// src/components/Navbar.jsx
import { Box, Github, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Box className="h-6 w-6" />
            <span className="text-xl font-bold">Professional CAD Viewer</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
              <Settings className="h-5 w-5" />
              <span className="hidden md:inline">Settings</span>
            </button>
            <a href="https://github.com/yourusername/cad-viewer" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
              <Github className="h-5 w-5" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;