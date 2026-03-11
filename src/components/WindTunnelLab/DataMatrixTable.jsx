import React from 'react';
import { Info } from 'lucide-react';

const DataMatrixTable = ({ showMatrix }) => {
  if (!showMatrix) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-3rem)] max-w-2xl pointer-events-auto sc-panel bg-[#040f1c]/90 backdrop-blur-xl border border-cyan-800/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-cyan-950/40 px-5 py-3 border-b border-cyan-900/50">
        <h3 className="font-bold text-sm text-cyan-400 tracking-widest uppercase flex items-center gap-2">
          <Info size={14} aria-hidden="true" /> 氣動力參數參照矩陣
        </h3>
      </div>
      <div className="overflow-x-auto p-3">
        <table className="w-full text-left text-[12px] text-cyan-100/70 font-sans">
          <thead className="text-[11px] text-cyan-500/80 uppercase tracking-widest border-b border-cyan-900/50">
            <tr>
              <th className="px-4 py-3 font-normal">飛行狀態</th>
              <th className="px-4 py-3 font-normal">馬赫數範圍</th>
              <th className="px-4 py-3 font-normal">模擬技術</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/30">
            <tr className="hover:bg-cyan-900/20 transition-colors">
              <td className="px-4 py-3 text-cyan-300 tracking-wider">亞音速</td>
              <td className="px-4 py-3 font-mono">M &lt; 0.8</td>
              <td className="px-4 py-3">低速陣列，煙流視覺化</td>
            </tr>
            <tr className="hover:bg-cyan-900/20 transition-colors">
              <td className="px-4 py-3 text-blue-400 tracking-wider">跨音速</td>
              <td className="px-4 py-3 font-mono">0.8 &lt; M &lt; 1.2</td>
              <td className="px-4 py-3">跨音速風洞，感壓漆映射</td>
            </tr>
            <tr className="hover:bg-cyan-900/20 transition-colors">
              <td className="px-4 py-3 text-purple-400 tracking-wider">超音速</td>
              <td className="px-4 py-3 font-mono">M &gt; 1.2</td>
              <td className="px-4 py-3">超音速陣列，紋影光學系統</td>
            </tr>
            <tr className="hover:bg-cyan-900/20 transition-colors">
              <td className="px-4 py-3 text-amber-500 tracking-wider">動態導數</td>
              <td className="px-4 py-3 font-mono">α̇, q (攻角/俯仰變率)</td>
              <td className="px-4 py-3">強迫振動機構</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(DataMatrixTable);
