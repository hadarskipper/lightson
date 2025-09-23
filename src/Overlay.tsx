import React, { useEffect, useState } from 'react';

interface OverlayProps {
  startingPosition: {
    top: number;
    left: number;
    width: number;
    height: number;
    imageSrc: string;
  } | null;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ startingPosition, onClose }) => {
  const [style, setStyle] = useState({});
  
  useEffect(() => {
    console.log("Overlay useEffect triggered with startingPosition - top:", startingPosition?.top + ", left: " + startingPosition?.left);
    if (startingPosition) {
      // Initial position exactly matching the cell
      setStyle({
        position: 'fixed',
        top: startingPosition.top,
        left: startingPosition.left,
        width: startingPosition.width,
        height: startingPosition.height,
        zIndex: 1000,
        // transform: 'scale(1)',  // Explicit initial scale
        pointerEvents: 'none',  // Prevent interaction during initial placement
        opacity: 0.5,  // Start visible to see the initial position
        // transition: 'none'  // Ensure no transition for initial position

      });

      // Add a small delay to ensure the initial position is rendered
      setTimeout(() => {
        // Force a reflow to ensure initial styles are applied
        document.body.offsetHeight;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate center position
        const centerX = (windowWidth - startingPosition.width) / 2;
        const centerY = (windowHeight - startingPosition.height) / 2;
        
        setStyle(prev => ({
          ...prev,
          top: centerY,
          left: centerX,
          transform: 'scale(10)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 1,
          pointerEvents: 'auto', // Re-enable interaction after animation starts
          cursor: 'pointer',
        }));
      }, 50); // Small delay to ensure initial render
    }
  }, [startingPosition]);

  if (!startingPosition) return null;

  return (
    <div style={style} onClick={onClose}>
      <img
        src={startingPosition.imageSrc}
        alt="Zoomed"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 'inherit'
        }}
      />
    </div>
  );
};

export default Overlay;