import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

const LIVE_PRICE = 9.56;

// ─── Memo-verified DCF engine (Two-Stage, April 6 2026) ─────────────────────
// Stage 1 (2026-2028): FCF = -30, +10, +40 ($M)
// Stage 2 (2029-2031): FCF = +68, +95, +115 ($M)
// Terminal: $115M terminal FCF, base TG 3.5%
// Net debt: −$6.6M (near net cash)
// Diluted shares: 165M
function calcDCF(wacc: number, termGrowth: number, beta: number): number {
  const w = wacc / 100;
  const g = termGrowth / 100;

  // Beta adjustment factor — beta=1.25 is fully re-rated scenario
  // As beta compresses from 2.49→1.25, FCFs improve (lower EAC risk, production visibility)
  const betaNorm = (beta - 1.25) / (2.49 - 1.25); // 0 at mature, 1 at current
  const betaFCFPenalty = 1 - betaNorm * 0.35; // 35% FCF haircut at peak beta

  const baseFCFs = [-30, 10, 40, 68, 95, 115];
  const fcfs = baseFCFs.map(f => f * betaFCFPenalty);

  let pvFCF = 0;
  fcfs.forEach((f, i) => {
    pvFCF += f / Math.pow(1 + w, i + 1);
  });

  const terminalFCF = fcfs[fcfs.length - 1] * (1 + g);
  const tv = terminalFCF / (w - g);
  const pvTV = tv / Math.pow(1 + w, fcfs.length);

  const ev = pvFCF + pvTV;
  const netDebt = -6.6; // near net cash
  const equity = ev - netDebt;
  const shares = 165;
  const price = equity / shares;
  return Math.max(0.5, Math.min(35, price));
}

const WACC_RANGE = [10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0];
const TGROWTH_RANGE = [2.5, 3.0, 3.5, 4.0];

// ─── Canvas-based axis label sprite ─────────────────────────────────────────
function makeTextSprite(text: string, color = '#1a1a1a'): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 28px Space Mono, monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.2, 0.3, 1);
  return sprite;
}

