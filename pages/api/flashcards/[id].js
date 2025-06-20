import redis from '../../../lib/redis';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await redis.del(`flashcard:${id}`);
      await redis.lrem('flashcard:all', 0, id); // remove from list
      res.status(200).json({ message: 'Flashcard deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete flashcard' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
