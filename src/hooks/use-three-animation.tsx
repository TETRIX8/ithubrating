
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Hook for animating a Three.js object with GSAP
export const useThreeAnimation = <T extends THREE.Object3D>(
  initialValues?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  },
  animationDuration = 0.5
) => {
  const ref = useRef<T>(null);
  
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
export const useFloatingAnimation = <T extends THREE.Object3D>(
  amplitude = 0.1,
  frequency = 1,
  uniqueOffset = 0,
  enabled = true
) => {
  const ref = useRef<T>(null);
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
export const useHoverEffect = <T extends THREE.Mesh>(
  onHover?: () => void,
  onLeave?: () => void,
  hoverScale: [number, number, number] = [1.2, 1.2, 1.2]
) => {
  const ref = useRef<T>(null);
  
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

// Hook for chaotic to ordered particle animation
export const useParticleAnimation = (
  targetPositions: THREE.Vector3[],
  animationDuration: number = 5,
  chaosAmount: number = 5
) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useRef(new THREE.Object3D()).current;
  const initialPositions = useRef<THREE.Vector3[]>([]);
  const chaoticPositions = useRef<THREE.Vector3[]>([]);
  const animationStarted = useRef(false);
  const dummy = useRef(new THREE.Object3D()).current;
  
  // Initialize particles with random chaotic positions
  useEffect(() => {
    if (!particlesRef.current || targetPositions.length === 0) return;
    
    // Store target positions
    initialPositions.current = targetPositions.map(pos => pos.clone());
    
    // Generate chaotic positions
    chaoticPositions.current = targetPositions.map(pos => {
      const chaosVector = new THREE.Vector3(
        (Math.random() - 0.5) * chaosAmount,
        (Math.random() - 0.5) * chaosAmount,
        (Math.random() - 0.5) * chaosAmount
      );
      return pos.clone().add(chaosVector);
    });
    
    // Set initial chaotic positions
    for (let i = 0; i < targetPositions.length; i++) {
      const pos = chaoticPositions.current[i];
      dummy.position.set(pos.x, pos.y, pos.z);
      // Add random rotation for more chaos
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      // Random scale for more visual interest
      const scale = 0.5 + Math.random() * 1;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    }
    particlesRef.current.instanceMatrix.needsUpdate = true;
    
    // Start animation after a delay
    setTimeout(() => {
      animationStarted.current = true;
    }, 100);
  }, [targetPositions, chaosAmount]);
  
  // Animate particles from chaos to order
  useFrame(({ clock }) => {
    if (!particlesRef.current || !animationStarted.current) return;
    
    const elapsedTime = clock.getElapsedTime();
    const count = particlesRef.current.count;
    let allSettled = true;
    
    for (let i = 0; i < count; i++) {
      particlesRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      
      if (elapsedTime < animationDuration) {
        allSettled = false;
        
        // During chaotic phase (first 5 seconds)
        if (elapsedTime < 4) {
          // Random movement
          dummy.position.x += (Math.random() - 0.5) * 0.05;
          dummy.position.y += (Math.random() - 0.5) * 0.05;
          dummy.position.z += (Math.random() - 0.5) * 0.05;
          
          // Rotating spheres
          dummy.rotation.x += 0.01;
          dummy.rotation.y += 0.01;
        } else {
          // Transition phase - begin moving toward target
          const targetPos = initialPositions.current[i];
          const progress = (elapsedTime - 4) / 1; // 1 second transition
          
          dummy.position.lerp(targetPos, 0.05);
          
          // Normalize scale and rotation
          dummy.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          dummy.rotation.x *= 0.95;
          dummy.rotation.y *= 0.95;
          dummy.rotation.z *= 0.95;
        }
      } else {
        // Final alignment to exact position
        const targetPos = initialPositions.current[i];
        dummy.position.lerp(targetPos, 0.2);
        dummy.scale.lerp(new THREE.Vector3(1, 1, 1), 0.2);
        
        // Check if this particle is still moving
        if (dummy.position.distanceTo(targetPos) > 0.01) {
          allSettled = false;
        }
      }
      
      dummy.updateMatrix();
      particlesRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    particlesRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return particlesRef;
};

export default {
  useThreeAnimation,
  useFloatingAnimation,
  useHoverEffect,
  useParticleAnimation
};
