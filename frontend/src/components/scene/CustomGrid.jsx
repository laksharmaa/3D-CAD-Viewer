// src/components/scene/CustomGrid.jsx
import React from 'react';
import { Grid } from '@react-three/drei';

const CustomGrid = ({ visible, size, divisions, color1, color2, infiniteGrid }) => {
  if (!visible) return null;
  
  // Position grid slightly below the model to prevent z-fighting
  const gridPosition = [0, -0.05, 0];
  
  if (infiniteGrid) {
    // Use drei Grid for infinite grid with improved settings
    const cellSize = size / divisions;
    const sectionSize = size / Math.min(10, Math.max(3, Math.floor(divisions / 5)));
    
    return (
      <Grid 
        cellSize={cellSize}
        cellThickness={0.3} // Thinner primary lines
        cellColor={color1}
        sectionSize={sectionSize}
        sectionThickness={1.0}
        sectionColor={color2}
        fadeDistance={500}
        fadeStrength={0.8}
        infiniteGrid={true}
        position={gridPosition}
      />
    );
  }
  
  // Use standard Three.js gridHelper for finite grid
  // Create a more detailed grid with secondary lines
  const effectiveSize = Math.min(size, 5000); // Cap rendered size for performance
  
  // Calculate appropriate number of divisions for main grid lines
  const mainDivisions = Math.min(100, Math.max(4, Math.floor(divisions / 4)));
  
  // Calculate total number of lines including secondary ones
  const totalDivisions = divisions;
  
  return (
    <group position={gridPosition}>
      {/* Primary grid (thicker lines, fewer divisions) */}
      <gridHelper 
        args={[effectiveSize, mainDivisions, color2, color2]} 
        position={[0, 0.001, 0]}
      />
      
      {/* Secondary grid (thinner lines, more divisions) */}
      <gridHelper 
        args={[effectiveSize, totalDivisions, color1, color1]} 
        position={[0, 0, 0]}
      />
    </group>
  );
};

export default CustomGrid;