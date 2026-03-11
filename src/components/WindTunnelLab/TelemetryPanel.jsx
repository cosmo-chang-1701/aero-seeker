import React from 'react';
import { testPoints } from './constants.jsx';

const TelemetryPanel = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="hidden md:flex flex-col absolute top-6 right-6 bottom-[4.5rem] w-80 pointer-events-auto sc-panel bg-[#040f1c]/80 backdrop-blur-md border border-cyan-900/50 overflow-hidden">
      <div className="p-4 bg-cyan-950/30 border-b border-cyan-900/50">
        <h2 className="text-[11px] font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-widest">
          多功能顯示器 / 遙測系統
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 sc-scrollbar">
        {testPoints.map((point, index) => (
          <button 
            key={index} 
            onClick={() => setActiveTab(index, point.presets)} 
            className={`w-full text-left p-3 sc-btn transition-colors duration-200 border outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${ activeTab === index ? 'bg-cyan-900/40 border-cyan-500/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' : 'bg-[#061222]/50 border-transparent hover:bg-cyan-900/20 hover:border-cyan-800/50' }`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-cyan-500 ${activeTab===index ? 'opacity-100' : 'opacity-50' }`}>
                {React.cloneElement(point.icon, { 'aria-hidden': 'true' })}
              </div>
              <h3 className={`font-bold text-[11px] tracking-widest uppercase ${activeTab===index ? 'text-cyan-50' : 'text-cyan-400/70' }`}>
                {point.title}
              </h3>
            </div>

            {activeTab === index && (
              <div className="mt-3 pl-7 text-[12px] animate-in fade-in duration-300">
                <p className="text-cyan-300/80 mb-2 leading-relaxed font-sans">{point.desc}</p>
                <ul className="space-y-1.5 font-sans">
                  {point.details.map((detail, dIndex) => (
                    <li key={dIndex} className="text-cyan-100/60 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-[2px]" aria-hidden="true">▹</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default React.memo(TelemetryPanel);
