// Connect to your Render server
const socket = io("https://among-us-server.onrender.com");

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Store all players
let players = {};

// When you join, server sends all current players
socket.on("currentPlayers", (serverPlayers) => {
  players = serverPlayers;
});

// When a new player joins
socket.on("newPlayer", (player) => {
  players[player.id] = player;
});

// When a player moves
socket.on("playerMoved", (data) => {
  if (players[data.id]) {
    players[data.id].x = data.x;
    players[data.id].y = data.y;
  }
});

// When a player disconnects
socket.on("playerDisconnected", (id) => {
  delete players[id];
});

// Your player position
let x = 400;
let y = 300;

// Movement controls
document.addEventListener("keydown", (e) => {
  if (e.key === "w") y -= 5;
  if (e.key === "s") y += 5;
  if (e.key === "a") x -= 5;
  if (e.key === "d") x += 5;

  socket.emit("move", { x, y });
});

// Draw loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    const p = players[id];
    ctx.drawImage(
  spriteSheet,
  sx, sy, sw, sh,
  p.x, p.y, sw, sh
);

  }

  requestAnimationFrame(draw);
}

draw();
