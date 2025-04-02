
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useThreeAnimation, useFloatingAnimation } from "@/hooks/use-three-animation";

// 3D trophy placeholder during loading
const TrophyModel: React.FC = () => {
  const baseRef = useThreeAnimation({ 
    position: [0, -5, 0], 
    rotation: [0, -Math.PI / 4, 0],
    scale: [0, 0, 0]
  }, 1);
  
  const cupRef = useFloatingAnimation(0.1, 0.8, 0);
  const handleRef = useFloatingAnimation(0.05, 1, 2);
  
  // Trophy colors
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#FFD700"),
    metalness: 0.8,
    roughness: 0.2,
  });
  
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#8B4513"),
    metalness: 0.4,
    roughness: 0.6,
  });

  return (
    <group ref={baseRef}>
      {/* Trophy cup */}
      <group ref={cupRef}>
        <mesh position={[0, 1.2, 0]} material={goldMaterial}>
          <cylinderGeometry args={[0.6, 0.8, 0.4, 32]} />
        </mesh>
        <mesh position={[0, 0.8, 0]} material={goldMaterial}>
          <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={goldMaterial}>
          <cylinderGeometry args={[0.2, 0.5, 0.4, 32]} />
        </mesh>
      </group>
      
      {/* Trophy handles */}
      <group ref={handleRef}>
        <mesh position={[0.7, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} material={goldMaterial}>
          <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        </mesh>
        <mesh position={[-0.7, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} material={goldMaterial}>
          <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        </mesh>
      </group>
      
      {/* Trophy base */}
      <mesh position={[0, 0, 0]} material={baseMaterial}>
        <cylinderGeometry args={[0.3, 0.6, 0.2, 32]} />
      </mesh>
      <mesh position={[0, -0.2, 0]} material={baseMaterial}>
        <boxGeometry args={[1.2, 0.2, 0.8]} />
      </mesh>
    </group>
  );
};

// 3D medal placeholders
const MedalModel: React.FC<{
  position: [number, number, number];
  color: string;
  rank: number;
  delay: number;
}> = ({ position, color, rank, delay }) => {
  const medalRef = useThreeAnimation({ 
    position: [position[0], position[1] - 3, position[2]], 
    scale: [0, 0, 0] 
  }, 0.8 + delay * 0.5);
  
  const floatingRef = useFloatingAnimation(0.1, 0.5, rank * 2, true);
  
  const medalMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.8,
    roughness: 0.2,
  });
  
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#" + ((rank === 1) ? "0000FF" : (rank === 2) ? "FF0000" : "00FF00")),
    metalness: 0.1,
    roughness: 0.8,
  });

  return (
    <group ref={medalRef}>
      <group ref={floatingRef}>
        {/* Medal body */}
        <mesh position={[0, 0, 0]} material={medalMaterial}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
        </mesh>
        
        {/* Medal rim */}
        <mesh position={[0, 0, 0]} material={medalMaterial}>
          <torusGeometry args={[0.7, 0.08, 16, 32]} />
        </mesh>
        
        {/* Medal ribbon */}
        <mesh position={[0, 0.7, -0.05]} material={ribbonMaterial}>
          <boxGeometry args={[0.3, 0.8, 0.05]} />
        </mesh>
        
        {/* Rank number */}
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.5}
          color="#ffffff"
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          {rank}
        </Text>
      </group>
    </group>
  );
};

// Loading text
const LoadingText: React.FC = () => {
  const textRef = useThreeAnimation({ 
    position: [0, -3, 0],
    scale: [0.5, 0.5, 0.5]
  });
  
  return (
    <group ref={textRef}>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        font="/fonts/Inter-Regular.woff"
        anchorX="center"
        anchorY="middle"
      >
        Загрузка рейтинга...
      </Text>
    </group>
  );
};

// Main loading scene
const LoadingScene: React.FC = () => {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
      
      <TrophyModel />
      <MedalModel position={[-2, 0, 0]} color="#C0C0C0" rank={2} delay={0.2} />
      <MedalModel position={[2, 0, 0]} color="#CD7F32" rank={3} delay={0.4} />
      <LoadingText />
    </>
  );
};

// Main component
const LeaderboardLoading: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-60 sm:h-80 rounded-lg shadow-inner overflow-hidden bg-gradient-to-b from-blue-900/20 to-indigo-900/30"
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <LoadingScene />
      </Canvas>
      
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardLoading;
