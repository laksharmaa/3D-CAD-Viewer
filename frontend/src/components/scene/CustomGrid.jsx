// src/components/scene/CustomGrid.jsx
import React from 'react';
import { Grid } from '@react-three/drei';

const CustomGrid = ({ visible, size, divisions, color1, color2, infiniteGrid }) => {
  if (!visible) return null;

  // Use larger size for infinite grid to make it appear expanded
  const gridSize = infiniteGrid ? size * 3 : size;
  
  if (infiniteGrid) {
    return (
      <Grid 
        cellSize={gridSize / divisions}
        cellThickness={0.5}
        cellColor={color1}
        sectionSize={gridSize / 10}
        sectionThickness={1.5}
        sectionColor={color2}
        fadeDistance={200}
        fadeStrength={1}
        infiniteGrid={true}
        position={[0, -0.005, 0]}
      />
    );
  }

  // For standard grid, increase the number of primary grid lines by reducing section size
  return (
    <gridHelper 
      args={[gridSize, divisions, color2, color1]}
      position={[0, 0, 0]}
    />
  );
};

export default CustomGrid;