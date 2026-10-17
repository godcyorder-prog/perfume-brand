"use client";
import { Canvas } from "@react-three/fiber";
import { Float, Environment, OrbitControls } from "@react-three/drei";

function Bottle() {
  return <Float speed={1.2} rotationIntensity={0.14} floatIntensity={0.3}><group rotation={[0, -.22, 0]}>
    <mesh position={[0, -.12, 0]} castShadow><boxGeometry args={[1.08, 1.28, .54, 4, 4, 4]}/><meshPhysicalMaterial color="#c9a96b" roughness={.19} metalness={.32} transmission={.16} thickness={.6} clearcoat={1} clearcoatRoughness={.12}/></mesh>
    <mesh position={[0, -.1, .279]}><planeGeometry args={[.76, .62]}/><meshStandardMaterial color="#e2c886" roughness={.62} metalness={.12}/></mesh>
    <mesh position={[0, -.1, .291]}><planeGeometry args={[.71, .57]}/><meshStandardMaterial color="#8a7045" roughness={.6}/></mesh>
    <mesh position={[0, -.1, .3]}><planeGeometry args={[.65, .51]}/><meshStandardMaterial color="#d8c28e" roughness={.68}/></mesh>
    <mesh position={[0, .68, 0]}><cylinderGeometry args={[.19,.19,.18,32]}/><meshStandardMaterial color="#d5b76e" metalness={.7} roughness={.22}/></mesh>
    <mesh position={[0, .89, 0]} castShadow><cylinderGeometry args={[.29,.27,.28,32]}/><meshPhysicalMaterial color="#8e7449" metalness={.82} roughness={.18} clearcoat={1}/></mesh>
    <mesh position={[-.31,.24,.279]}><planeGeometry args={[.025,.76]}/><meshBasicMaterial color="#fff4d0" transparent opacity={.52}/></mesh>
  </group></Float>;
}

export default function BottleScene() {
  return <Canvas camera={{ position: [0, 0, 4], fov: 38 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}><ambientLight intensity={1.6}/><directionalLight position={[3, 4, 4]} intensity={2.4} color="#ffedc4"/><Bottle/><Environment preset="studio"/><OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.2}/></Canvas>;
}
