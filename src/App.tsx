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
  const [lineColor, setLineColor] = useState('#c9a3ff');
  const [buttonColor, setButtonColor] = useState('#81c784');

  useEffect(() => {
    // Read CSS variables for colors
    const root = document.documentElement;
    const lineColorValue = getComputedStyle(root)
      .getPropertyValue('--color-line-stroke')
      .trim();
    const buttonColorValue = getComputedStyle(root)
      .getPropertyValue('--color-button-bg')
      .trim();
    if (lineColorValue) {
      setLineColor(lineColorValue);
    }
    if (buttonColorValue) {
      setButtonColor(buttonColorValue);
    }
  }, []);

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
      angle: index === 0 ? 270 : (index * angleStep - 90 + 360) % 360, // First letter at top (12:00 = 270°)
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
      angle: index === 0 ? 270 : (index * angleStep - 90 + 360) % 360, // First letter at top (12:00 = 270°)
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

  const getCircleEdgePoint = (
    center: { x: number; y: number },
    target: { x: number; y: number },
    circleRadius: number = 8
  ) => {
    // Calculate direction from center to target
    const dx = target.x - center.x;
    const dy = target.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return center;

    // Move circleRadius along the direction vector
    const scale = circleRadius / distance;
    return {
      x: center.x + dx * scale,
      y: center.y + dy * scale,
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            // Only allow letters a-z, convert to lowercase
            const filtered = e.target.value
              .toLowerCase()
              .replace(/[^a-z]/g, '');
            setInput(filtered);
          }}
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

                const startCenter = getLineEndpointPosition(startLetterPos);
                const endCenter = getLineEndpointPosition(endLetterPos);

                // Calculate edge points where line connects to circles
                const startEdge = getCircleEdgePoint(startCenter, endCenter, 8);
                const endEdge = getCircleEdgePoint(endCenter, startCenter, 8);

                return (
                  <line
                    key={`${currentId}-${nextId}`}
                    x1={startEdge.x}
                    y1={startEdge.y}
                    x2={endEdge.x}
                    y2={endEdge.y}
                    stroke={lineColor}
                    strokeWidth="4"
                    className={styles.pathLine}
                  />
                );
              })}
            {clickedOrder.map((id, index) => {
              const letterPos = letterPositions[id];
              if (!letterPos) return null;
              const center = getLineEndpointPosition(letterPos);
              const isFirst = index === 0;
              const isLast = index === clickedOrder.length - 1;

              const allLettersUsed = clickedOrder.length === letters.length;
              const fillColor = isFirst
                ? buttonColor
                : isLast && allLettersUsed
                ? '#000000'
                : 'none';

              return (
                <circle
                  key={`marker-${id}`}
                  cx={center.x}
                  cy={center.y}
                  r="8"
                  fill={fillColor}
                  stroke={lineColor}
                  strokeWidth="4"
                  className={
                    isFirst
                      ? styles.startMarker
                      : isLast
                      ? styles.endMarker
                      : styles.pathMarker
                  }
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
