export function addAndSortHighScores(scores, name, score, limit = 10) {
  const updated = [...scores, { name, score }];
  return updated.sort((a, b) => b.score - a.score).slice(0, limit);
}
