'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import * as THREE from 'three';
import Link from 'next/link';

export default function HeroBanner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const busRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations('hero3d');

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f0804);
    scene.fog = new THREE.Fog(0x0f0804, 60, 180);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    rendererRef.current = renderer;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting Setup - Warm Golden Hour
    const ambientLight = new THREE.AmbientLight(0xffc966, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffb347, 1.4);
    directionalLight.position.set(45, 60, 30);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 150;
    directionalLight.shadow.camera.left = -80;
    directionalLight.shadow.camera.right = 80;
    directionalLight.shadow.camera.top = 80;
    directionalLight.shadow.camera.bottom = -80;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xff9966, 0.5);
    fillLight.position.set(-30, 30, -40);
    scene.add(fillLight);

    // Sky
    const skyGeometry = new THREE.SphereGeometry(300, 64, 64);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a0f08,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d1810,
      roughness: 0.85,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.castShadow = true;
    ground.receiveShadow = true;
    scene.add(ground);

    // ===== BUS MODEL =====
    const busGroup = new THREE.Group();
    busRef.current = busGroup;

    const chassisGeometry = new THREE.BoxGeometry(3.2, 2.8, 9.5);
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4761a,
      roughness: 0.5,
      metalness: 0.5,
    });
    const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassis.position.y = 1.6;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    busGroup.add(chassis);

    const cabinGeometry = new THREE.BoxGeometry(3, 2.4, 2.8);
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: 0xff9933,
      roughness: 0.4,
      metalness: 0.6,
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 3, -3.2);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    busGroup.add(cabin);

    const windshieldGeometry = new THREE.BoxGeometry(2.8, 1.8, 0.3);
    const windshieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90a4,
      roughness: 0.1,
      metalness: 0.8,
      emissive: new THREE.Color(0x1a1a2e),
      emissiveIntensity: 0.3,
    });
    const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
    windshield.position.set(0, 2.8, -4.5);
    windshield.castShadow = true;
    busGroup.add(windshield);

    const windowGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.15);
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a9aad,
      roughness: 0.15,
      metalness: 0.7,
    });
    const windowPositions = [
      [-1.3, 2.4, -0.5],
      [1.3, 2.4, -0.5],
      [-1.3, 2.4, 1.5],
      [1.3, 2.4, 1.5],
    ];
    windowPositions.forEach((pos) => {
      const pane = new THREE.Mesh(windowGeometry, windowMaterial);
      pane.position.set(pos[0], pos[1], pos[2]);
      pane.castShadow = true;
      busGroup.add(pane);
    });

    const roofGeometry = new THREE.BoxGeometry(3.2, 0.5, 9.5);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0xb85c0d,
      roughness: 0.6,
      metalness: 0.4,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3.4;
    roof.castShadow = true;
    busGroup.add(roof);

    const doorGeometry = new THREE.BoxGeometry(1.2, 2.2, 0.2);
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0xa85000,
      roughness: 0.55,
      metalness: 0.45,
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(1.5, 1.5, -0.2);
    door.castShadow = true;
    busGroup.add(door);

    const mirrorGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.8);
    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.1,
      metalness: 0.95,
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(1.75, 2.2, -4.2);
    mirror.castShadow = true;
    busGroup.add(mirror);

    const bumperGeometry = new THREE.BoxGeometry(3.2, 0.4, 0.3);
    const bumperMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.4,
      metalness: 0.8,
    });
    const bumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
    bumper.position.set(0, 0.5, -4.8);
    bumper.castShadow = true;
    busGroup.add(bumper);

    // Wheels (index 8–11 in children, used for rotation)
    const wheelGeometry = new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.7,
    });
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.2,
      metalness: 0.9,
    });
    const wheelPositions = [
      [-1.5, 0.85, -2.5],
      [1.5, 0.85, -2.5],
      [-1.5, 0.85, 2.5],
      [1.5, 0.85, 2.5],
    ];
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      busGroup.add(wheel);

      const rimGeometry = new THREE.TorusGeometry(0.75, 0.15, 16, 8);
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.rotation.y = Math.PI / 2;
      rim.position.set(pos[0], pos[1], pos[2]);
      busGroup.add(rim);
    });

    busGroup.position.set(-20, 0, 25);
    busGroup.rotation.y = Math.PI / 5;
    scene.add(busGroup);

    // ===== EPHESUS PILLARS =====
    const createPillar = (x: number, z: number, height: number, damage: number = 0) => {
      const pillarGroup = new THREE.Group();

      const pillarGeometry = new THREE.CylinderGeometry(0.8, 1, height, 24, 8);
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4a574,
        roughness: 0.75,
        metalness: 0.1,
        flatShading: true,
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.y = height / 2;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      pillarGroup.add(pillar);

      if (damage < 0.7) {
        const capitalGeometry = new THREE.CylinderGeometry(0.95, 0.8, 0.6, 24);
        const capitalMaterial = new THREE.MeshStandardMaterial({
          color: 0xc99566,
          roughness: 0.7,
          metalness: 0.05,
        });
        const capital = new THREE.Mesh(capitalGeometry, capitalMaterial);
        capital.position.y = height + 0.3;
        capital.castShadow = true;
        pillarGroup.add(capital);
      }

      const baseGeometry = new THREE.CylinderGeometry(1.2, 1.3, 0.4, 24);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0xb8956a,
        roughness: 0.8,
        metalness: 0.05,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 0.2;
      base.castShadow = true;
      base.receiveShadow = true;
      pillarGroup.add(base);

      pillarGroup.position.set(x, 0, z);
      scene.add(pillarGroup);
      return pillarGroup;
    };

    createPillar(8, 8, 14, 0.1);
    createPillar(16, 8, 15, 0.2);
    createPillar(24, 10, 13, 0.15);
    createPillar(10, 16, 14.5, 0.3);
    createPillar(20, 18, 12, 0.25);
    createPillar(28, 14, 11, 0.4);

    const brokenGroup = new THREE.Group();
    const brokenGeometry = new THREE.CylinderGeometry(0.7, 0.85, 7.5, 24);
    const brokenMaterial = new THREE.MeshStandardMaterial({
      color: 0xc99566,
      roughness: 0.8,
      metalness: 0.05,
    });
    const brokenPillar = new THREE.Mesh(brokenGeometry, brokenMaterial);
    brokenPillar.position.y = 3.75;
    brokenPillar.castShadow = true;
    brokenGroup.add(brokenPillar);
    brokenGroup.position.set(26, 0, 16);
    brokenGroup.rotation.z = Math.PI / 2.8;
    scene.add(brokenGroup);

    // ===== PARTICLE SYSTEM =====
    const particleCount = 800;
    const positionArray = new Float32Array(particleCount * 3);
    const velocityArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * 120;
      positionArray[i * 3 + 1] = Math.random() * 70;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 120;

      velocityArray[i * 3] = (Math.random() - 0.5) * 0.015;
      velocityArray[i * 3 + 1] = Math.random() * 0.008;
      velocityArray[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffc966,
      size: 0.3,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    // Resize Handler
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || window.innerWidth;
      const newHeight = containerRef.current?.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    // Track wheel children indices (8 children before wheels: chassis, cabin,
    // windshield, 4 panes, roof, door, mirror, bumper = indices 0–9; wheels start at 10)
    const wheelStartIdx = busGroup.children.findIndex(
      (c) => c instanceof THREE.Mesh && (c.geometry as THREE.CylinderGeometry).parameters?.radiusTop === 0.85
    );

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.016;

      if (busGroup) {
        busGroup.position.x += 0.025;
        busGroup.position.z -= 0.012;
        if (busGroup.position.x > 25) {
          busGroup.position.x = -20;
          busGroup.position.z = 25;
        }
        busGroup.position.y = Math.sin(time * 0.7) * 0.25;
        busGroup.rotation.z = Math.sin(time * 0.5) * 0.02;

        // Rotate only wheel meshes (CylinderGeometry with radius 0.85)
        busGroup.children.forEach((child) => {
          if (
            child instanceof THREE.Mesh &&
            child.geometry instanceof THREE.CylinderGeometry &&
            child.geometry.parameters.radiusTop === 0.85
          ) {
            child.rotation.x += 0.12;
          }
        });
      }

      if (particles && particles.geometry) {
        const positions = particles.geometry.attributes.position.array as Float32Array;
        const velocities = particles.geometry.attributes.velocity.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];
          velocities[i * 3] += Math.sin(time * 0.3 + i) * 0.0005;

          if (positions[i * 3 + 1] > 70) {
            positions[i * 3 + 1] = -5;
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      camera.position.x = Math.sin(time * 0.15) * 3;
      camera.position.y = 10 + Math.sin(time * 0.2) * 1;

      renderer.render(scene, camera);
    };

    animate();
    setTimeout(() => setIsLoaded(true), 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70" />

      <div className="absolute inset-0 px-4 sm:px-6 md:px-12 z-10 flex flex-col justify-center overflow-y-auto sm:overflow-hidden pb-8 sm:pb-0">
        <div className="max-w-7xl mx-auto w-full relative flex flex-col lg:block mt-24 sm:mt-0">
          
          <div className="max-w-2xl lg:mt-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-lg">
              Walk where empires once whispered
            </h1>
            <p className="text-base sm:text-lg text-amber-100 mb-8 sm:mb-10 max-w-lg leading-relaxed opacity-95 drop-shadow-md">
              Experience about 2,000 years of history with our exclusive guided tours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Link
                href="/tours"
                className="inline-block px-7 sm:px-9 py-3.5 sm:py-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-semibold rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl"
              >
                {t('explore_button')}
              </Link>
              <Link
                href="/#tours-preview"
                className="inline-block px-7 sm:px-9 py-3.5 sm:py-4 bg-transparent border-2 border-amber-400 text-amber-100 hover:bg-amber-400 hover:text-black active:scale-95 font-semibold rounded-lg transition-all duration-200 text-center"
              >
                {t('learn_more')}
              </Link>
            </div>
          </div>

          {/* Right Card (Mobile: stacked below, Desktop: Absolute right) */}
          <div className="w-full max-w-sm mt-12 lg:mt-0 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/30 tracking-wider">
                MOST BOOKED • TODAY
              </div>
              <div className="text-gray-300 text-sm flex items-center gap-1.5 font-medium bg-black/40 px-2 py-1 rounded-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                8h
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 leading-snug">Ancient Ephesus & Terrace Houses</h3>
            
            <div className="flex items-end gap-2 mb-6 mt-5">
              <span className="text-gray-400 text-xs font-bold tracking-wider mb-1.5">FROM</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">€89<span className="text-lg text-gray-400 font-medium">/pp</span></span>
            </div>

            <div className="flex items-center gap-4 mb-7">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-[#1a1a1a] shadow-sm z-30 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-amber-400 opacity-20"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-[#1a1a1a] shadow-sm z-20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 opacity-20"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border-2 border-[#1a1a1a] shadow-sm z-10 flex items-center justify-center text-xs text-white font-bold">+9</div>
              </div>
              <span className="text-sm text-amber-100/90 font-medium">Small group - max 12</span>
            </div>

            <Link href="/tours/ephesus-terrace-houses" className="block w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25 text-center text-lg">
              Reserve a seat
            </Link>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
    </div>
  );
}
