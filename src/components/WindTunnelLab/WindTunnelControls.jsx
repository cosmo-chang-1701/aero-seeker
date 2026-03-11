import React from 'react';
import { Cpu } from 'lucide-react';

const WindTunnelControls = ({ mach, aoa, roll, density, setMach, setAoa, setRoll, setDensity }) => {
  return (
    <div className="absolute bottom-6 left-6 w-80 pointer-events-auto sc-panel bg-[#040f1c]/80 backdrop-blur-md border border-cyan-900/50 p-6">
      <h3 className="text-sm font-bold mb-5 text-cyan-500 flex items-center gap-2 uppercase tracking-widest">
        <Cpu size={14} aria-hidden="true" />
        環境參數控制
      </h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="mach-input" className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">量子/大氣航速 (馬赫)</label>
          </div>
          <input 
            id="mach-input"
            name="mach"
            type="range" 
            min="0.2" 
            max="2.5" 
            step="0.01" 
            value={mach} 
            onChange={(e)=> setMach(parseFloat(e.target.value))} 
            className="w-full h-1 bg-cyan-950 appearance-none cursor-pointer accent-cyan-400 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020611]" 
          />
          <div className="flex justify-between text-[11px] text-cyan-600 mt-2 uppercase tracking-widest font-medium">
            <span>亞音速</span>
            <span>跨音速</span>
            <span className="text-amber-500/70">超音速</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="aoa-input" className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">俯仰向量 (攻角)</label>
          </div>
          <input 
            id="aoa-input"
            name="aoa"
            type="range" 
            min="-90" 
            max="90" 
            step="1" 
            value={aoa} 
            onChange={(e)=> setAoa(parseInt(e.target.value))} 
            className="w-full h-1 bg-cyan-950 appearance-none cursor-pointer accent-amber-500 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020611]" 
          />
          <div className="flex justify-between text-[11px] text-cyan-600 mt-2 uppercase tracking-widest font-medium">
            <span className="text-amber-500/70">負失速</span>
            <span>巡航</span>
            <span className="text-amber-500/70">正失速</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="roll-input" className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">側滾向量 (Roll)</label>
          </div>
          <input 
            id="roll-input"
            name="roll"
            type="range" 
            min="-180" 
            max="180" 
            step="1" 
            value={roll} 
            onChange={(e)=> setRoll(parseInt(e.target.value))} 
            className="w-full h-1 bg-cyan-950 appearance-none cursor-pointer accent-purple-500 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020611]" 
          />
          <div className="flex justify-between text-[11px] text-cyan-600 mt-2 uppercase tracking-widest font-medium">
            <span className="text-purple-500/70">-180°</span>
            <span>0°</span>
            <span className="text-purple-500/70">+180°</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="density-input" className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">氣流密度 (渲染精度)</label>
          </div>
          <input 
            id="density-input"
            name="density"
            type="range" 
            min="0.1" 
            max="2.0" 
            step="0.01" 
            value={density} 
            onChange={(e)=> setDensity(parseFloat(e.target.value))} 
            className="w-full h-1 bg-cyan-950 appearance-none cursor-pointer accent-cyan-400 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020611]" 
          />
          <div className="flex justify-between text-[11px] text-cyan-600 mt-2 uppercase tracking-widest font-medium">
            <span>低效能</span>
            <span>平衡</span>
            <span className="text-cyan-400/70">高精度</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WindTunnelControls);
