import React from 'react';

interface CyberPanelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable panel with clip-path cut corners.
 * Wraps the `.sc-panel` CSS class from source_index.html L28.
 */
export function CyberPanel({ children, className = '' }: CyberPanelProps) {
  return (
    <div className={`sc-panel ${className}`}>
      {children}
    </div>
  );
}
