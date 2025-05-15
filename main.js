import { Snake } from './snake.js';
import { generateFood, isHighScore, updateHighScores } from './utils.js';
import { fetchGlobalHighScores, submitHighScore as submitHighScoreToAPI } from './apiClient.js';
import { initializeControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;

let snake,
  food,
  score,
  highScore = 0,
  highScores,
  game;

let directionChanged = false;
let pendingScore = null;
const directionFlag = { value: false };

function resetGame() {
  snake = new Snake(9 * box, 9 * box, box, canvas.width, canvas.height);
  food = generateFood(box, canvas.width, canvas.height);
  score = 0;
  directionChanged = false;
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
  updateScoreDisplay();
  directionChanged = false;
  directionFlag.value = false;
}

function updateScoreDisplay() {
  document.getElementById('score').innerText = 'Score: ' + score;
  if (score > highScore) {
    highScore = score;
    document.getElementById('highScore').innerText = 'High Score: ' + highScore;
  }
}

async function displayHighScores(playerName = null, playerScore = null) {
  const scores = await fetchGlobalHighScores();
  const list = scores
    .map((s) => {
      const isPlayer = playerName && s.name === playerName && s.score === playerScore;
      const style = isPlayer ? ' style="font-weight:bold; color:#fff; background:#0a0;"' : '';
      return `<li${style}>${s.name} - ${s.score}</li>`;
    })
    .join('');
  document.getElementById('highScoreList').innerHTML = `
    <h3>Top 10 High Scores</h3>
    <ol>${list}</ol>
  `;
}

async function endGame() {
  clearInterval(game);
  highScores.sort((a, b) => b.score - a.score);
  const isTopScore = isHighScore(score, highScores);
  pendingScore = score;

  document.getElementById('finalScore').innerText = 'Your score: ' + score;
  document.getElementById('gameOverScreen').style.display = 'flex';

  if (isTopScore) {
    document.getElementById('nameInputSection').style.display = 'block';
  } else {
    await displayHighScores();
  }
}

async function submitHighScore() {
  const input = document.getElementById('playerName');
  const name = input.value.trim().substring(0, 8).toUpperCase();
  if (!name) return;

  highScores = updateHighScores(highScores, name, pendingScore);
  localStorage.setItem('snakeHighScores', JSON.stringify(highScores));

  await submitHighScoreToAPI(name, pendingScore);
  await displayHighScores(name, pendingScore);

  document.getElementById('nameInputSection').style.display = 'none';
}

function startGame() {
  clearInterval(game);
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('nameInputSection').style.display = 'none';
  highScores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];
  resetGame();

  // Setup controls
  initializeControls(snake, canvas, directionFlag);

  game = setInterval(draw, 100);
}

window.startGame = startGame;
window.restartGame = startGame;
window.submitHighScore = submitHighScore;
