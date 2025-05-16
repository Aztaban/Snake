import { Snake } from './Snake.js';
import { initializeControls } from './controls.js';
import { UI, updateScoreDisplay } from '../ui/ui.js';

export class Game {
  constructor(canvasId, boxSize, scoreManager) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.box = boxSize;
    this.scoreManager = scoreManager;
    this.directionFlag = { value: false };
    this.highScore = 0;
    this.interval = null;
  }

  reset() {
    this.snake = new Snake(9 * this.box, 9 * this.box, this.box, this.canvas.width, this.canvas.height);
    this.food = this.snake.generateFood();
    this.score = 0;
    initializeControls(this.snake, this.canvas, this.directionFlag);
  }

  start() {
    clearInterval(this.interval);
    this.reset();
    this.interval = setInterval(this.draw.bind(this), 100);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw food
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.food.x, this.food.y, this.box, this.box);

    this.snake.move();

    // collision
    if (this.snake.checkCollision()) {
      this.endGame();
      return;
    }

    // Eat food
    if (this.snake.head.x === this.food.x && this.snake.head.y === this.food.y) {
      this.score += 100;
      this.food = this.snake.generateFood();
    } else {
      this.snake.shrink();
    }

    this.snake.draw(this.ctx);
    updateScoreDisplay(this.score, this.highScore);
    this.directionFlag.value = false;
  }

  async endGame() {
    clearInterval(this.interval);
    this.scoreManager.pendingScore = this.score;

    UI.finalScore.innerText = 'Your score: ' + this.score;
    UI.gameOverScreen.style.display = 'flex';
    UI.gameOverScoreList.style.display = 'block';
    this.scoreManager.setDisplayElement(UI.gameOverScoreList);

    const isTop = this.scoreManager.isTopScore(this.score);
    const isMobile = window.innerWidth < 400;
    UI.gameOverTitle.innerText = isTop ? (isMobile ? 'New High Score!' : '🎉 New High Score! 🎉') : 'Game Over!';
    UI.gameOverTitle.className = isTop ? 'highlight-title' : '';

    if (isTop) {
      UI.nameInput.style.display = 'block';
    } else {
      await this.scoreManager.display();
    }
  }
}
