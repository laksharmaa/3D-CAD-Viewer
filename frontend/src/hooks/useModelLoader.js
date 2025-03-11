// src/hooks/useModelLoader.js
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { fixNaNInGeometry, centerModel, disposeModel } from '../utils/modelUtils';

export function useModelLoader(url, fileFormat) {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let loader;
    let isMounted = true;
    
    if (!url || !fileFormat) return;
    
    if (fileFormat === 'stl') {
      loader = new STLLoader();
    } else if (fileFormat === 'obj') {
      loader = new OBJLoader();
    } else {
      setError(`Unsupported file format: ${fileFormat}`);
      return;
    }
    
    // Clean up any previous model
    if (model) {
      disposeModel(model);
    }
    
    setIsLoading(true);
    setError(null);
    
    loader.load(
      url,
      (loadedModel) => {
        if (!isMounted) return;
        
        try {
          if (fileFormat === 'stl') {
            // STL loader returns a BufferGeometry
            const geometry = loadedModel;
            
            // Fix potential NaN values
            const hasNaNs = fixNaNInGeometry(geometry);
            if (hasNaNs) {
              console.warn('Fixed NaN values in model geometry');
            }
            
            // Create material and mesh
            const material = new THREE.MeshStandardMaterial({
              color: 0x7777ff,
              metalness: 0.1,
              roughness: 0.5,
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Compute normals if they don't exist
            if (!geometry.attributes.normal) {
              geometry.computeVertexNormals();
            }
            
            // Ensure bounding sphere is computed
            try {
              geometry.computeBoundingSphere();
            } catch (e) {
              console.error('Error computing bounding sphere:', e);
            }
            
            // Center the model
            centerModel(mesh);
            
            setModel(mesh);
          } else {
            // OBJ loader returns a Group
            centerModel(loadedModel);
            setModel(loadedModel);
          }
        } catch (err) {
          console.error('Error processing model:', err);
          setError('Failed to process the model');
        } finally {
          setIsLoading(false);
          setProgress(100);
        }
      },
      (xhr) => {
        if (!isMounted) return;
        if (xhr.lengthComputable) {
          const progressValue = Math.round((xhr.loaded / xhr.total) * 100);
          setProgress(progressValue);
        }
      },
      (error) => {
        if (!isMounted) return;
        console.error('Error loading model:', error);
        setError('Failed to load the model');
        setIsLoading(false);
      }
    );
    
    return () => {
      isMounted = false;
      if (model) {
        disposeModel(model);
      }
    };
  }, [url, fileFormat, model]);
  
  return { model, isLoading, error, progress };
}