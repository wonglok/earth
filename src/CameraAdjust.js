import React, { useEffect } from 'react';
import { PointLight } from 'three';
import { useThree } from '@react-three/fiber';
export function CameraAdjust() {
  let { camera } = useThree();
  useEffect(() => {
    camera.position.z = 50;
    let light = new PointLight(0xffffff, 100, 100);
    camera.add(light);
  });
  return <group></group>;
}
