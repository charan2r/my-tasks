import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 24, className = '', fullScreen = false }) => {
  const loader = <Loader2 size={size} className={`animate-spin text-primary ${className}`} />;
  
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }
  
  return loader;
};
