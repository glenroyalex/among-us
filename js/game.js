// ===============================
//  GAME SETUP
// ===============================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Sprite sheet
const sprite = new Image();
sprite.src = "assets/alien.png"; // <-- your sprite sheet

// Player object
const player = {
    x: 300,
    y: 300,
    speed: 3,

    width: 64,   // adjust if your frame size is different
    height: 64,  // adjust if your frame size is different

    facing: "right",
    dx: 0,
    dy: 0,

    // Animation
    frame: 0,
    frameCount: 6,       // <-- you said 6 walk frames
    frameTimer: 0,
    frameInterval: 6     // lower = faster animation
};

// Keys
const keys = {};

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
//  ANIMATION LOGIC
// ===============================

function updateAnimation() {
    // If moving → animate walk frames
    if (player.dx !== 0 || player.dy !== 0) {
        player.frameTimer++;

        if (player.frameTimer >= player.frameInterval) {
            player.frameTimer = 0;
            player.frame = (player.frame + 1) % player.frameCount;
        }
    } else {
        // Idle → use frame 0
        player.frame = 0;
    }
}

// ===============================
//  DRAW PLAYER
// ===============================

function drawPlayer() {
    ctx.save();

    // Source frame on sprite sheet
    const sx = player.frame * player.width;
    const sy = player.height * 1; 
    // ^^^ IMPORTANT:
    // This selects the WALK ROW.
    // If your walk row is not the second row,
    // change the "* 1" to the correct row index.

    if (player.facing === "left") {
        ctx.scale(-1, 1);
        ctx.drawImage(
            sprite,
            sx, sy, player.width, player.height,
            -player.x - player.width, player.y,
            player.width, player.height
        );
    } else {
        ctx.drawImage(
            sprite,
            sx, sy, player.width, player.height,
            player.x, player.y,
            player.width, player.height
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
    updateAnimation();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

sprite.onload = () => {
    gameLoop();
};
