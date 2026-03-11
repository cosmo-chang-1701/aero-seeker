import React from 'react';
import { Activity, Radar, Crosshair, Zap } from 'lucide-react';

export const testPoints = [
  { title: '遙測與受力分析', icon: <Activity size={18} />, desc: '量子/氣動載荷感測器。', details: ['升力/阻力/側力向量分析。', '變動馬赫數下的艦體應力。'], presets: { mach: 0.8, aoa: 5, roll: 0, density: 1.0 } },
  { title: '艦體表面壓力映射', icon: <Radar size={18} />, desc: '結構完整性反饋。', details: ['微型感壓孔啟動。', '全息應力視覺化。'], presets: { mach: 1.2, aoa: 0, roll: 45, density: 1.5 } },
  { title: '流場視覺化', icon: <Activity size={18} />, desc: '大氣分離軌跡追蹤。', details: ['紋影光學陣列連線。', '電漿尾跡追蹤。'], presets: { mach: 0.5, aoa: 10, roll: 0, density: 2.0 } },
  { title: '失速與機動性', icon: <Activity size={18} />, desc: '高攻角 / 纏鬥飛行包絡線。', details: ['翼根渦流追蹤。', '俯仰穩定性喪失警告。'], presets: { mach: 0.4, aoa: 25, roll: 0, density: 1.0 } },
  { title: '武器/掛載物部署', icon: <Crosshair size={18} />, desc: '軍械分離軌跡。', details: ['S4/S5 掛載點淨空檢查。'], presets: { mach: 1.5, aoa: -5, roll: 180, density: 0.8 } },
  { title: '主推進器進氣道', icon: <Zap size={18} />, desc: '引擎畸變與效率。', details: ['進氣道氣流亂流極限。', '馬赫環排氣穩定性。'], presets: { mach: 2.5, aoa: 0, roll: 0, density: 1.0 } }
];
