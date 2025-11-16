import { useState, useEffect } from 'react';
import styles from './App.module.css';

interface LetterPosition {
  letter: string;
  angle: number;
  id: number;
}

function App() {
  const [input, setInput] = useState('');
  const [letters, setLetters] = useState<LetterPosition[]>([]);
  const [usedLetterIds, setUsedLetterIds] = useState<Set<number>>(new Set());
  const [builtWord, setBuiltWord] = useState<string[]>([]);

  useEffect(() => {
    if (input.length === 0) {
      setLetters([]);
      setUsedLetterIds(new Set());
      setBuiltWord([]);
      return;
    }

    const inputLetters = input.split('');
    const shuffled = [...inputLetters].sort(() => Math.random() - 0.5);

    const angleStep = 360 / shuffled.length;
    const positioned = shuffled.map((letter, index) => ({
      letter,
      angle: index * angleStep,
      id: index,
    }));

    setLetters(positioned);
    setUsedLetterIds(new Set());
    setBuiltWord([]);
  }, [input]);

  const handleShuffle = () => {
    if (input.length === 0) return;

    const inputLetters = input.split('');
    const shuffled = [...inputLetters].sort(() => Math.random() - 0.5);
    const angleStep = 360 / shuffled.length;
    const positioned = shuffled.map((letter, index) => ({
      letter,
      angle: index * angleStep,
      id: Math.random(),
    }));

    setLetters(positioned);
    setUsedLetterIds(new Set());
    setBuiltWord([]);
  };

  const handleLetterClick = (id: number, letter: string) => {
    if (usedLetterIds.has(id)) return;

    setUsedLetterIds((prev) => new Set(prev).add(id));
    setBuiltWord((prev) => [...prev, letter]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter letters here..."
          className={styles.input}
        />
        <button
          onClick={handleShuffle}
          disabled={input.length === 0}
          className={styles.shuffleButton}
        >
          Shuffle
        </button>
      </div>

      <div className={styles.circleContainer}>
        <div className={styles.circle}>
          {letters.map((item) => {
            const isUsed = usedLetterIds.has(item.id);
            return (
              <div
                key={item.id}
                className={`${styles.letter} ${
                  isUsed ? styles.letterUsed : ''
                }`}
                style={{
                  transform: `rotate(${item.angle}deg) translate(150px) rotate(-${item.angle}deg)`,
                }}
                onClick={() => handleLetterClick(item.id, item.letter)}
              >
                {item.letter.toUpperCase()}
              </div>
            );
          })}
        </div>
      </div>

      {builtWord.length > 0 && (
        <div className={styles.builtWord}>
          {builtWord.join('').toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default App;
