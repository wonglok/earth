import React, { Suspense } from 'react';
import './style.css';
import { Canvas } from '@react-three/fiber';
import { GlobeWithHeight } from './GlobeWithHeight.js';
import { CameraAdjust } from './CameraAdjust.js';
import { MyOrbitControls } from './MyOrbitControls.js';

export default function App() {
  return (
    <Canvas style={{ height: '100vh' }}>
      <Suspense fallback={null}>
        <GlobeWithHeight></GlobeWithHeight>
      </Suspense>
      <CameraAdjust />
      <ambientLight />
      <MyOrbitControls />
      <directionalLight position={[1, 1, 1]} />
    </Canvas>
  );
}
