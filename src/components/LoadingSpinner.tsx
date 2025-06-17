import React from 'react';
import { CarTaxiFront } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-200 z-50">
      <CarTaxiFront className="h-20 w-20 text-purple-600 animate-bounce" />
    </div>
  );
};

export default LoadingSpinner; 