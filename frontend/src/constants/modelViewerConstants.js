// src/constants/modelViewerConstants.js
export const ENVIRONMENT_PRESETS = [
    'sunset', 'dawn', 'night', 'warehouse', 'forest', 
    'apartment', 'studio', 'city', 'park', 'lobby'
  ];
  
  export const DEFAULT_GRID_OPTIONS = {
    visible: true,
    size: 30,
    divisions: 20,
    color1: '#888888',
    color2: '#444444',
    infiniteGrid: false
  };
  
  export const DEFAULT_LIGHTING_OPTIONS = {
    ambientIntensity: 0.5,
    ambientColor: '#ffffff',
    spotlightIntensity: 0.8,
    spotlightColor: '#ffffff',
    spotlightPosition: [10, 10, 10],
    environmentPreset: 'city',
    showContactShadow: true
  };
  
  export const DEFAULT_MODEL_OPTIONS = {
    color: '#4f6df5',
    metalness: 0.1,
    roughness: 0.5,
    wireframe: false
  };
  
  export const TEXTURE_OPTIONS = [
    { id: '/textures/metal.jpg', name: 'Metal' },
    { id: '/textures/plastic.jpg', name: 'Plastic' },
    { id: '/textures/carbon.jpg', name: 'Carbon Fiber' },
  ];