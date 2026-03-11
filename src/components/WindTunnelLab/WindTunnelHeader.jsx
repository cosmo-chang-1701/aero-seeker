import React from 'react';
import { Shield } from 'lucide-react';

const WindTunnelHeader = () => {
  return (
    <header className="absolute top-6 left-6 w-80 pointer-events-auto sc-panel bg-[#040f1c]/80 backdrop-blur-md border border-cyan-900/50 p-5">
      <div className="text-amber-500 text-[11px] tracking-[0.3em] mb-1 font-bold">鐵砧航太 (ANVIL AEROSPACE)</div>
      <h1 className="text-xl font-bold text-cyan-50 flex items-center gap-2 tracking-wider">
        <Shield className="text-cyan-500" size={20} aria-hidden="true" />
        F7A 大黃蜂
      </h1>
      <div className="mt-2 text-[11px] text-cyan-400/60 uppercase tracking-widest border-t border-cyan-900/50 pt-2 flex justify-between">
        <span>氣動模擬系統 版本 3.14</span>
        <span className="text-amber-500/80">授權碼: 994-B</span>
      </div>
    </header>
  );
};

export default React.memo(WindTunnelHeader);
