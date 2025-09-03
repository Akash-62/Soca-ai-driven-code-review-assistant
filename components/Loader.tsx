
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-text-secondary bg-bg-light/10 backdrop-blur-md">
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-brand-primary rounded-full animate-pulse"
            style={{ animationDelay: `${i * 100}ms`, animationDuration: '1.2s' }}
          ></div>
        ))}
      </div>
      <p className="mt-8 text-xl font-medium tracking-widest text-text-primary animate-pulse">
        SOCA IS THINKING...
      </p>
    </div>
  );
};

export default Loader;