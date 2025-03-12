// src/components/scene/CustomGrid.jsx
import React from 'react';
import { Grid } from '@react-three/drei';

const CustomGrid = ({ visible, size, divisions, color1, color2, infiniteGrid }) => {
  if (!visible) return null;
  
  // Position grid slightly below the model to prevent z-fighting
  const gridPosition = [0, -0.05, 0];
  
  if (infiniteGrid) {
    // Enhanced infinite grid with extended view distance
    return (
      <Grid 
        cellSize={Math.max(1, size / divisions)}
        cellThickness={0.3}  // Thinner primary lines
        cellColor={color1}
        sectionSize={Math.max(10, size / Math.max(3, Math.min(10, Math.floor(divisions / 4))))}
        sectionThickness={1.0}
        sectionColor={color2}
        fadeDistance={2000}  // Extended fade distance
        fadeStrength={0.3}   // Lower fade strength to see further
        infiniteGrid={true}
        position={gridPosition}
      />
    );
  }
  
  // For standard grid - create two overlapping grids for primary and secondary lines
  const effectiveSize = Math.min(size, 10000); // Cap rendered size for performance
  
  return (
    <group position={gridPosition}>
      {/* Primary grid (thicker lines, fewer divisions) */}
      <gridHelper 
        args={[effectiveSize, Math.max(4, Math.floor(divisions / 5)), color2, color2]} 
        position={[0, 0.001, 0]}
      />
      
      {/* Secondary grid (thinner lines, more divisions) */}
      <gridHelper 
        args={[effectiveSize, divisions, color1, color1]} 
        position={[0, 0, 0]}
      />
    </group>
  );
};

export default CustomGrid;