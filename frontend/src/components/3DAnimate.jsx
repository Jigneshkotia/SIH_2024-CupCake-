import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = ({ scale,position }) => {
  const { scene } = useGLTF('./last.glb');
  return <primitive object={scene} scale={scale} position={position} />;
};

const ThreeDAnimate = () => {
    return (
        <Canvas>
          <ambientLight intensity={1.5} /> ̰
          <directionalLight position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <Model scale={[5,5,5]} position={[0,-6,0]} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      );
}

export default ThreeDAnimate

