import { useState, useEffect } from 'react';

export default function Home() {
  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/flashcards');
      const data = await res.json();
      setFlashcards(data);
    } catch (error) {
      alert('Failed to load flashcards');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const addFlashcard = async () => {
    if (!front.trim() || !back.trim()) {
      alert('Please fill front and back');
      return;
    }

    const id = Date.now().toString();
    try {
      await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, front, back }),
      });
      setFlashcards([...flashcards, { id, front, back }]);
      setFront('');
      setBack('');
    } catch (error) {
      alert('Failed to add flashcard');
    }
  };

  const deleteFlashcard = async (id) => {
    try {
      await fetch(`/api/flashcards/${id}`, { method: 'DELETE' });
      setFlashcards(flashcards.filter(card => card.id !== id));
    } catch (error) {
      alert('Failed to delete flashcard');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Flashcards</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          style={{ width: '48%', marginRight: '4%', padding: 8 }}
        />
        <input
          type="text"
          placeholder="Back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          style={{ width: '48%', padding: 8 }}
        />
        <button onClick={addFlashcard} style={{ marginTop: 10, padding: '8px 16px' }}>
          Add Flashcard
        </button>
      </div>

      {loading ? (
        <p>Loading flashcards...</p>
      ) : flashcards.length === 0 ? (
        <p>No flashcards yet. Add some!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {flashcards.map(({ id, front, back }) => (
            <li
              key={id}
              style={{
                background: '#f0f0f0',
                marginBottom: 10,
                padding: 10,
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <b>{front}</b> — {back}
              </div>
              <button
                onClick={() => deleteFlashcard(id)}
                style={{
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
    }
