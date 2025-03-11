import { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import ModelList from './components/ModelList';
import ModelViewer from './components/ModelViewer';
import ModelConverter from './components/ModelConverter';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  const handleUploadSuccess = (uploadedModelData) => {
    setRefreshTrigger(prev => prev + 1);
    
    const newModel = {
      filename: uploadedModelData.filename,
      format: uploadedModelData.format
    };
    setSelectedModel(newModel);
  };
  
  const handleConversionSuccess = (convertedModelData) => {
    setRefreshTrigger(prev => prev + 1);
    
    if (convertedModelData && convertedModelData.filename) {
      setSelectedModel({
        filename: convertedModelData.filename,
        format: convertedModelData.new_format
      });
    }
  };
  
  const handleDeleteModel = () => {
    setSelectedModel(null);
    setRefreshTrigger(prev => prev + 1);
  };
  
  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Collapsible */}
        <div className={`relative bg-white border-r border-gray-200 transition-all duration-300 ${
          isPanelCollapsed ? 'w-0 overflow-hidden' : 'w-80'
        }`}>
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <ModelList 
              onSelectModel={setSelectedModel} 
              refreshTrigger={refreshTrigger}
              onDeleteModel={handleDeleteModel}
              selectedModel={selectedModel}
            />
            {selectedModel && (
              <ModelConverter 
                selectedModel={selectedModel}
                onConversionSuccess={handleConversionSuccess}
              />
            )}
          </div>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={togglePanel}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-r-md p-1 shadow-md"
          style={{ 
            marginLeft: isPanelCollapsed ? '0' : '320px' 
          }}
        >
          {isPanelCollapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ModelViewer selectedModel={selectedModel} />
        </div>
      </div>
    </div>
  );
}

export default App;