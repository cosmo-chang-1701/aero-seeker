/**
 * Test point preset data for the telemetry MFD panel.
 */

export interface TestPointPreset {
  mach: number;
  aoa: number;
  roll: number;
  yaw: number;
  camPos: { x: number; y: number; z: number };
  camLook: { x: number; y: number; z: number };
}

export interface TestPoint {
  title: string;
  icon: string;
  desc: string;
  details: string[];
  presets: TestPointPreset;
}

export const testPoints: TestPoint[] = [
  {
    title: '遙測與受力分析',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    desc: '六自由度氣動天平感測器。',
    details: ['升力/阻力/側力向量分析。', '變動馬赫數下的機體結構應力。'],
    presets: { mach: 0.8, aoa: 5, roll: 0, yaw: 0, camPos: { x: -15, y: 10, z: 28 }, camLook: { x: 0, y: 0, z: 0 } },
  },
  {
    title: '機體表面壓力映射',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"></path><path d="M4 6h.01"></path><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"></path><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"></path><path d="M12 18h.01"></path><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"></path><circle cx="12" cy="12" r="2"></circle><path d="m13.41 10.59 5.66-5.66"></path></svg>',
    desc: '結構完整性反饋。',
    details: ['微型感壓孔啟動。', '氣動應力分佈視覺化。'],
    presets: { mach: 1.2, aoa: 0, roll: 45, yaw: 0, camPos: { x: -6, y: 15, z: 15 }, camLook: { x: 0, y: 0, z: 0 } },
  },
  {
    title: '流場視覺化',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    desc: '邊界層分離軌跡追蹤。',
    details: ['紋影光學陣列連線。', '渦流核心尾跡追蹤。'],
    presets: { mach: 0.5, aoa: 10, roll: 0, yaw: 0, camPos: { x: 0, y: 5, z: 25 }, camLook: { x: 0, y: 0, z: 0 } },
  },
  {
    title: '失速與機動性',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
    desc: '高攻角 / 纏鬥飛行包絡線。',
    details: ['翼根渦流追蹤。', '俯仰穩定性喪失警告。'],
    presets: { mach: 0.4, aoa: 25, roll: 0, yaw: 0, camPos: { x: -20, y: 5, z: -15 }, camLook: { x: 0, y: 0, z: 0 } },
  },
  {
    title: '武器/掛載物部署',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>',
    desc: '軍械分離軌跡。',
    details: ['內置彈艙與翼下掛載點淨空檢查。'],
    presets: { mach: 1.5, aoa: -5, roll: 180, yaw: 0, camPos: { x: 0, y: -12, z: 15 }, camLook: { x: 0, y: 0, z: 0 } },
  },
  {
    title: '主推進器進氣道',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    desc: '引擎畸變與效率。',
    details: ['進氣道氣流亂流極限。', '馬赫環排氣穩定性。'],
    presets: { mach: 2.5, aoa: 0, roll: 0, yaw: 0, camPos: { x: 18, y: 3, z: -6 }, camLook: { x: 2.8, y: 0, z: 0 } },
  },
];
