let highScores = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(highScores);
  } else if (req.method === 'POST') {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);

    res.status(200).json(highScores);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
