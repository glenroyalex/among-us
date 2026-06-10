const updatesModal = document.getElementById("updatesModal");
const updatesList = document.getElementById("updatesList");
const closeUpdates = document.getElementById("closeUpdates");
const updatesBtn = document.getElementById("updatesBtn");
const playBtn = document.getElementById("playBtn");

// Load updates from updates.json
async function loadUpdates() {
  try {
    const res = await fetch("updates.json");
    const data = await res.json();

    updatesList.innerHTML = "";
    data.forEach(update => {
      const div = document.createElement("div");
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <strong>${update.version}</strong> - ${update.date}<br>
        ${update.text}
      `;
      updatesList.appendChild(div);
    });
  } catch (err) {
    updatesList.textContent = "Failed to load updates.";
  }
}

// Show modal on page load
window.addEventListener("load", async () => {
  await loadUpdates();
  updatesModal.style.display = "flex";
});

// Close modal
closeUpdates.addEventListener("click", () => {
  updatesModal.style.display = "none";
});

// Open modal from Updates button
updatesBtn.addEventListener("click", async () => {
  await loadUpdates();
  updatesModal.style.display = "flex";
});

// Go to game
playBtn.addEventListener("click", () => {
  window.location.href = "game.html";
});
