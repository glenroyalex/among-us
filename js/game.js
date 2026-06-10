// =========================
//  LOAD SPRITE SHEET
// =========================
const spriteSheet = new Image();
spriteSheet.src = "assets/armored_trooper_b.png";

// =========================
//  CANVAS SETUP
// =========================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// =========================
//  PLAYER DATA
// =========================
let players = {};
let myId = null;

// Frame size for Armored Trooper B (adjust if needed)
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;

// How many frames per direction (usually 3–6)
const FRAMES_PER_DIRECTION = 4;

// =========================
//  SOCKET.IO SETUP
// =========================
const socket = io();

// Receive your ID
socket.on("yourId", (id) => {
  myId = id;
});

// Receive all players
socket.on("state", (serverPlayers) => {
  players = serverPlayers;
});

// =========================
//  MOVEMENT + DIRECTION
// =========================
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Convert movement to direction index (0–7)
function getDirectionIndex(dx, dy) {
  if (dx === 0 && dy > 0) return 0;       // down
  if (dx > 0 && dy > 0) return 1;        // down-right
  if (dx > 0 && dy === 0) return 2;      // right
  if (dx > 0 && dy < 0) return 3;        // up-right
  if (dx === 0 && dy < 0) return 4;      // up
  if (dx < 0 && dy < 0) return 5;        // up-left
  if (dx < 0 && dy === 0) return 6;      // left
  if (dx < 0 && dy > 0) return 7;        // down-left
  return 0;
}

// =========================
//  GAME LOOP
// =========================
function update() {
  if (!myId || !players[myId]) return;

  let p = players[myId];

  let dx = 0;
  let dy = 0;

  if (keys["w"]) dy -= 1;
  if (keys["s"]) dy += 1;
  if (keys["a"]) dx -= 1;
  if (keys["d"]) dx += 1;

  const moving = dx !== 0 || dy !== 0;

  if (moving) {
    const speed = 2.5;
    p.x += dx * speed;
    p.y += dy * speed;

    p.directionIndex = getDirectionIndex(dx, dy);

    // Animate walk cycle
    p.frameTimer = (p.frameTimer || 0) + 1;
    if (p.frameTimer >= 10) {
      p.frameTimer = 0;
      p.frame = (p.frame + 1) % FRAMES_PER_DIRECTION;
    }
  } else {
    p.frame = 0; // idle
  }

  // Send update to server
  socket.emit("move", {
    x: p.x,
    y: p.y,
    directionIndex: p.directionIndex,
    frame: p.frame
  });
}

// =========================
//  DRAW LOOP
// =========================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    const p = players[id];

    const sx = p.frame * FRAME_WIDTH;
    const sy = p.directionIndex * FRAME_HEIGHT;

    ctx.drawImage(
      spriteSheet,
      sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
      p.x, p.y, FRAME_WIDTH, FRAME_HEIGHT
    );
  }

  requestAnimationFrame(draw);
}

// =========================
//  START LOOPS
// =========================
setInterval(update, 16); // 60 FPS logic
draw();
