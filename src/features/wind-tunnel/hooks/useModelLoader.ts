import { useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Model loader hook for drag & drop GLTF/GLB files.
 */
export function useModelLoader(
  objectGroup: THREE.Group | null,
  f35Group: THREE.Group | null,
) {
  const setCustomModel = useSimulationStore((s) => s.setCustomModel);
  const setSimParam = useSimulationStore((s) => s.setSimParam);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      if (!objectGroup || !f35Group) return;

      const file = e.dataTransfer?.files[0];
      if (!file || !(file.name.toLowerCase().endsWith('.gltf') || file.name.toLowerCase().endsWith('.glb'))) {
        alert('請上傳有效的 .GLTF 或 .GLB 模型檔案');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const contents = event.target?.result;
        if (!contents) return;

        const loader = new GLTFLoader();
        loader.parse(contents as ArrayBuffer, '', (gltf) => {
          // Remove existing custom model
          const existingCustom = useSimulationStore.getState().customModelGroup;
          if (existingCustom) objectGroup.remove(existingCustom);

          const customGroup = gltf.scene;
          const materials: THREE.Material[] = [];
          customGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
              materials.push((child as THREE.Mesh).material as THREE.Material);
            }
          });

          // Normalize scale
          const box = new THREE.Box3().setFromObject(customGroup);
          const size = box.getSize(new THREE.Vector3()).length();
          const scale = 5.0 / size;
          customGroup.scale.set(scale, scale, scale);

          const center = box.getCenter(new THREE.Vector3());
          customGroup.position.sub(center.multiplyScalar(scale));

          const dimensions = box.getSize(new THREE.Vector3());
          const scaledHalfExtents = dimensions.clone().multiplyScalar(scale * 0.5);

          f35Group.visible = false;
          objectGroup.add(customGroup);

          setCustomModel(customGroup, materials);
          setSimParam({
            objectType: 'custom',
            customSize: { a: scaledHalfExtents.x, b: scaledHalfExtents.y, c: scaledHalfExtents.z },
          });
        });
      };
      reader.readAsArrayBuffer(file);
    },
    [objectGroup, f35Group, setCustomModel, setSimParam],
  );

  useEffect(() => {
    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleDrop]);
}
