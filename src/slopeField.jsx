import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function SlopeField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });

    camera.position.z = 5;

    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x444444);
    scene.add(gridHelper);

    const vectorField = (x, y) => {
      const dx = x + y;
      const dy = x + y;
      return new THREE.Vector3(dx, dy, 0).normalize();
    };

    const numVectors = 20;
    for (let i = -numVectors; i <= numVectors; i++) {
      for (let j = -numVectors; j <= numVectors; j++) {
        const x = i / numVectors * 5;
        const y = j / numVectors * 5;
        const vector = vectorField(x, y);
        const arrowHelper = new THREE.ArrowHelper(vector, new THREE.Vector3(x, y, 0), 0.2, 0x0000ff);
        scene.add(arrowHelper);
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <canvas ref={canvasRef} style={{ width: 800, height: 600 }} />
  );
}

export default SlopeField;