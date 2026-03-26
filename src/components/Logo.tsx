import React from 'react';

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Clean Hexagonal Base */}
      <path 
        d="M50 5L89.4 27.5V72.5L50 95L10.6 72.5V27.5L50 5Z" 
        stroke="rgb(var(--accent))" 
        strokeWidth="6" 
        strokeLinejoin="round"
      />
      
      {/* Defined "T" Monogram */}
      <path 
        d="M30 35H70M50 35V75" 
        stroke="currentColor" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default Logo;
