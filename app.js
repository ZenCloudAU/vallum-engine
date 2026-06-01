const CAMPAIGN_PATH = "data/campaigns/noise-of-purpose.json";
const STORAGE_KEY = "vallum.engine.session.noise-of-purpose.v0.3";
const LEGACY_KEYS = ["vallum.engine.session.v0.2", "vallum.engine.session.v0.1"];

const dom = {
  campaignCover: document.getElementById("campaignCover"),
  continueBtn: document.getElementById("continueBtn"),
  startBtn: document.getElementById("startBtn"),
  coverStatus: document.getElementById("coverStatus"),
  campaignTitle: document.getElementById("campaignTitle"),
  saveStatus: document.getElementById("saveStatus"),
  ambienceState: document.getElementById("ambienceState"),
  regionTitle: document.getElementById("regionTitle"),
  timeBox: document.getElementById("timeBox"),
  routeLayer: document.getElementById("routeLayer"),
  locationLayer: document.getElementById("locationLayer"),
  tokenLayer: document.getElementById("tokenLayer"),
  sceneMood: document.getElementById("sceneMood"),
  diceLog: document.getElementById("diceLog"),
  sceneTitle: document.getElementById("sceneTitle"),
  sceneType: document.getElementById("sceneType"),
  narration: document.getElementById("narration"),
  outcomeText: document.getElementById("outcomeText"),
  choiceList: document.getElementById("choiceList"),
  partyList: document.getElementById("partyList"),
  journalList: document.getElementById("journalList"),
  newGameBtn: document.getElementById("newGameBtn"),
  saveBtn: document.getElementById("saveBtn"),
  ambienceBtn: document.getElementById("ambienceBtn"),
  characterDrawer: document.getElementById("characterDrawer"),
  closeDrawerBtn: document.getElementById("closeDrawerBtn"),
  drawerName: document.getElementById("drawerName"),
  drawerRole: document.getElementById("drawerRole"),
  drawerStats: document.getElementById("drawerStats"),
  drawerDrive: document.getElementById("drawerDrive")
};

let campaign = null;
let state = null;
let audio = { ctx: null, master: null, nodes: [], enabled: false, currentMood: null };

async function boot() {
  campaign = await loadCampaign();
  state = loadState() ?? createInitialState(campaign);
  document.body.classList.add("cover-open", "stormwright-theme");
  dom.campaignTitle.textContent = campaign.title;
  dom.coverStatus.textContent = loadState() ? "Saved Stormwright session found on this browser." : "No saved Stormwright session found. Start the ridge.";
  wireControls();
  render();
}

async function loadCampaign() {
  const response = await fetch(CAMPAIGN_PATH);
  if (!response.ok) throw new Error("Unable to load Stormwright campaign module.");
  return response.json();
}

function createInitialState(module) {
  return {
    campaignId: module.id,
    currentScene: module.startingScene,
    previousScene: null,
    time: { ...module.initialTime },
    party: module.party.map((member) => ({ ...member })),
    objectives: { ...(module.objectives ?? {}) },
    moralState: { ...(module.moralState ?? {}) },
    journal: [`Campaign started: ${module.title}.`],
    diceLog: "Stormwright table ready.",
    latestOutcome: "No choices resolved yet.",
    completedChoices: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.campaignId !== campaign.id) return null;
    return { ...createInitialState(campaign), ...parsed };
  } catch {
    return null;
  }
}

function wireControls() {
  dom.continueBtn.addEventListener("click", () => closeCover());
  dom.startBtn.addEventListener("click", startNewSession);
  dom.saveBtn.addEventListener("click", saveState);
  dom.newGameBtn.addEventListener("click", startNewSession);
  dom.ambienceBtn.addEventListener("click", toggleAmbience);
  dom.closeDrawerBtn.addEventListener("click", closeCharacterSheet);
  dom.characterDrawer.addEventListener("click", (event) => {
    if (event.target === dom.characterDrawer) closeCharacterSheet();
  });
}

function closeCover() {
  dom.campaignCover.hidden = true;
  document.body.classList.remove("cover-open");
  render();
}

function startNewSession() {
  localStorage.removeItem(STORAGE_KEY);
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  state = createInitialState(campaign);
  closeCover();
  setStatus("New Stormwright session started.");
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus("Session saved locally.");
}

function saveSilent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getScene() { return campaign.scenes[state.currentScene]; }
function getLocation(id) { return campaign.locations.find((location) => location.id === id); }

function render() {
  const scene = getScene();
  dom.regionTitle.textContent = `${campaign.region} · ${campaign.series ?? "Vallum"}`;
  dom.timeBox.textContent = `Day ${state.time.day} · ${state.time.phase}`;
  dom.sceneTitle.textContent = scene.title;
  dom.sceneType.textContent = scene.type;
  dom.sceneMood.textContent = scene.stakes ? `Stakes: ${scene.stakes}` : `Mood: ${scene.mood}`;
  dom.diceLog.textContent = state.diceLog;
  dom.outcomeText.textContent = state.latestOutcome;
  renderNarration(scene);
  renderChoices(scene);
  renderParty();
  renderJournal();
  renderMap(scene);
  renderAudioState(scene);
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
    button.className = "choice storm-choice";
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
    item.addEventListener("click", () => openCharacterSheet(member.id));
    const hpPct = Math.max(0, Math.min(100, (member.hp / member.maxHp) * 100));
    item.innerHTML = `
      <div>
        <div class="character-name">${escapeHtml(member.name)}</div>
        <div class="character-role">${escapeHtml(member.role)}</div>
        <div class="character-meta">${escapeHtml(member.drive)}</div>
      </div>
      <div class="character-meta">${member.hp}/${member.maxHp} HP</div>
      <div class="hp-bar"><div class="hp-fill" style="width:${hpPct}%"></div></div>`;
    dom.partyList.appendChild(item);
  });

  const statePanel = document.createElement("div");
  statePanel.className = "storm-state-panel";
  statePanel.innerHTML = `
    <div class="section-title">Moral State</div>
    ${renderStateLine("Force", state.moralState.force)}
    ${renderStateLine("Restraint", state.moralState.restraint)}
    ${renderStateLine("Witness", state.moralState.witness)}
    ${renderStateLine("Hollow", state.moralState.hollow)}
    ${renderStateLine("Reputation", state.moralState.reputation)}
    <div class="section-title objective-title">Objectives</div>
    ${renderObjectiveLine("Civilians", state.objectives.civilians)}
    ${renderObjectiveLine("Raider Threat", state.objectives.raiderThreat)}
    ${renderObjectiveLine("Captain Pressure", state.objectives.captainPressure)}
  `;
  dom.partyList.appendChild(statePanel);
}