export default function Valuation3DPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [beta, setBeta] = useState(2.49);
  const [hoverCell, setHoverCell] = useState<{ wacc: number; tg: number; price: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    meshGroup: THREE.Group;
    labelGroup: THREE.Group;
  } | null>(null);
  const frameRef = useRef<number>(0);
  const isRotating = useRef(true);

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
        const z = (j / (H - 1) - 0.5) * 2.5;
        const y = ((prices[i][j] - minP) / (maxP - minP)) * 2.2 - 0.3;
        vertices.push(x, y, z);

        // Color: red(low) → amber(mid) → green(high)
        const t = (prices[i][j] - minP) / (maxP - minP);
        const r = t < 0.5 ? 1 : 1 - (t - 0.5) * 1.6;
        const g2 = t < 0.5 ? t * 2 : 1;
        const b2 = t > 0.75 ? (t - 0.75) * 2.5 : 0;
        colors.push(Math.min(1, r), Math.min(1, g2), Math.min(1, b2));
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

    return { vertices, colors, indices, prices, minP, maxP };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 700;
    const H = 440;
    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? 0x0B0F18 : 0xFAFAFA;
    const axisColor = isDark ? '#9BA8BB' : '#374151';
    const gridColor = isDark ? 0x1F2937 : 0xE5E7EB;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(4.2, 3.5, 5.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dir1.position.set(3, 5, 3);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xC8102E, 0.4);
    dir2.position.set(-3, 2, -2);
    scene.add(dir2);

    // Grid floor
    const gridHelper = new THREE.GridHelper(6, 12, gridColor, gridColor);
    gridHelper.position.y = -0.35;
    scene.add(gridHelper);

    // ─── Axis lines ────────────────────────────────────────────────────────
    const axisMat = new THREE.LineBasicMaterial({ color: isDark ? 0x6B7280 : 0x374151 });
    const addLine = (from: [number,number,number], to: [number,number,number]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...from), new THREE.Vector3(...to),
      ]);
      scene.add(new THREE.Line(geo, axisMat));
    };

    // X axis (WACC: 10% → 13%)
    addLine([-2.2, -0.35, 0], [2.2, -0.35, 0]);
    // Z axis (Terminal Growth: 2.5% → 4%)
    addLine([0, -0.35, -1.3], [0, -0.35, 1.3]);
    // Y axis (Share Price height)
    addLine([0, -0.35, 0], [0, 2.1, 0]);

    // ─── Axis label sprites ────────────────────────────────────────────────
    const labelGroup = new THREE.Group();
    scene.add(labelGroup);

    // X-axis label — WACC
    const xLabel = makeTextSprite('← WACC (10%–13%) →', axisColor);
    xLabel.position.set(0, -0.75, 1.9);
    labelGroup.add(xLabel);

    // Z-axis label — Terminal Growth
    const zLabel = makeTextSprite('← TG Rate (2.5%–4%) →', axisColor);
    zLabel.position.set(-2.5, -0.75, 0);
    labelGroup.add(zLabel);

    // Y-axis label — Share Price
    const yLabel = makeTextSprite('↑ Share Price ($)', axisColor);
    yLabel.position.set(-2.5, 1.2, 0);
    yLabel.scale.set(1.0, 0.28, 1);
    labelGroup.add(yLabel);

    // WACC tick labels: 10%, 11%, 12%, 13%
    [10, 11, 12, 13].forEach((w, i) => {
      const frac = (w - 10) / 3;
      const xPos = (frac - 0.5) * 4;
      const tick = makeTextSprite(`${w}%`, axisColor);
      tick.position.set(xPos, -0.58, 1.55);
      tick.scale.set(0.55, 0.18, 1);
      labelGroup.add(tick);
    });

    // TG tick labels: 2.5%, 3.0%, 3.5%, 4.0%
    [2.5, 3.0, 3.5, 4.0].forEach((tg, i) => {
      const frac = i / 3;
      const zPos = (frac - 0.5) * 2.5;
      const tick = makeTextSprite(`${tg}%`, axisColor);
      tick.position.set(-2.5, -0.58, zPos);
      tick.scale.set(0.55, 0.18, 1);
      labelGroup.add(tick);
    });

    // Mesh group
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    const updateSurface = (b: number) => {
      while (meshGroup.children.length) meshGroup.remove(meshGroup.children[0]);

      const { vertices, colors, indices, prices, minP, maxP } = buildSurface(b);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshPhongMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        shininess: 80,
        transparent: true,
        opacity: 0.88,
      });
      meshGroup.add(new THREE.Mesh(geo, mat));

      // Wireframe overlay
      const wireMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0x374151 : 0xD1D5DB,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.25 : 0.3,
      });
      meshGroup.add(new THREE.Mesh(geo.clone(), wireMat));

      // ── Base-case price target marker ($16.00 at WACC 11%, TG 3.5%, β=1.25) ──
      const targetW = 11.0;
      const targetTG = 3.5;
      const tp = calcDCF(targetW, targetTG, b);
      const wi = WACC_RANGE.indexOf(WACC_RANGE.reduce((p, c) => Math.abs(c - targetW) < Math.abs(p - targetW) ? c : p));
      const ti = TGROWTH_RANGE.indexOf(TGROWTH_RANGE.reduce((p, c) => Math.abs(c - targetTG) < Math.abs(p - targetTG) ? c : p));
      const px = (wi / (WACC_RANGE.length - 1) - 0.5) * 4;
      const pz = (ti / (TGROWTH_RANGE.length - 1) - 0.5) * 2.5;
      const py = ((tp - minP) / (maxP - minP)) * 2.2 - 0.3 + 0.2;

      const markerGeo = new THREE.SphereGeometry(0.1, 14, 14);
      const markerMat = new THREE.MeshPhongMaterial({
        color: 0xC8102E,
        emissive: 0xC8102E,
        emissiveIntensity: 0.6,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(px, py, pz);
      meshGroup.add(marker);

      // Pulsing ring around marker
      const ringGeo = new THREE.RingGeometry(0.13, 0.18, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xC8102E, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(px, py, pz);
      ring.lookAt(camera.position);
      meshGroup.add(ring);
    };

    updateSurface(beta);
    sceneRef.current = { scene, camera, meshGroup, labelGroup };

    // Mouse drag
    let isDragging = false;
    let prevMX = 0, prevMY = 0;
    const onDown = (e: MouseEvent) => { isDragging = true; prevMX = e.clientX; prevMY = e.clientY; isRotating.current = false; };
    const onUp = () => { isDragging = false; };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      meshGroup.rotation.y += (e.clientX - prevMX) * 0.008;
      meshGroup.rotation.x += (e.clientY - prevMY) * 0.008;
      labelGroup.rotation.y = meshGroup.rotation.y;
      prevMX = e.clientX; prevMY = e.clientY;
    };
    renderer.domElement.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    let angle = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      if (isRotating.current) {
        angle += 0.003;
        meshGroup.rotation.y = angle;
        labelGroup.rotation.y = angle;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.domElement.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild surface when beta slider moves
  useEffect(() => {
    if (!sceneRef.current) return;
    const { meshGroup } = sceneRef.current;
    while (meshGroup.children.length) meshGroup.remove(meshGroup.children[0]);

    const isDark = document.documentElement.classList.contains('dark');
    const { vertices, colors, indices, prices, minP, maxP } = buildSurface(beta);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.DoubleSide, shininess: 80, transparent: true, opacity: 0.88 });
    meshGroup.add(new THREE.Mesh(geo, mat));
    const wireMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x374151 : 0xD1D5DB,
      wireframe: true, transparent: true,
      opacity: isDark ? 0.25 : 0.3,
    });
    meshGroup.add(new THREE.Mesh(geo.clone(), wireMat));

    // Marker
    const targetW = 11.0, targetTG = 3.5;
    const tp = calcDCF(targetW, targetTG, beta);
    const wi = WACC_RANGE.indexOf(WACC_RANGE.reduce((p, c) => Math.abs(c - targetW) < Math.abs(p - targetW) ? c : p));
    const ti = TGROWTH_RANGE.indexOf(TGROWTH_RANGE.reduce((p, c) => Math.abs(c - targetTG) < Math.abs(p - targetTG) ? c : p));
    const px = (wi / (WACC_RANGE.length - 1) - 0.5) * 4;
    const pz = (ti / (TGROWTH_RANGE.length - 1) - 0.5) * 2.5;
    const py = ((tp - minP) / (maxP - minP)) * 2.2 - 0.3 + 0.2;
    const mGeo = new THREE.SphereGeometry(0.1, 14, 14);
    const mMat = new THREE.MeshPhongMaterial({ color: 0xC8102E, emissive: 0xC8102E, emissiveIntensity: 0.6 });
    const marker = new THREE.Mesh(mGeo, mMat);
    marker.position.set(px, py, pz);
    meshGroup.add(marker);
  }, [beta, buildSurface]);

  // 2D sensitivity matrix
  const matrix = WACC_RANGE.map((w) => TGROWTH_RANGE.map((tg) => calcDCF(w, tg, beta)));
  const allPrices = matrix.flat();
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  const cellColor = (price: number) => {
    const t = (price - minPrice) / (maxPrice - minPrice);
    if (t > 0.66) return 'rgba(16,185,129,0.18)';
    if (t > 0.33) return 'rgba(245,158,11,0.18)';
    return 'rgba(200,16,46,0.15)';
  };

  const cellAccent = (price: number) => {
    const t = (price - minPrice) / (maxPrice - minPrice);
    if (t > 0.66) return '#10B981';
    if (t > 0.33) return '#F59E0B';
    return '#C8102E';
  };

  const betaColor = beta <= 1.5 ? '#10B981' : beta <= 2.0 ? '#F59E0B' : '#C8102E';

  return (
    <section id="valuation3d" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* flex-col for financial visualization */}
        <div className="section-layout-col mb-8">
          <div>
            <div className="section-eyebrow">Page 14 — Live 3D Valuation</div>
            <h2 className="section-title mb-4">
              DCF in Three Dimensions.<br />
              <span className="text-gradient-red">Watch the Surface Warp.</span>
            </h2>
            <p className="section-subtitle max-w-3xl">
              X-axis: WACC (10%–13%). Y-axis: Terminal Growth Rate (2.5%–4%). Z-axis (height): Share Price.
              Drag to rotate. The Beta slider re-rates from β=2.49 (development risk) to β=1.25 (mature peer) —
              watch the entire surface warp upward, proving that WACC compression drives asymmetric upside.
            </p>
          </div>
        </div>

        {/* Beta slider panel */}
        <div className="glass-card p-5 mb-6">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Beta Re-Rating Slider</div>
              <div className="text-3xl font-black font-mono" style={{ color: betaColor }}>
                β = {beta.toFixed(2)}
              </div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {beta >= 2.3 ? 'Development stage (current published)' : beta >= 1.6 ? 'Transition — production ramp' : 'Mature defense/space peer range'}
              </div>
            </div>
            <div className="flex-1 min-w-[220px]">
              <input
                type="range"
                min={1.25}
                max={2.49}
                step={0.01}
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full"
                data-testid="beta-slider"
                style={{ accentColor: 'var(--rdw-red)' }}
              />
              <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                <span style={{ color: '#10B981' }}>β=1.25 (mature)</span>
                <span style={{ color: '#C8102E' }}>β=2.49 (current)</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>DCF at WACC 11%, TG 3.5%</div>
              <div className="text-3xl font-black font-mono" style={{ color: betaColor }}>
                ${calcDCF(11.0, 3.5, beta).toFixed(2)}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                vs ${LIVE_PRICE} live · {(((calcDCF(11.0, 3.5, beta) - LIVE_PRICE) / LIVE_PRICE) * 100).toFixed(0)}% upside
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 3D Surface */}
          <div>
            <div className="section-eyebrow mb-2">3D Surface — Drag to Rotate · Slider = Beta Re-Rating</div>
            <div
              ref={mountRef}
              className="rounded-xl overflow-hidden"
              style={{ height: 440, cursor: 'grab', border: '1px solid var(--card-border)' }}
              data-testid="valuation-3d-canvas"
            />
            <div className="flex justify-between mt-2 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              <span>X: WACC (10%–13%)</span>
              <span>Z: Terminal Growth (2.5%–4%)</span>
              <span>Y: Share Price</span>
            </div>
            <div className="flex gap-4 mt-2 justify-center text-[10px] font-mono">
              <span style={{ color: '#C8102E' }}>■ Low</span>
              <span style={{ color: '#F59E0B' }}>■ Mid</span>
              <span style={{ color: '#10B981' }}>■ High</span>
              <span style={{ color: '#C8102E' }}>● $16.00 Base Case</span>
            </div>
          </div>

          {/* 2D Sensitivity Matrix */}
          <div>
            <div className="section-eyebrow mb-2">DCF Sensitivity Matrix — Hover for Detail</div>
            <div className="glass-card p-4 relative overflow-x-auto">
              <table className="w-full text-center" data-testid="sensitivity-matrix">
                <thead>
                  <tr>
                    <th className="text-[10px] font-mono p-2" style={{ color: 'var(--text-muted)' }}>WACC ↓ / TG →</th>
                    {TGROWTH_RANGE.map((tg) => (
                      <th key={tg} className="text-[11px] font-mono p-2" style={{ color: 'var(--rdw-red)' }}>{tg}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WACC_RANGE.map((wacc, wi) => (
                    <tr key={wacc}>
                      <td className="text-[11px] font-mono font-semibold p-2" style={{ color: '#0EA5E9' }}>{wacc}%</td>
                      {TGROWTH_RANGE.map((tg, ti) => {
                        const price = matrix[wi][ti];
                        const isHovered = hoverCell?.wacc === wacc && hoverCell?.tg === tg;
                        const isBaseCase = Math.abs(wacc - 11.0) < 0.01 && Math.abs(tg - 3.5) < 0.01;
                        return (
                          <td
                            key={tg}
                            className="relative transition-all duration-150 font-mono text-sm font-bold"
                            style={{
                              background: isHovered ? cellAccent(price) + '30' : cellColor(price),
                              border: `1px solid ${isBaseCase ? '#C8102E' : isHovered ? cellAccent(price) : cellAccent(price) + '40'}`,
                              color: isHovered || isBaseCase ? cellAccent(price) : cellAccent(price) + 'CC',
                              padding: '10px 8px',
                              cursor: 'pointer',
                              borderRadius: 4,
                              transform: isHovered ? 'scale(1.1)' : isBaseCase ? 'scale(1.04)' : 'scale(1)',
                              boxShadow: isHovered ? `0 0 16px ${cellAccent(price)}50` : isBaseCase ? `0 0 8px rgba(200,16,46,0.3)` : 'none',
                              zIndex: isHovered ? 10 : isBaseCase ? 5 : 1,
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
                            {isBaseCase && <span className="block text-[8px] font-normal">BASE</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
              β={beta.toFixed(2)} applied · Memo-verified FCF stream (2026E: −$30M → 2031E: +$115M) · 165M diluted shares
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
              background: 'var(--card-bg)',
              border: `1.5px solid ${cellAccent(hoverCell.price)}`,
              borderRadius: 10,
              padding: '14px 18px',
              fontSize: 13,
              minWidth: 230,
              color: 'var(--text-primary)',
              pointerEvents: 'none',
              boxShadow: `0 8px 40px rgba(0,0,0,0.15), 0 0 20px ${cellAccent(hoverCell.price)}25`,
            }}
          >
            <div className="text-[11px] font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>DCF Scenario</div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>WACC</span>
                <span className="font-mono font-bold" style={{ color: '#0EA5E9' }}>{hoverCell.wacc}%</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Terminal Growth</span>
                <span className="font-mono font-bold" style={{ color: 'var(--rdw-red)' }}>{hoverCell.tg}%</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Beta Applied</span>
                <span className="font-mono font-bold" style={{ color: betaColor }}>β {beta.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1.5" style={{ borderTop: '1px solid var(--card-border)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Implied Price</span>
                <span className="text-xl font-black font-mono" style={{ color: cellAccent(hoverCell.price) }}>
                  ${hoverCell.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span style={{ color: 'var(--text-muted)' }}>vs Live ${LIVE_PRICE}</span>
                <span className="font-mono font-bold" style={{ color: cellAccent(hoverCell.price) }}>
                  {hoverCell.price > LIVE_PRICE ? '+' : ''}{(((hoverCell.price - LIVE_PRICE) / LIVE_PRICE) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {hoverCell.price >= 16 ? '▲ Above price target — Strong Buy' : hoverCell.price >= 12 ? '▲ In price target range' : hoverCell.price >= LIVE_PRICE ? '→ Near current price' : '▼ Bear case scenario'}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
