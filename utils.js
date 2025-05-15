export function generateFood(box, width, height) {
  return {
    x: Math.floor(Math.random() * (width / box)) * box,
    y: Math.floor(Math.random() * (height / box)) * box,
  };
}

export function isHighScore(score, scores) {
  return scores.length < 10 || score > Math.min(...scores.map((s) => s.score));
}

export function updateHighScores(scores, name, score) {
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, 10);
}
