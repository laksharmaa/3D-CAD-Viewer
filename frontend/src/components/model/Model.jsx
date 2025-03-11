// src/components/model/Model.jsx
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// Material with texture support
const EnhancedModel = ({ model, materialProps, texture }) => {
  const meshRef = useRef();
  
  // Apply material properties to the model
  useEffect(() => {
    if (meshRef.current) {
      if (model instanceof THREE.Mesh) {
        meshRef.current.material = new THREE.MeshStandardMaterial(materialProps);
        if (texture) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
        }
      } else if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial(materialProps);
            if (texture) {
              child.material.map = texture;
              child.material.needsUpdate = true;
            }
          }
        });
      }
    }
  }, [model, materialProps, texture]);

  if (!model) return null;
  
  if (model instanceof THREE.Mesh) {
    return (
      <primitive 
        ref={meshRef}
        object={model} 
        dispose={null}
      />
    );
  }
  
  return <primitive object={model} dispose={null} />;
};

// Helper function to sanitize geometry by fixing NaN values
const sanitizeGeometry = (geometry) => {
  if (!geometry?.attributes?.position) return false;
  
  const positions = geometry.attributes.position.array;
  let hasFixedValues = false;
  
  // Replace NaN values with zeros
  for (let i = 0; i < positions.length; i++) {
    if (isNaN(positions[i]) || !isFinite(positions[i])) {
      positions[i] = 0;
      hasFixedValues = true;
    }
  }
  
  if (hasFixedValues) {
    geometry.attributes.position.needsUpdate = true;
    console.warn('Fixed NaN/Infinite values in geometry positions');
  }
  
  return hasFixedValues;
};

// Helper function to check if a geometry is valid
const isGeometryValid = (geometry) => {
  if (!geometry?.attributes?.position) return false;
  
  const positions = geometry.attributes.position.array;
  // Check if we have enough vertices for at least one triangle (9 values: 3 vertices × 3 coordinates)
  if (positions.length < 9) return false;
  
  // Check if all values are valid numbers
  let allValid = true;
  for (let i = 0; i < positions.length; i++) {
    if (isNaN(positions[i]) || !isFinite(positions[i])) {
      allValid = false;
      break;
    }
  }
  
  return allValid;
};

