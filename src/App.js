import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function SlopeField() {
  const meshRef = useRef(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    camera.position.set(0, -30, 10);
    camera.up.set(0, 5, 3);
  }, [camera]);

  useFrame(() => {
    gl.setClearColor(new THREE.Color('#f0f0f0'));
  });

  const slopeField = [];
  for (let x = -10; x <= 10; x += 1) {
    for (let y = -10; y <= 10; y += 1) {
      for (let z = -10; z <= 10; z += 1) {
        if (x !== 0 && y !== 0 && z !== 0) {
          // More complex equation: dy/dx = x / y, dz/dx = x / z, dz/dy = y / z
          const dx = 0.2;
          const dy = dx * (x / y);
          const dz = dx * (x / z);
          const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const arrow = (
            <mesh
              ref={meshRef}
              key={`${x}-${y}-${z}`}
              position={[x, y, z]}
              rotation={[
                Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)),
                Math.atan2(dy, dx),
                0,
              ]}
            >
              <cylinderGeometry args={[0.01, 0.15, length, 12]} />
              <meshBasicMaterial color={'#000000'} />
            </mesh>
          );
          slopeField.push(arrow);
        }
      }
    }
  }

  return (
    <>
      {slopeField}
      {/* Axes labels */}
      <Text
        scale={[1, 1, 1]}
        color={'#000000'}
        position={[11, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        X
      </Text>
      <Text
      scale={[20, 20, 20]}
        color={'#000000'}
        position={[50, 50, -50]}
        rotation={[Math.PI / 2, 0, 0]}

      >
        dy/dx = x / y, 
        dz/dx = x / z, 
        dz/dy = y / z
      </Text>
      <Text
        scale={[1, 1, 1]}
        color={'#000000'}
        position={[0, 11, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        Y
      </Text>
      <Text
        scale={[1, 1, 1]}
        color={'#000000'}
        position={[0, 0, 11]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        Z
      </Text>
      {/* Grid lines */}
      {[...Array(21).keys()].map((i) => (
        <mesh key={`x-grid-line-${i}`} position={[i - 10, 0, 0]}>
          <boxGeometry args={[0.1, 20, 0.1]} />
          <meshBasicMaterial color={'#cccccc'} />
        </mesh>
      ))}
      {[...Array(21).keys()].map((i) => (
        <mesh key={`y-grid-line-${i}`} position={[0, i - 10, 0]}>
          <boxGeometry args={[20, 0.1, 0.1]} />
          <meshBasicMaterial color={'#cccccc'} />
        </mesh>
      ))}
      {[...Array(21).keys()].map((i) => (
        <mesh key={`z-grid-line-${i}`} position={[0, 0, i - 10]}>
          <boxGeometry args={[0.1, 0.1, 20]} />
          <meshBasicMaterial color={'#0000ff'} />
        </mesh>
      ))}
      <OrbitControls ref={meshRef} enableDamping={false} />
    </>
  );
}

function App() {
  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <SlopeField />
    </Canvas>
  );
}

export default App;