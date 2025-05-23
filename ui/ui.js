export const UI = {
  startScreen: document.getElementById('startScreen'),
  gameOverScreen: document.getElementById('gameOverScreen'),
  nameInput: document.getElementById('nameInputSection'),
  highScoreList: document.getElementById('highScoreList'),
  finalScore: document.getElementById('finalScore'),
  playerNameInput: document.getElementById('playerName'),
  scoreDisplay: document.getElementById('score'),
  highScoreDisplay: document.getElementById('highScore'),
  gameOverScoreList: document.getElementById('gameOverScoreList'),
  gameOverTitle: document.getElementById('gameOverTitle'),
};

export function hideScreens() {
  UI.startScreen.style.display = 'none';
  UI.gameOverScreen.style.display = 'none';
  UI.nameInput.style.display = 'none';
  UI.highScoreList.style.display = 'none';
}

export function updateScoreDisplay(score, currentHighScore) {
  UI.scoreDisplay.innerText = 'Score: ' + score;
  if (score > currentHighScore) {
    UI.highScoreDisplay.innerText = 'High Score: ' + score;
  }
}

export function showStartScreenScores(scoreManager) {
  scoreManager.setDisplayElement(UI.highScoreList);
  UI.highScoreList.style.display = 'block';
  return scoreManager.display();
}

export function showGameOverScores(scoreManager, name, score) {
  scoreManager.setDisplayElement(UI.gameOverScoreList);
  UI.gameOverScoreList.style.display = 'block';
  return scoreManager.display(name, score);
}
