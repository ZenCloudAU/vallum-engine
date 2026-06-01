const CAMPAIGN_PATH = "data/campaigns/noise-of-purpose.json";
const STORAGE_KEY = "vallum.engine.session.noise-of-purpose.v0.3.2";

const $ = (id) => document.getElementById(id);

const dom = {
  campaignCover: $("campaignCover"),
  continueBtn: $("continueBtn"),
  startBtn: $("startBtn"),
  coverStatus: $("coverStatus"),
  campaignTitle: $("campaignTitle"),
  saveStatus: $("saveStatus"),
  ambienceState: $("ambienceState"),
  regionTitle: $("regionTitle"),
  timeBox: $("timeBox"),
  routeLayer: $("routeLayer"),
  locationLayer: $("locationLayer"),
  tokenLayer: $("tokenLayer"),
  sceneMood: $("sceneMood"),
  diceLog: $("diceLog"),
  sceneTitle: $("sceneTitle"),
  sceneType: $("sceneType"),
  narration: $("narration"),
  outcomeText: $("outcomeText"),
  choiceList: $("choiceList"),
  partyList: $("partyList"),
  journalList: $("journalList"),
  newGameBtn: $("newGameBtn"),
  saveBtn: $("saveBtn"),
  ambienceBtn: $("ambienceBtn"),
  characterDrawer: $("characterDrawer"),
  closeDrawerBtn: $("closeDrawerBtn"),
  drawerName: $("drawerName"),
  drawerRole: $("drawerRole"),
  drawerStats: $("drawerStats"),
  drawerDrive: $("drawerDrive")
};

let campaign = null;
let state = null;
let audio = { ctx: null, master: null, nodes: [], enabled: false, currentMood: null };

boot();

async function boot() {
  try {
    campaign = await loadCampaign();
    state = loadState() || createInitialState(campaign);
    document.body.classList.add("cover-open", "stormwright-theme");
    setText(dom.campaignTitle, campaign.title);
    const hasSave = !!localStorage.getItem(STORAGE_KEY);
    setText(dom.coverStatus, hasSave ? "Saved Stormwright session found on this browser." : "No saved Stormwright session found. Begin on the ridge.");
    if (dom.continueBtn) dom.continueBtn.hidden = !hasSave;
    wireControls();
    render();
  } catch (error) {
    showFatalError(error);
  }
}

async function loadCampaign() {
  const response = await fetch(CAMPAIGN_PATH, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load Stormwright campaign module.");
  return response.json();
}

function createInitialState(module) {
  return {
    campaignId: module.id,
    currentScene: module.startingScene,
    previousScene: null,
    time: { ...(module.initialTime || { day: 1, phase: "Stormlight" }) },
    party: (module.party || []).map((member) => ({ ...member })),
    objectives: { ...(module.objectives || {}) },
    moralState: { ...(module.moralState || {}) },
    journal: [`Campaign started: ${module.title}.`],
    latestOutcome: {
      consequence: "No choices resolved yet.",
      stateChange: "The account is empty."
    },
    completedChoices: [],
    sessionComplete: false
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.campaignId !== campaign.id) return null;
    return normaliseState(parsed);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function normaliseState(candidate) {
  const base = createInitialState(campaign);
  return {
    ...base,
    ...candidate,
    time: { ...base.time, ...(candidate.time || {}) },
    objectives: { ...base.objectives, ...(candidate.objectives || {}) },
    moralState: { ...base.moralState, ...(candidate.moralState || {}) },
    latestOutcome: normaliseOutcome(candidate.latestOutcome)
  };
}

function normaliseOutcome(outcome) {
  if (!outcome) return { consequence: "No choices resolved yet.", stateChange: "The account is empty." };
  if (typeof outcome === "string") return { consequence: outcome, stateChange: "State already applied." };
  return {
    consequence: outcome.consequence || outcome.roll || "The choice is recorded.",
    stateChange: outcome.stateChange || "State already applied."
  };
}

function wireControls() {
  on(dom.continueBtn, "click", closeCover);
  on(dom.startBtn, "click", startNewSession);
  on(dom.saveBtn, "click", saveState);
  on(dom.newGameBtn, "click", startNewSession);
  on(dom.ambienceBtn, "click", toggleAmbience);
  on(dom.closeDrawerBtn, "click", closeCharacterSheet);
  on(dom.characterDrawer, "click", (event) => {
    if (event.target === dom.characterDrawer) closeCharacterSheet();
  });
}

function closeCover() {
  if (dom.campaignCover) dom.campaignCover.hidden = true;
  document.body.classList.remove("cover-open");
  render();
}

function startNewSession() {
  localStorage.removeItem(STORAGE_KEY);
  state = createInitialState(campaign);
  closeCover();
  setStatus("New session started.");
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus("Saved.");
}

function saveSilent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  try {
    const scene = getScene();
    setText(dom.regionTitle, `${campaign.region} · ${campaign.series || "Vallum"}`);
    setText(dom.timeBox, `Day ${state.time.day} · ${state.time.phase}`);
    setText(dom.sceneTitle, scene.title);
    setText(dom.sceneType, scene.type);
    setText(dom.sceneMood, scene.stakes ? `Stakes: ${scene.stakes}` : `Mood: ${scene.mood || "Uncertain"}`);
    renderNarration(scene);
    renderChoices(scene);
    renderCharacterPanel();
    renderJournal();
    renderMap(scene);
    renderOutcome();
    renderAudioState(scene);
    if (audio.enabled) playAmbience(scene.ambience);
  } catch (error) {
    showFatalError(error);
  }
}

function getScene() {
  const scene = campaign.scenes[state.currentScene];
  if (!scene) throw new Error(`Scene not found: ${state.currentScene}`);
  return scene;
}

function getLocation(id) {
  return campaign.locations.find((location) => location.id === id) || campaign.locations[0];
}

function renderNarration(scene) {
  if (!dom.narration) return;
  dom.narration.innerHTML = "";
  (scene.narration || []).forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    dom.narration.appendChild(p);
  });
}

