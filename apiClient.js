const BIN_ID = '68269c788a456b79669ea317';
const ACCESS_KEY = '$2a$10$2CjETQg03/ghTwpaQbXkZeHd34regxxgZxfIHkWaExfZco03WPDJG';

const headers = {
  'X-Access-Key': ACCESS_KEY,
  'Content-Type': 'application/json',
};

export async function fetchGlobalHighScores() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers });
  const data = await res.json();
  return data.record?.scores || [];
}

export async function submitHighScore(name, score) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers });
  const data = await res.json();
  const scores = data.record?.scores || [];

  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);

  const updateRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ scores: top10 }),
  });

  const updateData = await updateRes.json();
  return updateData.record?.scores || [];
}
