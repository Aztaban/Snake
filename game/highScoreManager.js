import { updateHighScores } from '../ui/utils.js';
import { UI } from '../ui/ui.js';

export class HighScoreManager {
  constructor(storageKey = 'snakeHighScores') {
    this.storageKey = storageKey;
    this.scores = [];
    this.pendingScore = null;
    this.displayElement = UI.highScoreList;
  }

  async load() {
    const local = JSON.parse(localStorage.getItem(this.storageKey));
    this.scores = Array.isArray(local) ? local : [];

    try {
      const response = await fetch('/api/handler');
      const global = await response.json();
      if (Array.isArray(global) && global.length > 0) {
        this.scores = global;
        localStorage.setItem(this.storageKey, JSON.stringify(global));
      }
    } catch (err) {
      console.warn('Failed to load global scores:', err);
    }
  }

  isTopScore(score) {
    const sorted = [...this.scores].sort((a, b) => b.score - a.score);
    return sorted.length < 10 || score > sorted[sorted.length - 1].score;
  }

  setPendingScore(score) {
    this.pendingScore = score;
  }

  setDisplayElement(el) {
    this.displayElement = el;
  }

  async submit(name) {
    if (typeof this.pendingScore !== 'number') {
      console.warn('No pending score to submit.');
      return;
    }

    try {
      const response = await fetch('/api/handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score: this.pendingScore }),
      });

      const updatedScores = await response.json();
      this.scores = updateHighScores(updatedScores, name, this.pendingScore);
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    } catch (err) {
      console.error('Failed to submit score to server:', err);
    }
  }
  async display(playerName = null, playerScore = null) {
    const targetEl = this.displayElement;
    if (!targetEl) return console.warn('No display element set for HighScoreManager.');

    try {
      const response = await fetch('/api/handler');
      const scores = await response.json();
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
