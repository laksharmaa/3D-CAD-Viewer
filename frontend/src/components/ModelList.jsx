// src/components/ModelList.jsx
import { useState, useEffect } from 'react';
import { getModels, deleteModel } from '../services/api';
import { List, Trash2, Package2, ChevronDown, ChevronUp } from 'lucide-react';

const ModelList = ({ onSelectModel, refreshTrigger, onDeleteModel, selectedModel }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const data = await getModels();
        setModels(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch models');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [refreshTrigger]);
  
  const handleDelete = async (e, filename) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      setDeletingFile(filename);
      
      try {
        await deleteModel(filename);
        onDeleteModel();
      } catch (err) {
        setError(`Failed to delete ${filename}`);
        console.error(err);
      } finally {
        setDeletingFile(null);
      }
    }
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const getFileIcon = (format) => {
    return <Package2 className="h-4 w-4 mr-2 text-blue-500" />;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-gray-100 cursor-pointer"
        onClick={toggleCollapse}
      >
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <List className="h-5 w-5 mr-2 text-blue-600" />
          Model Library
        </h2>
        {isCollapsed ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-2">{error}</div>
          ) : models.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              <div className="mb-2">No models in your library</div>
              <div className="text-sm">Upload a model to get started</div>
            </div>
          ) : (
            <ul className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {models.map((model) => {
                const isSelected = selectedModel && selectedModel.filename === model.filename;
                return (
                  <li 
                    key={model.filename} 
                    className={`p-2 rounded-md cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected 
                        ? 'bg-blue-100 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => onSelectModel(model)}
                  >
                    <div className="flex items-center overflow-hidden">
                      {getFileIcon(model.format)}
                      <span className="font-medium text-sm truncate max-w-[160px]">
                        {model.filename}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-2">
                        {model.format.toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, model.filename)}
                        disabled={deletingFile === model.filename}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 focus:outline-none"
                        title="Delete model"
                      >
                        {deletingFile === model.filename ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelList;