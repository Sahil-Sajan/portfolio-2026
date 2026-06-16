import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";

const COLS = 14;
const ROWS = 6;
const STEP = 44;

const shadowPath = (cx, cy) =>
  `M${cx - 12} ${cy + 7.4483}V${cy}H${cx + 12}V${cy + 7.4483}` +
  `C${cx + 12} ${cy + 14.0757} ${cx + 6.6274} ${cy + 19.4483} ${cx} ${cy + 19.4483}` +
  `C${cx - 6.6274} ${cy + 19.4483} ${cx - 12} ${cy + 14.0757} ${cx - 12} ${cy + 7.4483}Z`;

const highlightPath = (cx, cy) =>
  `M${cx} ${cy - 12}` +
  `C${cx + 6.6274} ${cy - 12} ${cx + 12} ${cy - 6.6274} ${cx + 12} ${cy}` +
  `C${cx + 12} ${cy + 0.2781} ${cx + 11.9893} ${cy + 0.5538} ${cx + 11.9707} ${cy + 0.8271}` +
  `C${cx + 11.5453} ${cy - 5.414} ${cx + 6.3491} ${cy - 10.3447} ${cx} ${cy - 10.3447}` +
  `C${cx - 6.3491} ${cy - 10.3447} ${cx - 11.5463} ${cy - 5.414} ${cx - 11.9717} ${cy + 0.8271}` +
  `C${cx - 11.9903} ${cy + 0.5538} ${cx - 12} ${cy + 0.278} ${cx - 12} ${cy}` +
  `C${cx - 12} ${cy - 6.6274} ${cx - 6.6274} ${cy - 12} ${cx} ${cy - 12}Z`;

export default function FooterStudGrid() {
  const knobRefs = useRef([]);
  const activeRef = useRef(null);   // single-click active stud
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const dragPressed = useRef([]);     // ordered list of drag-pressed indices

  // Release all drag-pressed studs with a staggered elastic wave
  const releaseAllDrag = useCallback(() => {
    dragPressed.current.forEach((idx, i) => {
      const el = knobRefs.current[idx];
      if (!el) return;
      gsap.to(el, {
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1.3, 0.38)",
        delay: i * 0.025,
      });
    });
    dragPressed.current = [];
  }, []);

  // Global mouseup ends drag and releases everything
  useEffect(() => {
    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (hasMoved.current) releaseAllDrag();
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [releaseAllDrag]);

  // Start drag on any mousedown inside the SVG
  const handleSvgMouseDown = useCallback(() => {
    isDragging.current = true;
    hasMoved.current = false;
  }, []);

  // Press stud when cursor enters it while dragging
  const handleStudEnter = useCallback((idx) => {
    if (!isDragging.current) return;
    hasMoved.current = true;
    if (dragPressed.current.includes(idx)) return;
    const el = knobRefs.current[idx];
    if (!el) return;
    dragPressed.current.push(idx);
    gsap.to(el, { y: 7, duration: 0.08, ease: "power3.out" });
  }, []);

  // Single-click toggle (only fires when mouse hasn't moved)
  const handleStudClick = useCallback((idx) => {
    if (hasMoved.current) return; // was a drag, not a click
    const el = knobRefs.current[idx];
    if (!el) return;

    // Pop previously clicked stud back up
    if (activeRef.current && activeRef.current !== el) {
      gsap.to(activeRef.current, {
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1.3, 0.38)",
      });
    }

    // Toggle off same stud
    if (activeRef.current === el) {
      gsap.to(el, { y: 0, duration: 0.65, ease: "elastic.out(1.3, 0.38)" });
      activeRef.current = null;
      return;
    }

    // Press new stud
    gsap.to(el, { y: 7, duration: 0.08, ease: "power3.out" });
    activeRef.current = el;
  }, []);

  const studs = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      const cx = 32 + col * STEP;
      const cy = 22 + row * STEP;
      studs.push({ idx, cx, cy });
    }
  }

  return (
    <svg
      width="636"
      height="264"
      viewBox="0 0 636 264"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%", userSelect: "none" }}
      onMouseDown={handleSvgMouseDown}
    >
      <rect width="636" height="264" fill="#C2E9E7" />
      {studs.map(({ idx, cx, cy }) => (
        <g
          key={idx}
          onMouseEnter={() => handleStudEnter(idx)}
          onClick={() => handleStudClick(idx)}
          style={{ cursor: "" }}
        >
          <path d={shadowPath(cx, cy)} fill="#559991" />
          <g ref={el => { knobRefs.current[idx] = el; }}>
            <circle cx={cx} cy={cy} r="12" fill="#C2E9E7" />
            <path d={highlightPath(cx, cy)} fill="#FBFFFD" />
          </g>
        </g>
      ))}
    </svg>
  );
}
