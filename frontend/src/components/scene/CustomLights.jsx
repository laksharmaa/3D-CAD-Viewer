// src/components/scene/CustomLights.jsx
import React from 'react';

const CustomLights = ({ 
  ambientIntensity, 
  ambientColor,
  spotlightIntensity,
  spotlightColor,
  spotlightPosition,
  showContactShadow
}) => {
  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <spotLight 
        intensity={spotlightIntensity} 
        color={spotlightColor} 
        position={spotlightPosition}
        castShadow={showContactShadow}
      />
    </>
  );
};

export default CustomLights;