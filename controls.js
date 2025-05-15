let directionFlag;
let snakeRef;

export function initializeControls(snakeInstance, canvas, externalFlag) {
  directionFlag = externalFlag;
  snakeRef = snakeInstance;

  setupKeyboardControls();
  setupTouchControls(canvas);
  setupButtonControls();
}

function setDirectionIfAllowed(dir) {
  if (!directionFlag.value) {
    snakeRef.setDirection(dir);
    directionFlag.value = true;
  }
}

function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    const dir = e.key.replace('Arrow', '').toUpperCase();
    setDirectionIfAllowed(dir);
  });
}

function setupTouchControls(canvas) {
  let startX = 0,
    startY = 0;

  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  canvas.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) setDirectionIfAllowed('RIGHT');
      if (dx < -30) setDirectionIfAllowed('LEFT');
    } else {
      if (dy > 30) setDirectionIfAllowed('DOWN');
      if (dy < -30) setDirectionIfAllowed('UP');
    }
  });
}

function setupButtonControls() {
  window.changeDirection = (dir) => {
    setDirectionIfAllowed(dir);
  };
}