function renderChoices(scene) {
  if (!dom.choiceList) return;
  dom.choiceList.innerHTML = "";
  (scene.choices || []).forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice storm-choice";
    button.innerHTML = `<span class="choice-title">${index + 1}. ${escapeHtml(choice.label)}</span>`;
    button.addEventListener("click", () => choose(choice));
    dom.choiceList.appendChild(button);
  });
}

function choiceMeta(choice) {
  const impacts = [];
  if (choice.objectives) impacts.push(deltaSummary(choice.objectives));
  if (choice.moral) impacts.push(deltaSummary(choice.moral));
  return impacts.length ? `<span class="choice-meta">${escapeHtml(impacts.join(" · "))}</span>` : "";
}

function deltaSummary(delta) {
  return Object.entries(delta).map(([key, value]) => `${value > 0 ? "+" : ""}${value} ${readableKey(key)}`).join(", ");
}

function renderCharacterPanel() {
  if (!dom.partyList) return;
  dom.partyList.innerHTML = "";
  const member = state.party[0];
  if (member) {
    const hpPct = Math.max(0, Math.min(100, (member.hp / member.maxHp) * 100));
    const card = document.createElement("div");
    card.className = "character";
    card.innerHTML = `
      <div>
        <div class="character-name">${escapeHtml(member.name)}</div>
        <div class="character-role">${escapeHtml(member.role)}</div>
        <div class="character-meta">${escapeHtml(member.drive)}</div>
      </div>
      <div class="character-meta">${member.hp}/${member.maxHp} HP</div>
      <div class="hp-bar"><div class="hp-fill" style="width:${hpPct}%"></div></div>`;
    card.addEventListener("click", () => openCharacterSheet(member.id));
    dom.partyList.appendChild(card);
  }

  const panel = document.createElement("div");
  panel.className = "storm-state-panel";
  panel.innerHTML = `
    <div class="section-title">Inner State</div>
    ${stateLine("Force", state.moralState.force, forceLabel)}
    ${stateLine("Restraint", state.moralState.restraint, restraintLabel)}
    ${stateLine("Witness", state.moralState.witness, witnessLabel)}
    ${stateLine("Hollow", state.moralState.hollow, hollowLabel)}
    ${stateLine("Reputation", state.moralState.reputation, reputationLabel)}
    <div class="section-title objective-title">The Field</div>
    ${stateLine("Civilians", state.objectives.civilians, civilianLabel, true)}
    ${stateLine("Raider Threat", state.objectives.raiderThreat, threatLabel, true)}
    ${stateLine("Captain", state.objectives.captainPressure, pressureLabel, true)}
  `;
  dom.partyList.appendChild(panel);
}

