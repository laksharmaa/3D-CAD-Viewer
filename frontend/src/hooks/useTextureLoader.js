// src/hooks/useTextureLoader.js
import { useState, useEffect } from 'react';
import * as THREE from 'three';

export function useTextureLoader(texturePath) {
  const [texture, setTexture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!texturePath) {
      setTexture(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      texturePath,
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.repeat.set(1, 1);
        setTexture(loadedTexture);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading texture:', err);
        setError('Failed to load texture');
        setIsLoading(false);
      }
    );
    
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texturePath, texture]);
  
  return { texture, isLoading, error };
}