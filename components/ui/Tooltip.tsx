import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => (
  <div className="group relative flex flex-col items-center">
    {children}
    <div className="absolute bottom-full mb-2 hidden flex-col items-center group-hover:flex z-50 pointer-events-none transition-opacity duration-200">
      <span className="relative z-10 p-2 text-[10px] leading-none text-gray-900 whitespace-no-wrap bg-gray-100 border border-gray-300 shadow-lg rounded font-mono">
        {text}
      </span>
      <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-100 border-r border-b border-gray-300"></div>
    </div>
  </div>
);