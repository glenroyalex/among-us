// ===============================
//  GAME SETUP
// ===============================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player sprite
const sprite = new Image();
sprite.src = "assets/alien.png"; // <-- your chosen sprite

// Player object
const player = {
    x: 300,
    y: 300,
    speed: 3,
    width: 64,   // adjust if your sprite is different
    height: 64,  // adjust if your sprite is different
    facing: "right",
    dx: 0,
    dy: 0
};

// Keys
const keys = {};

// ===============================
//  INPUT HANDLING
// ===============================

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// ===============================
//  MOVEMENT LOGIC
// ===============================

function updateMovement() {
    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["ArrowUp"]) dy = -1;
    if (keys["s"] || keys["ArrowDown"]) dy = 1;
    if (keys["a"] || keys["ArrowLeft"]) dx = -1;
    if (keys["d"] || keys["ArrowRight"]) dx = 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
    }

    // Apply movement
    player.x += dx * player.speed;
    player.y += dy * player.speed;

    // Save direction for drawing
    if (dx > 0) player.facing = "right";
    if (dx < 0) player.facing = "left";

    player.dx = dx;
    player.dy = dy;
}

// ===============================
//  DRAW PLAYER
// ===============================

function drawPlayer() {
    ctx.save();

    if (player.facing === "left") {
        ctx.scale(-1, 1);
        ctx.drawImage(
            sprite,
            -player.x - player.width,
            player.y,
            player.width,
            player.height
        );
    } else {
        ctx.drawImage(
            sprite,
            player.x,
            player.y,
            player.width,
            player.height
        );
    }

    ctx.restore();
}

// ===============================
//  MAIN GAME LOOP
// ===============================

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateMovement();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Start when sprite loads
sprite.onload = () => {
    gameLoop();
};
