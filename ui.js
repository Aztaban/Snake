export const UI = {
  startScreen: document.getElementById('startScreen'),
  gameOverScreen: document.getElementById('gameOverScreen'),
  nameInput: document.getElementById('nameInputSection'),
  highScoreList: document.getElementById('highScoreList'),
  finalScore: document.getElementById('finalScore'),
  playerNameInput: document.getElementById('playerName'),
  scoreDisplay: document.getElementById('score'),
  highScoreDisplay: document.getElementById('highScore'),
};

export function hideScreens() {
  UI.startScreen.style.display = 'none';
  UI.gameOverScreen.style.display = 'none';
  UI.nameInput.style.display = 'none';
}

export function updateScoreDisplay(score, currentHighScore) {
  UI.scoreDisplay.innerText = 'Score: ' + score;
  if (score > currentHighScore) {
    UI.highScoreDisplay.innerText = 'High Score: ' + score;
  }
}
