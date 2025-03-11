// src/components/controls/ModelControls.jsx
import React from 'react';
import { 
  CubeIcon,
  SwatchIcon,
  Square3Stack3DIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

function ModelControls({ modelOptions, setModelOptions, textures, selectedTexture, setSelectedTexture }) {
  // Add "None" option to textures
  const textureOptions = [
    { id: null, name: 'None' },
    ...textures
  ];

  return (
    <>
      <h3 className="flex items-center text-base font-medium text-gray-800 mb-4">
        <CubeIcon className="w-5 h-5 mr-2 text-indigo-600" />
        Model Appearance
      </h3>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SwatchIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Model Color
        </label>
        <div className="flex items-center">
          <input 
            type="color" 
            value={modelOptions.color}
            onChange={(e) => setModelOptions({
              ...modelOptions,
              color: e.target.value
            })}
            className="w-8 h-8 rounded border border-gray-300"
          />
          <div 
            className="ml-2 w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: modelOptions.color }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SwatchIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Metalness
        </label>
        <div className="flex items-center">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={modelOptions.metalness}
            onChange={(e) => setModelOptions({
              ...modelOptions,
              metalness: parseFloat(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-xs text-gray-500 min-w-[2rem] text-right">
            {modelOptions.metalness.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Matte</span>
          <span>Metallic</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SwatchIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Roughness
        </label>
        <div className="flex items-center">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={modelOptions.roughness}
            onChange={(e) => setModelOptions({
              ...modelOptions,
              roughness: parseFloat(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-xs text-gray-500 min-w-[2rem] text-right">
            {modelOptions.roughness.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Glossy</span>
          <span>Rough</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input 
            type="checkbox"
            checked={modelOptions.wireframe}
            onChange={(e) => setModelOptions({
              ...modelOptions,
              wireframe: e.target.checked
            })}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          <Square3Stack3DIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Wireframe Mode
        </label>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <PhotoIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Texture
        </label>
        <select
          value={selectedTexture || ''}
          onChange={(e) => setSelectedTexture(e.target.value === '' ? null : e.target.value)}
          className="w-full p-2 text-sm border border-gray-300 rounded"
        >
          {textureOptions.map(texture => (
            <option key={texture.id || 'none'} value={texture.id || ''}>
              {texture.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedTexture && (
        <div className="border border-gray-300 rounded p-2 bg-gray-50">
          <p className="text-xs font-medium text-gray-700 mb-1">Texture Preview</p>
          <div className="h-24 flex items-center justify-center bg-white rounded overflow-hidden">
            <img
              src={selectedTexture}
              alt="Texture preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ModelControls;