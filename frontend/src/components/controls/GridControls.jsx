// src/components/controls/GridControls.jsx
import React from 'react';
import { 
  ViewfinderCircleIcon,
  ArrowsPointingOutIcon,
  TableCellsIcon,
  SwatchIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

function GridControls({ gridOptions, setGridOptions }) {
  // Helper function to handle color changes
  const handleColorChange = (colorKey, newValue) => {
    setGridOptions({
      ...gridOptions,
      [colorKey]: newValue
    });
  };
  
  // Helper function to reset grid settings
  const resetGridSettings = () => {
    setGridOptions({
      visible: true,
      size: 30,
      divisions: 20,
      color1: '#888888',
      color2: '#444444',
      infiniteGrid: false
    });
  };

  return (
    <>
      <h3 className="flex items-center text-base font-medium text-gray-800 mb-4">
        <ViewfinderCircleIcon className="w-5 h-5 mr-2 text-indigo-600" />
        Grid Controls
      </h3>
      
      {/* Grid Visibility */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input 
            type="checkbox"
            checked={gridOptions.visible}
            onChange={(e) => setGridOptions({
              ...gridOptions,
              visible: e.target.checked
            })}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          Show Grid
        </label>
      </div>
      
      {/* Grid Type Selection */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input 
            type="checkbox"
            checked={gridOptions.infiniteGrid}
            onChange={(e) => setGridOptions({
              ...gridOptions,
              infiniteGrid: e.target.checked
            })}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          Infinite Grid
        </label>
        <p className="text-xs text-gray-500 ml-6 mt-1">
          {gridOptions.infiniteGrid 
            ? "Grid extends to horizon with fading effect" 
            : "Standard grid with fixed size"}
        </p>
      </div>
      
      {/* Grid Size */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <ArrowsPointingOutIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Grid Size
        </label>
        <div className="flex items-center">
          <input 
            type="range" 
            min="10" 
            max="200" 
            step="10"
            value={gridOptions.size}
            onChange={(e) => setGridOptions({
              ...gridOptions,
              size: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-xs text-gray-500 min-w-[2rem] text-right">
            {gridOptions.size}
          </span>
        </div>
      </div>
      
      {/* Grid Divisions */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <TableCellsIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          Grid Divisions
        </label>
        <div className="flex items-center">
          <input 
            type="range" 
            min="5" 
            max="50" 
            value={gridOptions.divisions}
            onChange={(e) => setGridOptions({
              ...gridOptions,
              divisions: parseInt(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-xs text-gray-500 min-w-[2rem] text-right">
            {gridOptions.divisions}
          </span>
        </div>
      </div>
      
      {/* Primary Grid Color */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SwatchIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          {gridOptions.infiniteGrid ? "Cell Color" : "Primary Grid Color"}
        </label>
        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded p-1">
            <input 
              type="color" 
              value={gridOptions.color1}
              onChange={(e) => handleColorChange('color1', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="ml-3 flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {gridOptions.color1}
              </span>
              <button
                onClick={() => handleColorChange('color1', '#888888')}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Grid Color */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
          <SwatchIcon className="w-4 h-4 mr-1.5 text-gray-500" />
          {gridOptions.infiniteGrid ? "Section Color" : "Secondary Grid Color"}
        </label>
        <div className="flex items-center">
          <div className="flex items-center border border-gray-300 rounded p-1">
            <input 
              type="color" 
              value={gridOptions.color2}
              onChange={(e) => handleColorChange('color2', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="ml-3 flex-grow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {gridOptions.color2}
              </span>
              <button
                onClick={() => handleColorChange('color2', '#444444')}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset All Grid Settings */}
      <div className="mt-6">
        <button
          onClick={resetGridSettings}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" />
          Reset Grid Settings
        </button>
      </div>
    </>
  );
}

export default GridControls;