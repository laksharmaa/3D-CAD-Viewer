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
      {/* Ambient light doesn't cast shadows */}
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      
      {/* Directional light for sharp shadows */}
      {showContactShadow && (
        <directionalLight
          intensity={spotlightIntensity * 0.7}
          color={spotlightColor}
          position={[5, 10, 7.5]}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        >
          <orthographicCamera 
            attach="shadow-camera"
            args={[-10, 10, 10, -10, 0.1, 50]}
          />
        </directionalLight>
      )}
      
      {/* Spotlight for focused lighting */}
      <spotLight 
        intensity={spotlightIntensity} 
        color={spotlightColor} 
        position={spotlightPosition}
        castShadow={showContactShadow}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        angle={Math.PI / 4}
        penumbra={0.3}
        distance={50}
      />
      
      {/* Simple plane to receive shadows */}
      {showContactShadow && (
        <mesh 
          position={[0, -0.02, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial transparent opacity={0.2} />
        </mesh>
      )}
    </>
  );
};

export default CustomLights;