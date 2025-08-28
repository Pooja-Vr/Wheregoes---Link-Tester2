import React from 'react';
import { FaGlobe } from "react-icons/fa";

const Header = () => {
  return (
    // Header
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <FaGlobe className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wheregoes</h1>
              <p className="text-gray-600 text-sm">Link Redirect Tester & Tracer</p>
            </div>
          </div>
        </div>
      </header>
    
  );
};

export default Header;