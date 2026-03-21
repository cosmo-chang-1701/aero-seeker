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

  const processFile = useCallback(
    (file: File) => {
      if (!objectGroup || !f35Group) return;

      if (!(file.name.toLowerCase().endsWith('.gltf') || file.name.toLowerCase().endsWith('.glb'))) {
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

          // Most standard GLTF models are facing +Z or -Z. The wind tunnel aligns with the X axis.
          // Rotate by -90 degrees around Y to align the front of the model properly.
          customGroup.rotation.y = -Math.PI / 2;
          customGroup.updateMatrixWorld(true);

          // Calculate bounding box after rotation
          const box = new THREE.Box3().setFromObject(customGroup);
          const size = box.getSize(new THREE.Vector3()).length();
          const scale = 5.0 / size;
          
          // Apply scale
          customGroup.scale.set(scale, scale, scale);
          customGroup.updateMatrixWorld(true);

          // Recalculate center after scaling and rotate to center properly
          const finalBox = new THREE.Box3().setFromObject(customGroup);
          const center = finalBox.getCenter(new THREE.Vector3());
          customGroup.position.sub(center);

          const dimensions = finalBox.getSize(new THREE.Vector3());
          const scaledHalfExtents = dimensions.clone().multiplyScalar(0.5);

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

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile],
  );

  useEffect(() => {
    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }
    
    function handleCustomLoad(e: Event) {
      const customEvent = e as CustomEvent<File>;
      if (customEvent.detail) {
        processFile(customEvent.detail);
      }
    }

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('load-custom-model', handleCustomLoad);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('load-custom-model', handleCustomLoad);
    };
  }, [handleDrop, processFile]);
}