function renderStateLine(label, value = 0) {
  return `<div class="state-line"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderObjectiveLine(label, value = 0) {
  return `<div class="state-line objective"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderJournal() {
  dom.journalList.innerHTML = "";
  state.journal.slice(-7).reverse().forEach((entry) => {
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

  renderBattlefieldTexture();

  campaign.routes.forEach(([fromId, toId]) => {
    const from = getLocation(fromId);
    const to = getLocation(toId);
    const active = (fromId === state.previousScene && toId === state.currentScene) || (toId === state.previousScene && fromId === state.currentScene);
    dom.routeLayer.appendChild(svg("line", {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      class: active ? "route-active" : "",
      stroke: "rgba(180,170,150,0.32)",
      "stroke-width": 7,
      "stroke-linecap": "round",
      "stroke-dasharray": "16 16"
    }));
  });

  campaign.locations.forEach((location) => renderLocation(location, scene.location));
  renderKaelToken(getLocation(scene.location));
}

function renderBattlefieldTexture() {
  const smoke = [
    { cx: 505, cy: 310, rx: 115, ry: 72, opacity: 0.22 },
    { cx: 585, cy: 360, rx: 150, ry: 82, opacity: 0.18 },
    { cx: 410, cy: 390, rx: 115, ry: 68, opacity: 0.14 }
  ];
  smoke.forEach((s) => dom.routeLayer.appendChild(svg("ellipse", { ...s, fill: "#d7d0c6" })));
}

function renderLocation(location, currentId) {
  const group = svg("g", { class: `location-node ${location.id === currentId ? "location-current" : ""}` });
  const palette = {
    kael: "#d8bd84",
    fire: "#b35b4f",
    objective: "#819fb6",
    threat: "#7f3333",
    road: "#7d9b75"
  };
  const fill = palette[location.kind] ?? "#d8bd84";
  const marker = location.kind === "fire" || location.kind === "threat"
    ? svg("rect", { x: location.x - 30, y: location.y - 30, width: 60, height: 60, rx: 10, fill, stroke: "rgba(0,0,0,0.45)", "stroke-width": 3 })
    : svg("circle", { cx: location.x, cy: location.y, r: 30, fill, stroke: "rgba(0,0,0,0.45)", "stroke-width": 3 });
  const label = svg("text", { x: location.x + 45, y: location.y + 8 });
  label.textContent = location.name;
  group.appendChild(marker);
  group.appendChild(label);
  dom.locationLayer.appendChild(group);
}

function renderKaelToken(current) {
  const token = svg("g", { class: "party-token" });
  const circle = svg("circle", { class: "token-core", cx: current.x, cy: current.y - 62, r: 28, fill: "#f2eadc", stroke: "#d8bd84", "stroke-width": 5, filter: "url(#shadow)" });
  const text = svg("text", { x: current.x, y: current.y - 62 });
  text.textContent = "K";
  token.appendChild(circle);
  token.appendChild(text);
  dom.tokenLayer.appendChild(token);
}

function choose(choice) {
  const messages = [];
  const startingScene = state.currentScene;
  if (choice.roll) messages.push(resolveRoll(choice.roll));
  if (choice.objectives) applyDelta(state.objectives, choice.objectives);
  if (choice.moral) applyDelta(state.moralState, choice.moral);
  if (choice.damage) messages.push(applyDamage(choice.damage));
  if (choice.heal) messages.push(applyHeal(choice.heal));
  if (choice.result) messages.push(choice.result);
  if (choice.journal) addJournal(choice.journal);
  if (choice.time) advanceTime(choice.time);
  if (choice.nextScene) state.currentScene = choice.nextScene;
  state.previousScene = startingScene;
  const outcome = messages.filter(Boolean).join(" ") || "Choice resolved.";
  state.diceLog = outcome;
  state.latestOutcome = outcome;
  state.completedChoices.push({ scene: startingScene, label: choice.label, nextScene: state.currentScene, at: new Date().toISOString() });
  saveSilent();
  setStatus("Autosaved after choice.");
  render();
}

function applyDelta(target, delta) {
  Object.entries(delta).forEach(([key, value]) => {
    target[key] = Math.max(0, (target[key] ?? 0) + value);
  });
}

function resolveRoll(roll) {
  const value = d20();
  const bonus = statBonus(roll.stat);
  const total = value + bonus;
  const success = total >= roll.target;
  const resultText = success ? roll.success : roll.failure;
  const entry = `${titleCase(roll.stat)}: d20 ${value} + ${bonus} = ${total} vs ${roll.target}. ${success ? "Success" : "Failure"}.`;
  addJournal(resultText);
  return `${entry} ${resultText}`;
}

function statBonus(stat) {
  if (state?.moralState && stat in state.moralState) return state.moralState[stat];
  return { Insight: 2, Lore: 3, Caution: 2, Resolve: 2 }[stat] ?? 1;
}

function applyDamage(effect) {
  if (effect.target !== "party") return "Damage effect ignored.";
  state.party.forEach((member) => { member.hp = Math.max(1, member.hp - effect.amount); });
  return `Kael takes ${effect.amount} damage from ${effect.reason}.`;
}

function applyHeal(effect) {
  if (effect.target !== "party") return "Heal effect ignored.";
  state.party.forEach((member) => { member.hp = Math.min(member.maxHp, member.hp + effect.amount); });
  return `Kael recovers ${effect.amount} HP from ${effect.reason}.`;
}

function advanceTime(phase) {
  const previous = state.time.phase;
  state.time.phase = phase;
  if (previous === "Night" && phase === "Dawn") state.time.day += 1;
}

function openCharacterSheet(memberId) {
  const member = state.party.find((item) => item.id === memberId);
  if (!member) return;
  dom.drawerName.textContent = member.name;
  dom.drawerRole.textContent = member.role;
  dom.drawerDrive.textContent = member.drive;
  dom.drawerStats.innerHTML = "";
  [
    ["Hit Points", `${member.hp}/${member.maxHp}`],
    ["Defence", member.defence],
    ["Attack", `+${member.attack}`],
    ["Hollow", state.moralState.hollow],
    ["Reputation", state.moralState.reputation],
    ["State", member.hp <= 0 ? "Down" : "Active"]
  ].forEach(([label, value]) => {
    const stat = document.createElement("div");
    stat.className = "drawer-stat";
    stat.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    dom.drawerStats.appendChild(stat);
  });
  dom.characterDrawer.hidden = false;
}

function closeCharacterSheet() { dom.characterDrawer.hidden = true; }
function addJournal(entry) { if (entry) state.journal.push(entry); }
function d20() { return Math.floor(Math.random() * 20) + 1; }
function d6() { return Math.floor(Math.random() * 6) + 1; }
function setStatus(message) { dom.saveStatus.textContent = message; }
function titleCase(value) { return String(value).charAt(0).toUpperCase() + String(value).slice(1); }
function svg(name, attrs = {}) { const el = document.createElementNS("http://www.w3.org/2000/svg", name); Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value)); return el; }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }

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
  renderAudioState(getScene());
}

