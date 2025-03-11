// src/components/FileUpload.jsx
import { useState } from 'react';
import { uploadModel } from '../services/api';
import { UploadCloud, AlertCircle, FileSymlink } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };
  
  const validateAndSetFile = (selectedFile) => {
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (fileExt !== 'stl' && fileExt !== 'obj') {
      setError('Only STL and OBJ files are supported');
      return;
    }
    setFile(selectedFile);
    setError(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    try {
      const response = await uploadModel(file);
      onUploadSuccess(response);
      setFile(null);
      setError(null);
      e.target.reset();
    } catch (err) {
      setError(err.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <FileSymlink className="h-5 w-5 mr-2 text-blue-600" />
          Import Model
        </h2>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".stl,.obj"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="h-10 w-10 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {file 
                  ? file.name 
                  : 'Drag & drop your file here or click to browse'
                }
              </p>
              <p className="text-xs text-gray-500">Supported formats: STL, OBJ</p>
            </div>
            
            {error && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4 mr-2" />
                Import Model
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUpload;