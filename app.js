const STORAGE_KEY = "vallum.engine.session.v0.1";

const dom = {
  regionTitle: document.getElementById("regionTitle"),
  timeBox: document.getElementById("timeBox"),
  worldMap: document.getElementById("worldMap"),
  routeLayer: document.getElementById("routeLayer"),
  locationLayer: document.getElementById("locationLayer"),
  tokenLayer: document.getElementById("tokenLayer"),
  sceneMood: document.getElementById("sceneMood"),
  diceLog: document.getElementById("diceLog"),
  sceneTitle: document.getElementById("sceneTitle"),
  sceneType: document.getElementById("sceneType"),
  narration: document.getElementById("narration"),
  choiceList: document.getElementById("choiceList"),
  partyList: document.getElementById("partyList"),
  journalList: document.getElementById("journalList"),
  newGameBtn: document.getElementById("newGameBtn"),
  saveBtn: document.getElementById("saveBtn"),
  ambienceBtn: document.getElementById("ambienceBtn")
};

let campaign = null;
let state = null;
let audio = {
  ctx: null,
  master: null,
  nodes: [],
  enabled: false,
  currentMood: null
};

async function boot() {
  campaign = await loadCampaign();
  state = loadState() ?? createInitialState(campaign);
  render();
  wireControls();
}

async function loadCampaign() {
  const response = await fetch("data/campaigns/western-road.json");
  if (!response.ok) {
    throw new Error("Unable to load campaign module.");
  }
  return response.json();
}

function createInitialState(module) {
  return {
    campaignId: module.id,
    currentScene: module.startingScene,
    time: { ...module.initialTime },
    party: module.party.map((member) => ({ ...member })),
    journal: ["Campaign started: The Western Road."],
    diceLog: "Dice log ready.",
    completedChoices: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.campaignId !== "western-road") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  pulseDice("Session saved locally.");
}

function wireControls() {
  dom.saveBtn.addEventListener("click", saveState);
  dom.newGameBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state = createInitialState(campaign);
    render();
    pulseDice("New session started.");
  });
  dom.ambienceBtn.addEventListener("click", toggleAmbience);
}

function getScene() {
  return campaign.scenes[state.currentScene];
}

function getLocation(id) {
  return campaign.locations.find((location) => location.id === id);
}

function render() {
  const scene = getScene();
  dom.regionTitle.textContent = campaign.region;
  dom.timeBox.textContent = `Day ${state.time.day} · ${state.time.phase}`;
  dom.sceneTitle.textContent = scene.title;
  dom.sceneType.textContent = scene.type;
  dom.sceneMood.textContent = `Mood: ${scene.mood}`;
  dom.diceLog.textContent = state.diceLog;
  renderNarration(scene);
  renderChoices(scene);
  renderParty();
  renderJournal();
  renderMap(scene);
  if (audio.enabled) playAmbience(scene.ambience);
}

function renderNarration(scene) {
  dom.narration.innerHTML = "";
  scene.narration.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    dom.narration.appendChild(p);
  });
}

function renderChoices(scene) {
  dom.choiceList.innerHTML = "";
  scene.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = `${index + 1}. ${choice.label}`;
    button.addEventListener("click", () => choose(choice));
    dom.choiceList.appendChild(button);
  });
}

function renderParty() {
  dom.partyList.innerHTML = "";
  state.party.forEach((member) => {
    const item = document.createElement("div");
    item.className = "character";

    const details = document.createElement("div");
    details.innerHTML = `
      <div class="character-name">${escapeHtml(member.name)}</div>
      <div class="character-role">${escapeHtml(member.role)}</div>
      <div class="character-meta">${escapeHtml(member.drive)}</div>
    `;

    const hp = document.createElement("div");
    hp.className = "character-meta";
    hp.textContent = `${member.hp}/${member.maxHp} HP`;

    const bar = document.createElement("div");
    bar.className = "hp-bar";
    const fill = document.createElement("div");
    fill.className = "hp-fill";
    fill.style.width = `${Math.max(0, Math.min(100, (member.hp / member.maxHp) * 100))}%`;
    bar.appendChild(fill);

    item.appendChild(details);
    item.appendChild(hp);
    item.appendChild(bar);
    dom.partyList.appendChild(item);
  });
}

function renderJournal() {
  dom.journalList.innerHTML = "";
  state.journal.slice(-6).reverse().forEach((entry) => {
    const div = document.createElement("div");
    div.className = "journal-entry";
    div.textContent = entry;
    dom.journalList.appendChild(div);
  });
}

function renderMap(scene) {
  dom.routeLayer.innerHTML = "";
  dom.locationLayer.innerHTML = "";
  dom.tokenLayer.innerHTML = "";

  campaign.routes.forEach(([fromId, toId]) => {
    const from = getLocation(fromId);
    const to = getLocation(toId);
    const line = svg("line", {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: "rgba(216,189,132,0.38)",
      "stroke-width": 8,
      "stroke-linecap": "round",
      "stroke-dasharray": "18 14"
    });
    dom.routeLayer.appendChild(line);
  });

  campaign.locations.forEach((location) => {
    const group = svg("g", {
      class: `location-node ${location.id === scene.location ? "location-current" : ""}`
    });

    const fill = location.kind === "settlement" ? "#7d9b75" : location.kind === "dungeon" ? "#9b756f" : location.kind === "road" ? "#819fb6" : "#d8bd84";
    const marker = location.kind === "dungeon"
      ? svg("rect", { x: location.x - 28, y: location.y - 28, width: 56, height: 56, rx: 10, fill, stroke: "rgba(0,0,0,0.4)", "stroke-width": 3 })
      : svg("circle", { cx: location.x, cy: location.y, r: 28, fill, stroke: "rgba(0,0,0,0.4)", "stroke-width": 3 });

    const label = svg("text", { x: location.x + 42, y: location.y + 8 });
    label.textContent = location.name;

    group.appendChild(marker);
    group.appendChild(label);
    dom.locationLayer.appendChild(group);
  });

  const current = getLocation(scene.location);
  const token = svg("g", { class: "party-token" });
  const tokenCircle = svg("circle", { cx: current.x, cy: current.y - 58, r: 30, fill: "#f2eadc", stroke: "#d8bd84", "stroke-width": 5, filter: "url(#shadow)" });
  const tokenText = svg("text", { x: current.x, y: current.y - 58 });
  tokenText.textContent = "P";
  token.appendChild(tokenCircle);
  token.appendChild(tokenText);
  dom.tokenLayer.appendChild(token);
}

function choose(choice) {
  const messages = [];

  if (choice.roll) {
    messages.push(resolveRoll(choice.roll));
  }

  if (choice.combat) {
    messages.push(resolveCombat(choice.combat));
  }

  if (choice.damage) {
    messages.push(applyDamage(choice.damage));
  }

  if (choice.heal) {
    messages.push(applyHeal(choice.heal));
  }

  if (choice.result) {
    messages.push(choice.result);
  }

  if (choice.journal) {
    addJournal(choice.journal);
  }

  if (choice.time) {
    advanceTime(choice.time);
  }

  if (choice.nextScene) {
    state.currentScene = choice.nextScene;
  }

  state.diceLog = messages.filter(Boolean).join(" ") || "Choice resolved.";
  state.completedChoices.push({ scene: state.currentScene, label: choice.label, at: new Date().toISOString() });
  saveSilent();
  render();
}

function resolveRoll(roll) {
  const value = d20();
  const bonus = statBonus(roll.stat);
  const total = value + bonus;
  const success = total >= roll.target;
  const resultText = success ? roll.success : roll.failure;
  const entry = `${roll.stat} check: d20 ${value} + ${bonus} = ${total} vs ${roll.target}. ${success ? "Success" : "Failure"}.`;
  addJournal(resultText);
  return `${entry} ${resultText}`;
}

function resolveCombat(mode) {
  const scene = getScene();
  const encounter = scene.encounter;
  if (!encounter) return "No encounter found.";

  let enemyHp = encounter.enemyHp;
  if (mode === "weakened") enemyHp -= 5;
  if (mode === "risky") enemyHp -= 3;

  let round = 1;
  const combatLog = [];

  while (enemyHp > 0 && hasLivingParty() && round <= 6) {
    let partyDamage = 0;
    state.party.forEach((member) => {
      if (member.hp <= 0) return;
      const roll = d20();
      const hit = roll + member.attack >= encounter.target;
      if (hit) {
        const damage = Math.max(1, d6() + Math.floor(member.attack / 2));
        partyDamage += damage;
      }
    });

    enemyHp -= partyDamage;
    combatLog.push(`Round ${round}: party deals ${partyDamage} damage.`);

    if (enemyHp <= 0) break;

    const target = randomLivingMember();
    const incoming = Math.max(1, d6() + encounter.enemyAttack - 2);
    target.hp = Math.max(0, target.hp - incoming);
    combatLog.push(`${encounter.name} hits ${target.name} for ${incoming}.`);
    round += 1;
  }

  if (enemyHp <= 0) {
    addJournal(`Victory: ${encounter.name} defeated.`);
    state.currentScene = encounter.victoryScene;
    state.time.phase = "Dusk";
    return `${combatLog.join(" ")} Victory. The road opens toward the tower.`;
  }

  if (!hasLivingParty()) {
    addJournal(`Defeat: the party was forced back by ${encounter.name}.`);
    state.party.forEach((member) => {
      if (member.hp <= 0) member.hp = 1;
    });
    state.currentScene = encounter.defeatScene;
    state.time.phase = "Dusk";
    return `${combatLog.join(" ")} Defeat. The party survives, but only by retreating.`;
  }

  const target = randomLivingMember();
  target.hp = Math.max(1, target.hp - 2);
  addJournal(`Hard victory: ${encounter.name} scattered after a brutal exchange.`);
  state.currentScene = encounter.victoryScene;
  state.time.phase = "Dusk";
  return `${combatLog.join(" ")} Hard victory. ${target.name} takes a lasting bruise.`;
}

