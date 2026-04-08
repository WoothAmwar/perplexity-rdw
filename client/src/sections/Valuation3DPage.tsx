import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

// DCF calculation engine
function calcDCF(wacc: number, termGrowth: number, beta: number): number {
  // Base FCF path: FY26E=-5, FY27E=15, FY28E=40, FY29E=58, FY30E=72 ($M)
  const baseFCFs = [-5, 15, 40, 58, 72];
  // Beta adjustment factor on growth
  const betaAdj = (2.49 - beta) * 0.12 + 1;
  const fcfs = baseFCFs.map((f) => f * betaAdj);

  const w = wacc / 100;
  const g = termGrowth / 100;

  // PV of FCFs
  let pvFCF = 0;
  fcfs.forEach((f, i) => {
    pvFCF += f / Math.pow(1 + w, i + 1);
  });

  // Terminal value (Gordon Growth)
  const terminalFCF = fcfs[fcfs.length - 1] * (1 + g);
  const tv = terminalFCF / (w - g);
  const pvTV = tv / Math.pow(1 + w, fcfs.length);

  const ev = pvFCF + pvTV;
  const netDebt = 213 - 40; // FY28E
  const equity = ev - netDebt;
  const shares = 137.1;
  const price = equity / shares;
  return Math.max(1, Math.min(30, price));
}

// Sensitivity matrix data
const WACC_RANGE = [10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0];
const TGROWTH_RANGE = [2.5, 3.0, 3.5, 4.0];

