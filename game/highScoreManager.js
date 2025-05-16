import { fetchGlobalHighScores, submitHighScore } from '../apiClient.js';
import { addAndSortHighScores } from '../ui/utils.js';
import { UI } from '../ui/ui.js';

export class HighScoreManager {
  constructor(storageKey = 'snakeHighScores') {
    this.storageKey = storageKey;
    this.scores = [];
    this.pendingScore = null;
    this.displayElement = UI.highScoreList;
  }

  // === Setup Methods ===
  setPendingScore(score) {
    this.pendingScore = score;
  }

  setDisplayElement(el) {
    this.displayElement = el;
  }

  // === Core Logic ===
  saveToLocal() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
  }

  updateLocalScores(name, score) {
    this.scores = addAndSortHighScores(this.scores, name, score);
    this.saveToLocal();
  }

  isTopScore(score) {
    const sorted = [...this.scores].sort((a, b) => b.score - a.score);
    return sorted.length < 10 || score > sorted[sorted.length - 1].score;
  }

  // === Data Handling ===
  async load() {
    const local = JSON.parse(localStorage.getItem(this.storageKey));
    this.scores = Array.isArray(local) ? local : [];

    try {
      const global = await fetchGlobalHighScores();
      if (global.length > 0) {
        this.scores = global;
        localStorage.setItem(this.storageKey, JSON.stringify(global));
      }
    } catch (err) {
      console.warn('Failed to load global scores:', err);
    }
  }

  async submit(name) {
    if (typeof this.pendingScore !== 'number') {
      console.warn('No pending score to submit.');
      return;
    }

    const score = this.pendingScore;
    this.pendingScore = null;

    try {
      this.scores = await submitHighScore(name, score);
      this.saveToLocal;
      await this.display(name, score);
    } catch (err) {
      console.error('Score submission failed:', err);

      this.updateLocalScores(name, score);
      await this.display(name, score);

      this.pendingScore = score;
    }
  }

  // === UI Display ===
  async display(playerName = null, playerScore = null) {
    const targetEl = this.displayElement;
    if (!targetEl) return console.warn('No display element set for HighScoreManager.');

    try {
      const scores = await fetchGlobalHighScores();
      this.scores = scores;

      const list = scores
        .map((s) => {
          const isPlayer = playerName && s.name.toUpperCase() === playerName.toUpperCase() && s.score === playerScore;
          const style = isPlayer ? ' style="font-weight:bold; color:#fff; background:#0a0;"' : '';
          return `<li${style}>${s.name} - ${s.score}</li>`;
        })
        .join('');

      targetEl.innerHTML = `<h3>Top 10 High Scores</h3><ol>${list}</ol>`;
    } catch (err) {
      console.warn('Failed to fetch and display scores:', err);
    }
  }
}