function applyDamage(effect) {
  if (effect.target === "party") {
    state.party.forEach((member) => {
      member.hp = Math.max(1, member.hp - effect.amount);
    });
    return `Party takes ${effect.amount} damage each from ${effect.reason}.`;
  }
  return "Damage effect ignored.";
}

function applyHeal(effect) {
  if (effect.target === "party") {
    state.party.forEach((member) => {
      member.hp = Math.min(member.maxHp, member.hp + effect.amount);
    });
    return `Party recovers ${effect.amount} HP each from ${effect.reason}.`;
  }
  return "Heal effect ignored.";
}

function advanceTime(phase) {
  const previous = state.time.phase;
  state.time.phase = phase;
  if (previous === "Night" && phase === "Dawn") {
    state.time.day += 1;
  }
}

function addJournal(entry) {
  if (!entry) return;
  state.journal.push(entry);
}

function d20() {
  return Math.floor(Math.random() * 20) + 1;
}

function d6() {
  return Math.floor(Math.random() * 6) + 1;
}

function statBonus(stat) {
  const bonuses = {
    Insight: 2,
    Lore: 3,
    Caution: 2,
    Resolve: 2
  };
  return bonuses[stat] ?? 1;
}

function hasLivingParty() {
  return state.party.some((member) => member.hp > 0);
}

function randomLivingMember() {
  const living = state.party.filter((member) => member.hp > 0);
  return living[Math.floor(Math.random() * living.length)];
}

function saveSilent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function pulseDice(message) {
  state.diceLog = message;
  dom.diceLog.textContent = message;
}

function svg(name, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function toggleAmbience() {
  if (!audio.enabled) {
    await startAudio();
    audio.enabled = true;
    dom.ambienceBtn.textContent = "Stop ambience";
    playAmbience(getScene().ambience);
  } else {
    stopAmbience();
    audio.enabled = false;
    dom.ambienceBtn.textContent = "Start ambience";
  }
}

async function startAudio() {
  if (!audio.ctx) {
    audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = 0.06;
    audio.master.connect(audio.ctx.destination);
  }
  if (audio.ctx.state === "suspended") {
    await audio.ctx.resume();
  }
}

function stopAmbience() {
  audio.nodes.forEach((node) => {
    try { node.stop(); } catch {}
    try { node.disconnect(); } catch {}
  });
  audio.nodes = [];
  audio.currentMood = null;
}

function playAmbience(mood) {
  if (!audio.ctx || audio.currentMood === mood) return;
  stopAmbience();
  audio.currentMood = mood;

  if (mood === "rain") {
    noiseLayer({ type: "rain", frequency: 900, variance: 0.35, gain: 0.38 });
    lowDrone(96, 0.05);
  } else if (mood === "wind") {
    noiseLayer({ type: "wind", frequency: 420, variance: 0.7, gain: 0.3 });
    lowDrone(72, 0.06);
  } else if (mood === "dungeon") {
    lowDrone(54, 0.16);
    lowDrone(81, 0.05);
    tickLayer();
  } else {
    lowDrone(80, 0.05);
  }
}

function noiseLayer({ frequency, variance, gain }) {
  const bufferSize = audio.ctx.sampleRate * 2;
  const buffer = audio.ctx.createBuffer(1, bufferSize, audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * variance;
  }

  const source = audio.ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = audio.ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.7;

  const layerGain = audio.ctx.createGain();
  layerGain.gain.value = gain;

  source.connect(filter);
  filter.connect(layerGain);
  layerGain.connect(audio.master);
  source.start();
  audio.nodes.push(source, filter, layerGain);
}

function lowDrone(frequency, gain) {
  const oscillator = audio.ctx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  const layerGain = audio.ctx.createGain();
  layerGain.gain.value = gain;

  oscillator.connect(layerGain);
  layerGain.connect(audio.master);
  oscillator.start();
  audio.nodes.push(oscillator, layerGain);
}

function tickLayer() {
  const interval = window.setInterval(() => {
    if (!audio.enabled || audio.currentMood !== "dungeon") {
      window.clearInterval(interval);
      return;
    }
    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 170 + Math.random() * 80;
    gain.gain.setValueAtTime(0.0001, audio.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audio.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(audio.master);
    osc.start();
    osc.stop(audio.ctx.currentTime + 0.18);
  }, 2600 + Math.random() * 1800);
}

boot().catch((error) => {
  dom.sceneTitle.textContent = "Engine failed to load";
  dom.narration.textContent = error.message;
});
