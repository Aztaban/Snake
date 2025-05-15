export async function fetchGlobalHighScores() {
  try {
    const res = await fetch('/api/highscores');
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch high scores:', err);
    return [];
  }
}

export async function submitHighScore(name, score) {
  try {
    const res = await fetch('/api/highscores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to submit high score:', err);
    return [];
  }
}
