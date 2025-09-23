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

const BUTTON_HIGHT = 40;

const Overlay: React.FC<OverlayProps> = ({ startingPosition, onClose }) => {
  const [style, setStyle] = useState({});
  
  useEffect(() => {
    console.log("Overlay useEffect triggered with startingPosition - top:", startingPosition?.top + ", left: " + startingPosition?.left);
    if (startingPosition) {
      console.log("startingPosition dimensions - width:", startingPosition.width + ", height: " + startingPosition.height);

      // Initial position exactly matching the cell
      setStyle({
        position: 'fixed',
        top: startingPosition.top,
        left: startingPosition.left,
        width: startingPosition.width,
        height: startingPosition.height,
        zIndex: 1000,
        pointerEvents: 'none',  // Prevent interaction during initial placement
        opacity: 0.5,  // Start visible to see the initial position

      });

      // Add a small delay to ensure the initial position is rendered
      setTimeout(() => {
        // Force a reflow to ensure initial styles are applied
        document.body.offsetHeight;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        console.log("Window dimensions - width:", windowWidth + ", height: " + windowHeight);
        
        const padding = 0; // Leave some padding around edges
        const maxWidth = windowWidth - padding * 2;
        const maxHeight = windowHeight - BUTTON_HIGHT - padding * 2;
        
        // Get the original image aspect ratio
        const originalAspectRatio = startingPosition.width / startingPosition.height;
        
        // Calculate the best fit dimensions
        let finalWidth = maxWidth;
        let finalHeight = maxWidth / originalAspectRatio;
        
        // If height exceeds screen, scale down based on height instead
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = maxHeight * originalAspectRatio;
        }

        // Calculate center position
        const centerX = (windowWidth - finalWidth) / 2;
        const centerY = (windowHeight - BUTTON_HIGHT - finalHeight) / 2;
        
        setStyle(prev => ({
          ...prev,
          top: centerY,
          left: centerX,
          width: finalWidth,
          height: finalHeight,
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
export { BUTTON_HIGHT };