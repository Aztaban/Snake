const BIN_ID = '68269c788a456b79669ea317';
const ACCESS_KEY = '$2a$10$2CjETQg03/ghTwpaQbXkZeHd34regxxgZxfIHkWaExfZco03WPDJG';

const headers = {
  'X-Access-Key': ACCESS_KEY,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers,
      });
      const data = await response.json();
      res.status(200).json(data.record.scores || []);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
      res.status(500).json({ error: 'Failed to fetch scores' });
    }
  } else if (req.method === 'POST') {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    try {
      const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers });
      const getData = await getRes.json();
      const scores = getData.record.scores || [];

      scores.push({ name, score });
      scores.sort((a, b) => b.score - a.score);
      const top10 = scores.slice(0, 10);

      const putRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ scores: top10 }),
      });

      const putData = await putRes.json();
      res.status(200).json(putData.record.scores);
    } catch (err) {
      console.error('Failed to update scores:', err);
      res.status(500).json({ error: 'Failed to update scores' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
