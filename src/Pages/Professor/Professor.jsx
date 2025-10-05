import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

import ProfessorModel from "../../compontents/ProfessorModel.jsx";

const Professor = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <ProfessorModel scale={1.5} position={[0, -1, 0]} />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default Professor;
