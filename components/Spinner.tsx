import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="w-16 h-16 border-4 border-solid rounded-full animate-spin border-[#00ffff] border-t-transparent"></div>
  );
};

export default Spinner;