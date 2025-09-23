import React from 'react';
import './Tiles.css';

// Utility function to determine initial transparency pattern
export const getInitialTileTransparency = (rowIndex: number, colIndex: number): boolean => {
  return (rowIndex + colIndex) % 3 === 0;
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
  initiallyTransparent?: boolean;
  onTransparencyChange?: (isTransparent: boolean) => void;
}

export const Tiles: React.FC<TilesProps> = ({
  colIndex,
  rowIndex,
  totalCols = 4,
  totalRows = 4,
  topLeft,
  width,
  height,
  initiallyTransparent,
  onTransparencyChange
}) => {
  const defaultTransparency = getInitialTileTransparency(rowIndex, colIndex);
  const [isTransparent, setIsTransparent] = React.useState(
    initiallyTransparent === undefined ? defaultTransparency : initiallyTransparent
  );

  // Update transparency when changed externally
  React.useEffect(() => {
    if (initiallyTransparent !== undefined) {
      setIsTransparent(initiallyTransparent);
    }
  }, [initiallyTransparent]);

  // Calculate the size of each tile
  const tileWidth = width / totalCols;
  const tileHeight = height / totalRows;

  // Calculate the position of the specific tile
  const tileX = topLeft.x + (colIndex * tileWidth);
  const tileY = topLeft.y + (rowIndex * tileHeight);

  const toggleTransparency = () => {
    const newTransparency = !isTransparent;
    setIsTransparent(newTransparency);
    onTransparencyChange?.(newTransparency);
  };

  return (
    <div
      className="tile"
      onClick={toggleTransparency}
      style={{
        position: 'absolute',
        left: `${tileX}px`,
        top: `${tileY}px`,
        width: `${tileWidth}px`,
        height: `${tileHeight}px`,
        backgroundColor: isTransparent ? 'transparent' : 'rgba(250, 246, 240, 1)',
        boxSizing: 'border-box',
        pointerEvents: 'auto', // Enable clicks
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'background-color 0.3s ease-in-out'
      }}
    />
  );
};