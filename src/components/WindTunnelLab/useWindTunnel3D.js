import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const RANDOM_TABLE_SIZE = 16384;
const randomTable = new Float32Array(RANDOM_TABLE_SIZE);
for (let i = 0; i < RANDOM_TABLE_SIZE; i++) {
  randomTable[i] = Math.random();
}
let randomIndex = 0;
function fastRandom() {
  randomIndex = (randomIndex + 1) & 16383; // Fast modulo 16384
  return randomTable[randomIndex];
}

export const useWindTunnel3D = ({ mach, aoa, roll = 0, isStall, isReducedMotion, density }) => {
  const mountRef = useRef(null);
  const [webglError, setWebglError] = useState(false);
  const stateRef = useRef({ mach, aoa, roll, isStall });

  useEffect(() => {
    stateRef.current = { mach, aoa, roll, isStall, density };
  }, [mach, aoa, roll, isStall, density]);

  useEffect(() => {
    if (!mountRef.current || webglError) return;

    let renderer;
    const originalConsoleError = console.error;

    try {
      console.error = () => {};
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) || 
                 canvas.getContext('experimental-webgl');
      
      if (!gl) throw new Error("WebGL not supported or performance caveat detected");
      
      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: true
      });
      
      console.error = originalConsoleError;
    } catch (e) {
      console.error = originalConsoleError;
      setWebglError(true);
      return;
    }

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xa5f3fc, 2.0);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0xf59e0b, 3, 20);
    backLight.position.set(-8, -2, -5);
    scene.add(backLight);

    const f7aGroup = new THREE.Group();
    scene.add(f7aGroup);

    const armorMat = new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.8, metalness: 0.5 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.7 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });

    const hullGeo = new THREE.CylinderGeometry(0.35, 0.45, 4.5, 16);
    hullGeo.rotateZ(-Math.PI / 2);
    const mainHull = new THREE.Mesh(hullGeo, armorMat);
    mainHull.position.set(-0.25, 0, 0);
    f7aGroup.add(mainHull);

    const noseGeo = new THREE.ConeGeometry(0.35, 1.5, 16);
    noseGeo.rotateZ(-Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, armorMat);
    nose.position.set(2.75, 0, 0);
    f7aGroup.add(nose);

    const canopyGeo = new THREE.CylinderGeometry(0, 0.35, 1.5, 8);
    canopyGeo.rotateZ(-Math.PI / 2);
    canopyGeo.rotateX(Math.PI / 4);
    const canopy = new THREE.Mesh(canopyGeo, glassMat);
    canopy.scale.set(1.2, 0.7, 0.8);
    canopy.position.set(1.2, 0.45, 0);
    f7aGroup.add(canopy);

    const turretGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const turret = new THREE.Mesh(turretGeo, accentMat);
    turret.position.set(-0.5, 0.45, 0);
    f7aGroup.add(turret);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(-1.5, 2.8);
    wingShape.lineTo(-2.2, 2.8);
    wingShape.lineTo(-1.2, 0);
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03 });
    wingGeo.rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo, armorMat);
    rightWing.position.set(0.2, 0, 0.4);
    f7aGroup.add(rightWing);

    const leftWing = new THREE.Mesh(wingGeo, armorMat);
    leftWing.position.set(0.2, 0, -0.4);
    leftWing.scale.z = -1;
    f7aGroup.add(leftWing);

    const vTailShape = new THREE.Shape();
    vTailShape.moveTo(0, 0);
    vTailShape.lineTo(-0.8, 1.2);
    vTailShape.lineTo(-1.5, 1.2);
    vTailShape.lineTo(-1.0, 0);
    const vTailGeo = new THREE.ExtrudeGeometry(vTailShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });

    const rightVTail = new THREE.Mesh(vTailGeo, armorMat);
    rightVTail.position.set(-1.0, 0.2, 0.8);
    rightVTail.rotation.x = -Math.PI / 16;
    f7aGroup.add(rightVTail);

    const leftVTail = new THREE.Mesh(vTailGeo, armorMat);
    leftVTail.position.set(-1.0, 0.2, -0.8);
    leftVTail.rotation.x = Math.PI / 16;
    f7aGroup.add(leftVTail);

    const hTailShape = new THREE.Shape();
    hTailShape.moveTo(0, 0);
    hTailShape.lineTo(-0.8, 1.0);
    hTailShape.lineTo(-1.2, 1.0);
    hTailShape.lineTo(-0.8, 0);
    const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.05, bevelEnabled: false });
    hTailGeo.rotateX(Math.PI / 2);
    const hTail = new THREE.Mesh(hTailGeo, armorMat);
    hTail.position.set(-1.2, 0.1, 0);
    f7aGroup.add(hTail);

    const thrusterGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.8, 16);
    thrusterGeo.rotateZ(Math.PI / 2);
    const engine = new THREE.Mesh(thrusterGeo, accentMat);
    engine.position.set(-2.6, 0, 0);
    f7aGroup.add(engine);

    const flameGroup = new THREE.Group();
    flameGroup.position.set(-3.0, 0, 0);
    f7aGroup.add(flameGroup);

    const flameMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.5, 16), flameMat);
    flame.rotation.z = Math.PI / 2;
    flame.position.x = -1.25;
    flameGroup.add(flame);

    const diamonds = [];
    const diamondMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    for (let i = 0; i < 5; i++) { 
      const diamond = new THREE.Mesh(new THREE.ConeGeometry(0.25 - i*0.03, 0.4, 16), diamondMat);
      diamond.rotation.z = Math.PI / 2; 
      diamond.position.x = -0.5 - i * 0.45; 
      flameGroup.add(diamond); 
      diamonds.push(diamond);
    } 
    
    const maxLineCount = 24000; 
    const linesGeo = new THREE.BufferGeometry(); 
    const posArray = new Float32Array(maxLineCount * 6); 
    const colorArray = new Float32Array(maxLineCount * 6); 
    
    for(let i = 0; i < maxLineCount; i++) {
      const x = (fastRandom() - 0.5) * 40; 
      const y = (fastRandom() - 0.5) * 30; 
      const z = (fastRandom() - 0.5) * 30;
      posArray[i*6] = x; 
      posArray[i*6+1] = y; 
      posArray[i*6+2] = z; 
      posArray[i*6+3] = x + 1; 
      posArray[i*6+4] = y; 
      posArray[i*6+5] = z;
      for(let c = 0; c < 6; c += 3) { 
        colorArray[i*6+c] = 0.0; 
        colorArray[i*6+c+1] = 0.8; 
        colorArray[i*6+c+2]=0.9; 
      } 
    }
    
    linesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3).setUsage(THREE.DynamicDrawUsage)); 
    linesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3).setUsage(THREE.DynamicDrawUsage)); 
    const linesMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }); 
    const flowSystem = new THREE.LineSegments(linesGeo, linesMat); 
    scene.add(flowSystem); 
    
    const shockGroup = new THREE.Group(); 
    shockGroup.rotation.z = -Math.PI / 2; 
    shockGroup.position.x = 3.5; 
    
    const shockMatOuter = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }); 
    const shockOuter = new THREE.Mesh(new THREE.ConeGeometry(5, 7, 64, 1, true), shockMatOuter); 
    shockGroup.add(shockOuter); 
    
    const shockMatInner = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }); 
    const shockInner = new THREE.Mesh(new THREE.ConeGeometry(4.9, 6.9, 64, 1, true), shockMatInner); 
    shockInner.position.y = -0.05; 
    shockGroup.add(shockInner);
    
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }); 
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.9, 0.04, 16, 64), ringMat); 
    ring.rotation.x = Math.PI / 2; 
    ring.position.y = -3.45; 
    shockGroup.add(ring); 
    f7aGroup.add(shockGroup); 
    
    const vaporMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }); 
    const vaporCone = new THREE.Mesh(new THREE.ConeGeometry(3.5, 4.5, 64, 1, true), vaporMat); 
    vaporCone.rotation.z = -Math.PI / 2;
    vaporCone.position.x = 0; 
    f7aGroup.add(vaporCone); 
    
    let cameraAngles = { theta: Math.PI / 6, phi: Math.PI / 2.5 }; 
    let radius = 16; 
    let isDragging = false; 
    let previousMousePosition = { x: 0, y: 0 }; 
    const updateCamera = () => {
      cameraAngles.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngles.phi));
      camera.position.x = radius * Math.sin(cameraAngles.phi) * Math.sin(cameraAngles.theta);
      camera.position.y = radius * Math.cos(cameraAngles.phi);
      camera.position.z = radius * Math.sin(cameraAngles.phi) * Math.cos(cameraAngles.theta);
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const handleMouseDown = (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; };
    const handleMouseUp = () => { isDragging = false; };
    const handleMouseMove = (e) => {
      if (isDragging) {
        cameraAngles.theta -= (e.clientX - previousMousePosition.x) * 0.01;
        cameraAngles.phi -= (e.clientY - previousMousePosition.y) * 0.01;
        updateCamera();
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };
    const handleWheel = (e) => {
      e.preventDefault();
      radius = Math.max(6, Math.min(45, radius + e.deltaY * 0.02));
      updateCamera();
    };

    const container = mountRef.current;
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('wheel', handleWheel, { passive: false });

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const { mach: currentMach, aoa: currentAoa, roll: currentRoll = 0, isStall: currentStall, density: currentDensity } = stateRef.current;
      const activeLineCount = Math.min(24000, Math.floor(12000 * currentDensity)); 
      flowSystem.geometry.setDrawRange(0, activeLineCount * 2);

      const lerpFactor = isReducedMotion ? 0.05 : 0.1;

      f7aGroup.rotation.z += ((currentAoa * Math.PI) / 180 - f7aGroup.rotation.z) * lerpFactor;
      const targetRoll = (currentRoll * Math.PI) / 180;

      if (currentStall) {
        f7aGroup.position.y = Math.sin(Date.now() * 0.05) * 0.08;
        f7aGroup.rotation.x += (targetRoll + Math.sin(Date.now() * 0.04) * 0.05 - f7aGroup.rotation.x) * lerpFactor;
      } else {
        f7aGroup.position.y += (0 - f7aGroup.position.y) * 0.1;
        f7aGroup.rotation.x += (targetRoll - f7aGroup.rotation.x) * lerpFactor;
      }

      flame.scale.setLength(1 + Math.random() * 0.3 + currentMach * 0.8);
      flameMat.opacity = currentMach > 0.8 ? 0.9 : 0;

      const diaOpacity = currentMach >= 1.0 ? 0.4 + Math.random() * 0.6 : 0;
      diamonds.forEach(d => d.material.opacity = diaOpacity);

      if (currentMach >= 1.0) {
        const mu = Math.asin(1 / Math.max(currentMach, 1.001));
        const shockRadius = 7 * Math.tan(mu);
        const scaleXZ = shockRadius / 5;
        shockGroup.scale.set(scaleXZ, 1, scaleXZ);

        const intensity = Math.min(1.0, (currentMach - 0.95) * 2.0);
        shockMatOuter.opacity = intensity * 0.25;
        shockMatInner.opacity = intensity * 0.15;
        ringMat.opacity = intensity * 0.5;
      } else {
        shockMatOuter.opacity = 0;
        shockMatInner.opacity = 0;
        ringMat.opacity = 0;
      }

      let vaporOpacity = 0;
      if (currentMach > 0.95 && currentMach < 1.05) { 
        vaporOpacity = 1.0 - Math.abs(currentMach - 1.0) * 10.0; 
        vaporOpacity = Math.max(0, vaporOpacity) * 0.4; 
      } 
      vaporMat.opacity = vaporOpacity; 
       
      const positions = flowSystem.geometry.attributes.position.array; 
      const colors = flowSystem.geometry.attributes.color.array; 
      const cosPitch = Math.cos(f7aGroup.rotation.z); 
      const sinPitch = Math.sin(f7aGroup.rotation.z); 
      const cosRoll = Math.cos(f7aGroup.rotation.x); 
      const sinRoll = Math.sin(f7aGroup.rotation.x); 
      const speedBase = currentMach * 1.5 + 0.4; 
      
      const isSupersonic = currentMach >= 1.0;
      const shockConeTan = isSupersonic ? Math.tan(Math.asin(1 / Math.max(currentMach, 1.001))) : 0;

      for (let i = 0; i < activeLineCount; i++) { 
        const idx0 = i * 6;
        let x = positions[idx0], y = positions[idx0 + 1], z = positions[idx0 + 2]; 
        let vx = -speedBase, vy = 0, vz = 0;
        let turbulent = false, heated = false, impact = false; 
        
        let tempX = x * cosPitch + y * sinPitch;
        let tempY = -x * sinPitch + y * cosPitch;
        let tempZ = z;
        
        const localX = tempX; 
        const localY = tempY * cosRoll + tempZ * sinRoll; 
        const localZ = -tempY * sinRoll + tempZ * cosRoll; 
        let deflect_y = 0, deflect_z = 0; 
        
        if (localX > -3.5 && localX < 4.5) { 
          let bodyRadius = 0.45; 
          if (localX > 1.5) {
            bodyRadius = Math.max(0.01, (3.5 - localX) * 0.22); 
          }

          const distSq = localY * localY + localZ * localZ;

          let wingInfluence = 0;
          const absLocalZ = localZ < 0 ? -localZ : localZ;
          const absLocalY = localY < 0 ? -localY : localY;

          if (localX < 0.5 && localX > -2.0 && absLocalZ < 3.0 && absLocalY < 0.8) { 
            wingInfluence = (3.0 - absLocalZ) * 0.25; 
          } 
          const envelope = bodyRadius > wingInfluence ? bodyRadius : wingInfluence;
          const envPlusOne = envelope + 1.0;
          
          if (distSq < envPlusOne * envPlusOne && distSq > 0.0001) {
            const distScale = Math.sqrt(distSq);
            const push = (envPlusOne - distScale) * (speedBase * 0.5);
            const invDist = 1.0 / distScale;
            deflect_y += (localY * invDist) * push;
            deflect_z += (localZ * invDist) * push;

            if (localY > 0 && localX < 0) { deflect_y -= currentAoa * 0.02; } 
            
            if (distScale < envelope + 0.15) { 
              impact = true; 
              deflect_y += (fastRandom() - 0.5) * speedBase * 1.5; 
              deflect_z += (fastRandom() - 0.5) * speedBase * 1.5;
              vx += speedBase * 0.6; 
            } 
          } 
          
          if (isSupersonic) {
            const shockConeRadius = (3.5 - localX) * shockConeTan;
            if (localX < 3.5 && distSq < shockConeRadius * shockConeRadius) {
              const distScale = Math.sqrt(distSq);
              if (distScale > shockConeRadius - 0.6) heated = true;
            }
          }

          if (localX < -1.5) { 
            const isWakeZone = absLocalY < 2.0 && absLocalZ < 3.0; 
            if (isWakeZone) { 
              let wakeIntensity = currentStall ? 2.5 : (isSupersonic ? 0.4 : 0.05);
              if (currentAoa > 15 && localY > 0) wakeIntensity += (currentAoa - 15) * 0.08;
              if (wakeIntensity > 0.1) {
                deflect_y += (fastRandom() - 0.5) * wakeIntensity;
                deflect_z += (fastRandom() - 0.5) * wakeIntensity;
                if (wakeIntensity > 1.0) turbulent = true;
              }
            }
          }
        }

        let world_deflect_y = deflect_y * cosRoll - deflect_z * sinRoll;
        let world_deflect_z = deflect_y * sinRoll + deflect_z * cosRoll;

        vx += world_deflect_y * (-sinPitch); 
        vy += world_deflect_y * cosPitch; 
        vz += world_deflect_z;
        x += vx; 
        y += vy; 
        z += vz;

        const absY = y < 0 ? -y : y;
        const absZ = z < 0 ? -z : z;

        if (x < -20 || absY > 20 || absZ > 20) {
          x = 20 + fastRandom() * 5; 
          y = (fastRandom() - 0.5) * 30; 
          z = (fastRandom() - 0.5) * 30;
          positions[idx0 + 3] = x; 
          positions[idx0 + 4] = y; 
          positions[idx0 + 5] = z;
        }

        positions[idx0] = x; 
        positions[idx0 + 1] = y; 
        positions[idx0 + 2] = z;
        const tailSpeed = 0.4;
        positions[idx0 + 3] += (x - positions[idx0 + 3]) * tailSpeed;
        positions[idx0 + 4] += (y - positions[idx0 + 4]) * tailSpeed;
        positions[idx0 + 5] += (z - positions[idx0 + 5]) * tailSpeed;

        let r = 0.0, g = 0.8, b = 0.9;
        if (impact) {
          r = 1.0; g = 0.85; b = 0.3;
        } else if (currentStall && turbulent) {
          r = 0.9; g = 0.2; b = 0.0;
        } else if (heated) {
          r = 1.0; g = 1.0; b = 1.0;
        }

        colors[idx0] = r; 
        colors[idx0 + 1] = g; 
        colors[idx0 + 2] = b;

        if (impact) {
          colors[idx0 + 3] = r * 0.5; 
          colors[idx0 + 4] = g * 0.5; 
          colors[idx0 + 5] = b * 0.5;
        } else {
          colors[idx0 + 3] = r * 0.1; 
          colors[idx0 + 4] = g * 0.1; 
          colors[idx0 + 5] = b * 0.1;
        }
      }
      
      if (!isReducedMotion || Date.now() % 2 === 0) {
        flowSystem.geometry.attributes.position.needsUpdate = true;
        flowSystem.geometry.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !renderer) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('wheel', handleWheel);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      scene.clear();
    };
  }, [webglError, isReducedMotion]);

  return { mountRef, webglError };
};
