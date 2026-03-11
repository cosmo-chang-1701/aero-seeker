<p align="center">
  <img src="./public/hero.png" alt="Aero-Seeker Hero" width="100%">
</p>

# 🚀 Aero-Seeker: Wind Tunnel Simulation Lab

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

**Aero-Seeker** 是一個基於 React 與 Three.js 構建的科幻風格空氣動力學/風洞模擬視覺化實驗室 (Wind Tunnel Lab)。本專案模擬了虛擬飛行器 (如 F7A Hornet) 在不同環境參數 (馬赫數、攻角、側滾等) 下的氣流與激波 (Shockwave) 反應，並透過高科技感 (Sci-Fi) 的 HUD 與介面呈現資料遙測畫面。

---

## ✨ 核心特色 (Key Features)

- **🛸 3D 即時氣流模擬**: 透過客製化的 Three.js 粒子系統，模擬高亞音速、跨音速與超音速下的流場變化。
- **💥 動態激波反應 (Shock Cone)**: 當馬赫數 (Mach) 超過 1.0 時，自動計算馬赫角並生成視覺化衝擊波。
- **📟 Sci-Fi HUD 介面**: 採用半透明磨砂玻璃質感 (Backdrop Blur) 與螢光色系，打造沉浸式的飛行遙測體驗。
- **🛠️ 即時參數控制**: 可動態調整馬赫數、攻角 (AoA)、側滾、粒子密度及流場顏色。
- **🛡️ 優雅降級機制**: 當瀏覽器不支援 WebGL 或效能低下時，自動切換至 2D Canvas 模式，確保核心視覺化功能正常運作。
- **⚠️ 失速模擬**: 當攻角超過安全範圍 (±25°) 時，觸發機體劇烈震動與失速警告。

---

## 🛠️ 技術棧 (Tech Stack)

| 技術 | 用途 | 說明 |
| :--- | :--- | :--- |
| **React 18** | UI 框架 | 元件化架構、狀態管理與渲染控制 |
| **Three.js** | 3D 渲染引擎 | 模型構建、材質運算、粒子流系統 |
| **Vite** | 打包工具 | 極速的開發服器與優化打包過程 |
| **Tailwind CSS** | 樣式設計 | 快速開發 Sci-Fi 風格 UI 與響應式佈局 |
| **Lucide React** | 圖示庫 | 精緻的現代化向量圖示 |

---

## 📂 專案架構 (Project Architecture)

```text
aero-seeker/
├── public/                 # 靜態資源 (包含 Hero Image 與 模型貼圖)
├── src/
│   ├── components/
│   │   ├── WindTunnelLab.jsx            # 主視幕：整合 2D/3D 與 HUD
│   │   └── WindTunnelLab/               # 邏輯子組件
│   │       ├── useWindTunnel3D.js       # 核心 3D 邏輯與 Three.js Hooks
│   │       ├── Fallback2DViewer.jsx     # WebGL 降級渲染方案
│   │       ├── WindTunnelControls.jsx   # 同步參數控制面板
│   │       ├── WindTunnelHUD.jsx        # 抬頭顯示器 (Heads-up Display)
│   │       └── constants.jsx            # 物理常數與預設配置
│   ├── App.jsx             # 頂層 App 組件
│   └── index.css           # 全域 CSS 與 Sci-Fi 全域樣式
└── vite.config.js          # 專案配置方案
```

---

## 🧠 核心邏輯解析 (Core Concepts)

### 1. 3D 流體視覺化 (`useWindTunnel3D.js`)
- **粒子系統**: 使用 `BufferGeometry` 優化上萬個粒子的渲染效能。
- **流場算法**: 粒子位置根據向量 `(vx, vy, vz)` 實時運算，並受到飛行器體積的「排斥」作用，模擬真實氣流繞流效果。
- **馬赫波**: 計算公式 $ \mu = \arcsin(1/M) $，動態調整激波錐 (Shock Cone) 的角度與透明度。

### 2. 2D 降級傳承 (`Fallback2DViewer.jsx`)
- 利用 Canvas 2D `context.stroke()` 繪製粒子線段。
- 飛機模型轉為 SVG `transform` 旋轉，並搭配 CSS Keyframes 模擬亂流震動，確保低階裝置使用者體驗不打折。

---

## 🚀 快速開始 (Getting Started)

### 前置準備
- 已安裝 <b>Node.js (v18+)</b>
- 已安裝 <b>npm</b> 或 <b>yarn</b>

### 安裝與啟動
1. 複製本專案
   ```bash
   git clone https://github.com/your-username/aero-seeker.git
   cd aero-seeker
   ```
2. 安裝依賴
   ```bash
   npm install
   ```
3. 啟動開發伺服器
   ```bash
   npm run dev
   ```
4. 開啟瀏覽器訪問 `http://localhost:5173`

---

## 📝 授權 (License)

本專案採用 **[MIT License](./LICENSE)** 授權。

---

<p align="center">
  Built with ❤️ by Cosmo Chang | Exploring the boundaries of Aerospace & Web Tech.
</p>
