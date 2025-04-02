
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  colorScheme?: 'gold' | 'blue' | 'purple';
}

// Star component that animates on hover
const AnimatedStar: React.FC<{
  position: [number, number, number];
  filled: boolean;
  hovered: boolean;
  index: number;
  colorScheme: string;
  onHover: (index: number) => void;
  onLeave: () => void;
}> = ({ position, filled, hovered, index, colorScheme, onHover, onLeave }) => {
  const starRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Color mapping based on the colorScheme
  const getColors = () => {
    switch (colorScheme) {
      case 'gold':
        return { 
          base: '#FFD700', 
          glow: '#FFA500',
          empty: '#C0C0C0' 
        };
      case 'blue':
        return { 
          base: '#00BFFF', 
          glow: '#0088FF',
          empty: '#A0CFFF' 
        };
      case 'purple':
        return { 
          base: '#9B87F5', 
          glow: '#7E69AB',
          empty: '#D6BCFA' 
        };
      default:
        return { 
          base: '#FFD700', 
          glow: '#FFA500',
          empty: '#C0C0C0' 
        };
    }
  };

  const colors = getColors();
  
  // Animation effects
  useEffect(() => {
    if (!starRef.current) return;
    
    if (hovered) {
      gsap.to(starRef.current.scale, { 
        x: 1.3, 
        y: 1.3, 
        z: 1.3, 
        duration: 0.3, 
        ease: "back.out(1.7)" 
      });
      gsap.to(starRef.current.rotation, { 
        z: THREE.MathUtils.degToRad(15), 
        duration: 0.4,
        ease: "elastic.out(1, 0.3)" 
      });
    } else {
      gsap.to(starRef.current.scale, { 
        x: 1, 
        y: 1, 
        z: 1, 
        duration: 0.2 
      });
      gsap.to(starRef.current.rotation, { 
        z: 0, 
        duration: 0.3 
      });
    }
  }, [hovered]);

  // Initial animation when component mounts
  useEffect(() => {
    if (!starRef.current) return;
    
    // Start from below and "float" up
    starRef.current.position.y = -0.5;
    
    gsap.to(starRef.current.position, {
      y: position[1],
      duration: 0.5 + index * 0.1,
      ease: "back.out(1.7)",
      delay: index * 0.05
    });
    
    // Start small and grow
    starRef.current.scale.set(0.1, 0.1, 0.1);
    
    gsap.to(starRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
      delay: 0.2 + index * 0.07
    });
  }, []);

  // Gentle floating animation
  useFrame((state) => {
    if (!starRef.current) return;
    
    if (!hovered) {
      const t = state.clock.getElapsedTime();
      starRef.current.position.y = position[1] + Math.sin(t * 1.5 + index) * 0.02;
    }
  });

  // Create a star shape
  const createStarShape = () => {
    const shape = new THREE.Shape();
    const outerRadius = 0.5;
    const innerRadius = 0.2;
    const points = 5;
    const angleStep = Math.PI / points;
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep;
      
      if (i === 0) {
        shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      } else {
        shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
    }
    
    shape.closePath();
    return shape;
  };

  // Create star geometry
  const starShape = createStarShape();
  const geometry = new THREE.ShapeGeometry(starShape);

  return (
    <mesh
      ref={starRef}
      position={position}
      onPointerOver={() => onHover(index)}
      onPointerOut={onLeave}
    >
      <shapeGeometry args={[starShape]} />
      <meshStandardMaterial 
        color={filled ? colors.base : colors.empty} 
        emissive={hovered ? colors.glow : 'black'}
        emissiveIntensity={hovered ? 0.8 : 0}
        roughness={0.3}
        metalness={filled ? 0.7 : 0.3}
      />
    </mesh>
  );
};

// Particle system that forms when clicking on stars
const ParticleEffects: React.FC<{
  position: [number, number, number];
  color: string;
  active: boolean;
}> = ({ position, color, active }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Float32Array | null>(null);
  
  // Create particles
  useEffect(() => {
    if (!active) return;
    
    const particleCount = 50;
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = position[0];
      particlePositions[i3 + 1] = position[1];
      particlePositions[i3 + 2] = position[2];
    }
    
    setParticles(particlePositions);
    
    // Animate particles flying outward
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2; 
        const z = (Math.random() - 0.5) * 0.5;
        
        gsap.to(positions.array, {
          [i3]: position[0] + x,
          [i3 + 1]: position[1] + y,
          [i3 + 2]: position[2] + z,
          duration: 0.8 + Math.random() * 0.5,
          ease: "power2.out",
          onUpdate: () => {
            positions.needsUpdate = true;
          }
        });
      }
      
      // Fade out particles
      gsap.to(particlesRef.current.material, {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, [active]);
  
  if (!particles) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={1}
      />
    </points>
  );
};

// Main scene containing the stars
const RatingScene: React.FC<{
  rating: number;
  maxRating: number;
  colorScheme: string;
}> = ({ rating, maxRating, colorScheme }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [clickedStar, setClickedStar] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Place stars based on max rating
  const starPositions: [number, number, number][] = [];
  const starSpacing = 1.2;
  const startX = -((maxRating - 1) * starSpacing) / 2;
  
  for (let i = 0; i < maxRating; i++) {
    starPositions.push([startX + i * starSpacing, 0, 0]);
  }
  
  const handleStarHover = (index: number) => {
    setHoveredStar(index);
  };
  
  const handleStarLeave = () => {
    setHoveredStar(null);
  };
  
  return (
    <group ref={groupRef}>
      {/* Background stars effect */}
      <Stars radius={20} depth={50} count={500} factor={2} fade speed={1} />
      
      {/* Rating stars */}
      {starPositions.map((position, index) => (
        <React.Fragment key={index}>
          <AnimatedStar
            position={position}
            filled={index < rating}
            hovered={hoveredStar !== null && index <= hoveredStar}
            index={index}
            colorScheme={colorScheme}
            onHover={handleStarHover}
            onLeave={handleStarLeave}
          />
          <ParticleEffects
            position={position}
            color={colorScheme === 'gold' ? '#FFD700' : colorScheme === 'blue' ? '#00BFFF' : '#9B87F5'}
            active={clickedStar === index}
          />
        </React.Fragment>
      ))}
      
      {/* Show rating text */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {rating.toFixed(1)}
      </Text>
    </group>
  );
};

// Wrapper component with canvas
const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  colorScheme = 'gold'
}) => {
  // Determine canvas height based on size prop
  const getCanvasHeight = () => {
    switch (size) {
      case 'sm': return 80;
      case 'md': return 120;
      case 'lg': return 180;
      default: return 120;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden rounded-lg"
      style={{ height: getCanvasHeight() }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <RatingScene rating={rating} maxRating={maxRating} colorScheme={colorScheme} />
      </Canvas>
      
      {showValue && (
        <div className="text-center mt-1">
          <span className="text-sm font-medium">{rating.toFixed(1)} / {maxRating}</span>
        </div>
      )}
    </motion.div>
  );
};

export default RatingStars;
