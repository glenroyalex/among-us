<!DOCTYPE html>
<html>
<head>
  <title>Multiplayer Test</title>

  <!-- Load socket.io client -->
  <script src="https://cdn.socket.io/4.7.0/socket.io.min.js"></script>

  <!-- FIXED: correct path to game.js -->
  <script src="js/game.js" defer></script>

  <style>
    body {
      margin: 0;
      background: #111;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    canvas {
      background: #222;
      border: 3px solid #fff;
    }
  </style>
</head>

<body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
</body>
</html>
