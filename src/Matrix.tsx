import React, { useState } from 'react';
import './Matrix.css';
import Overlay, { BUTTON_HIGHT } from './Overlay';
import { Tiles } from './Tiles';

interface MatrixProps {
  rows?: number;
  cols?: number;
  onResetButtonClick?: () => void;
}

const TOTAL_GRID_ROWS = 4;
const TOTAL_GRID_COLS = 4;
const SHUFFLE_ITERATIONS = 6;


const imageFiles = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
  '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
];

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  console.log(Date() + " - button start render");

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: BUTTON_HIGHT,
        width: '100%',
      }}
    >
      {label}
    </button>
  );
};


const Matrix: React.FC<MatrixProps> = ({ rows = 3, cols = 3 }) => {
  const [widths, setWidths] = useState<{ [key: number]: number }>({});
  const [overlayStartingPosition, setOverlayStartingPosition] = useState<{ top: number; left: number; width: number; height: number; imageSrc: string; } | null>(null);
  const [tilesState, setTilesState] = useState<{ [key: string]: boolean }>({});

  // Simulate five random tile clicks after the initial state is set
  React.useEffect(() => {
    if (overlayStartingPosition) {
      // Add a small delay to ensure the tiles are rendered
      setTimeout(() => {
        // Perform SHUFFLE_ITERATIONS random toggles
        for (let i = 0; i < SHUFFLE_ITERATIONS; i++) {
          setTimeout(() => {
            const randomRow = Math.floor(Math.random() * TOTAL_GRID_ROWS);
            const randomCol = Math.floor(Math.random() * TOTAL_GRID_COLS);
            handleTileToggle(randomRow, randomCol);
          }, i * 250); // 20ms buffer between each toggle
        }
      }, 600); // Initial delay to ensure overlay is visible
    }
  }, [overlayStartingPosition]);

  const handleTileToggle = (rowIndex: number, colIndex: number) => {
    const neighbors = [
      [rowIndex - 1, colIndex],     // top
      [rowIndex + 1, colIndex],     // bottom
      [rowIndex, colIndex - 1],     // left
      [rowIndex, colIndex + 1],     // right

      // [rowIndex - 1, colIndex - 1], // top-left
      // [rowIndex - 1, colIndex + 1], // top-right
      // [rowIndex + 1, colIndex - 1], // bottom-left
      // [rowIndex + 1, colIndex + 1]  // bottom-right
    ].filter(([row, col]) => row >= 0 && row < TOTAL_GRID_ROWS && col >= 0 && col < TOTAL_GRID_COLS); // Only valid tiles

    setTilesState(prevState => {
      const newState = { ...prevState };
      // Toggle the clicked tile
      const clickedKey = `${rowIndex}-${colIndex}`;
      newState[clickedKey] = !prevState[clickedKey];
      
      // Toggle neighbors
      neighbors.forEach(([row, col]) => {
        const neighborKey = `${row}-${col}`;
        newState[neighborKey] = !prevState[neighborKey];
      });
      
      return newState;
    });
  };

  const handleImgLoad = (imgIdx: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    const width = Math.round(80 * ratio);
    setWidths(w => ({ ...w, [imgIdx]: width }));
  };

  const handleImgClick = (_imgIdx: number, e: React.MouseEvent<HTMLImageElement>) => {
    if (!overlayStartingPosition) {  // Only set position if no overlay is showing
      const img = e.currentTarget;
      const rect = img.getBoundingClientRect();
      
      // Initialize tiles state based on the getInitialTileTransparency pattern
      const initialTilesState: { [key: string]: boolean } = {};
      for (let row = 0; row < TOTAL_GRID_ROWS; row++) {
        for (let col = 0; col < TOTAL_GRID_COLS; col++) {
          const tileKey = `${row}-${col}`;
          initialTilesState[tileKey] = true; // All tiles start transparent
        }
      }
      setTilesState(initialTilesState);

      setOverlayStartingPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        imageSrc: img.src
      });
    }
  };

  const handleOverlayClose = () => {
    setOverlayStartingPosition(null);
    setTilesState({}); // Reset tiles state when overlay closes
  };

  const renderTilesGrid = () => {
    if (!overlayStartingPosition) return null;
    
    // Calculate final position (center of screen)
    const Width = window.innerWidth;
    const Height = window.innerHeight - BUTTON_HIGHT;
    const centerX = 0;
    const centerY = 0;
    
    return Array.from({ length: TOTAL_GRID_ROWS }).map((_, rowIdx) => 
      Array.from({ length: TOTAL_GRID_COLS }).map((_, colIdx) => {
        const tileKey = `${rowIdx}-${colIdx}`;
        return (
          <Tiles
            key={tileKey}
            rowIndex={rowIdx}
            colIndex={colIdx}
            totalRows={TOTAL_GRID_ROWS}
            totalCols={TOTAL_GRID_COLS}
            topLeft={{ x: centerX, y: centerY }}
            width={Width}
            height={Height}
            initiallyTransparent={tilesState[tileKey]}
            onTransparencyChange={() => handleTileToggle(rowIdx, colIdx)}
          />
        );
      })
    );
  };

  return (
    <><div className="matrix">
      <Overlay startingPosition={overlayStartingPosition} onClose={handleOverlayClose} />
      {overlayStartingPosition && renderTilesGrid()}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div className="matrix-row" key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => {
            const imgIdx = rowIdx * cols + colIdx;
            const imgSrc = imgIdx < imageFiles.length
              ? new URL(`./assets/${imageFiles[imgIdx]}`, import.meta.url).href
              : null;
            const cellWidth = widths[imgIdx] || 80;
            return (
              <div className="matrix-cell" key={colIdx} style={{ width: cellWidth, flexShrink: 0 }}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={`img-${imgIdx + 1}`}
                    style={{ height: '80px', objectFit: 'contain', cursor: 'pointer' }}
                    onLoad={e => handleImgLoad(imgIdx, e)}
                    onClick={e => handleImgClick(imgIdx, e)} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <Button label="Go to Home" onClick={() => handleOverlayClose()} /></>

  );
};


export { Matrix };