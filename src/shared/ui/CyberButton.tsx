import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  active?: boolean;
}

/**
 * Reusable button with clip-path cut corners.
 * Wraps the `.sc-btn` CSS class from source_index.html L29.
 */
export function CyberButton({ children, active = false, className = '', ...props }: CyberButtonProps) {
  const baseClass = 'sc-btn text-[11px] font-bold tracking-wider';
  const activeClass = active
    ? 'bg-cyan-600 text-black'
    : 'bg-[#061222]/80 text-cyan-500 border border-cyan-900/50 hover:bg-cyan-900/50';

  return (
    <button className={`${baseClass} ${activeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
