import redis from '../../../lib/redis';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const keys = await redis.keys('flashcard:*');
      const cards = [];

      for (const key of keys) {
        const cardJson = await redis.get(key);
        cards.push(JSON.parse(cardJson));
      }

      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
  } else if (req.method === 'POST') {
    try {
      const { id, front, back } = req.body;
      if (!id || !front || !back) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      await redis.set(`flashcard:${id}`, JSON.stringify({ id, front, back }));
      res.status(201).json({ message: 'Flashcard added' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add flashcard' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
             }
