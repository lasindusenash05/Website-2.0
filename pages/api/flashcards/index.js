import redis from '../../../lib/redis';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const ids = await redis.lrange('flashcard:all', 0, -1); // get all IDs
      const cards = await Promise.all(
        ids.map(async (id) => {
          const card = await redis.get(`flashcard:${id}`);
          return card ? JSON.parse(card) : null;
        })
      );
      res.status(200).json(cards.filter(Boolean)); // filter out nulls
    } catch (error) {
      console.error('GET error:', error);
      res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
  }

  else if (req.method === 'POST') {
    try {
      const { id, front, back } = req.body;
      if (!id || !front || !back) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      await redis.set(`flashcard:${id}`, JSON.stringify({ id, front, back }));
      await redis.lpush('flashcard:all', id); // save ID to list
      res.status(201).json({ message: 'Flashcard added' });
    } catch (error) {
      console.error('POST error:', error);
      res.status(500).json({ error: 'Failed to add flashcard' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
