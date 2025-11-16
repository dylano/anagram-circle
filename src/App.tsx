import { useState, useEffect, useRef } from 'react';
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
  const [clickedOrder, setClickedOrder] = useState<number[]>([]);
  const [letterPositions, setLetterPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});
  const letterRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (input.length === 0) {
      setLetters([]);
      setUsedLetterIds(new Set());
      setBuiltWord([]);
      setClickedOrder([]);
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
    setClickedOrder([]);
    setLetterPositions({});
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
    setClickedOrder([]);
    setLetterPositions({});
  };

  const updateLetterPositions = () => {
    if (letters.length === 0 || !svgRef.current) return;

    const newPositions: { [key: number]: { x: number; y: number } } = {};
    letters.forEach((letter) => {
      const element = letterRefs.current[letter.id];
      const pos = getLetterCenterPosition(element, svgRef.current);
      if (pos) {
        newPositions[letter.id] = pos;
      }
    });

    setLetterPositions(newPositions);
  };

  useEffect(() => {
    // Update letter positions after render
    const timeoutId = setTimeout(updateLetterPositions, 0);
    return () => clearTimeout(timeoutId);
  }, [letters, clickedOrder]);

  const handleLetterClick = (id: number, letter: string) => {
    // If letter is already used, rewind to that point
    if (usedLetterIds.has(id)) {
      const clickedIndex = clickedOrder.indexOf(id);
      if (clickedIndex === -1) return;

      // Truncate to the clicked letter (inclusive)
      const newOrder = clickedOrder.slice(0, clickedIndex + 1);
      const newWord = builtWord.slice(0, clickedIndex + 1);
      const newUsedIds = new Set(newOrder);

      setClickedOrder(newOrder);
      setBuiltWord(newWord);
      setUsedLetterIds(newUsedIds);
      return;
    }

    // Add new letter
    setUsedLetterIds((prev) => new Set(prev).add(id));
    setBuiltWord((prev) => [...prev, letter]);
    setClickedOrder((prev) => [...prev, id]);
  };

  const getLetterCenterPosition = (
    element: HTMLDivElement | null,
    svgElement: SVGSVGElement | null
  ) => {
    if (!element || !svgElement) return null;

    const svgRect = svgElement.getBoundingClientRect();
    const letterRect = element.getBoundingClientRect();

    // Get the center of the letter relative to the SVG
    const x = letterRect.left + letterRect.width / 2 - svgRect.left;
    const y = letterRect.top + letterRect.height / 2 - svgRect.top;

    // Convert to SVG viewBox coordinates (0-400)
    const viewBoxWidth = 400;
    const viewBoxHeight = 400;
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;

    return {
      x: (x / svgWidth) * viewBoxWidth,
      y: (y / svgHeight) * viewBoxHeight,
    };
  };

  const getLineEndpointPosition = (
    letterPos: { x: number; y: number },
    centerX: number = 200,
    centerY: number = 200,
    offsetRadius: number = 30
  ) => {
    // Calculate direction vector from center to letter
    const dx = letterPos.x - centerX;
    const dy = letterPos.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return letterPos;

    // Normalize and scale back by offsetRadius
    const newDistance = distance - offsetRadius;
    const scale = newDistance / distance;

    return {
      x: centerX + dx * scale,
      y: centerY + dy * scale,
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Letters to anagram..."
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
          <svg ref={svgRef} className={styles.linesSvg} viewBox="0 0 400 400">
            {clickedOrder.length > 1 &&
              clickedOrder.slice(0, -1).map((_, index) => {
                const currentId = clickedOrder[index];
                const nextId = clickedOrder[index + 1];

                const startLetterPos = letterPositions[currentId];
                const endLetterPos = letterPositions[nextId];

                if (!startLetterPos || !endLetterPos) return null;

                const startPos = getLineEndpointPosition(startLetterPos);
                const endPos = getLineEndpointPosition(endLetterPos);

                return (
                  <line
                    key={`${currentId}-${nextId}`}
                    x1={startPos.x}
                    y1={startPos.y}
                    x2={endPos.x}
                    y2={endPos.y}
                    stroke="#c9a3ff"
                    strokeWidth="4"
                    className={styles.pathLine}
                  />
                );
              })}
          </svg>
          {letters.map((item) => {
            const isUsed = usedLetterIds.has(item.id);
            return (
              <div
                key={item.id}
                ref={(el) => {
                  letterRefs.current[item.id] = el;
                }}
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
