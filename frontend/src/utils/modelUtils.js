// src/utils/modelUtils.js
import * as THREE from 'three';

/**
 * Check and fix NaN values in a geometry's position attribute
 */
export const fixNaNInGeometry = (geometry) => {
  if (!geometry.attributes.position) return false;
  
  const positions = geometry.attributes.position.array;
  let hasNaN = false;
  
  for (let i = 0; i < positions.length; i++) {
    if (isNaN(positions[i])) {
      positions[i] = 0;
      hasNaN = true;
    }
  }
  
  if (hasNaN) {
    geometry.attributes.position.needsUpdate = true;
  }
  
  return hasNaN;
};

/**
 * Center a model based on its bounding box
 */
export const centerModel = (model) => {
  if (model instanceof THREE.Mesh && model.geometry) {
    model.geometry.computeBoundingBox();
    const boundingBox = model.geometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    model.position.set(-center.x, -center.y, -center.z);
  } else if (model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.set(-center.x, -center.y, -center.z);
  }
};

/**
 * Dispose resources to prevent memory leaks
 */
export const disposeModel = (model) => {
  if (!model) return;
  
  if (model instanceof THREE.Mesh) {
    if (model.geometry) {
      model.geometry.dispose();
    }
    if (model.material) {
      if (Array.isArray(model.material)) {
        model.material.forEach(m => m.dispose());
      } else {
        model.material.dispose();
      }
    }
  } else if (model.children) {
    model.children.forEach(child => {
      disposeModel(child);
    });
  }
};