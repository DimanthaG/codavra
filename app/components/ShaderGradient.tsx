'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;

  // Hash function for consistent noise
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  // Smooth circle function with fade
  float circle(vec2 uv, float radius, float softness) {
    float d = length(uv);
    return smoothstep(radius, radius - softness, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 centeredUv = uv * 2.0 - 1.0;
    centeredUv.x *= resolution.x / resolution.y;
    
    // Base gradient - deep red to orange
    vec3 topColor = vec3(0.4, 0.05, 0.05);     // Deep red
    vec3 bottomColor = vec3(0.6, 0.25, 0.05);  // Deep orange
    vec3 color = mix(topColor, bottomColor, pow(uv.y, 1.3));
    
    // Breathing animation for central circle
    float breathe = sin(time * 0.8) * 0.5 + 0.5; // much faster breathing
    float breatheExp = pow(breathe, 0.5);
    // Move the circle up as it breathes
    centeredUv.y += breatheExp * 0.08;
    // Make the circle shrink to about 50% of its max size
    float minRadius = 0.5; // 50% of max
    float maxRadius = 1.008;
    float radius = mix(minRadius, maxRadius, breatheExp);
    float blackCircle = circle(centeredUv, radius, 0.6);
    
    // Apply black circle - darker in the center
    vec3 darkCenter = vec3(0.05, 0.02, 0.04);
    color = mix(color, darkCenter, blackCircle * 0.8);
    
    // Apply subtle noise texture for glass effect
    float noise = hash(uv * 200.0) * 0.01;
    
    // Add glass texture to the entire scene
    float glassTexture = 0.0;
    for (int i = 0; i < 5; i++) {
      vec2 glassUv = uv * float(i + 1) * 5.0;
      glassTexture += smoothstep(0.4, 0.6, hash(glassUv)) * 0.003;
    }
    
    // Add subtle wave distortion for more visual interest
    float waveEffect = sin(centeredUv.y * 15.0 + time * 0.2) * 0.003;
    
    // Combine glass texture effects
    color += vec3(noise + glassTexture + waveEffect) * (1.0 + breatheExp * 0.1);
    
    // Add vignette
    float vignette = 1.0 - length((uv - 0.5) * vec2(1.8, 1.2)) * 0.35;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export default function ShaderGradient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    const clock = new THREE.Clock();
    
    // Create shader material
    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() }
    };
    
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms,
    });
    
    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.set(width, height);
    };
    
    // Initial setup
    handleResize();
    containerRef.current.appendChild(renderer.domElement);
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    }
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 hero-gradient"
    />
  );
} 