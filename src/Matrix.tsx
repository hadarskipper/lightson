import React, { useState } from 'react';
import './Matrix.css';
import Overlay from './Overlay';

interface MatrixProps {
  rows?: number;
  cols?: number;
}

const imageFiles = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
  '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
];

export const Matrix: React.FC<MatrixProps> = ({ rows = 3, cols = 3 }) => {
  const [widths, setWidths] = useState<{ [key: number]: number }>({});
  const [overlayStartingPosition, setOverlayStartingPosition] = useState<{ top: number; left: number; width: number; height: number; imageSrc: string; } | null>(null);

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
  };

  return (
    <div className="matrix">
      <Overlay startingPosition={overlayStartingPosition} onClose={handleOverlayClose} />
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div className="matrix-row" key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => {
            const imgIdx = rowIdx * cols + colIdx;
            const imgSrc = imgIdx < imageFiles.length
              ? new URL(`./assets/${imageFiles[imgIdx]}`, import.meta.url).href
              : null;
            const cellWidth = widths[imgIdx] || 80;
            return (
              <div className="matrix-cell" key={colIdx} style={{ width: cellWidth, flexShrink: 0}}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={`img-${imgIdx + 1}`}
                    style={{ height: '80px', objectFit: 'contain', cursor: 'pointer' }}
                    onLoad={e => handleImgLoad(imgIdx, e)}
                    onClick={e => handleImgClick(imgIdx, e)}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};


