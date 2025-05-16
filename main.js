import { HighScoreManager } from './game/HighScoreManager.js';
import { UI, hideScreens, showStartScreenScores, showGameOverScores } from './ui/ui.js';
import { Game } from './game/Game.js';

const scoreManager = new HighScoreManager();
const game = new Game('gameCanvas', 20, scoreManager);

window.addEventListener('DOMContentLoaded', async () => {
  await scoreManager.load();
  await scoreManager.display(); // shows scores on home screen
});

async function startGame() {
  hideScreens();
  await scoreManager.load();
  await showStartScreenScores(scoreManager);
  game.start();
}

async function submitHighScore() {
  const input = UI.playerNameInput;
  const name = input.value.trim().substring(0, 8).toUpperCase();
  if (!name) return;

  const score = scoreManager.pendingScore;
  await scoreManager.submit(name);

  await showGameOverScores(scoreManager, name, score);

  UI.nameInput.style.display = 'none';
}

window.startGame = startGame;
window.restartGame = startGame;
window.submitHighScore = submitHighScore;
