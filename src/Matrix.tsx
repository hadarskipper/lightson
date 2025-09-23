import React, { useState } from 'react';
import './Matrix.css';

interface MatrixProps {
  rows?: number;
  cols?: number;
}


const imageFiles = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
  '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
];

const async_sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function synchronous_sleep(ms: number): void {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy-wait loop
  }
}


const Matrix: React.FC<MatrixProps> = ({ rows = 3, cols = 3 }) => {
  const [widths, setWidths] = useState<{ [key: number]: number }>({});
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);

  const handleImgLoad = (imgIdx: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("inside handleImgLoad: " + imgIdx+ ", e: " + e.currentTarget);

    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    const width = Math.round(80 * ratio);
    console.log("image loaded: " + imgIdx+ ", new width: " + width + ", natural width: " + img.naturalWidth);
    console.log("current widths state: ", widths.toString());
    // synchronous_sleep (1000);
    setWidths(w => ({ ...w, [imgIdx]: width }));
  };

  const handleImgClick = (imgIdx: number) => {
    setZoomedIdx(zoomedIdx === imgIdx ? null : imgIdx);
  };

  if (zoomedIdx !== null) {
    const imgSrc = new URL(`./assets/${imageFiles[zoomedIdx]}`, import.meta.url).href;
    return (
      <div className="matrix zoomed" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <img
          src={imgSrc}
          alt={`img-${zoomedIdx + 1}`}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'zoom-out' }}
          onClick={() => setZoomedIdx(null)}
        />
      </div>
    );
  }

  return (
    <div className="matrix">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div className="matrix-row" key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => {
            const imgIdx = rowIdx * cols + colIdx;
            const imgSrc = imgIdx < imageFiles.length
              ? new URL(`./assets/${imageFiles[imgIdx]}`, import.meta.url).href
              : null;
            const cellWidth = widths[imgIdx] || 80;
            console.log(`Rendering cell [${rowIdx}, ${colIdx}] with imgIdx ${imgIdx}, cellWidth: ${cellWidth}`);
            // synchronous_sleep(1000)
            return (
              <div className="matrix-cell" key={colIdx} style={{ width: cellWidth, flexShrink: 0}}>
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={`img-${imgIdx + 1}`}
                    style={{ height: '80px', objectFit: 'contain', cursor: 'zoom-in' }}
                    onLoad={e => handleImgLoad(imgIdx, e)}
                    onClick={() => handleImgClick(imgIdx)}
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

export { Matrix };
