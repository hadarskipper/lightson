import React from 'react';
import './Tiles.css';

// Utility function to determine initial transparency pattern
export const getInitialTileTransparency = (_rowIndex: number, _colIndex: number): boolean => {
  return true;  // All tiles start transparent
};

interface TilesProps {
  colIndex: number;
  rowIndex: number;
  totalCols?: number;
  totalRows?: number;
  topLeft: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  isTransparent?: boolean;
  isCorrect?: boolean;
  showSolution?: boolean;
  onTileClick?: () => void;
}

export const Tiles: React.FC<TilesProps> = ({
  colIndex,
  rowIndex,
  totalCols = 4,
  totalRows = 4,
  topLeft,
  width,
  height,
  isTransparent,
  isCorrect,
  showSolution,
  onTileClick
}) => {

  // Calculate the size of each tile
  const tileWidth = width / totalCols;
  const tileHeight = height / totalRows;

  // Calculate the position of the specific tile
  const tileX = topLeft.x + (colIndex * tileWidth);
  const tileY = topLeft.y + (rowIndex * tileHeight);

  return (
    <div
      className="tile"
      onClick={onTileClick}
      style={{
        position: 'absolute',
        left: `${tileX}px`,
        top: `${tileY}px`,
        width: `${tileWidth}px`,
        height: `${tileHeight}px`,
        backgroundColor: isTransparent ? 'transparent' : 'rgba(233, 246, 254, 1)',
        border: isTransparent ? 'none' : '1px solid #b3b3b3ff',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'background-color 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {showSolution && !isCorrect && (
        <div
          style={{
            width: `${Math.min(tileWidth, tileHeight) * 0.3}px`,
            height: `${Math.min(tileWidth, tileHeight) * 0.3}px`,
            backgroundColor: 'red',
            borderRadius: '50%',
            pointerEvents: 'none' // Prevent the circle from interfering with tile clicks
          }}
        />
      )}
    </div>
  );
};