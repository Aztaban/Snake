import { Snake } from './snake.js';
import { generateFood } from './utils.js';
import { initializeControls } from './controls.js';
import { HighScoreManager } from './highScoreManager.js';
import { UI, hideScreens, updateScoreDisplay } from './ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;

let snake,
  food,
  score,
  highScore = 0,
  game;

const directionFlag = { value: false };
const scoreManager = new HighScoreManager();

function resetGame() {
  snake = new Snake(9 * box, 9 * box, box, canvas.width, canvas.height);
  food = generateFood(box, canvas.width, canvas.height);
  score = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  snake.move();

  // Collision
  if (snake.checkCollision()) {
    endGame();
    return;
  }

  // Eat food
  if (snake.head.x === food.x && snake.head.y === food.y) {
    score += 100;
    food = generateFood(box, canvas.width, canvas.height);
  } else {
    snake.shrink();
  }

  // Draw snake and UI
  snake.draw(ctx);
  updateScoreDisplay(score, highScore);
  directionFlag.value = false;
}

async function endGame() {
  clearInterval(game);
  scoreManager.pendingScore = score;

  UI.finalScore.innerText = 'Your score: ' + score;
  UI.gameOverScreen.style.display = 'flex';

  if (scoreManager.isHighScore(score)) {
    UI.nameInput.style.display = 'block';
  } else {
    await scoreManager.display(UI.highScoreList);
  }
}

async function submitHighScore() {
  const input = UI.playerNameInput;
  const name = input.value.trim().substring(0, 8).toUpperCase();
  if (!name) return;

  await scoreManager.submit(name);
  await scoreManager.display(UI.highScoreList, name, scoreManager.pendingScore);

  UI.nameInput.style.display = 'none';
}

async function startGame() {
  clearInterval(game);
  hideScreens();

  await scoreManager.load();
  resetGame();
  initializeControls(snake, canvas, directionFlag);
  game = setInterval(draw, 100);
}

window.startGame = startGame;
window.restartGame = startGame;
window.submitHighScore = submitHighScore;
