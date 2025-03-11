// src/components/scene/CustomGrid.jsx
import React from 'react';
import { Grid } from '@react-three/drei';

const CustomGrid = ({ visible, size, divisions, color1, color2, infiniteGrid }) => {
  if (!visible) return null;
  
  if (infiniteGrid) {
    // Use drei Grid for infinite grid
    return (
      <Grid 
        cellSize={size / divisions}
        cellThickness={0.5}
        cellColor={color1}
        sectionSize={size / 10}
        sectionThickness={1.5}
        sectionColor={color2}
        fadeDistance={200}
        fadeStrength={1}
        infiniteGrid={true}
        position={[0, -0.001, 0]}
      />
    );
  }
  
  // Use standard Three.js gridHelper for finite grid
  return (
    <gridHelper 
      args={[size, divisions, color2, color1]} 
      position={[0, 0, 0]}
    />
  );
};

export default CustomGrid;