import { fetchGlobalHighScores, submitHighScore as submitToAPI } from './apiClient.js';
import { updateHighScores } from './utils.js';

export class HighScoreManager {
  constructor(storageKey = 'snakeHighScores') {
    this.storageKey = storageKey;
    this.scores = [];
    this.pendingScore = null;
  }

  async load() {
    const local = JSON.parse(localStorage.getItem(this.storageKey));
    this.scores = Array.isArray(local) ? local : [];

    try {
      const global = await fetchGlobalHighScores();
      if (Array.isArray(global) && global.length > 0) {
        this.scores = global;
        localStorage.setItem(this.storageKey, JSON.stringify(global));
      }
    } catch (err) {
      console.warn('Failed to load global scores:', err);
    }
  }

  isHighScore(score) {
    const sorted = [...this.scores].sort((a, b) => b.score - a.score);
    return sorted.length < 10 || score > sorted[sorted.length - 1].score;
  }

  async submit(name, score) {
    this.scores = updateHighScores(this.scores, name, score);
    localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    await submitToAPI(name, score);
  }

  async display(targetEl, playerName = null, playerScore = null) {
    const scores = await fetchGlobalHighScores();
    this.scores = scores;

    const list = scores
      .map((s) => {
        const isPlayer = playerName && s.name === playerName && s.score === playerScore;
        const style = isPlayer ? ' style="font-weight:bold; color:#fff; background:#0a0;"' : '';
        return `<li${style}>${s.name} - ${s.score}</li>`;
      })
      .join('');

    targetEl.innerHTML = `<h3>Top 10 High Scores</h3><ol>${list}</ol>`;
  }
}
