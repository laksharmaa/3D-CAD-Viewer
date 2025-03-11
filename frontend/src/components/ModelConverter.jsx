// src/components/ModelConverter.jsx
import { useState } from 'react';
import { convertModel, getModelUrl } from '../services/api';
import { FileSymlink, Download, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const ModelConverter = ({ selectedModel, onConversionSuccess }) => {
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!selectedModel) {
    return null;
  }
  
  const handleConvert = async () => {
    setConverting(true);
    setError(null);
    setConvertedFile(null);
    
    try {
      const targetFormat = selectedModel.format.toLowerCase() === 'stl' ? 'obj' : 'stl';
      const result = await convertModel(selectedModel.filename, targetFormat);
      setConvertedFile(result);
      onConversionSuccess(result);
    } catch (err) {
      setError(err.error || 'Conversion failed');
    } finally {
      setConverting(false);
    }
  };
  
  const targetFormat = selectedModel.format.toLowerCase() === 'stl' ? 'OBJ' : 'STL';
  
  const handleDownload = () => {
    if (!convertedFile) return;
    
    const downloadUrl = getModelUrl(convertedFile.filename);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = convertedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer"
        onClick={toggleCollapse}
      >
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <FileSymlink className="h-5 w-5 mr-2 text-blue-600" />
          Format Conversion
        </h2>
        {isCollapsed ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Current format</div>
              <div className="font-medium">{selectedModel.format.toUpperCase()}</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div>
              <div className="text-sm text-gray-500">Target format</div>
              <div className="font-medium">{targetFormat}</div>
            </div>
          </div>
          
          <button
            onClick={handleConvert}
            disabled={converting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300 mb-3 flex items-center justify-center transition-colors"
          >
            {converting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Convert to {targetFormat}
              </>
            )}
          </button>
          
          {convertedFile && (
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download {targetFormat}
            </button>
          )}
          
          {error && (
            <div className="mt-2 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelConverter;