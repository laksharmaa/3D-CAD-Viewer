// src/components/controls/ControlSidebar.jsx
import React, { useState } from 'react';
import { 
  LightBulbIcon, 
  ViewfinderCircleIcon, 
  CubeIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

import LightingControls from './LightingControls';
import GridControls from './GridControls';
import ModelControls from './ModelControls';

function ControlSidebar({ 
  controlsRef, 
  lightingOptions, 
  setLightingOptions, 
  gridOptions, 
  setGridOptions, 
  modelOptions, 
  setModelOptions,
  textures,
  selectedTexture,
  setSelectedTexture,
  darkMode,
  setDarkMode,
  resetCamera
}) {
  const [activePanel, setActivePanel] = useState(null);
  
  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };
  
  const handleResetView = () => {
    if (typeof resetCamera === 'function') {
      resetCamera();
    } else if (controlsRef && controlsRef.current) {
      // Reset camera to default position
      controlsRef.current.reset();
      
      // Force update the controls
      controlsRef.current.update();
    }
  };
  
  return (
    <div className="flex h-full" style={{ pointerEvents: 'none' }}>
      {/* Button column with pointer events enabled */}
      <div className="flex flex-col bg-white border-l border-gray-200 shadow-md" style={{ pointerEvents: 'auto' }}>
        <div className="p-2 border-b border-gray-200 flex items-center justify-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-amber-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
        
        <button 
          className={`p-2 m-1 rounded ${activePanel === 'lighting' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
          onClick={() => togglePanel('lighting')}
          title="Lighting Controls"
        >
          <LightBulbIcon className="h-5 w-5" />
        </button>
        
        <button 
          className={`p-2 m-1 rounded ${activePanel === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
          onClick={() => togglePanel('grid')}
          title="Grid Controls"
        >
          <ViewfinderCircleIcon className="h-5 w-5" />
        </button>
        
        <button 
          className={`p-2 m-1 rounded ${activePanel === 'model' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
          onClick={() => togglePanel('model')}
          title="Model Appearance"
        >
          <CubeIcon className="h-5 w-5" />
        </button>
        
        <button 
          className="p-2 m-1 rounded hover:bg-gray-100 mt-auto mb-2"
          onClick={handleResetView}
          title="Reset Camera View"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Panel content with pointer events enabled only when active */}
      {activePanel && (
        <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          {activePanel === 'lighting' && (
            <div className="p-4">
              <LightingControls 
                lightingOptions={lightingOptions}
                setLightingOptions={setLightingOptions}
              />
            </div>
          )}
          
          {activePanel === 'grid' && (
            <div className="p-4">
              <GridControls 
                gridOptions={gridOptions}
                setGridOptions={setGridOptions}
              />
            </div>
          )}
          
          {activePanel === 'model' && (
            <div className="p-4">
              <ModelControls 
                modelOptions={modelOptions}
                setModelOptions={setModelOptions}
                textures={textures}
                selectedTexture={selectedTexture}
                setSelectedTexture={setSelectedTexture}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ControlSidebar;