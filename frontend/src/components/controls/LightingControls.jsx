// src/components/controls/LightingControls.jsx
import React from 'react';
import {
  LightBulbIcon,
  SunIcon,
  SparklesIcon,
  SwatchIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

function LightingControls({ lightingOptions, setLightingOptions }) {
  const environmentPresets = [
    'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment',
    'studio', 'city', 'park', 'lobby'
  ];

  return (
    <>
      <h3 className="flex items-center text-base font-medium text-gray-800 mb-4">
        <LightBulbIcon className="w-5 h-5 mr-2 text-indigo-600" />
        Lighting Controls
      </h3>

      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SunIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Ambient Light
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={lightingOptions.ambientIntensity}
            onChange={(e) => setLightingOptions({
              ...lightingOptions,
              ambientIntensity: parseFloat(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-xs text-gray-500 min-w-[2rem] text-right">
            {lightingOptions.ambientIntensity.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SparklesIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Spotlight
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={lightingOptions.spotlightIntensity}
            onChange={(e) => setLightingOptions({
              ...lightingOptions,
              spotlightIntensity: parseFloat(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-xs text-gray-500 min-w-[2rem] text-right">
            {lightingOptions.spotlightIntensity.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SwatchIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Light Color
        </label>
        <div className="flex items-center">
          <input
            type="color"
            value={lightingOptions.spotlightColor}
            onChange={(e) => setLightingOptions({
              ...lightingOptions,
              spotlightColor: e.target.value
            })}
            className="w-8 h-8 rounded border border-gray-300"
          />
          <span className="ml-2 text-xs text-gray-500">
            {lightingOptions.spotlightColor}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <PhotoIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Environment
        </label>
        <select
          value={lightingOptions.environmentPreset}
          onChange={(e) => setLightingOptions({
            ...lightingOptions,
            environmentPreset: e.target.value
          })}
          className="w-full p-2 text-sm border border-gray-300 rounded"
        >
          {environmentPresets.map(preset => (
            <option key={preset} value={preset}>
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={lightingOptions.showContactShadow}
            onChange={(e) => setLightingOptions({
              ...lightingOptions,
              showContactShadow: e.target.checked
            })}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          Show Shadow
        </label>
      </div>
    </>
  );
}

export default LightingControls;