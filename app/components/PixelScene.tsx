'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import { useRef } from 'react';
import { Group, ShaderMaterial } from 'three';
import * as THREE from 'three';
import styles from '../styles/PixelScene.module.css';

// CRT shader material with enhanced effects
const CRTMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(1024, 1024),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {
      // Enhanced screen curvature
      vec2 curved_uv = vUv * 2.0 - 1.0;
      float d = length(curved_uv);
      curved_uv *= 1.0 + d * d * 0.3; // Increased curvature
      curved_uv = curved_uv * 0.5 + 0.5;

      // Check if we're outside the screen
      if (curved_uv.x < 0.0 || curved_uv.x > 1.0 || curved_uv.y < 0.0 || curved_uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // Enhanced scanlines
      float scanline = sin(curved_uv.y * 400.0) * 0.08; // More visible scanlines
      float slow_scan = sin(curved_uv.y * 50.0 + time) * 0.03;

      // Enhanced vertical sync distortion
      float distort = sin(time * 2.0 + curved_uv.y * 10.0) * 0.002;
      curved_uv.x += distort;

      // Random noise
      float noise = fract(sin(dot(curved_uv.xy, vec2(12.9898,78.233))) * 43758.5453);
      noise = noise * 0.015; // Subtle noise

      // Base color (white with blue-green phosphor tint)
      vec4 color = vec4(0.95, 0.97, 1.0, 1.0);

      // Apply enhanced effects
      color.rgb += scanline + slow_scan + noise;
      color.rgb *= 0.85 + 0.15 * sin(curved_uv.x * 3.1415);

      // Enhanced vignette
      float vignette = 1.0 - d * 0.7;
      color.rgb *= vignette;

      // Brightness flicker
      float flicker = 0.97 + 0.03 * sin(time * 10.0);
      color.rgb *= flicker;

      gl_FragColor = color;
    }
  `
);

function PixelComputer() {
  const computerRef = useRef<Group>(null);
  const crtMaterialRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    if (crtMaterialRef.current) {
      crtMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={computerRef}>
      {/* Monitor Frame - Black */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Screen with CRT effect */}
      <mesh position={[0, 1.2, 0.11]} renderOrder={1}>
        <planeGeometry args={[1.8, 1.3]} />
        <primitive object={new CRTMaterial()} ref={crtMaterialRef} transparent />
      </mesh>

      {/* Pixel Art on Screen */}
      <group position={[0, 1.2, 0.12]} renderOrder={2}>
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <mesh
              key={`pixel-${row}-${col}`}
              position={[
                (col - 3.5) * 0.2,
                (row - 3.5) * 0.2,
                0
              ]}
            >
              <boxGeometry args={[0.18, 0.18, 0.01]} />
              <meshStandardMaterial 
                color={Math.random() > 0.7 ? '#000000' : '#FFFFFF'} 
                emissive={Math.random() > 0.7 ? '#000000' : '#FFFFFF'}
                emissiveIntensity={0.3}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Stand - Black */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Base - Black */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Keyboard - Black */}
      <mesh position={[0, 0.15, 0.6]}>
        <boxGeometry args={[1.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

const PixelScene = () => {
  return (
    <div className={styles.container}>
      <Canvas
        className={styles.canvas}
        camera={{
          position: [0, 0, 5],
          fov: 75
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        
        <PixelComputer />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default PixelScene; 