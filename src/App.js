import React, { Suspense } from "react";
import "./style.css";
import { Canvas } from "@react-three/fiber";
import { GlobeWithHeight } from "./GlobeWithHeight.js";
import { CameraAdjust } from "./CameraAdjust.js";
import { MyOrbitControls } from "./MyOrbitControls.js";
import { ParsB } from "./ParsB.js";
import { Bloom } from "./Bloom.jsx";

export default function App() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <Suspense fallback={null}>
        <GlobeWithHeight></GlobeWithHeight>
        <ParsB></ParsB>
      </Suspense>
      <Bloom></Bloom>
      <CameraAdjust />
      {/* <ambientLight /> */}
      <MyOrbitControls />
      {/* <directionalLight position={[1, 1, 1]} /> */}
    </Canvas>
  );
}
