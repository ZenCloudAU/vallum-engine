// Vallum GM Engine — Claude AI as live Game Master
// User supplies their own Anthropic key; stored in localStorage, never leaves the browser except to Anthropic's API.

const GM = (() => {
  const KEY_STORE  = 'vallum.anthropic.key';
  const MODEL      = 'claude-opus-4-8';   // upgrade to claude-fable-5 once available via API

  const SYSTEM = `You are the Game Master for Vallum, a solo TTRPG set in the Stormwright Cycle.

The player controls Kael Vorn, Iron Captain of the Eastern Marches. He is extremely capable. He is beginning to understand what capability costs.

World: morally complex, politically uncomfortable, physically harsh. The Eastern Marches are wet, under-resourced, contested. Violence is concrete, not glorious. Every victory costs something. The account is never clean.

NPC voices:
- Raider Captain: professional, unhurried. Finds Kael interesting as a problem. Not surprised by anything.
- Civilians: afraid, specific, not props. They have names they haven't said yet.
- The Field Itself: the rain doesn't stop. The smoke doesn't clear.

Writing style: terse, literary, present-tense. Short declarative sentences. No purple prose. No words like epic, incredible, legendary, powerful, suddenly. Weather is always present. Kael is a man on a road, not a legend narrating himself.

Stay under 140 words total. Narrate only what Kael perceives. Never explain game mechanics. Never use the word "you".`;

  function key()        { return localStorage.getItem(KEY_STORE); }
  function setKey(k)    { localStorage.setItem(KEY_STORE, k.trim()); }
  function clearKey()   { localStorage.removeItem(KEY_STORE); }
  function hasKey()     { return !!key(); }

  async function stream({ userContent, onToken, onDone, onError }) {
    const k = key();
    if (!k) { onError?.('No API key set.'); return; }

    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': k,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 350,
          system: SYSTEM,
          stream: true,
          messages: [{ role: 'user', content: userContent }]
        })
      });
    } catch (err) {
      onError?.(err.message);
      return;
    }

    if (!res.ok) {
      try {
        const e = await res.json();
        onError?.(e.error?.message || `API error ${res.status}`);
      } catch {
        onError?.(`API error ${res.status}`);
      }
      return;
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              onToken?.(evt.delta.text);
            }
          } catch { /* malformed event — skip */ }
        }
      }
    } catch (err) {
      onError?.(err.message);
      return;
    }

    onDone?.();
  }

  function choicePrompt(choice, roll, gameState, scene) {
    const { moralState: m, objectives: o } = gameState;
    const rollLine = roll
      ? `Roll result: ${roll.success ? 'SUCCESS' : 'FAILURE'} — "${roll.text}"`
      : `Outcome: "${choice.result || 'The choice is recorded.'}"`;
    return `Scene: ${scene.title}
Setting: ${scene.mood || ''}

Kael's inner state — Force ${m.force}, Restraint ${m.restraint}, Witness ${m.witness}, Hollow ${m.hollow}, Reputation ${m.reputation}
Field — Civilians: ${o.civilians ?? '?'}, Raider Threat: ${o.raiderThreat ?? '?'}, Captain Pressure: ${o.captainPressure ?? '?'}

Choice made: "${choice.label}"
${rollLine}

Narrate the moment this choice resolves. 2–3 short paragraphs.`;
  }

  function askPrompt(query, gameState, scene) {
    const { moralState: m } = gameState;
    return `Scene: ${scene.title}
Setting: ${scene.mood || ''}
Kael's inner state — Force ${m.force}, Restraint ${m.restraint}, Witness ${m.witness}, Hollow ${m.hollow}

Player examines: "${query}"

Respond as GM. 1–2 short paragraphs. Present-tense. This is what Kael perceives.`;
  }

  return { key, setKey, clearKey, hasKey, stream, choicePrompt, askPrompt };
})();
