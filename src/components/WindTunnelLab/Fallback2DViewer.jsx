import React, { useEffect, useRef } from 'react';

const STREAMLINE_TIME_SCALE = 0.0018;
const STREAMLINE_INDEX_PHASE = 0.03;
const STREAMLINE_CURVE_FREQUENCY = 0.75;
const TURBULENT_SWIRL_MULTIPLIER = 1.4;
const CALM_SWIRL_MULTIPLIER = 0.7;
const TURBULENT_BOW_MULTIPLIER = 1.2;
const CALM_BOW_MULTIPLIER = 0.45;

const Fallback2DViewer = ({ mach, aoa, roll = 0, isStall, density = 1.0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const baseLines = isStall ? 120 : 60;
    const numLines = Math.floor(baseLines * density);
    
    let streamlines = Array.from({ length: numLines }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0,
      length: 50 + Math.random() * 100,
      offsetY: Math.random() * 1000,
      amplitude: 4 + Math.random() * 12,
      curvature: 6 + Math.random() * 18,
    }));

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const frameTimePhase = time * STREAMLINE_TIME_SCALE;

      streamlines.forEach((p, index) => {
        p.speed = (mach * 10 + 2) + (p.length / 100);
        p.x -= p.speed;
        
        let currentY = p.y;
        let isTurbulent = false;

        const relY = height > 0 ? p.y / height : 0;

        if (isStall && relY > 0.3 && relY < 0.7) {
          currentY += Math.sin(time * 0.01 + p.offsetY) * 5;
          isTurbulent = true;
        }

        if (p.x < -p.length) {
          p.x = width + p.length;
          p.y = Math.random() * height;
        }

        const timePhase = frameTimePhase + p.offsetY + index * STREAMLINE_INDEX_PHASE;
        const swirl = Math.sin(timePhase) * p.amplitude * (isTurbulent ? TURBULENT_SWIRL_MULTIPLIER : CALM_SWIRL_MULTIPLIER);
        const bow = Math.cos(timePhase * STREAMLINE_CURVE_FREQUENCY) * p.curvature * (isTurbulent ? TURBULENT_BOW_MULTIPLIER : CALM_BOW_MULTIPLIER);

        ctx.beginPath();
        ctx.moveTo(p.x, currentY);
        ctx.quadraticCurveTo(
          p.x + p.length * 0.45,
          currentY + bow,
          p.x + p.length,
          currentY + swirl
        );
        
        if (isTurbulent) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // amber-500
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'; // cyan-400
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        streamlines.forEach(p => p.y = Math.random() * canvas.height);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mach, isStall, density]);

  return (
    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0,transparent_70%),linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:100%_100%,30px_30px,30px_30px] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '600px' }}>
        <div 
          className="relative z-10 scale-125 transition-transform duration-200" 
          style={{ 
            transform: `rotateZ(${-aoa}deg) rotateX(${roll}deg)`, 
            animation: isStall ? 'shake 0.2s infinite' : 'none' 
          }}
        >
          <svg width="240" height="80" viewBox="0 0 200 60" fill="none" role="img" aria-label="F7A Hornet 2D Proxy">
            <title>F7A Hornet 2D Proxy Rendering</title>
            <path d="M 40 30 L 0 24 L 0 36 Z" fill="#0ea5e9" className={mach > 0.8 ? "opacity-80" : "opacity-0"} />
            <path d="M 140 30 L 100 20 L 20 20 L 20 40 L 100 40 Z" fill="#2a3038" stroke="#0ea5e9" strokeWidth="0.5" />
            <path d="M 140 30 L 160 30 L 140 35 Z" fill="#d97706" />
            <path d="M 110 20 L 70 5 L 30 5 L 60 20 Z" fill="#111827" stroke="#0ea5e9" strokeWidth="0.5" />
            <path d="M 110 40 L 70 55 L 30 55 L 60 40 Z" fill="#111827" stroke="#0ea5e9" strokeWidth="0.5" />
            <path d="M 120 20 L 100 15 L 80 20 Z" fill="#0ea5e9" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Fallback2DViewer);