function renderAudioState(scene) { dom.ambienceState.textContent = audio.enabled ? `Ambience: ${scene.ambience}` : "Ambience off"; }
async function startAudio() { if (!audio.ctx) { audio.ctx = new (window.AudioContext || window.webkitAudioContext)(); audio.master = audio.ctx.createGain(); audio.master.gain.value = 0.06; audio.master.connect(audio.ctx.destination); } if (audio.ctx.state === "suspended") await audio.ctx.resume(); }
function stopAmbience() { audio.nodes.forEach((node) => { try { node.stop(); } catch {} try { node.disconnect(); } catch {} }); audio.nodes = []; audio.currentMood = null; }
function playAmbience(mood) { if (!audio.ctx || audio.currentMood === mood) return; stopAmbience(); audio.currentMood = mood; if (mood === "storm") { noiseLayer(760, 0.5, 0.4); lowDrone(44, 0.08); lowDrone(92, 0.04); } else if (mood === "rain") { noiseLayer(900, 0.35, 0.38); lowDrone(96, 0.05); } else if (mood === "wind") { noiseLayer(420, 0.7, 0.3); lowDrone(72, 0.06); } else { lowDrone(54, 0.16); } }
function noiseLayer(frequency, variance, gain) { const bufferSize = audio.ctx.sampleRate * 2; const buffer = audio.ctx.createBuffer(1, bufferSize, audio.ctx.sampleRate); const data = buffer.getChannelData(0); for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * variance; const source = audio.ctx.createBufferSource(); source.buffer = buffer; source.loop = true; const filter = audio.ctx.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.value = frequency; const layerGain = audio.ctx.createGain(); layerGain.gain.value = gain; source.connect(filter); filter.connect(layerGain); layerGain.connect(audio.master); source.start(); audio.nodes.push(source, filter, layerGain); }
function lowDrone(frequency, gain) { const oscillator = audio.ctx.createOscillator(); oscillator.type = "sine"; oscillator.frequency.value = frequency; const layerGain = audio.ctx.createGain(); layerGain.gain.value = gain; oscillator.connect(layerGain); layerGain.connect(audio.master); oscillator.start(); audio.nodes.push(oscillator, layerGain); }

boot().catch((error) => { dom.sceneTitle.textContent = "Engine failed to load"; dom.narration.textContent = error.message; });