// Model loader component
const Model = ({ url, fileFormat, materialProps, texturePath }) => {
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const [texture, setTexture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load texture if specified
  useEffect(() => {
    if (texturePath) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        texturePath,
        (loadedTexture) => {
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.RepeatWrapping;
          loadedTexture.repeat.set(1, 1);
          setTexture(loadedTexture);
        },
        undefined,
        (err) => console.error('Error loading texture:', err)
      );
    } else {
      setTexture(null);
    }
  }, [texturePath]);
  
  // Clean up when component unmounts or model changes
  useEffect(() => {
    return () => {
      // Clean up previous model resources
      if (model) {
        if (model instanceof THREE.Mesh && model.geometry) {
          model.geometry.dispose();
        }
        if (model instanceof THREE.Group) {
          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              child.geometry.dispose();
            }
          });
        }
      }
    };
  }, [model]);
  
  // Load model
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
            
            // Fix NaN values in geometry
            sanitizeGeometry(geometry);
            
            // Check if the geometry is valid after fixing NaN values
            if (!isGeometryValid(geometry)) {
              throw new Error("STL model doesn't contain valid geometry data");
            }
            
            try {
              // Compute vertex normals if they don't exist
              if (!geometry.attributes.normal) {
                geometry.computeVertexNormals();
              }
              
              // Safely compute the bounding box
              try {
                geometry.computeBoundingBox();
              } catch (boundingBoxError) {
                console.error('Error computing bounding box:', boundingBoxError);
                // Create a default bounding box
                geometry.boundingBox = new THREE.Box3(
                  new THREE.Vector3(-1, -1, -1),
                  new THREE.Vector3(1, 1, 1)
                );
              }
              
              // Safely compute the bounding sphere
              try {
                geometry.computeBoundingSphere();
              } catch (boundingSphereError) {
                console.error('Error computing bounding sphere:', boundingSphereError);
                // Create a default bounding sphere
                geometry.boundingSphere = new THREE.Sphere(
                  new THREE.Vector3(0, 0, 0), 
                  1.732 // Approximate radius of a sphere containing a 1×1×1 box
                );
              }
              
              // Create material and mesh
              const material = new THREE.MeshStandardMaterial({
                color: 0x7777ff,
                metalness: 0.1,
                roughness: 0.5,
              });
              
              // Create the mesh with our sanitized geometry
              const mesh = new THREE.Mesh(geometry, material);
              
              // Center the model
              if (geometry.boundingBox) {
                const center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                // Use the center to offset the mesh position to center it
                mesh.position.set(-center.x, -center.y, -center.z);
              }
              
              setModel(mesh);
            } catch (geometryError) {
              console.error('Error processing STL geometry:', geometryError);
              
              // Fallback: create a simple box as placeholder
              const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
              const material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                wireframe: true
              });
              const fallbackMesh = new THREE.Mesh(boxGeometry, material);
              setModel(fallbackMesh);
              setError('Error processing model geometry - showing placeholder');
            }
          } else {
            // OBJ loader returns a Group
            try {
              // Check if OBJ contains any valid meshes
              let hasValidGeometry = false;
              let geometryCount = 0;
              
              // First pass: count and validate geometries
              loadedModel.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  geometryCount++;
                  if (child.geometry && isGeometryValid(child.geometry)) {
                    hasValidGeometry = true;
                    // Fix any NaN values
                    sanitizeGeometry(child.geometry);
                  } else if (child.geometry) {
                    // Try to fix the geometry
                    sanitizeGeometry(child.geometry);
                    // Check again after fixing
                    if (isGeometryValid(child.geometry)) {
                      hasValidGeometry = true;
                    }
                  }
                }
              });
              
              console.log(`OBJ contains ${geometryCount} geometries, valid: ${hasValidGeometry}`);
              
              // If no valid geometries were found, try to create a basic one
              if (!hasValidGeometry) {
                if (geometryCount === 0) {
                  throw new Error("OBJ model doesn't contain any geometries");
                } else {
                  throw new Error("OBJ model doesn't contain any valid geometries");
                }
              }
              
              // Process meshes and compute normals/bounds
              loadedModel.traverse((child) => {
                if (child instanceof THREE.Mesh && child.geometry) {
                  // Ensure normals are computed
                  if (!child.geometry.attributes.normal) {
                    child.geometry.computeVertexNormals();
                  }
                  
                  // Safely compute bounding information
                  try {
                    child.geometry.computeBoundingBox();
                    child.geometry.computeBoundingSphere();
                  } catch (e) {
                    console.error('Error computing bounds for child geometry:', e);
                    // Create default bounding volumes
                    child.geometry.boundingBox = new THREE.Box3(
                      new THREE.Vector3(-1, -1, -1),
                      new THREE.Vector3(1, 1, 1)
                    );
                    child.geometry.boundingSphere = new THREE.Sphere(
                      new THREE.Vector3(0, 0, 0), 
                      1.732
                    );
                  }
                }
              });
              
              // Try to center the model safely
              try {
                const box = new THREE.Box3().setFromObject(loadedModel);
                if (!box.isEmpty()) {
                  const center = new THREE.Vector3();
                  box.getCenter(center);
                  if (isFinite(center.x) && isFinite(center.y) && isFinite(center.z)) {
                    loadedModel.position.set(-center.x, -center.y, -center.z);
                  } else {
                    console.warn('Invalid center point, using (0,0,0)');
                    loadedModel.position.set(0, 0, 0);
                  }
                } else {
                  console.warn('Empty bounding box, using position (0,0,0)');
                  loadedModel.position.set(0, 0, 0);
                }
              } catch (centerError) {
                console.error('Error centering model:', centerError);
                loadedModel.position.set(0, 0, 0);
              }
              
              setModel(loadedModel);
            } catch (objError) {
              console.error('Error processing OBJ model:', objError);
              
              // Create a fallback model
              const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
              const material = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                wireframe: true
              });
              const fallbackMesh = new THREE.Mesh(boxGeometry, material);
              setModel(fallbackMesh);
              setError(`OBJ model error: ${objError.message}`);
            }
          }
        } catch (err) {
          console.error('Error processing model:', err);
          
          // Create a fallback model
          const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            wireframe: true
          });
          const fallbackMesh = new THREE.Mesh(boxGeometry, material);
          setModel(fallbackMesh);
          setError(`Model processing error: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      },
      // Progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      // Error callback
      (loadError) => {
        if (!isMounted) return;
        console.error('Error loading model:', loadError);
        
        // Create a fallback model for loading errors
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
          color: 0xff6600,  // Different color for load errors
          wireframe: true
        });
        const fallbackMesh = new THREE.Mesh(boxGeometry, material);
        setModel(fallbackMesh);
        setError(`Failed to load the model: ${loadError.message || 'Unknown error'}`);
        setIsLoading(false);
      }
    );
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [url, fileFormat]);
  
  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" wireframe={true} />
      </mesh>
    );
  }
  
  if (isLoading) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4f6df5" wireframe={true} />
      </mesh>
    );
  }
  
  return <EnhancedModel model={model} materialProps={materialProps} texture={texture} />;
};

export default Model;