export default function Valuation3DPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [beta, setBeta] = useState(2.49);
  const [hoverCell, setHoverCell] = useState<{ wacc: number; tg: number; price: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sceneRef = useRef<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; meshGroup: THREE.Group } | null>(null);
  const frameRef = useRef<number>(0);
  const isRotating = useRef(true);

  // Build surface geometry
  const buildSurface = useCallback((b: number) => {
    const W = WACC_RANGE.length;
    const H = TGROWTH_RANGE.length;
    const vertices: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const prices = WACC_RANGE.map((w) => TGROWTH_RANGE.map((tg) => calcDCF(w, tg, b)));

    const minP = Math.min(...prices.flat());
    const maxP = Math.max(...prices.flat());

    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        const x = (i / (W - 1) - 0.5) * 4;
        const z = (j / (H - 1) - 0.5) * 2;
        const y = (prices[i][j] - minP) / (maxP - minP) * 2 - 0.5;
        vertices.push(x, y, z);

        // Color gradient: low=red, mid=gold, high=green
        const t = (prices[i][j] - minP) / (maxP - minP);
        const r = t < 0.5 ? 1 : 1 - (t - 0.5) * 2;
        const g2 = t < 0.5 ? t * 2 : 1;
        const b2 = t > 0.7 ? (t - 0.7) * 3 : 0;
        colors.push(r, g2, b2);
      }
    }

    for (let j = 0; j < H - 1; j++) {
      for (let i = 0; i < W - 1; i++) {
        const a = j * W + i;
        const b2 = j * W + i + 1;
        const c = (j + 1) * W + i + 1;
        const d = (j + 1) * W + i;
        indices.push(a, b2, c, a, c, d);
      }
    }

    return { vertices, colors, indices, prices };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 700;
    const H = 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(3.5, 3, 4.5);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xf5c842, 1.2);
    dir.position.set(2, 4, 2);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x1abcb4, 0.6);
    dir2.position.set(-2, 2, -2);
    scene.add(dir2);

    // Grid
    const gridHelper = new THREE.GridHelper(5, 10, 0x1e2a3a, 0x1e2a3a);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Axes
    const axesMat = new THREE.LineBasicMaterial({ color: 0x3a4a5c });
    const addAxis = (from: [number, number, number], to: [number, number, number]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...from),
        new THREE.Vector3(...to),
      ]);
      scene.add(new THREE.Line(geo, axesMat));
    };
    addAxis([-2.5, -0.5, 0], [2.5, -0.5, 0]);
    addAxis([0, -0.5, -1.5], [0, -0.5, 1.5]);
    addAxis([0, -0.5, 0], [0, 2.5, 0]);

    // Mesh group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    sceneRef.current = { scene, camera, meshGroup };

    // Build initial surface
    const updateSurface = (b: number) => {
      while (meshGroup.children.length) meshGroup.remove(meshGroup.children[0]);

      const { vertices, colors, indices } = buildSurface(b);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshPhongMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        shininess: 60,
        transparent: true,
        opacity: 0.85,
      });

      const mesh = new THREE.Mesh(geo, mat);
      meshGroup.add(mesh);

      // Wireframe
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x1e2a3a, wireframe: true, transparent: true, opacity: 0.3 });
      const wire = new THREE.Mesh(geo.clone(), wireMat);
      meshGroup.add(wire);

      // Target price marker
      const targetPriceWacc = 10.5; // β=1.25 scenario
      const targetTG = 3.0;
      const tp = calcDCF(targetPriceWacc, targetTG, b);
      const wi = WACC_RANGE.indexOf(WACC_RANGE.reduce((prev, curr) => Math.abs(curr - targetPriceWacc) < Math.abs(prev - targetPriceWacc) ? curr : prev));
      const ti = TGROWTH_RANGE.indexOf(TGROWTH_RANGE.reduce((prev, curr) => Math.abs(curr - targetTG) < Math.abs(prev - targetTG) ? curr : prev));
      const { prices } = buildSurface(b);
      const minP = Math.min(...prices.flat());
      const maxP = Math.max(...prices.flat());
      const px = (wi / (WACC_RANGE.length - 1) - 0.5) * 4;
      const pz = (ti / (TGROWTH_RANGE.length - 1) - 0.5) * 2;
      const py = (tp - minP) / (maxP - minP) * 2 - 0.5 + 0.15;

      const markerGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const markerMat = new THREE.MeshPhongMaterial({ color: 0xd4a017, emissive: 0xd4a017, emissiveIntensity: 0.5 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(px, py, pz);
      meshGroup.add(marker);
    };

    updateSurface(beta);

    // Mouse drag to rotate
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouseX = e.clientX; prevMouseY = e.clientY; isRotating.current = false; };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      meshGroup.rotation.y += dx * 0.01;
      meshGroup.rotation.x += dy * 0.01;
      prevMouseX = e.clientX; prevMouseY = e.clientY;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    // Animate
    let angle = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (isRotating.current) {
        angle += 0.003;
        meshGroup.rotation.y = angle;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update surface when beta changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const { meshGroup } = sceneRef.current;
    while (meshGroup.children.length) meshGroup.remove(meshGroup.children[0]);

    const { vertices, colors, indices } = buildSurface(beta);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.DoubleSide, shininess: 60, transparent: true, opacity: 0.85 });
    meshGroup.add(new THREE.Mesh(geo, mat));
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x1e2a3a, wireframe: true, transparent: true, opacity: 0.3 });
    meshGroup.add(new THREE.Mesh(geo.clone(), wireMat));
  }, [beta, buildSurface]);

  // 2D sensitivity matrix for hover
  const matrix = WACC_RANGE.map((w) => TGROWTH_RANGE.map((tg) => calcDCF(w, tg, beta)));
  const allPrices = matrix.flat();
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  const cellColor = (price: number) => {
    const t = (price - minPrice) / (maxPrice - minPrice);
    if (t > 0.66) return 'rgba(76,175,80,0.25)';
    if (t > 0.33) return 'rgba(212,160,23,0.2)';
    return 'rgba(192,57,43,0.2)';
  };

  const cellBorder = (price: number) => {
    const t = (price - minPrice) / (maxPrice - minPrice);
    if (t > 0.66) return '#4CAF50';
    if (t > 0.33) return '#D4A017';
    return '#C0392B';
  };

  return (
    <section id="valuation3d" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 14 — Live 3D Valuation</div>
          <h2 className="section-title mb-4">
            DCF in Three Dimensions.<br />
            <span className="text-gradient-gold">Watch the Surface Warp.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            The 3D surface maps every combination of WACC (X) and Terminal Growth Rate (Y) to a share price (Z). Drag to rotate. Use the Beta slider to watch the entire surface shift upward as execution de-risks the business and beta compresses from 2.49 to 1.25.
          </p>
        </div>

        {/* Beta slider */}
        <div className="glass-card p-5 mb-6">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-[11px] text-[#5C6880] font-mono uppercase tracking-wider mb-1">Beta Adjustment</div>
              <div className="text-3xl font-black font-mono" style={{ color: beta <= 1.5 ? '#4CAF50' : beta <= 2.0 ? '#D4A017' : '#C0392B' }}>
                β = {beta.toFixed(2)}
              </div>
              <div className="text-[11px] text-[#5C6880] mt-1">
                {beta >= 2.3 ? 'Development stage risk pricing' : beta >= 1.6 ? 'Transition — production ramp' : 'Mature defense/space peer'}
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <input
                type="range"
                min={1.25}
                max={2.49}
                step={0.01}
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full accent-yellow-500"
                data-testid="beta-slider"
                style={{ accentColor: '#D4A017' }}
              />
              <div className="flex justify-between text-[10px] text-[#3A4A5C] font-mono mt-1">
                <span className="text-[#4CAF50]">1.25 (mature)</span>
                <span className="text-[#C0392B]">2.49 (current)</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-[#5C6880] uppercase tracking-wider mb-1">Base Case PT</div>
              <div className="text-2xl font-black font-mono" style={{ color: beta <= 1.5 ? '#4CAF50' : '#D4A017' }}>
                ${calcDCF(10.5, 3.0, beta).toFixed(2)}
              </div>
              <div className="text-[11px] text-[#5C6880]">at WACC 10.5%, TG 3.0%</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 3D Surface */}
          <div>
            <div className="section-eyebrow mb-2">3D Surface — Drag to Rotate · Slider = Beta Re-Rating</div>
            <div
              ref={mountRef}
              className="rounded-xl overflow-hidden border border-[#1E2A3A]"
              style={{ height: 400, cursor: 'grab' }}
              data-testid="valuation-3d-canvas"
            />
            <div className="flex justify-between mt-2 text-[10px] font-mono text-[#3A4A5C]">
              <span>X: WACC (10%–13%)</span>
              <span>Y: Share Price</span>
              <span>Z: Terminal Growth (2.5%–4%)</span>
            </div>
            <div className="flex gap-4 mt-2 justify-center text-[10px] font-mono">
              <span className="text-[#C0392B]">■ Low</span>
              <span className="text-[#D4A017]">■ Mid</span>
              <span className="text-[#4CAF50]">■ High</span>
              <span className="text-[#D4A017]">● Base Case PT</span>
            </div>
          </div>

          {/* 2D Sensitivity matrix with full hover */}
          <div>
            <div className="section-eyebrow mb-2">2D Sensitivity Matrix — Hover for Detail</div>
            <div className="glass-card p-4 relative overflow-x-auto">
              <table className="w-full text-center" data-testid="sensitivity-matrix">
                <thead>
                  <tr>
                    <th className="text-[10px] text-[#5C6880] font-mono p-2">WACC ↓ / TG →</th>
                    {TGROWTH_RANGE.map((tg) => (
                      <th key={tg} className="text-[11px] text-[#D4A017] font-mono p-2">{tg}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WACC_RANGE.map((wacc, wi) => (
                    <tr key={wacc}>
                      <td className="text-[11px] text-[#1ABCB4] font-mono font-semibold p-2">{wacc}%</td>
                      {TGROWTH_RANGE.map((tg, ti) => {
                        const price = matrix[wi][ti];
                        const isHovered = hoverCell?.wacc === wacc && hoverCell?.tg === tg;
                        return (
                          <td
                            key={tg}
                            className="relative transition-all duration-150 font-mono text-sm font-bold"
                            style={{
                              background: isHovered ? cellBorder(price) + '40' : cellColor(price),
                              border: `1px solid ${isHovered ? cellBorder(price) : cellBorder(price) + '50'}`,
                              color: isHovered ? '#FFFFFF' : cellBorder(price),
                              padding: '10px 8px',
                              cursor: 'pointer',
                              borderRadius: 4,
                              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                              boxShadow: isHovered ? `0 0 16px ${cellBorder(price)}60` : 'none',
                              zIndex: isHovered ? 10 : 1,
                            }}
                            onMouseEnter={(e) => {
                              setHoverCell({ wacc, tg, price });
                              setMousePos({ x: e.clientX, y: e.clientY });
                            }}
                            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setHoverCell(null)}
                            data-testid={`cell-${wacc}-${tg}`}
                          >
                            ${price.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoverCell && (
          <div
            style={{
              position: 'fixed',
              left: mousePos.x + 16,
              top: mousePos.y - 10,
              zIndex: 9999,
              background: 'rgba(13,17,23,0.97)',
              border: `1px solid ${cellBorder(hoverCell.price)}`,
              borderRadius: 10,
              padding: '14px 18px',
              fontSize: 13,
              minWidth: 220,
              color: '#E8EDF5',
              pointerEvents: 'none',
              boxShadow: `0 8px 40px rgba(0,0,0,0.8), 0 0 20px ${cellBorder(hoverCell.price)}30`,
            }}
          >
            <div className="text-[11px] font-mono text-[#5C6880] tracking-widest uppercase mb-2">DCF Scenario</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#5C6880]">WACC</span>
                <span className="font-mono font-bold text-[#1ABCB4]">{hoverCell.wacc}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6880]">Terminal Growth</span>
                <span className="font-mono font-bold text-[#D4A017]">{hoverCell.tg}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C6880]">Beta Applied</span>
                <span className="font-mono font-bold" style={{ color: beta <= 1.5 ? '#4CAF50' : '#D4A017' }}>β {beta.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#1E2A3A] pt-1.5 flex justify-between">
                <span className="font-semibold text-[#E8EDF5]">Implied Price</span>
                <span className="text-xl font-black font-mono" style={{ color: cellBorder(hoverCell.price) }}>
                  ${hoverCell.price.toFixed(2)}
                </span>
              </div>
              <div className="text-[11px] text-[#5C6880] pt-1">
                {hoverCell.price >= 14 ? '▲ Strong Buy territory' : hoverCell.price >= 10 ? '▲ Upside scenario' : hoverCell.price >= 7 ? '→ Near current price' : '▼ Bear case'}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
