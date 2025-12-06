import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'success' | 'ghost' | 'danger' | 'icon' | 'outline';
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  icon: Icon,
  disabled = false,
  title = '',
  type = 'button'
}) => {
  const baseStyle = "group relative px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ease-out flex items-center justify-center gap-2 overflow-hidden outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-lg";
  
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none border border-transparent",
    secondary: "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    dark: "bg-gray-800 text-white border border-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-gray-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    danger: "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200",
    icon: "p-2 aspect-square rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-transparent",
    outline: "bg-transparent text-orange-600 border-2 border-orange-600 hover:bg-orange-50 hover:text-orange-700"
  };

  return (
    <button onClick={onClick} disabled={disabled} title={title} type={type} className={`${baseStyle} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon size={14} />}
        {children}
      </span>
    </button>
  );
};