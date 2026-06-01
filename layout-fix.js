function normaliseMusicChrome() {
  const button = document.getElementById("ambienceBtn");
  const state = document.getElementById("ambienceState");
  if (!button || !state) return;

  button.textContent = "M";
  const raw = state.textContent.toLowerCase();
  if (raw.includes("storm") || raw.includes("rain") || raw.includes("wind") || raw.includes("ambience:")) {
    state.textContent = "On";
  }
  if (raw.includes("off")) {
    state.textContent = "Off";
  }
}

window.addEventListener("load", () => {
  normaliseMusicChrome();
  const button = document.getElementById("ambienceBtn");
  const state = document.getElementById("ambienceState");

  if (button) {
    button.addEventListener("click", () => window.setTimeout(normaliseMusicChrome, 0));
  }

  if (state) {
    const observer = new MutationObserver(normaliseMusicChrome);
    observer.observe(state, { childList: true, characterData: true, subtree: true });
  }
});
