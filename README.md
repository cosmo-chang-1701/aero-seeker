# Aero-Seeker

Aero-Seeker 是一個基於 React 與 Three.js 構建的科幻風格空氣動力學/風洞模擬視覺化實驗室 (Wind Tunnel Lab)。本專案模擬了虛擬飛行器 (如 F7A Hornet) 在不同環境參數 (馬赫數、攻角、側滾等) 下的氣流與激波 (Shockwave) 反應，並透過高科技感 (Sci-Fi) 的 HUD 與介面呈現資料遙測畫面。

## 技術棧 (Tech Stack)

- **框架**: [React](https://reactjs.org/) (v18.2.0)
- **建置工具**: [Vite](https://vitejs.dev/)
- **3D 渲染**: [Three.js](https://threejs.org/) (v0.160.0)
- **樣式與版面**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS
- **圖示庫**: [lucide-react](https://lucide.dev/)

## 專案架構 (Architecture)

```text
aero-seeker/
├── public/                 # 靜態資源檔案
├── src/
│   ├── components/
│   │   ├── WindTunnelLab.jsx            # 主視圖組件：整合 3D/2D 視圖、HUD 與控制介面
│   │   └── WindTunnelLab/               # 風洞實驗室相關子組件與邏輯
│   │       ├── useWindTunnel3D.js       # 核心 3D 渲染 Hooks (Three.js 邏輯)
│   │       ├── Fallback2DViewer.jsx     # WebGL 失敗時的 2D Canvas 降級替代組件
│   │       ├── WindTunnelControls.jsx   # 環境參數控制面板 (馬赫、攻角、側仰等)
│   │       ├── WindTunnelHUD.jsx        # 抬頭顯示器疊加層 (Sci-Fi 風格 UI)
│   │       ├── TelemetryPanel.jsx       # 遙測數據面板 (右側狀態列)
│   │       ├── DataMatrixTable.jsx      # 數據矩陣全螢幕/浮層展示
│   │       ├── WindTunnelHeader.jsx     # 實驗室標頭組件
│   │       └── constants.jsx            # 靜態常數、預設組合與配置
│   ├── App.jsx             # 頂層 App 組件
│   ├── main.jsx            # React 進入點
│   └── index.css           # 全域 CSS 配置 (Tailwind 指令與自訂 Sci-Fi 樣式)
├── package.json            # 依賴與指令配置
├── vite.config.js          # Vite 相關打包或開發服器設定
└── tailwind.config.js      # Tailwind CSS 主題與擴展設定
```

## 核心邏輯與機制 (Core Logic)

### 1. 狀態管理與串聯 (State Management)
以 `<WindTunnelLab />` 作為主控台，內部使用 `useState` 集中管理主要變數：
- `mach` (馬赫數)：影響粒子流速、音爆激波 (Shock cone) 產生與引擎火焰長度。
- `aoa` (攻角, Angle of Attack)：控制機體俯仰，超過閾值 (±25度) 將觸發 `isStall` (失速) 狀態。
- `roll` (側滾, Roll)：機身自轉角度。
- `density` (粒子密度)：控制渲染粒子總數，調節效能與畫面的平衡。
- 面板控制 (`WindTunnelControls`) 更新這些參數後，會由下傳遞至 3D Hook / 2D Canvas 及 HUD。

### 2. 3D 流體力學與視覺化演算 (`useWindTunnel3D.js`)
使用 **Three.js** 以自訂邏輯產生高效能的粒子與幾何特效：
- **飛行器建構**：運用多個基礎幾何體 (CylinderGeometry, ConeGeometry 等) 與自訂 `Shape/ExtrudeGeometry` 並透過 `Group` 組合建立 F7A 模型，並分別套用金屬、能量與透明材質。
- **粒子系統 (極簡版流體)**：使用 `LineSegments` 與 `BufferGeometry` 優化效能。自行實作粒子位置更迭算法 (`vx, vy, vz`)，賦予風洞內物體幾何碰撞折射、尾跡亂流 (Turbulence) 與音速衝擊波 (Shockwave) 影響，即時運算陣列座標。
- **動態特效**：超音速 (Mach >= 1.0) 突破時會計算馬赫角並出現半透明圓錐體 (Shock cone)；引擎噴流動態受到馬赫數增減改變規模與透明度。
- **減弱動態與無障礙**：監聽 `(prefers-reduced-motion: reduce)`，可選擇性地降低機體晃動幅度跟平滑補間 (Lerp) 的速率。

### 3. 2D 優雅降級 (`Fallback2DViewer.jsx`)
若裝置不支援 WebGL 或效能過低掛載 3D 環境失敗，會自動觸發 `Fallback2DViewer`：
- 使用原生的 HTML5 `Canvas 2D API` 生成向量線段粒子流。
- 飛行器轉為 SVG 圖示，配合 CSS `transform` 屬性響應參數變化 (旋轉與失速震動 `animation`)，確保核心的互動與展示不受限於高階硬體。

### 4. 高科技感使用者介面 (Sci-Fi UI)
- 完全仰賴 Tailwind CSS 實作大量漸層、半透明 `backdrop-blur`、螢光字體及絕對定位 (Absolute Positioning)。
- 右面板、狀態矩陣表格、底部控制滑桿 (Range inputs) 皆支援實時數據雙向響應。

## 開發與執行 (Usage)

請確保您的環境中已安裝 [Node.js](https://nodejs.org/) (建議 v18+)

```bash
# 安裝依賴庫
npm install

# 啟動本地開發伺服器
npm run dev

# 建立正式環境發布包
npm run build

# 預覽正式環境包
npm run preview
```

## 授權 (License)

保留所有權利。請參閱原始碼了解詳細結構。
