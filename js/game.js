// ===============================
//  CANVAS SETUP
// ===============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===============================
//  SPRITE SHEET (5 frames, 1 row)
// ===============================
const sprite = new Image();
sprite.src = "assets/alien_walk.png"; // 5-frame walk row

const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 128;
const FRAME_COUNT = 5;
const FRAME_INTERVAL = 6;
const SPEED = 3;

// ===============================
//  MULTIPLAYER SETUP
// ===============================
const socket = io("https://among-us-server.onrender.com");

let myId = null;
const players = {}; // id -> { x,y,dx,dy,facing,frame,frameTimer }

// ===============================
//  INPUT
// ===============================
const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// ===============================
//  LOCAL PLAYER HELPERS
// ===============================
function ensureLocalPlayer() {
    if (!myId) return;
    if (!players[myId]) {
        players[myId] = {
            x: 300,
            y: 300,
            dx: 0,
            dy: 0,
            facing: "right",
            frame: 0,
            frameTimer: 0
        };
    }
}

function updateLocalMovement() {
    if (!myId || !players[myId]) return;
    const p = players[myId];

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["ArrowUp"]) dy = -1;
    if (keys["s"] || keys["ArrowDown"]) dy = 1;
    if (keys["a"] || keys["ArrowLeft"]) dx = -1;
    if (keys["d"] || keys["ArrowRight"]) dx = 1;

    if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    p.x += dx * SPEED;
    p.y += dy * SPEED;

    if (dx > 0) p.facing = "right";
    if (dx < 0) p.facing = "left";

    p.dx = dx;
    p.dy = dy;

    // send movement to server
    socket.emit("move", {
        x: p.x,
        y: p.y,
        dx: p.dx,
        dy: p.dy,
        facing: p.facing
    });
}

// ===============================
//  ANIMATION
// ===============================
function updateAnimation(p) {
    if (p.dx !== 0 || p.dy !== 0) {
        p.frameTimer++;
        if (p.frameTimer >= FRAME_INTERVAL) {
            p.frameTimer = 0;
            p.frame = (p.frame + 1) % FRAME_COUNT;
        }
    } else {
        p.frame = 0;
        p.frameTimer = 0;
    }
}

// ===============================
//  DRAWING
// ===============================
function drawPlayer(p) {
    ctx.save();

    const sx = p.frame * FRAME_WIDTH;
    const sy = 0; // only one row

    if (p.facing === "left") {
        ctx.scale(-1, 1);
        ctx.drawImage(
            sprite,
            sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
            -p.x - FRAME_WIDTH, p.y,
            FRAME_WIDTH, FRAME_HEIGHT
        );
    } else {
        ctx.drawImage(
            sprite,
            sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
            p.x, p.y,
            FRAME_WIDTH, FRAME_HEIGHT
        );
    }

    ctx.restore();
}

function drawAllPlayers() {
    for (const id in players) {
        updateAnimation(players[id]);
        drawPlayer(players[id]);
    }
}

// ===============================
//  SOCKET.IO EVENTS
// ===============================

// when we connect, remember our id
socket.on("connect", () => {
    myId = socket.id;
    ensureLocalPlayer();
});

// server should send all current players:
// { id: { x,y,dx,dy,facing } }
socket.on("currentPlayers", (serverPlayers) => {
    for (const id in serverPlayers) {
        const sp = serverPlayers[id];
        players[id] = {
            x: sp.x,
            y: sp.y,
            dx: sp.dx || 0,
            dy: sp.dy || 0,
            facing: sp.facing || "right",
            frame: 0,
            frameTimer: 0
        };
    }
});

// new player joined: { id, x,y,dx,dy,facing }
socket.on("newPlayer", (sp) => {
    players[sp.id] = {
        x: sp.x,
        y: sp.y,
        dx: sp.dx || 0,
        dy: sp.dy || 0,
        facing: sp.facing || "right",
        frame: 0,
        frameTimer: 0
    };
});

// player moved: { id, x,y,dx,dy,facing }
socket.on("playerMoved", (sp) => {
