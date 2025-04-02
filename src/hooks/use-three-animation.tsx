
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Hook for animating a Three.js object with GSAP
export const useThreeAnimation = (
  initialValues?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  },
  animationDuration = 0.5
) => {
  const ref = useRef<THREE.Object3D>(null);
  
  useEffect(() => {
    if (!ref.current || !initialValues) return;
    
    const { position, rotation, scale } = initialValues;
    
    // Apply initial values
    if (position) {
      ref.current.position.set(position[0], position[1], position[2]);
    }
    
    if (rotation) {
      ref.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
    
    if (scale) {
      ref.current.scale.set(scale[0], scale[1], scale[2]);
    }
    
    // Animate to final position
    gsap.to(ref.current.position, {
      x: position ? 0 : ref.current.position.x,
      y: position ? 0 : ref.current.position.y,
      z: position ? 0 : ref.current.position.z,
      duration: animationDuration,
      ease: "back.out(1.7)"
    });
    
    gsap.to(ref.current.rotation, {
      x: rotation ? 0 : ref.current.rotation.x,
      y: rotation ? 0 : ref.current.rotation.y,
      z: rotation ? 0 : ref.current.rotation.z,
      duration: animationDuration,
      ease: "power2.out"
    });
    
    gsap.to(ref.current.scale, {
      x: scale ? 1 : ref.current.scale.x,
      y: scale ? 1 : ref.current.scale.y,
      z: scale ? 1 : ref.current.scale.z,
      duration: animationDuration,
      ease: "elastic.out(1, 0.3)"
    });
  }, []);
  
  return ref;
};

// Hook for applying floating animation to a Three.js object
export const useFloatingAnimation = (
  amplitude = 0.1,
  frequency = 1,
  uniqueOffset = 0,
  enabled = true
) => {
  const ref = useRef<THREE.Object3D>(null);
  const initialY = useRef<number>(0);
  
  useEffect(() => {
    if (ref.current) {
      initialY.current = ref.current.position.y;
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (!ref.current || !enabled) return;
    
    const time = clock.getElapsedTime();
    const y = initialY.current + Math.sin(time * frequency + uniqueOffset) * amplitude;
    
    ref.current.position.y = y;
  });
  
  return ref;
};

// Hook for applying hover effects
export const useHoverEffect = (
  onHover?: () => void,
  onLeave?: () => void,
  hoverScale: [number, number, number] = [1.2, 1.2, 1.2]
) => {
  const ref = useRef<THREE.Mesh>(null);
  
  const handlePointerOver = () => {
    if (!ref.current) return;
    
    gsap.to(ref.current.scale, {
      x: hoverScale[0],
      y: hoverScale[1],
      z: hoverScale[2],
      duration: 0.3,
      ease: "back.out(1.7)"
    });
    
    if (onHover) onHover();
  };
  
  const handlePointerOut = () => {
    if (!ref.current) return;
    
    gsap.to(ref.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.2,
      ease: "power2.out"
    });
    
    if (onLeave) onLeave();
  };
  
  return { ref, handlePointerOver, handlePointerOut };
};

export default {
  useThreeAnimation,
  useFloatingAnimation,
  useHoverEffect
};
