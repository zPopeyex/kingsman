// web/apps/src/three/Object3D.tsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface Object3DProps {
  className?: string;
}

const Object3D: React.FC<Object3DProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuración básica de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    // Configurar renderer
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Montar en el DOM
    mountRef.current.appendChild(renderer.domElement);

    // Crear objeto 3D (navaja estilizada con primitivas)
    const razorGroup = new THREE.Group();

    // Mango de la navaja
    const handleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 1.5, 8);
    const handleMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513,
      shininess: 30,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.75;
    handle.castShadow = true;
    razorGroup.add(handle);

    // Hoja de la navaja
    const bladeGeometry = new THREE.BoxGeometry(0.05, 1.2, 0.02);
    const bladeMaterial = new THREE.MeshPhongMaterial({
      color: 0xc0c0c0,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.y = 0.6;
    blade.position.x = 0.1;
    blade.castShadow = true;
    razorGroup.add(blade);

    // Detalles dorados
    const detailGeometry = new THREE.RingGeometry(0.08, 0.12, 8);
    const detailMaterial = new THREE.MeshPhongMaterial({
      color: 0xd4af37,
      shininess: 80,
    });
    const detail = new THREE.Mesh(detailGeometry, detailMaterial);
    detail.position.y = -0.2;
    detail.rotation.x = Math.PI / 2;
    razorGroup.add(detail);

    // Posición inicial
    razorGroup.position.set(0, 0, 0);
    razorGroup.rotation.set(0.2, 0, 0.1);
    scene.add(razorGroup);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xd4af37, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-5, 5, 2);
    scene.add(pointLight);

    // Posición de cámara
    camera.position.z = 3;
    camera.position.y = 0.5;

    // Referencias
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    objectRef.current = razorGroup;

    // Animación de render loop
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current)
        return;

      // Oscilación suave
      const time = Date.now() * 0.001;
      if (objectRef.current) {
        objectRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        objectRef.current.position.y = Math.sin(time * 0.3) * 0.05;

        // Parallax manual con scroll
        const scrollY = window.scrollY;
        objectRef.current.position.z = scrollY * 0.001; // Traslación Z con scroll

        // Color dorado en hover
        if (isHovered) {
          const materials = [handleMaterial, bladeMaterial, detailMaterial];
          materials.forEach((mat) => {
            if (mat.color) {
              mat.color.lerp(new THREE.Color(0xd4af37), 0.05);
            }
          });
        } else {
          // Volver a colores originales
          handleMaterial.color.lerp(new THREE.Color(0x8b4513), 0.05);
          bladeMaterial.color.lerp(new THREE.Color(0xc0c0c0), 0.05);
          detailMaterial.color.lerp(new THREE.Color(0xd4af37), 0.05);
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // El scroll parallax se maneja manualmente en el animate loop
    // No usar scrollManager.createParallax con Vector3

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      // Limpiar geometrías y materiales
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [isHovered]);

  // Pausar animación cuando no es visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
      } else {
        // Reiniciar animación si está visible
        const animate = () => {
          if (!sceneRef.current || !rendererRef.current || !cameraRef.current)
            return;

          const time = Date.now() * 0.001;
          if (objectRef.current) {
            objectRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
            objectRef.current.position.y = Math.sin(time * 0.3) * 0.05;

            // Mantener parallax con scroll
            const scrollY = window.scrollY;
            objectRef.current.position.z = scrollY * 0.001;
          }

          rendererRef.current.render(sceneRef.current, cameraRef.current);
          frameIdRef.current = requestAnimationFrame(animate);
        };
        animate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: "drop-shadow(0 10px 20px rgba(212, 175, 55, 0.3))",
      }}
    />
  );
};

export default Object3D;