function stateLine(label, value = 0, labelFn = genericLabel, objective = false) {
  return `<div class="state-line ${objective ? "objective" : ""}"><span>${label}<em>${labelFn(value)}</em></span><strong>${value}</strong></div>`;
}

function renderJournal() {
  if (!dom.journalList) return;
  dom.journalList.innerHTML = "";
  state.journal.slice(-6).reverse().forEach((entry) => {
    const div = document.createElement("div");
    div.className = "journal-entry";
    div.textContent = entry;
    dom.journalList.appendChild(div);
  });
}

function renderMap(scene) {
  if (!dom.routeLayer || !dom.locationLayer || !dom.tokenLayer) return;
  dom.routeLayer.innerHTML = "";
  dom.locationLayer.innerHTML = "";
  dom.tokenLayer.innerHTML = "";
  renderBattlefieldTexture();
  (campaign.routes || []).forEach(([fromId, toId]) => {
    const from = getLocation(fromId);
    const to = getLocation(toId);
    const active = (fromId === state.previousScene && toId === state.currentScene) || (toId === state.previousScene && fromId === state.currentScene);
    dom.routeLayer.appendChild(svg("line", {
      x1: from.x, y1: from.y, x2: to.x, y2: to.y,
      class: active ? "route-active" : "",
      stroke: "rgba(180,170,150,0.32)",
      "stroke-width": 7,
      "stroke-linecap": "round",
      "stroke-dasharray": "16 16"
    }));
  });
  (campaign.locations || []).forEach((location) => renderLocation(location, scene.location));
  renderKaelToken(getLocation(scene.location));
}

function renderBattlefieldTexture() {
  [
    { x: 130, y: 88, width: 150, height: 88, rx: 22, fill: "rgba(216,189,132,0.08)" },
    { x: 285, y: 405, width: 170, height: 110, rx: 22, fill: "rgba(129,159,182,0.10)" },
    { x: 684, y: 185, width: 170, height: 110, rx: 22, fill: "rgba(179,91,79,0.13)" }
  ].forEach((zone) => dom.routeLayer.appendChild(svg("rect", zone)));

  [
    { cx: 505, cy: 310, rx: 115, ry: 72, opacity: 0.22 },
    { cx: 585, cy: 360, rx: 150, ry: 82, opacity: 0.18 },
    { cx: 410, cy: 390, rx: 115, ry: 68, opacity: 0.14 }
  ].forEach((smoke) => dom.routeLayer.appendChild(svg("ellipse", { ...smoke, fill: "#d7d0c6" })));
}

