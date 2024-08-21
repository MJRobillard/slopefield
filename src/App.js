import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { Canvas } from '@react-three/fiber';
import SlopeField from './SlopeField'; // Import the SlopeField component
import 'antd/dist/reset.css'; // Import Ant Design styles

function App() {
  const [visible, setVisible] = useState(true);

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
        width={400} // Adjust width as needed
      >
        <p>left click to start manual control</p>
        <ul>
          <li>Use the mouse to rotate the view.</li>
          <li>Scroll to zoom in and out.</li>
          <li>Click and drag to move around.</li>
          <li>Use the controls in the bottom right to adjust settings.</li>
          {/* Add more instructions as needed */}
        </ul>
      </Drawer>
    </div>
  );
}

export default App;
