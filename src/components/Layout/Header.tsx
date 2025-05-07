import React from 'react';
import { Package } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-4 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Package size={28} className="text-white" />
          <h1 className="text-xl sm:text-2xl font-bold">SpinStrike</h1>
        </div>
        <div className="text-sm sm:text-base">
          <p>Business Management System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
