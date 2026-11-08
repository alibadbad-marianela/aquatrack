import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Droplets,
  ArrowRight,
  Sparkles,
  Newspaper,
  GraduationCap,
  LogIn,
  UserPlus,
  ShieldCheck,
  BarChart3,
  Gamepad2,
  Scale,
  Compass,
  Fish,
  Waves,
  Anchor,
  Activity
} from 'lucide-react';
import { LocalTimeDisplay } from './LocalTimeDisplay';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenCreator: () => void;
  onOpenNews: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenCreator,
  onOpenNews,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  // Overlay Beat Refs
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLSpanElement>(null);
  const l0Ref = useRef<HTMLDivElement>(null);
  const l1Ref = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const l2Ref = useRef<HTMLDivElement>(null);
  const visChipRef = useRef<HTMLDivElement>(null);
  const visParaRef = useRef<HTMLParagraphElement>(null);

  const l3Ref = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);

  const l4Ref = useRef<HTMLDivElement>(null);
  const credRef = useRef<HTMLDivElement>(null);
  const waterCardRef = useRef<HTMLDivElement>(null);
  const waterNumRef = useRef<HTMLSpanElement>(null);
  const sparkPolyRef = useRef<SVGPolylineElement>(null);

  const progInnerRef = useRef<HTMLDivElement>(null);
  const solSectionRef = useRef<HTMLElement>(null);

  // Interactive UI State
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [activeFeatRow, setActiveFeatRow] = useState<number | null>(null);

  // Vision word chunks
  const visionLines = [
    ['From', 'Water', 'Waste', 'to'],
    ['Science-Backed,'],
    ['Actionable', 'Conservation'],
  ];

  // Accounting paragraph text
  const acctWords =
    'Our ecosystem-level water accounting translates household domestic consumption into verifiable, climate-ready conservation metrics — so every liter saved directly protects our rivers, aquifers, and living oceans.'.split(
      ' '
    );

  // 3D Scene Lifecycle and Animation Loop
  useEffect(() => {
    const mount = canvasMountRef.current;
    const story = storyRef.current;
    if (!mount || !story) return;

    // Detect software WebGL per Three.js skill guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    // Deep atmospheric ocean fog transitioning from bright turquoise surface to midnight abyss
    scene.fog = new THREE.FogExp2(0x041628, 0.022);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 2, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setClearColor(0x041628, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    mount.appendChild(renderer.domElement);

    // 2. Procedural Skin Texture for the Blue Whale
    const createWhaleTexture = () => {
      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = 512;
      const ctx = cv.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(cv);

      // Gradient background: deep slate-blue dorsal to light mottled belly
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#10273f'); // deep dorsal spine
      grad.addColorStop(0.35, '#193f64');
      grad.addColorStop(0.65, '#255883');
      grad.addColorStop(0.85, '#6da1c7'); // ventral transition
      grad.addColorStop(1, '#a8d2ea'); // light pleated throat grooves
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Mottled oceanic skin spots & caustics
      ctx.fillStyle = 'rgba(74, 150, 204, 0.35)';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 380;
        const r = 2 + Math.random() * 8;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.8, r, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ventral throat pleat grooves (longitudinal striations on lower belly)
      ctx.strokeStyle = 'rgba(16, 42, 68, 0.45)';
      ctx.lineWidth = 1.8;
      for (let y = 360; y < 512; y += 7) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.bezierCurveTo(300, y + (Math.random() - 0.5) * 4, 700, y, 980, y);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    const whaleSkinTexture = createWhaleTexture();

    // 3. Assemble Procedural Composite 3D Blue Whale (THREE.Group)
    // Structure: whaleRoot -> [headGroup, torsoGroup, peduncleGroup -> [flukeGroup], leftFin, rightFin, dorsalFin]
    const whaleGroup = new THREE.Group();

    // Whale Materials
    const whaleMaterial = new THREE.MeshPhysicalMaterial({
      map: whaleSkinTexture,
      color: 0x256598,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.85,
      clearcoatRoughness: 0.25,
    });

    const finMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1d476c,
      roughness: 0.3,
      metalness: 0.1,
      clearcoat: 0.7,
    });

    const bellyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x98cbe6,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.6,
    });

    // 3.1 Main Torso / Body (Streamlined Hydrodynamic Hull)
    // Built using an aerodynamic tapered spindle
    const torsoGeo = new THREE.CylinderGeometry(1.65, 1.4, 7.5, 24, 8);
    torsoGeo.rotateZ(Math.PI / 2);
    // Scale slightly laterally to reflect cetacean cross-section (taller than wide at tail, wider at head)
    torsoGeo.scale(1, 0.95, 1.25);
    const torsoMesh = new THREE.Mesh(torsoGeo, whaleMaterial);
    torsoMesh.position.set(0, 0, 0);
    whaleGroup.add(torsoMesh);

    // 3.2 Head & Rostrum with Ventral Throat Pleats
    const headGroup = new THREE.Group();
    headGroup.position.set(3.75, 0, 0);

    // Upper Rostrum / Snout
    const snoutGeo = new THREE.ConeGeometry(1.65, 4.8, 24, 6);
    snoutGeo.rotateZ(-Math.PI / 2);
    snoutGeo.scale(1, 0.75, 1.2);
    const snoutMesh = new THREE.Mesh(snoutGeo, whaleMaterial);
    snoutMesh.position.set(2.4, 0.05, 0);
    headGroup.add(snoutMesh);

    // Ventral Grooves Bulge (Pouch)
    const throatGeo = new THREE.SphereGeometry(1.5, 18, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    throatGeo.scale(2.2, 0.65, 1.05);
    const throatMesh = new THREE.Mesh(throatGeo, bellyMaterial);
    throatMesh.position.set(0.6, -0.65, 0);
    headGroup.add(throatMesh);

    // Dual Blowhole Nostrils on top ridge
    const blowholeGeo = new THREE.CapsuleGeometry(0.12, 0.35, 4, 8);
    blowholeGeo.rotateX(Math.PI / 2);
    const blowholeMat = new THREE.MeshBasicMaterial({ color: 0x081522 });
    const blowholeL = new THREE.Mesh(blowholeGeo, blowholeMat);
    blowholeL.position.set(1.5, 0.88, 0.16);
    const blowholeR = blowholeL.clone();
    blowholeR.position.set(1.5, 0.88, -0.16);
    headGroup.add(blowholeL, blowholeR);

    // Subtle dark obsidian eyes
    const eyeGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const eyeMat = new THREE.MeshPhysicalMaterial({ color: 0x050c14, roughness: 0.1, clearcoat: 1 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(1.1, -0.05, 1.62);
    const eyeR = eyeL.clone();
    eyeR.position.set(1.1, -0.05, -1.62);
    headGroup.add(eyeL, eyeR);

    whaleGroup.add(headGroup);

    // 3.3 Pectoral Flippers (Left & Right - Hydrodynamic Wings)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.bezierCurveTo(1.2, 0.5, 3.8, 0.2, 4.6, -0.6);
    finShape.bezierCurveTo(4.2, -1.2, 1.8, -1.0, 0, -0.3);
    finShape.closePath();

    const finExtrudeSettings = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
    finGeo.center();

    // Left Flipper Pivot
    const leftFinPivot = new THREE.Group();
    leftFinPivot.position.set(1.8, -0.5, 1.45);
    const leftFinMesh = new THREE.Mesh(finGeo, finMaterial);
    leftFinMesh.rotation.set(0.3, 0.2, -0.5);
    leftFinMesh.position.set(1.8, -0.4, 0.8);
    leftFinPivot.add(leftFinMesh);
    whaleGroup.add(leftFinPivot);

    // Right Flipper Pivot
    const rightFinPivot = new THREE.Group();
    rightFinPivot.position.set(1.8, -0.5, -1.45);
    const rightFinMesh = new THREE.Mesh(finGeo, finMaterial);
    rightFinMesh.rotation.set(-0.3, -0.2, -0.5);
    rightFinMesh.position.set(1.8, -0.4, -0.8);
    rightFinPivot.add(rightFinMesh);
    whaleGroup.add(rightFinPivot);

    // 3.4 Dorsal Fin (Small falcate sickle on dorsal ridge)
    const dorsalShape = new THREE.Shape();
    dorsalShape.moveTo(0, 0);
    dorsalShape.quadraticCurveTo(0.4, 0.8, 0.9, 0.9);
    dorsalShape.quadraticCurveTo(0.65, 0.4, 1.3, 0);
    dorsalShape.closePath();
    const dorsalGeo = new THREE.ExtrudeGeometry(dorsalShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    });
    const dorsalMesh = new THREE.Mesh(dorsalGeo, finMaterial);
    dorsalMesh.position.set(-2.6, 1.35, -0.07);
    whaleGroup.add(dorsalMesh);

    // 3.5 Caudal Peduncle (Segmented Flexible Tail)
    const peduncleGroup = new THREE.Group();
    peduncleGroup.position.set(-3.75, 0, 0);

    const tailGeo = new THREE.CylinderGeometry(1.38, 0.65, 5.2, 18, 6);
    tailGeo.rotateZ(Math.PI / 2);
    tailGeo.scale(1, 1.1, 0.7); // lateral compression
    const tailMesh = new THREE.Mesh(tailGeo, whaleMaterial);
    tailMesh.position.set(-2.6, 0, 0);
    peduncleGroup.add(tailMesh);

    // 3.6 Tail Flukes (Wide Triangular Caudal Fin with Median Notch)
    const flukeGroup = new THREE.Group();
    flukeGroup.position.set(-5.2, 0, 0);

    const flukeShape = new THREE.Shape();
    flukeShape.moveTo(0, 0);
    flukeShape.bezierCurveTo(-0.8, 1.4, -2.2, 2.9, -3.2, 2.7);
    flukeShape.bezierCurveTo(-2.6, 1.2, -1.6, 0.4, -0.9, 0.05); // median notch
    flukeShape.bezierCurveTo(-1.6, -0.4, -2.6, -1.2, -3.2, -2.7);
    flukeShape.bezierCurveTo(-2.2, -2.9, -0.8, -1.4, 0, 0);
    flukeShape.closePath();

    const flukeGeo = new THREE.ExtrudeGeometry(flukeShape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    flukeGeo.rotateY(Math.PI / 2);
    flukeGeo.rotateX(Math.PI / 2);
    const flukeMesh = new THREE.Mesh(flukeGeo, finMaterial);
    flukeGroup.add(flukeMesh);

    peduncleGroup.add(flukeGroup);
    whaleGroup.add(peduncleGroup);

    // Scale and orient whole whale into scene
    whaleGroup.scale.set(0.9, 0.9, 0.9);
    whaleGroup.position.set(0, 0, 0);
    scene.add(whaleGroup);

    // 4. Underwater Ocean Lighting & Caustic Shading
    // 4.1 Penetrating Sunlight from Water Surface
    const sunLight = new THREE.DirectionalLight(0xc6f3ff, 2.5);
    sunLight.position.set(10, 25, 12);
    scene.add(sunLight);

    // 4.2 Cool Deep-Sea Ambient Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x020a14, 1.4);
    scene.add(hemiLight);

    // 4.3 Floor Caustic Up-Light (reflecting turquoise ocean light onto underbelly)
    const causticUpLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    causticUpLight.position.set(-8, -20, -5);
    scene.add(causticUpLight);

    // 5. Volumetric Underwater Sun Shafts (God Rays)
    const raysGroup = new THREE.Group();
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < 5; i++) {
      const rayGeo = new THREE.ConeGeometry(2.5 + i * 0.4, 38, 16, 1, true);
      const rayMesh = new THREE.Mesh(rayGeo, rayMat);
      rayMesh.position.set(-15 + i * 7.5, 12, -8 + (i % 2) * 6);
      rayMesh.rotation.set(0.2, 0, -0.35 + (i * 0.08));
      raysGroup.add(rayMesh);
    }
    scene.add(raysGroup);

    // 6. Suspended Marine Snow & Plankton Particles
    const particleCount = 850;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 55;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 45;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: 0.008 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.22,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const marineSnow = new THREE.Points(particleGeo, particleMat);
    scene.add(marineSnow);

    // 7. Oceanic Telemetry Buoy & Acoustic Sensor Tag in scene
    const sensorBuoyGroup = new THREE.Group();
    sensorBuoyGroup.position.set(8.5, -4.5, 2.5);

    // Buoy Body
    const buoyBodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 16);
    const buoyMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e3b5e,
      roughness: 0.2,
      metalness: 0.85,
      clearcoat: 1,
    });
    const buoyMesh = new THREE.Mesh(buoyBodyGeo, buoyMat);
    sensorBuoyGroup.add(buoyMesh);

    // Sensor Torus Collars
    const collarGeo = new THREE.TorusGeometry(0.48, 0.08, 8, 24);
    const collarMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const collar1 = new THREE.Mesh(collarGeo, collarMat);
    collar1.rotation.x = Math.PI / 2;
    collar1.position.y = 0.6;
    const collar2 = collar1.clone();
    collar2.position.y = -0.6;
    sensorBuoyGroup.add(collar1, collar2);

    // Beacon Light
    const beaconLight = new THREE.PointLight(0x38bdf8, 2, 8);
    beaconLight.position.set(0, 1.2, 0);
    sensorBuoyGroup.add(beaconLight);

    scene.add(sensorBuoyGroup);

    // 8. Schooling Pelagic Fish (InstancedMesh)
    const fishCount = 35;
    const fishGeo = new THREE.ConeGeometry(0.18, 0.9, 6);
    fishGeo.rotateZ(Math.PI / 2);
    const fishMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.7,
      clearcoat: 0.9,
    });
    const fishInstanced = new THREE.InstancedMesh(fishGeo, fishMat, fishCount);
    const dummy = new THREE.Object3D();

    const fishData = Array.from({ length: fishCount }, (_, i) => ({
      orbitRadius: 7 + Math.random() * 4,
      orbitSpeed: 0.4 + Math.random() * 0.25,
      orbitY: -3 + Math.random() * 6,
      offset: (i / fishCount) * Math.PI * 2,
    }));

    scene.add(fishInstanced);

    // 9. Resize Handling
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    };
    window.addEventListener('resize', handleResize);

    // 10. Pointer Tracking for Gentle Parallax
    let mx = 0;
    let my = 0;
    let sx = 0;
    let sy = 0;

    const onPointerMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onPointerMove);

    // Setup sparkline dasharray
    const sparkPoly = sparkPolyRef.current;
    let sparkLen = 260;
    if (sparkPoly) {
      try {
        sparkLen = sparkPoly.getTotalLength();
      } catch {
        sparkLen = 260;
      }
      sparkPoly.style.strokeDasharray = `${sparkLen}`;
      sparkPoly.style.strokeDashoffset = `${sparkLen}`;
    }

    // 11. Per-Frame Render and Cinematic Scroll Loop
    let sp = 0;
    let lastTime = performance.now();
    let animId = 0;

    const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const tick = (nowTime: number) => {
      const dt = Math.min(64, nowTime - lastTime);
      lastTime = nowTime;
      const t = nowTime * 0.001;

      // Scroll Progress interpolation
      const storyRect = story.getBoundingClientRect();
      const totalScroll = story.offsetHeight - window.innerHeight;
      const rawP = clamp(-storyRect.top / (totalScroll > 0 ? totalScroll : 1));

      const smoothFactor = 1 - Math.pow(0.86, dt / 16.7);
      sp += (rawP - sp) * smoothFactor;
      if (Math.abs(rawP - sp) < 0.0002) sp = rawP;

      // Pointer smoothing
      sx += (mx - sx) * 0.06;
      sy += (my - sy) * 0.06;

      // 11.1 Whale Kinematics & Swimming Undulation
      const swimSpeed = 2.2;
      const strokeAmp = 0.22;

      // Body Wave Undulation
      headGroup.rotation.y = Math.sin(t * swimSpeed) * 0.04;
      headGroup.rotation.x = Math.sin(t * swimSpeed * 0.5) * 0.02;

      peduncleGroup.rotation.y = Math.sin(t * swimSpeed - 0.7) * strokeAmp;
      peduncleGroup.rotation.x = Math.cos(t * swimSpeed - 0.7) * (strokeAmp * 0.4);

      flukeGroup.rotation.y = Math.sin(t * swimSpeed - 1.4) * (strokeAmp * 1.5);
      flukeGroup.rotation.x = Math.cos(t * swimSpeed - 1.4) * (strokeAmp * 0.85);

      // Pectoral flippers roll & bank
      leftFinPivot.rotation.z = Math.sin(t * swimSpeed * 0.5) * 0.12;
      rightFinPivot.rotation.z = -Math.sin(t * swimSpeed * 0.5) * 0.12;

      // Whole Whale Gliding Motion through Water Column
      whaleGroup.position.y = Math.sin(t * 0.8) * 0.45;
      whaleGroup.position.x = Math.sin(t * 0.4) * 0.6;
      whaleGroup.rotation.z = Math.sin(t * 0.8) * 0.025;

      // 11.2 Camera Choreography mapped to Scroll Progress (5 Cinematic Beats)
      // Camera moves seamlessly from sunlit surface down through the water column
      const targetCamX = Math.sin(sp * Math.PI) * 5 + sx * 3;
      const targetCamY = 2 - sp * 14 - sy * 2;
      const targetCamZ = 22 - Math.sin(sp * Math.PI * 0.8) * 8;

      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;

      camera.lookAt(whaleGroup.position.x * 0.5, whaleGroup.position.y * 0.5 - sp * 4, 0);

      // 11.3 Animate Particles (Marine Snow)
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx + 1] += particleVelocities[i].y;
        positions[idx] += particleVelocities[i].x;

        if (positions[idx + 1] > 20) positions[idx + 1] = -20;
        if (positions[idx] > 30) positions[idx] = -30;
        if (positions[idx] < -30) positions[idx] = 30;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // 11.4 Animate Schooling Fish
      for (let i = 0; i < fishCount; i++) {
        const f = fishData[i];
        const fishAngle = t * f.orbitSpeed + f.offset;
        const fx = Math.cos(fishAngle) * f.orbitRadius;
        const fz = Math.sin(fishAngle) * f.orbitRadius;
        const fy = f.orbitY + Math.sin(t * 1.5 + f.offset) * 0.5;

        dummy.position.set(fx, fy, fz);
        dummy.rotation.y = -fishAngle + Math.PI / 2;
        dummy.rotation.z = Math.sin(t * 4 + f.offset) * 0.15;
        dummy.updateMatrix();
        fishInstanced.setMatrixAt(i, dummy.matrix);
      }
      fishInstanced.instanceMatrix.needsUpdate = true;

      // 11.5 Animate Telemetry Buoy Beacon
      beaconLight.intensity = 1.2 + Math.sin(t * 3.5) * 1.0;
      sensorBuoyGroup.rotation.y = t * 0.25;

      // 11.6 DOM Layer Animations (Mirroring Mossline Pacing)
      // Beat 1: Hero (sp: 0.00 -> 0.12)
      const heroH = seg(sp, 0.02, 0.12);
      const l0 = l0Ref.current;
      const l1 = l1Ref.current;
      const heroCopy = heroCopyRef.current;
      const hudBlock = hudRef.current;
      const captionBlock = captionRef.current;
      const scrollHint = hintRef.current;

      if (l0 && l1 && heroCopy && hudBlock && captionBlock && scrollHint) {
        if (heroH >= 1) {
          l0.style.visibility = 'hidden';
          l1.style.visibility = 'hidden';
        } else {
          l0.style.visibility = 'visible';
          l1.style.visibility = 'visible';

          heroCopy.style.transform = `translate3d(${-sx * 10}px, ${-heroH * 80 - sy * 6}px, 0) scale(${
            1 + heroH * 0.12
          })`;
          heroCopy.style.filter = `blur(${heroH * 14}px)`;
          heroCopy.style.opacity = `${1 - heroH}`;

          const hudH = seg(sp, 0.02, 0.09);
          hudBlock.style.transform = `translate3d(${sx * 26}px, ${sy * 18 - heroH * 40}px, 0)`;
          hudBlock.style.opacity = `${1 - hudH}`;

          const capH = seg(sp, 0.01, 0.06);
          captionBlock.style.opacity = `${1 - capH}`;
          scrollHint.style.opacity = `${1 - capH}`;
        }
      }

      // Beat 2: Vision (sp: 0.15 -> 0.38)
      const vIn = seg(sp, 0.15, 0.28);
      const vOut = seg(sp, 0.35, 0.44);
      const l2 = l2Ref.current;
      const visChip = visChipRef.current;
      const visPara = visParaRef.current;
      const visionWordSpans = Array.from(document.querySelectorAll<HTMLElement>('.vision-word-elem'));

      if (l2 && visChip && visPara) {
        if (vIn <= 0 || vOut >= 1) {
          l2.style.visibility = 'hidden';
        } else {
          l2.style.visibility = 'visible';
          visionWordSpans.forEach((wSpan, i) => {
            const k = clamp(vIn * 1.6 - i * 0.08);
            const ty = (1 - k) * 30 - vOut * 60;
            const blurVal = (1 - k) * 12 + vOut * 14;
            const opVal = k * (1 - vOut);
            wSpan.style.transform = `translate3d(0, ${ty}px, 0)`;
            wSpan.style.filter = `blur(${blurVal}px)`;
            wSpan.style.opacity = `${opVal}`;
          });

          const chipParaOp = clamp(vIn * 2 - 0.6) * (1 - vOut);
          const chipParaLift = -vOut * 50;
          visChip.style.opacity = `${chipParaOp}`;
          visChip.style.transform = `translate3d(0, ${chipParaLift}px, 0)`;
          visPara.style.opacity = `${chipParaOp}`;
          visPara.style.transform = `translate3d(0, ${chipParaLift}px, 0)`;
        }
      }

      // Beat 3: Accounting & Hotspots (sp: 0.44 -> 0.68)
      const aIn = seg(sp, 0.44, 0.55);
      const aOut = seg(sp, 0.64, 0.70);
      const l3 = l3Ref.current;
      const fogBank = fogRef.current;
      const acctWordSpans = Array.from(document.querySelectorAll<HTMLElement>('.acct-word-elem'));
      const hotspotElems = Array.from(document.querySelectorAll<HTMLElement>('.hotspot-elem'));

      // Underwater Fog Bank
      const fg = ease(seg(sp, 0.38, 0.48));
      if (fogBank) {
        if (fg <= 0) {
          fogBank.style.visibility = 'hidden';
          fogBank.style.opacity = '0';
        } else {
          fogBank.style.visibility = 'visible';
          fogBank.style.opacity = `${fg}`;
          fogBank.style.transform = `translate3d(${(fg - 1) * 18 + sx * -10}vw, ${sy * -6}px, 0)`;
        }
      }

      if (l3) {
        if (aIn <= 0 || aOut >= 1) {
          l3.style.visibility = 'hidden';
        } else {
          l3.style.visibility = 'visible';
          acctWordSpans.forEach((wSpan, i) => {
            const k = clamp(aIn * 2.2 - (i / acctWordSpans.length) * 1.2);
            wSpan.style.opacity = `${(0.15 + 0.85 * k) * (1 - aOut)}`;
            wSpan.style.filter = `blur(${(1 - k) * 6 + aOut * 10}px)`;
          });

          hotspotElems.forEach((hs, i) => {
            const k = seg(sp, 0.48 + i * 0.02, 0.53 + i * 0.02);
            hs.style.transform = `translate3d(${sx * -30}px, ${sy * -20}px, 0) scale(${
              k * (1 - aOut)
            })`;
          });
        }
      }

      // Beat 4: Pelagic Station 07 (sp: 0.70 -> 0.88)
      const sIn = seg(sp, 0.70, 0.82);
      const l4 = l4Ref.current;
      const credBlock = credRef.current;
      const waterCard = waterCardRef.current;
      const waterNum = waterNumRef.current;
      const featRowElems = Array.from(document.querySelectorAll<HTMLElement>('.feat-row-elem'));

      if (l4 && credBlock && waterCard && waterNum && sparkPoly) {
        if (sIn <= 0) {
          l4.style.visibility = 'hidden';
        } else {
          l4.style.visibility = 'visible';
          credBlock.style.opacity = `${sIn}`;
          credBlock.style.transform = `translate3d(0, ${(1 - sIn) * 30}px, 0)`;
          credBlock.style.filter = `blur(${(1 - sIn) * 8}px)`;

          const cIn = ease(seg(sp, 0.73, 0.85));
          waterCard.style.opacity = `${cIn}`;
          waterCard.style.transform = `translate3d(${sx * -14}px, ${
            (1 - cIn) * 60 + sy * -10
          }px, 0) rotateY(${sx * 8}deg) rotateX(${-sy * 8}deg)`;

          const cardCount = Math.round(84 * seg(sp, 0.75, 0.90));
          waterNum.textContent = `${cardCount}`;

          const sparkP = seg(sp, 0.76, 0.92);
          sparkPoly.style.strokeDashoffset = `${sparkLen * (1 - sparkP)}`;

          featRowElems.forEach((row, i) => {
            const k = ease(seg(sp, 0.75 + i * 0.025, 0.81 + i * 0.025));
            row.style.opacity = `${k}`;
            row.style.transform = `translateX(${(1 - k) * 40}px)`;
          });
        }
      }

      // Progress bar at bottom
      const progInner = progInnerRef.current;
      if (progInner) {
        progInner.style.transform = `scaleX(${sp})`;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // 12. 3D Card Tilt Interaction in Solutions
    const solCards = Array.from(document.querySelectorAll<HTMLElement>('.sol-card-elem'));
    const cleanups: (() => void)[] = [];

    solCards.forEach((card) => {
      const onCardMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${cx * 6}deg) rotateX(${-cy * 6}deg)`;
      };
      const onCardLeave = () => {
        card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      };
      card.addEventListener('mousemove', onCardMove);
      card.addEventListener('mouseleave', onCardLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onCardMove);
        card.removeEventListener('mouseleave', onCardLeave);
      });
    });

    // 13. Solutions Stats Count-Up Animation
    const solSection = solSectionRef.current;
    const statNums = Array.from(document.querySelectorAll<HTMLElement>('.stat-num-elem'));
    let statsAnimated = false;

    const checkStatsTrigger = () => {
      if (statsAnimated || !solSection) return;
      const rect = solSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.6) {
        statsAnimated = true;
        const duration = 1600;
        const startTime = performance.now();

        const stepStats = (now: number) => {
          const progress = clamp((now - startTime) / duration);
          const eased = ease(progress);

          statNums.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-target') || '0');
            const isComma = el.getAttribute('data-format') === 'comma';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';

            const currentVal = target * eased;
            let formatted = '';
            if (decimals > 0) {
              formatted = currentVal.toFixed(decimals);
            } else if (isComma) {
              formatted = Math.round(currentVal).toLocaleString('en-US');
            } else {
              formatted = Math.round(currentVal).toString();
            }
            el.textContent = prefix + formatted + suffix;
          });

          if (progress < 1) {
            requestAnimationFrame(stepStats);
          }
        };
        requestAnimationFrame(stepStats);
      }
    };

    window.addEventListener('scroll', checkStatsTrigger, { passive: true });
    checkStatsTrigger();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('scroll', checkStatsTrigger);
      cleanups.forEach((c) => c());

      // Dispose Three.js resources to prevent memory leaks
      renderer.dispose();
      whaleSkinTexture.dispose();
      torsoGeo.dispose();
      whaleMaterial.dispose();
      finMaterial.dispose();
      bellyMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#040d1a] text-white antialiased selection:bg-[#22d3ee] selection:text-[#040d1a] overflow-x-hidden font-['Inter_Tight',sans-serif]"
    >
      {/* 1. FIXED OCEANIC NAVIGATION BAR */}
      <nav
        id="nav"
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 py-3.5 sm:py-5 pointer-events-auto bg-[#040d1a]/55 backdrop-blur-xl border-b border-[#38bdf8]/15 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
      >
        {/* Left: AquaTrack Signature Droplet & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#22d3ee] p-1.5 shadow-md shadow-cyan-500/25">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-white font-['Space_Grotesk',sans-serif]">
              Aqua<span className="text-[#38bdf8]">Track</span>
            </span>
            <span className="hidden sm:inline font-mono text-[9.5px] tracking-widest uppercase text-cyan-300/80">
              Living Ocean
            </span>
          </div>
        </div>

        {/* Center Menu Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <a
            href="#sol"
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-slate-200 hover:text-[#38bdf8] transition-colors"
          >
            <span>Solutions</span>
            <span className="w-1.5 h-1.5 border-r-[1.3px] border-b-[1.3px] border-current -translate-y-0.5 rotate-45" />
          </a>
          <a
            href="#story"
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-slate-200 hover:text-[#38bdf8] transition-colors"
          >
            <span>Pelagic Telemetry</span>
            <span className="w-1.5 h-1.5 border-r-[1.3px] border-b-[1.3px] border-current -translate-y-0.5 rotate-45" />
          </a>
          <button
            onClick={onOpenNews}
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-slate-200 hover:text-[#38bdf8] transition-colors cursor-pointer"
          >
            <Newspaper className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Water News</span>
          </button>
          <button
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-slate-200 hover:text-[#38bdf8] transition-colors cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Creator</span>
          </button>
        </div>

        {/* Right CTA Area: Live Time + Sign In + Launch App */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3.5">
          {/* Integrated Dynamic Live Local Time Pill */}
          <div className="hidden xl:block">
            <LocalTimeDisplay />
          </div>

          <button
            onClick={onOpenLogin}
            className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#22d3ee] hover:brightness-110 text-[#040d1a] font-mono text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#040d1a]" />
          </button>
        </div>
      </nav>

      {/* 2. PINNED SCROLL STORY (640vh) */}
      <section id="story" ref={storyRef} className="relative h-[640vh]">
        <div className="sticky top-0 h-screen w-screen overflow-hidden bg-[#040d1a]">
          {/* Three.js 3D WebGL Canvas Mount (100% Unobstructed Center Viewport) */}
          <div
            ref={canvasMountRef}
            className="absolute inset-0 w-full h-full pointer-events-auto"
          />

          {/* Bioluminescent Deep-Water Fog Bank */}
          <div
            id="fogBank"
            ref={fogRef}
            className="absolute -left-[8vw] -top-[6vh] w-[58vw] h-[64vh] pointer-events-none z-10 invisible opacity-0"
            style={{
              maskImage:
                'radial-gradient(ellipse 52% 48% at 46% 46%, #000 44%, rgba(0,0,0,0.7) 64%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 52% 48% at 46% 46%, #000 44%, rgba(0,0,0,0.7) 64%, transparent 100%)',
            }}
          >
            <div
              className="absolute inset-0 blur-[14px]"
              style={{
                background:
                  'radial-gradient(60% 55% at 40% 45%, #082949, #051a30 60%, #030f1e)',
              }}
            />
            <div
              className="absolute -inset-[20%] opacity-45 blur-[16px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 700 460' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005 0.012' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.05  0 0 0 0 0.25  0 0 0 0 0.45  1.4 0 0 0 -0.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
              }}
            />
          </div>

          {/* Layer L0: Hero Headline (Beat 1: The Pelagic Surface) */}
          <div id="l0" ref={l0Ref} className="absolute inset-0 pointer-events-none z-12">
            <div
              id="heroCopy"
              ref={heroCopyRef}
              className="absolute left-0 right-0 top-[18vh] sm:top-[22vh] text-center pointer-events-none transition-opacity duration-100 px-4"
            >
              <div className="chip-aqua">
                Oceanic Intelligence · Living Water Telemetry
              </div>
              <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-[clamp(40px,6.8vw,102px)] leading-[0.92] tracking-[-0.04em] mt-4.5 text-white [text-shadow:0_4px_30px_rgba(0,0,0,0.75)]">
                <span className="block overflow-hidden pb-[0.06em] whitespace-nowrap">
                  <span
                    id="heroText"
                    ref={heroTextRef}
                    className="inline-block bg-gradient-to-b from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent"
                  >
                    Measure the Living Ocean
                  </span>
                </span>
              </h1>
            </div>
          </div>

          {/* Layer L1: HUD, Caption, Scroll Hint (Beat 1: Telemetry Overlay) */}
          <div id="l1" ref={l1Ref} className="absolute inset-0 pointer-events-none z-20">
            {/* Marine Telemetry HUD (Over the Blue Whale) */}
            <div
              id="hudBlock"
              ref={hudRef}
              className="absolute left-[8%] sm:left-[54%] top-[56%] sm:top-[60%]"
            >
              {/* Cyan Crosshair */}
              <div className="absolute -left-9 top-2 w-5.5 h-5.5">
                <span className="absolute left-0 top-[10.5px] w-5.5 h-[1px] bg-[#38bdf8]" />
                <span className="absolute left-[10.5px] top-0 w-[1px] h-5.5 bg-[#38bdf8]" />
              </div>

              <div className="relative inline-block p-1">
                <div className="chip-aqua">Pelagic Biome · Whale Sanctuary</div>
                <pre className="font-mono text-[11px] tracking-[0.12em] leading-[1.65] text-cyan-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] mt-2.5">
                  LAT 09°42&apos;18&quot; N{'\n'}LON 124°15&apos;36&quot; E{'\n'}DEPTH -18.4 M{'\n'}SALINITY 34.8 PSU
                </pre>
                <div
                  className="absolute -inset-x-3 -top-1.5 -bottom-2 border border-[#38bdf8]/45 pointer-events-none"
                  style={{
                    clipPath:
                      'polygon(0 0, 14px 0, 14px 1px, 1px 1px, 1px 14px, 0 14px, 0 calc(100% - 14px), 1px calc(100% - 14px), 1px calc(100% - 1px), 14px calc(100% - 1px), 14px 100%, 0 100%, calc(100% - 14px) 100%, calc(100% - 14px) calc(100% - 1px), calc(100% - 1px) calc(100% - 1px), calc(100% - 1px) calc(100% - 14px), 100% calc(100% - 14px), 100% 100%, 100% 14px, calc(100% - 1px) 14px, calc(100% - 1px) 1px, calc(100% - 14px) 1px, calc(100% - 14px) 0, 100% 0)',
                  }}
                />
              </div>
            </div>

            {/* Bottom-Left Caption */}
            <div
              id="captionBlock"
              ref={captionRef}
              className="absolute left-6 sm:left-[34px] bottom-8 sm:bottom-[34px] pl-4 border-l-2 border-[#38bdf8] font-mono text-[11px] sm:text-[11.5px] leading-[1.75] tracking-[0.13em] uppercase text-cyan-200/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)] max-w-sm"
            >
              Real-time domestic water intelligence
              <br />
              paired with planetary ocean conservation.
              <br />
              Science-backed and transparent.
            </div>

            {/* Bottom-Right Scroll Hint */}
            <div
              id="scrollHint"
              ref={hintRef}
              className="absolute right-6 sm:right-[34px] bottom-8 sm:bottom-[36px] flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] text-cyan-300"
            >
              <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full border-[1.3px] border-[#38bdf8]/70">
                <span className="w-1.5 h-1.5 border-r-[1.3px] border-b-[1.3px] border-[#38bdf8] -translate-y-0.25 rotate-45 animate-bounce" />
              </span>
              <span>SCROLL TO DIVE</span>
            </div>
          </div>

          {/* Layer L2: Vision (Beat 2: Resolves out of deep-water blur) */}
          <div
            id="l2"
            ref={l2Ref}
            className="absolute inset-0 pointer-events-none z-24 flex items-center justify-center invisible"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(840px,92vw)] text-center text-white px-4">
              <div id="visChip" ref={visChipRef} className="chip-aqua">
                Our Mission & Vision
              </div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[clamp(34px,4.8vw,72px)] leading-tight tracking-[-0.04em] my-5 [text-shadow:0_4px_45px_rgba(2,12,24,0.9),0_1px_3px_rgba(6,182,212,0.4)]">
                {visionLines.map((lineWords, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {lineWords.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className="vision-word-elem inline-block whitespace-pre will-change-transform bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent"
                      >
                        {word}{' '}
                      </span>
                    ))}
                    {lineIdx < visionLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p
                id="visPara"
                ref={visParaRef}
                className="text-base sm:text-lg leading-relaxed text-cyan-100/90 [text-shadow:0_2px_16px_rgba(0,0,0,0.85)] max-w-2xl mx-auto"
              >
                A breakthrough in household water accounting and planetary watershed protection,
                engineered for everyday homes and global impact.
              </p>
            </div>
          </div>

          {/* Layer L3: Accounting & Hotspots (Beat 3: Living Water Metrics) */}
          <div id="l3" ref={l3Ref} className="absolute inset-0 pointer-events-none z-26 invisible">
            <p className="absolute left-6 sm:left-[34px] top-[14vh] w-[min(580px,88vw)] text-white text-[clamp(20px,2vw,30px)] leading-[1.2] tracking-[-0.02em] [text-shadow:0_0_28px_rgba(2,12,24,0.95)] font-medium">
              {acctWords.map((word, idx) => (
                <span
                  key={idx}
                  className="acct-word-elem inline-block whitespace-pre will-change-opacity"
                >
                  {word}{' '}
                </span>
              ))}
            </p>

            {/* 4 Interactive Ocean Hotspots */}
            {[
              { id: 1, left: '14%', top: '56%', label: 'Aquifer Recharge', val: '+4.2 mm/yr' },
              { id: 2, left: '35%', top: '42%', label: 'Freshwater Outflow', val: '3.1 km³/season' },
              { id: 3, left: '68%', top: '64%', label: 'Marine Biomass Index', val: '1,840 g/m²' },
              { id: 4, left: '82%', top: '48%', label: 'Ocean pH & Temp', val: '8.14 pH · 26.4 °C' },
            ].map((hs) => {
              const isOn = activeHotspot === hs.id;
              return (
                <div
                  key={hs.id}
                  style={{ left: hs.left, top: hs.top }}
                  onClick={() => setActiveHotspot(isOn ? null : hs.id)}
                  className={`hotspot-elem group absolute flex items-center gap-2.5 cursor-pointer select-none origin-center pointer-events-auto transition-transform duration-300 ${
                    isOn ? 'on' : ''
                  }`}
                >
                  <div className="relative w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_0_0_rgba(34,211,238,0.7)] animate-[dotPing_2.4s_infinite] group-hover:scale-115 transition-transform">
                    <span className="absolute w-2.5 h-[1.6px] bg-[#040d1a]" />
                    <span className="absolute w-[1.6px] h-2.5 bg-[#040d1a]" />
                  </div>
                  <div className="flex flex-col py-1.5 px-3 rounded-md bg-[#041628]/80 border border-cyan-400/35 backdrop-blur-md font-mono text-[10.5px] tracking-[0.14em] uppercase text-white shadow-xl">
                    <span className="text-cyan-200">{hs.label}</span>
                    <em
                      className={`not-italic text-[#38bdf8] font-bold overflow-hidden transition-all duration-450 ${
                        isOn
                          ? 'max-h-5 opacity-100 mt-0.75'
                          : 'max-h-0 opacity-0 group-hover:max-h-5 group-hover:opacity-100 group-hover:mt-0.75'
                      }`}
                    >
                      {hs.val}
                    </em>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer L4: Station (Beat 4: Pelagic Station 07 & Water Conservation Balance) */}
          <div id="l4" ref={l4Ref} className="absolute inset-0 pointer-events-none z-28 invisible">
            {/* Heading */}
            <div id="credBlock" ref={credRef} className="absolute left-6 sm:left-[34px] top-[12vh] sm:top-[14vh] max-w-[420px]">
              <div className="flex w-max font-mono text-[10.5px] py-1 px-2.5 rounded-[3px] bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 mb-3 font-semibold">
                ✕ Pelagic Station 07 · Coral Triangle Basin
              </div>
              <h3 className="font-['Space_Grotesk',sans-serif] text-white text-[clamp(22px,2.2vw,32px)] leading-[1.1] tracking-[-0.025em] [text-shadow:0_0_24px_rgba(0,0,0,0.9)] font-bold">
                Scientific precision for domestic and corporate water stewardship
              </h3>
            </div>

            {/* Glass Water Conservation Balance Card */}
            <div
              id="waterCard"
              ref={waterCardRef}
              className="absolute left-6 sm:left-[38%] top-auto sm:top-[38vh] bottom-20 sm:bottom-auto w-[280px] p-5 rounded-2xl bg-[#061e36]/55 border border-cyan-400/30 backdrop-blur-xl text-white pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <h4 className="font-['Space_Grotesk',sans-serif] text-[15px] font-semibold leading-[1.25] text-cyan-100">
                Accumulated water
                <br />
                conservation balance
              </h4>
              <div className="font-mono text-[9.5px] text-cyan-300/80 mt-1">
                Sub-basin 07 · 12 months rolling
              </div>
              <div className="mt-4 font-['Space_Grotesk',sans-serif] text-[48px] font-bold tracking-tight leading-none flex items-baseline gap-2">
                <span id="waterNum" ref={waterNumRef} className="text-white">
                  0
                </span>
                <span className="font-mono text-[11px] tracking-wider text-cyan-400 uppercase font-semibold">
                  kL saved
                </span>
              </div>
              <div className="absolute right-4 top-20 font-mono text-[9.5px] py-1 px-2 bg-cyan-400 text-[#040d1a] rounded-[3px] font-bold">
                +12.4 kL this mo
              </div>
              {/* Dynamic Sparkline SVG */}
              <svg className="w-full h-[65px] mt-4 overflow-visible" viewBox="0 0 220 70">
                <polyline
                  ref={sparkPolyRef}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,60 30,55 60,57 90,44 120,46 150,30 180,24 214,10"
                />
                <circle cx="90" cy="44" r="2.8" fill="#ffffff" />
                <circle cx="150" cy="30" r="2.8" fill="#ffffff" />
                <circle cx="214" cy="10" r="3.8" fill="#22d3ee" />
              </svg>
              <div className="font-mono text-[9.5px] tracking-[0.16em] text-cyan-300/70 mt-3 text-center">
                Q1 · Q2 · Q3 · Q4
              </div>
            </div>

            {/* 5 Feature Matrix Rows */}
            <div className="absolute right-6 sm:right-[34px] top-auto sm:top-[30vh] bottom-20 sm:bottom-auto w-[min(420px,38vw)] py-2 px-4.5 rounded-2xl bg-[#061e36]/65 border border-cyan-400/25 backdrop-blur-xl pointer-events-auto shadow-2xl">
              {[
                { idx: '01', text: 'Precision domestic volumetric monitoring (L, mL, Gal, m³)' },
                { idx: '02', text: 'Watershed-scale aquifer & river flow mapping' },
                { idx: '03', text: 'Republic Act 9275 & Clean Water Act compliance' },
                { idx: '04', text: 'Cryptographic tamper-proof water logs' },
                { idx: '05', text: 'Built for personal households and municipal utility scale' },
              ].map((row, i) => {
                const isOn = activeFeatRow === i;
                return (
                  <div
                    key={row.idx}
                    onClick={() => setActiveFeatRow(isOn ? null : i)}
                    className={`feat-row-elem grid grid-cols-[30px_1fr_16px] gap-2 items-center py-2.5 border-b border-cyan-500/15 last:border-b-0 font-mono text-[11px] tracking-[0.11em] uppercase text-cyan-100 cursor-pointer transition-all duration-300 hover:text-cyan-300 hover:pl-1.5 ${
                      isOn ? 'text-cyan-300 pl-1.5 font-bold' : ''
                    }`}
                  >
                    <span className="opacity-60">{row.idx}</span>
                    <span className="leading-tight">{row.text}</span>
                    <span
                      className={`transition-transform duration-300 ${
                        isOn ? 'translate-x-1 text-cyan-300' : ''
                      }`}
                    >
                      →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="prog absolute left-1/2 bottom-5 -translate-x-1/2 w-[120px] h-[2px] bg-cyan-900/50 rounded-full overflow-hidden z-40">
            <div
              id="progInner"
              ref={progInnerRef}
              className="h-full w-full bg-[#38bdf8] origin-left scale-x-0"
            />
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS SECTION (Slides up -30vh over the pinned 3D underwater stage) */}
      <section
        id="sol"
        ref={solSectionRef}
        className="relative z-30 -mt-[30vh] bg-slate-900/95 dark:bg-[#061426] rounded-t-[28px] border-t border-cyan-500/30 px-4 sm:px-8 pt-16 sm:pt-20 pb-24 shadow-[0_-30px_80px_rgba(0,0,0,0.85)] text-white backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Head */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10">
            <div className="max-w-2xl">
              <div className="chip-aqua">AquaTrack Solutions</div>
              <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-[clamp(34px,4vw,60px)] leading-[1.05] tracking-[-0.03em] mt-4 text-white">
                Protecting the freshwater cycle that sustains all ocean life
              </h2>
            </div>
            <div className="max-w-md text-[15px] leading-relaxed text-slate-300">
              Every drop conserved at home directly lessens the strain on municipal reservoirs,
              prevents river runoff contamination, and preserves marine sanctuaries.
            </div>
          </div>

          {/* 3 Tilting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mt-14">
            {/* Card 1: Domestic Water Intelligence */}
            <div className="sol-card-elem group relative h-[450px] rounded-2xl overflow-hidden bg-[#071d33] text-white cursor-pointer [transform-style:preserve-3d] transition-transform duration-150 ease-out border border-cyan-500/20 shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-108"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#041220]/75 via-[#041220]/40 to-[#030d1a]/95" />
              <div className="relative h-full p-6.5 flex flex-col justify-between z-10">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-wider uppercase text-cyan-300 font-semibold">
                    [Household water intelligence]
                  </span>
                  <span className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full bg-cyan-400 text-[#040d1a] text-sm font-bold transition-transform duration-300 group-hover:-rotate-45 shadow-md">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] text-[24px] font-bold tracking-tight leading-tight mb-2 text-white">
                    Smart domestic logging
                    <br />
                    &amp; leak detection
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-slate-200/90 max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-24 group-hover:opacity-100">
                    Real-time volumetric tracking with leak alarms, fixtures breakdown, and daily
                    conservation targets in Liters, Gallons, and m³.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Watershed & River Sanctuaries */}
            <div className="sol-card-elem group relative h-[450px] rounded-2xl overflow-hidden bg-[#071d33] text-white cursor-pointer [transform-style:preserve-3d] transition-transform duration-150 ease-out border border-cyan-500/20 shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-108"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#041220]/75 via-[#041220]/40 to-[#030d1a]/95" />
              <div className="relative h-full p-6.5 flex flex-col justify-between z-10">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-wider uppercase text-cyan-300 font-semibold">
                    [Watershed &amp; River Sanctuaries]
                  </span>
                  <span className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full bg-cyan-400 text-[#040d1a] text-sm font-bold transition-transform duration-300 group-hover:-rotate-45 shadow-md">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] text-[24px] font-bold tracking-tight leading-tight mb-2 text-white">
                    Philippine Clean Water
                    <br />
                    Act (RA 9275)
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-slate-200/90 max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-24 group-hover:opacity-100">
                    Comprehensive legal repository and educational insights on river basin
                    rehabilitation, discharge permits, and mangrove coastal defense.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Marine Megafauna & Ocean Biodiversity */}
            <div className="sol-card-elem group relative h-[450px] rounded-2xl overflow-hidden bg-[#071d33] text-white cursor-pointer [transform-style:preserve-3d] transition-transform duration-150 ease-out border border-cyan-500/20 shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-108"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#041220]/75 via-[#041220]/40 to-[#030d1a]/95" />
              <div className="relative h-full p-6.5 flex flex-col justify-between z-10">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-wider uppercase text-cyan-300 font-semibold">
                    [Ocean Biodiversity]
                  </span>
                  <span className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full bg-cyan-400 text-[#040d1a] text-sm font-bold transition-transform duration-300 group-hover:-rotate-45 shadow-md">
                    →
                  </span>
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk',sans-serif] text-[24px] font-bold tracking-tight leading-tight mb-2 text-white">
                    Blue whale migration
                    <br />
                    &amp; reef baselines
                  </h3>
                  <p className="text-[13.5px] leading-relaxed text-slate-200/90 max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-24 group-hover:opacity-100">
                    Connecting upstream household water habits with downstream ocean health, pelagic
                    biodiversity indices, and coral reef resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Animated Count-up Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-cyan-500/20">
            <div className="pt-2">
              <div
                className="stat-num-elem font-['Space_Grotesk',sans-serif] text-[44px] font-bold tracking-tight text-white leading-none"
                data-target="4.8"
                data-decimals="1"
                data-suffix="M"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-cyan-300 mt-2 font-medium">
                Liters Conserved
              </div>
            </div>

            <div className="pt-2">
              <div
                className="stat-num-elem font-['Space_Grotesk',sans-serif] text-[44px] font-bold tracking-tight text-white leading-none"
                data-target="120"
                data-suffix="+"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-cyan-300 mt-2 font-medium">
                Languages Supported
              </div>
            </div>

            <div className="pt-2">
              <div
                className="stat-num-elem font-['Space_Grotesk',sans-serif] text-[44px] font-bold tracking-tight text-white leading-none"
                data-target="100"
                data-suffix="%"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-cyan-300 mt-2 font-medium">
                Verified Real Users
              </div>
            </div>

            <div className="pt-2">
              <div
                className="stat-num-elem font-['Space_Grotesk',sans-serif] text-[44px] font-bold tracking-tight text-white leading-none"
                data-target="99.8"
                data-decimals="1"
                data-suffix="%"
              >
                0
              </div>
              <div className="font-mono text-[10.5px] tracking-widest uppercase text-cyan-300 mt-2 font-medium">
                Data Uptime &amp; Sync
              </div>
            </div>
          </div>

          {/* AQUATRACK PLATFORM LAUNCHPAD */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#072442] via-[#05172b] to-[#020b16] border border-cyan-400/30 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>AquaTrack Ecosystem Architecture</span>
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-['Space_Grotesk',sans-serif] leading-tight">
                From Ocean Telemetry to Everyday Action.
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                AquaTrack unites high-precision domestic water consumption logging with national
                environmental legislation, interactive conservation arcade games, and real-time
                verified community science.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Droplets className="w-5 h-5 text-cyan-400 mb-2" />
                  <h5 className="font-bold text-xs text-white">Daily Tracking</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">5 Global Units</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <BarChart3 className="w-5 h-5 text-cyan-400 mb-2" />
                  <h5 className="font-bold text-xs text-white">Analytics</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Rolling 7d &amp; 30d</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Scale className="w-5 h-5 text-cyan-400 mb-2" />
                  <h5 className="font-bold text-xs text-white">PH Water Laws</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">RA 9275 &amp; PD 1067</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Gamepad2 className="w-5 h-5 text-cyan-400 mb-2" />
                  <h5 className="font-bold text-xs text-white">Eco Games</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Interactive Arcade</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#22d3ee] hover:brightness-110 text-[#040d1a] font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account</span>
                </button>

                <button
                  onClick={onOpenLogin}
                  className="px-6 py-3.5 rounded-xl border border-cyan-400/35 hover:bg-cyan-500/10 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Sign In to AquaTrack</span>
                </button>

                <button
                  onClick={onOpenNews}
                  className="px-4 py-3.5 rounded-xl text-cyan-300 hover:text-white text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Explore Water News</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              © 2026 AquaTrack. Track Every Drop, Protect Every Tomorrow. All rights reserved.
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <button onClick={onOpenNews} className="hover:text-cyan-300 cursor-pointer">
                Water News
              </button>
              <span>·</span>
              <button onClick={onOpenCreator} className="hover:text-cyan-300 cursor-pointer">
                About Creator
              </button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};
