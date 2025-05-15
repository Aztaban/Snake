export function setupKeyboardControls(snake, directionChangedRef) {
  document.addEventListener('keydown', (e) => {
    if (!directionChangedRef.value) {
      const dir = e.key.replace('Arrow', '').toUpperCase();
      snake.setDirection(dir);
      directionChangedRef.value = true;
    }
  });
}

export function setupTouchControls(canvas, onDirectionChange) {
  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  canvas.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) onDirectionChange('RIGHT');
      if (dx < -30) onDirectionChange('LEFT');
    } else {
      if (dy > 30) onDirectionChange('DOWN');
      if (dy < -30) onDirectionChange('UP');
    }
  });
}

export function setupButtonControls(onDirectionChange) {
  window.changeDirection = function (dir) {
    onDirectionChange(dir);
  };
}
