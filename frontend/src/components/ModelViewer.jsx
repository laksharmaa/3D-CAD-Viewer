// src/components/ModelViewer.jsx
import { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Box, ZoomOut, Maximize } from 'lucide-react';
import * as THREE from 'three';
import { getModelUrl } from '../services/api';

// Custom components
import Model from './model/Model';
import CustomGrid from './scene/CustomGrid';
import CustomLights from './scene/CustomLights';
import ControlSidebar from './controls/ControlSidebar';

// Camera controller component for camera positioning and fitting
const CameraController = ({ modelRef, defaultPosition = [0, 5, 10] }) => {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const [initialized, setInitialized] = useState(false);

  // Function to fit camera to model
  const fitCameraToModel = () => {
    if (!modelRef.current || !controlsRef.current) return;

    try {
      // Create bounding box from model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      
      // Skip if box is empty or invalid
      if (box.isEmpty() || !isFinite(box.min.x) || !isFinite(box.max.x)) {
        return;
      }
      
      // Get box dimensions and center
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // Calculate distance needed to frame the model
      const maxDim = Math.max(size.x, size.y, size.z);
      const fitHeightDistance = maxDim / Math.tan((Math.PI * camera.fov) / 360);
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);
      
      // Set target to center of model
      controlsRef.current.target.copy(center);
      
      // Position camera
      const direction = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(camera.quaternion)
        .normalize()
        .multiplyScalar(distance);
      
      camera.position.copy(center).add(direction);
      controlsRef.current.update();
    } catch (error) {
      console.error("Error fitting camera to model:", error);
    }
  };

  // Function to reset camera to default position
  const resetCamera = () => {
    if (!controlsRef.current) return;
    
    controlsRef.current.reset();
    camera.position.set(defaultPosition[0], defaultPosition[1], defaultPosition[2]);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  // Auto fit on first render
  useEffect(() => {
    if (modelRef.current && !initialized) {
      // Wait a bit for the model to load completely
      const timer = setTimeout(() => {
        fitCameraToModel();
        setInitialized(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [modelRef.current, initialized]);

  // Expose functions via ref
  useEffect(() => {
    if (modelRef.current && modelRef.current.userData) {
      modelRef.current.userData.fitCamera = fitCameraToModel;
      modelRef.current.userData.resetCamera = resetCamera;
    }
  }, [modelRef.current]);

  return (
    <OrbitControls 
      ref={controlsRef} 
      enablePan 
      enableZoom 
      enableRotate 
      minDistance={0.1}
      maxDistance={1000}
    />
  );
};

const ModelViewer = ({ selectedModel }) => {
  const modelRef = useRef();
  const [darkMode, setDarkMode] = useState(false);
  
  // Grid settings
  const [gridOptions, setGridOptions] = useState({
    visible: true,
    size: 30,
    divisions: 20,
    color1: '#888888',  // Primary grid color (thinner lines)
    color2: '#444444',  // Secondary grid color (thicker section lines)
    infiniteGrid: false
  });
  
  // Lighting settings
  const [lightingOptions, setLightingOptions] = useState({
    ambientIntensity: 0.5,
    ambientColor: '#ffffff',
    spotlightIntensity: 0.8,
    spotlightColor: '#ffffff',
    spotlightPosition: [10, 10, 10],
    environmentPreset: 'city',
    showContactShadow: true
  });
  
  // Material/Model settings
  const [modelOptions, setModelOptions] = useState({
    color: '#4f6df5',
    metalness: 0.1,
    roughness: 0.5,
    wireframe: false
  });

  const [defaultCameraPosition] = useState([0, 5, 10]);
  
  // Available textures
  const textures = [
    { id: '/textures/metal.jpg', name: 'Metal' },
    { id: '/textures/plastic.jpg', name: 'Plastic' },
    { id: '/textures/carbon.jpg', name: 'Carbon Fiber' },
  ];
  
  const [selectedTexture, setSelectedTexture] = useState(null);
  
  // Reset model reference when selection changes
  useEffect(() => {
    if (selectedModel && modelRef.current) {
      // Force a reset of the camera when model changes
      setTimeout(() => {
        if (modelRef.current && modelRef.current.userData && modelRef.current.userData.fitCamera) {
          modelRef.current.userData.fitCamera();
        }
      }, 500);
    }
  }, [selectedModel]);
  
  // Convert color string to THREE.js color
  const materialProps = {
    color: new THREE.Color(modelOptions.color),
    metalness: modelOptions.metalness,
    roughness: modelOptions.roughness,
    wireframe: modelOptions.wireframe,
    envMapIntensity: 1.0,
  };
  
  if (!selectedModel) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
        <div className="text-center">
          <Box className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">Select a model to view</p>
          <p className="text-sm text-gray-400 mt-2">Upload a model or choose from your library</p>
        </div>
      </div>
    );
  }
  
  const modelUrl = getModelUrl(selectedModel.filename);
  
  // Camera control functions
  const handleFitView = () => {
    if (modelRef.current && modelRef.current.userData && modelRef.current.userData.fitCamera) {
      modelRef.current.userData.fitCamera();
    }
  };
  
  const handleZoomOut = () => {
    if (modelRef.current && modelRef.current.userData && modelRef.current.userData.resetCamera) {
      modelRef.current.userData.resetCamera();
    }
  };
  
  return (
    <div className={`relative bg-white p-6 rounded-lg shadow-md h-[500px] ${darkMode ? 'dark' : ''}`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Box className="h-5 w-5 mr-2 text-blue-600" />
        {selectedModel.filename}
      </h2>
      
      <div className={`h-[400px] border border-gray-200 rounded-md ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} relative overflow-hidden`}>
        {/* View control buttons */}
        <div className="absolute top-2 left-2 z-20 bg-white/80 rounded shadow flex flex-col space-y-1 p-1">
          <button 
            onClick={handleFitView}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-800"
            title="Fit model to view">
            <Maximize size={16} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-800"
            title="Zoom out (reset view)">
            <ZoomOut size={16} />
          </button>
        </div>
        
        {/* Canvas for 3D rendering */}
        <Canvas shadows gl={{ antialias: true }}>
          <color attach="background" args={[darkMode ? '#1a1a1a' : '#f8f9fa']} />
          
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={defaultCameraPosition} 
            fov={50}
          />
          
          {/* Custom lights */}
          <CustomLights 
            ambientIntensity={lightingOptions.ambientIntensity}
            ambientColor={lightingOptions.ambientColor}
            spotlightIntensity={lightingOptions.spotlightIntensity}
            spotlightColor={lightingOptions.spotlightColor}
            spotlightPosition={lightingOptions.spotlightPosition}
            showContactShadow={lightingOptions.showContactShadow}
          />
          
          {/* Environment */}
          <Environment preset={lightingOptions.environmentPreset} background={false} />
          
          {/* Custom grid - positioned below the model */}
          <CustomGrid 
            visible={gridOptions.visible}
            size={gridOptions.size}
            divisions={gridOptions.divisions}
            color1={gridOptions.color1}
            color2={gridOptions.color2}
            infiniteGrid={gridOptions.infiniteGrid}
          />
          
          {/* Model */}
          <group ref={modelRef}>
            <Model 
              url={modelUrl} 
              fileFormat={selectedModel.format}
              materialProps={materialProps}
              texturePath={selectedTexture}
            />
          </group>
          
          {/* Camera controller */}
          <CameraController 
            modelRef={modelRef}
            defaultPosition={defaultCameraPosition}
          />
        </Canvas>
        
        {/* Control sidebar */}
        <div className="absolute top-0 right-0 h-full z-10">
          <ControlSidebar
            controlsRef={null}
            resetCamera={handleZoomOut}
            lightingOptions={lightingOptions}
            setLightingOptions={setLightingOptions}
            gridOptions={gridOptions}
            setGridOptions={setGridOptions}
            modelOptions={modelOptions}
            setModelOptions={setModelOptions}
            textures={textures}
            selectedTexture={selectedTexture}
            setSelectedTexture={setSelectedTexture}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
        <div>
          <p className="font-medium">Control the view:</p>
          <ul className="flex space-x-4 mt-1">
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              Drag: Rotate
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Right-click: Pan
            </li>
            <li className="flex items-center">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
              Scroll: Zoom
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;