// src/Components/ProfessorModel.jsx
import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function ProfessorModel(props) {
  const { scene, animations } = useGLTF("../../public/professor.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const firstAction = Object.values(actions)[0];
    if (firstAction) {
      firstAction.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return <primitive object={scene} {...props} />;
}
