import React, { useRef, useEffect, useState } from 'react';
import { Drawer, Button } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import webgazer from 'webgazer'; // Import WebGazer.js

function SlopeField() {
  const meshRef = useRef(null);
  const { camera, gl } = useThree();
  const startTime = useRef(Date.now());
  const [userControl, setUserControl] = useState(false);

  const radius = 30;
  const speed = 0.0001; // Adjust the speed of the camera movement

  // Initialize WebGazer and setup the gaze listener
  useEffect(() => {
    webgazer.setGazeListener((data, elapsedTime) => {
      if (data && !userControl) {
        const { x, y } = data;

        // Convert gaze coordinates (x, y) to a range suitable for camera positioning
        const normalizedX = (x / window.innerWidth - 0.5) * 2; // Normalize to range [-1, 1]
        const normalizedY = (y / window.innerHeight - 0.5) * 2;

        // Set camera position or rotation based on gaze data
        camera.position.x = normalizedX * radius;
        camera.position.y = -normalizedY * radius;
        camera.lookAt(0, 0, 0);
      }
    }).begin();

    return () => {
      webgazer.end(); // Cleanup on unmount
    };
  }, [camera, userControl]);

  useEffect(() => {
    camera.position.set(radius, 0, 10);
    camera.up.set(0, 1, 1);
  }, [camera]);

  useFrame(() => {
    if (!userControl) {
      const elapsedTime = (Date.now() - startTime.current) * speed;
      const x = radius * Math.cos(elapsedTime);
      const z = radius * Math.sin(elapsedTime);
      
      camera.position.set(x, 0, z);
      camera.lookAt(0, 0, 0);
    }

    gl.setClearColor(new THREE.Color('#f0f0f0'));
  });

  const handleCanvasClick = () => {
    setUserControl(true);
  };

  const slopeField = [];
  for (let x = -10; x <= 10; x += 1) {
    for (let y = -10; y <= 10; y += 1) {
      for (let z = -10; z <= 10; z += 1) {
        if (x !== 0 && y !== 0 && z !== 0) {
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
    <mesh onClick={handleCanvasClick}>
      {slopeField}
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
        color={['#000000']}
        position={[0, 0, 11]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        Z
      </Text>
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
    </mesh>
  );
}

function App() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Canvas style={{ height: '100%', width: '100%' }}>
          <SlopeField />
        </Canvas>
      </div>
      <Button
        type="primary"
        onClick={showDrawer}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000
        }}
      >
        Instructions
      </Button>
      <Drawer
        title="Instructions"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={'40vw'} // Adjust width as needed
      >
        <p>left click to start manual control</p>
        <ul>
          <li>Use the mouse to rotate the view.</li>
          <li>Scroll to zoom in and out.</li>
          <li>Click and drag to move around.</li>
          <li>Use the controls in the bottom right to adjust settings.</li>
        </ul>
      </Drawer>
    </div>
  );
}

export default App;
