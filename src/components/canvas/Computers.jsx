import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useAnimations, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const { animations, scene } = useGLTF("./desktop_pc/scene.gltf");
  const hasAnimations = animations && animations.length > 0;
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (hasAnimations) {
      console.log("Model contains animations:", animations);
      // Mainkan animasi dengan nama "Take 001"
      if (actions["Take 001"]) {
        actions["Take 001"].play();
      }
    } else {
      console.log("Model does not contain any animations.");
    }
  }, [hasAnimations, animations, actions]);

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      <pointLight intensity={1} />
      <primitive
        object={scene}
        scale={isMobile ? 2 : 2}
        position={isMobile ? [3, -1, -2.2] : [3, -1, -1.5]}
        rotation={[0.2, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Tambahkan listener untuk perubahan ukuran layar
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Atur nilai awal variabel state `isMobile`
    setIsMobile(mediaQuery.matches);

    // Tentukan fungsi callback untuk menangani perubahan pada media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Tambahkan fungsi callback sebagai listener untuk perubahan media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Hapus listener saat komponen tidak lagi digunakan
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas frameloop="demand" shadows dpr={[1, 2]} camera={{ position: [20, 3, 5], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