function renderLocation(location, currentId) {
  const group = svg("g", { class: `location-node ${location.id === currentId ? "location-current" : ""}` });
  const palette = { kael: "#d8bd84", fire: "#b35b4f", objective: "#819fb6", threat: "#7f3333", road: "#7d9b75" };
  const fill = palette[location.kind] || "#d8bd84";
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

function renderOutcome() {
  if (!dom.outcomeText) return;
  const outcome = normaliseOutcome(state.latestOutcome);
  dom.outcomeText.innerHTML = `
    <div class="outcome-grid">
      <div><span>Immediate Consequence</span><strong>${escapeHtml(outcome.consequence)}</strong></div>
      <div><span>What Changed</span><strong>${escapeHtml(outcome.stateChange)}</strong></div>
    </div>
    ${buildAftermathReport()}`;
}

function buildAftermathReport() {
  if (state.currentScene !== "aftermath" && !state.sessionComplete) return "";
  const civilians = state.objectives.civilians || 0;
  const captain = state.objectives.captainPressure || 0;
  const threat = state.objectives.raiderThreat || 0;
  const hollow = state.moralState.hollow || 0;
  const reputation = state.moralState.reputation || 0;
  return `
    <section class="aftermath-report">
      <p class="outcome-label">Aftermath Report</p>
      <div class="report-grid">
        <div><span>Civilians</span><strong>${civilianLabel(civilians)}</strong></div>
        <div><span>Captain</span><strong>${pressureLabel(captain)}</strong></div>
        <div><span>Threat</span><strong>${threatLabel(threat)}</strong></div>
        <div><span>Hollow</span><strong>${hollowLabel(hollow)}</strong></div>
        <div><span>Reputation</span><strong>${reputationLabel(reputation)}</strong></div>
        <div><span>Account</span><strong>${hollow >= 5 ? "Victory cannot make this clean." : "The account can still be made accurate."}</strong></div>
      </div>
    </section>`;
}

function choose(choice) {
  try {
    const before = snapshotState();
    const startingScene = state.currentScene;
    const roll = choice.roll ? resolveRoll(choice.roll) : null;
    if (choice.objectives) applyDelta(state.objectives, choice.objectives);
    if (choice.moral) applyDelta(state.moralState, choice.moral);
    if (choice.damage) applyDamage(choice.damage);
    if (choice.heal) applyHeal(choice.heal);
    if (choice.journal) addJournal(choice.journal);
    if (choice.time) advanceTime(choice.time);
    if (choice.nextScene) state.currentScene = choice.nextScene;
    if (choice.result && choice.result.toLowerCase().includes("module ends")) state.sessionComplete = true;
    state.previousScene = startingScene;
    state.latestOutcome = {
      consequence: roll ? roll.text : choice.result || "The choice is recorded.",
      stateChange: describeStateChange(before, snapshotState())
    };
    state.completedChoices.push({ scene: startingScene, label: choice.label, nextScene: state.currentScene, at: new Date().toISOString() });
    saveSilent();
    setStatus("Autosaved.");
    render();
  } catch (error) {
    showFatalError(error);
  }
}

function snapshotState() {
  return { objectives: { ...state.objectives }, moralState: { ...state.moralState } };
}

function describeStateChange(before, after) {
  const changes = [];
  collectChanges(changes, before.objectives, after.objectives);
  collectChanges(changes, before.moralState, after.moralState);
  return changes.length ? changes.join(" · ") : "No visible state change.";
}

function collectChanges(changes, before, after) {
  Object.keys(after || {}).forEach((key) => {
    const delta = (after[key] || 0) - (before[key] || 0);
    if (delta !== 0) changes.push(`${delta > 0 ? "+" : ""}${delta} ${readableKey(key)}`);
  });
}

function resolveRoll(roll) {
  const total = d20() + statBonus(roll.stat);
  const success = total >= roll.target;
  const text = success ? roll.success : roll.failure;
  addJournal(text);
  return { success, text };
}

function applyDelta(target, delta) {
  Object.entries(delta || {}).forEach(([key, value]) => {
    target[key] = Math.max(0, Math.min(10, (target[key] || 0) + value));
  });
}

function applyDamage(effect) {
  if (effect.target === "party") state.party.forEach((member) => { member.hp = Math.max(1, member.hp - effect.amount); });
}

function applyHeal(effect) {
  if (effect.target === "party") state.party.forEach((member) => { member.hp = Math.min(member.maxHp, member.hp + effect.amount); });
}

function advanceTime(phase) {
  state.time.phase = phase;
}

function statBonus() {
  return 0;
}

function openCharacterSheet(memberId) {
  const member = state.party.find((item) => item.id === memberId);
  if (!member) return;
  setText(dom.drawerName, member.name);
  setText(dom.drawerRole, member.role);
  setText(dom.drawerDrive, member.drive);
  if (!dom.drawerStats) return;
  dom.drawerStats.innerHTML = "";
  [
    ["Hit Points", `${member.hp}/${member.maxHp}`],
    ["Defence", member.defence],
    ["Attack", `+${member.attack}`],
    ["Hollow", hollowLabel(state.moralState.hollow)],
    ["Reputation", reputationLabel(state.moralState.reputation)]
  ].forEach(([label, value]) => {
    const stat = document.createElement("div");
    stat.className = "drawer-stat";
    stat.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    dom.drawerStats.appendChild(stat);
  });
  if (dom.characterDrawer) dom.characterDrawer.hidden = false;
}

function closeCharacterSheet() {
  if (dom.characterDrawer) dom.characterDrawer.hidden = true;
}

function addJournal(entry) {
  if (entry) state.journal.push(entry);
}

async function toggleAmbience() {
  if (!audio.enabled) {
    await startAudio();
    audio.enabled = true;
    setText(dom.ambienceBtn, "M");
    playAmbience(getScene().ambience);
  } else {
    stopAmbience();
    audio.enabled = false;
    setText(dom.ambienceBtn, "M");
  }
  renderAudioState(getScene());
}

function renderAudioState() {
  setText(dom.ambienceState, audio.enabled ? "On" : "Off");
}

async function startAudio() {
  if (!audio.ctx) {
    audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    audio.master = audio.ctx.createGain();
    audio.master.gain.value = 0.06;
    audio.master.connect(audio.ctx.destination);
  }
  if (audio.ctx.state === "suspended") await audio.ctx.resume();
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
  noiseLayer(mood === "storm" ? 760 : 900, mood === "storm" ? 0.5 : 0.35, 0.35);
  lowDrone(mood === "storm" ? 44 : 96, 0.06);
}

function noiseLayer(frequency, variance, gain) {
  const bufferSize = audio.ctx.sampleRate * 2;
  const buffer = audio.ctx.createBuffer(1, bufferSize, audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = (Math.random() * 2 - 1) * variance;
  const source = audio.ctx.createBufferSource();
  const filter = audio.ctx.createBiquadFilter();
  const layerGain = audio.ctx.createGain();
  source.buffer = buffer;
  source.loop = true;
  filter.type = "bandpass";
  filter.frequency.value = frequency;
  layerGain.gain.value = gain;
  source.connect(filter);
  filter.connect(layerGain);
  layerGain.connect(audio.master);
  source.start();
  audio.nodes.push(source, filter, layerGain);
}

function lowDrone(frequency, gain) {
  const oscillator = audio.ctx.createOscillator();
  const layerGain = audio.ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  layerGain.gain.value = gain;
  oscillator.connect(layerGain);
  layerGain.connect(audio.master);
  oscillator.start();
  audio.nodes.push(oscillator, layerGain);
}

function d20() { return Math.floor(Math.random() * 20) + 1; }
function readableKey(key) { return String(key).replace(/([A-Z])/g, " $1").toLowerCase(); }
function genericLabel(value) { return value >= 6 ? "high" : value >= 3 ? "present" : "low"; }
function forceLabel(value) { return value >= 6 ? "dominant" : value >= 4 ? "ready" : "held"; }
function restraintLabel(value) { return value >= 5 ? "active" : value >= 3 ? "possible" : "thin"; }
function witnessLabel(value) { return value >= 5 ? "clear" : value >= 3 ? "working" : "partial"; }
function hollowLabel(value) { return value >= 6 ? "hollow rising" : value >= 3 ? "opening" : "contained"; }
function reputationLabel(value) { return value >= 6 ? "legend feeding" : value >= 3 ? "useful name" : "quiet"; }
function civilianLabel(value) { return value >= 7 ? "protected" : value >= 4 ? "at risk" : "severe cost"; }
function threatLabel(value) { return value <= 3 ? "scattered" : value <= 6 ? "unstable" : "dangerous"; }
function pressureLabel(value) { return value <= 2 ? "broken" : value <= 5 ? "contested" : "commanding"; }

function svg(name, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function setStatus(msg) {
  setText(dom.saveStatus, msg);
}

function on(target, event, handler) {
  if (target) target.addEventListener(event, handler);
}

function setText(target, value) {
  if (target) target.textContent = value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showFatalError(error) {
  console.error(error);
  if (dom.campaignCover) dom.campaignCover.hidden = true;
  document.body.classList.remove("cover-open");
  setText(dom.sceneTitle, "Table interrupted");
  if (dom.narration) {
    dom.narration.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = "The session could not continue. Start a new session to clear the local table state.";
    dom.narration.appendChild(p);
  }
  if (dom.choiceList) {
    dom.choiceList.innerHTML = "";
    const button = document.createElement("button");
    button.className = "choice storm-choice";
    button.textContent = "Start a clean session";
    button.addEventListener("click", startNewSession);
    dom.choiceList.appendChild(button);
  }
}
