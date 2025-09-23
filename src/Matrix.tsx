import React from 'react';
import './Matrix.css';

interface MatrixProps {
  rows?: number;
  cols?: number;
}

const Matrix: React.FC<MatrixProps> = ({ rows = 3, cols = 3 }) => {
  return (
    <div className="matrix">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div className="matrix-row" key={rowIdx}>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div className="matrix-cell" key={colIdx}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Matrix;
