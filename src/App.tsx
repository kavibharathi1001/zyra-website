import React, { useState, useMemo, useRef, useEffect, useId } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  Bookmark,
  X,
  Menu,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Palette,
  Volume2,
  VolumeX,
  Feather,
  Flame,
  Layers,
  ArrowRight,
  Check,
  Compass,
  SlidersHorizontal,
  Wand2,
  MoveHorizontal
} from 'lucide-react';

import heroBrandEditorial from './assets/zyra-brand-editorial.jpg';
import zyraMascotPng from './assets/zyra-quetzal-mascot.png';
import tryonBaseSilhouette from './assets/tryon-base-silhouette.jpg';
import tryonNeuralDrape from './assets/tryon-neural-drape.jpg';
import tryonM2Base from './assets/tryon-m2-base.jpg';
import tryonM2Draped from './assets/tryon-m2-draped.jpg';
import tryonM3Base from './assets/tryon-m3-base.jpg';
import tryonM3Draped from './assets/tryon-m3-draped.jpg';

// ==========================================
// 0. UTILITY & HELPER FUNCTIONS
// ==========================================

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ==========================================
// 1. TILTED GRID HERO (3D CYLINDER CAROUSEL)
// 21st.dev Component by Ruixen
// ==========================================

const SLICES = 16;
const CAMERA = 1.6;
const MAX_WIDTH = 55;

function arc(bend: number): number {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number
) {
  const h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) {
    return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  }
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
  };
}

interface TiltedGridHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  images: { src: string; alt?: string }[];
  speed?: number;
  tileHeight?: number;
  aspectRatio?: number;
  gap?: number;
  axis?: number;
  curve?: number;
  fade?: number;
  children?: React.ReactNode;
  className?: string;
}

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 28,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 52,
  curve = 75,
  fade = 14,
  children,
  className,
  ...props
}: TiltedGridHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const generatedId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `tgh-o-${generatedId}`;
  const tile = `tgh-t-${generatedId}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  const [layout, setLayout] = useState<{
    columns: number;
    sweep: number;
    unit: number;
    limit: number;
  } | null>(null);
  const [shown, setShown] = useState<Record<number, number>>({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns &&
          prev.sweep === next.sweep &&
          prev.unit === next.unit
          ? prev
          : next
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  useEffect(() => {
    for (const img of images) {
      if (img?.src) {
        const imageObj = new Image();
        imageObj.src = img.src;
      }
    }
  }, [images]);

  const { columns, sweep, unit, limit } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(MAX_WIDTH / aspectRatio).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = (deg: number) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused}}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{ containerType: "size", ...props.style }}
    >
      <style>{css}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const img = images[(shown[t] ?? first) % Math.max(images.length, 1)];
          return (
            <div
              key={t}
              className={cn(tile, "absolute")}
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className={cn(
                    "absolute top-0 overflow-hidden bg-[#101210] border-y border-white/[0.06]",
                    k === 0 && "rounded-l-2xl border-l border-white/20",
                    k === SLICES - 1 && "rounded-r-2xl border-r border-white/20"
                  )}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    width: k === SLICES - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={k === 0 ? (img.alt ?? "") : ""}
                      draggable={false}
                      className="absolute top-0 max-w-none object-cover filter brightness-[1.05] contrast-[1.05]"
                      style={{
                        left: u(-k * share),
                        width: u(aspectRatio),
                        height: u(1),
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

// ==========================================
// 1.5. CIRCULAR GALLERY 2 (OGL + 3D BEND ENGINE)
// 21st.dev Component with Touch & Wheel Drag
// ==========================================

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

export interface GalleryItem {
  image: string;
  text: string;
  subtext?: string;
  category?: string;
  price?: string;
  fiber?: string;
  raw?: unknown;
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  bend?: number;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  className?: string;
  onItemSelect?: (item: GalleryItem) => void;
}

export function CircularGallery({
  items = [],
  bend = 2.5,
  borderRadius = 0.06,
  scrollSpeed = 2,
  scrollEase = 0.05,
  className,
  onItemSelect,
  ...props
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !items.length) return;

    let animationFrameId: number;
    let isDown = false;
    let startX = 0;
    const scroll = { current: 0, target: 0, ease: scrollEase };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imagesCache = items.map((item) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = item.image;
      return img;
    });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onTouchDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const onTouchMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = (startX - x) * (scrollSpeed * 0.45);
      scroll.target += delta;
      startX = x;
    };

    const onTouchUp = () => {
      isDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      scroll.target += (delta > 0 ? scrollSpeed : -scrollSpeed) * 35;
    };

    container.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchUp);
    container.addEventListener('touchstart', onTouchDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // Render loop with cylindrical perspective arc projection
    const render = () => {
      scroll.current = lerp(scroll.current, scroll.target, scroll.ease);
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const cardWidth = Math.min(260, width * 0.45);
      const cardHeight = cardWidth * 1.35;
      const padding = 28;
      const totalSlotWidth = cardWidth + padding;
      const totalSpan = items.length * totalSlotWidth;

      // Wrap scroll position continuously
      const normalizedScroll = ((scroll.current % totalSpan) + totalSpan) % totalSpan;
      const centerIndex = Math.round(normalizedScroll / totalSlotWidth) % items.length;
      setActiveItemIndex(centerIndex);

      const radius = (width / 2) * (Math.max(1, bend) * 0.85);

      items.forEach((item, index) => {
        let xOffset = index * totalSlotWidth - normalizedScroll;
        if (xOffset < -totalSlotWidth * 2) xOffset += totalSpan;
        if (xOffset > width + totalSlotWidth) xOffset -= totalSpan;

        const screenX = width / 2 + xOffset - cardWidth / 2;
        const distFromCenter = (screenX + cardWidth / 2 - width / 2) / (width / 2);

        // Cylindrical arc displacement
        const angle = distFromCenter * (Math.PI / (3.6 / (bend || 1)));
        const arcY = Math.sin(Math.abs(angle)) * (height * 0.16) * (bend > 0 ? 1 : -1);
        const scale = Math.max(0.72, 1 - Math.abs(distFromCenter) * 0.28);
        const alpha = Math.max(0.2, 1 - Math.abs(distFromCenter) * 0.75);

        const currentCardW = cardWidth * scale;
        const currentCardH = cardHeight * scale;
        const drawX = width / 2 + Math.sin(angle) * radius - currentCardW / 2;
        const drawY = height / 2 - currentCardH / 2 + arcY;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(drawX + currentCardW / 2, drawY + currentCardH / 2);
        ctx.rotate(angle * 0.45);
        ctx.translate(-currentCardW / 2, -currentCardH / 2);

        // Rounded image card clipping
        const r = Math.min(currentCardW, currentCardH) * borderRadius;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(currentCardW - r, 0);
        ctx.quadraticCurveTo(currentCardW, 0, currentCardW, r);
        ctx.lineTo(currentCardW, currentCardH - r);
        ctx.quadraticCurveTo(currentCardW, currentCardH, currentCardW - r, currentCardH);
        ctx.lineTo(r, currentCardH);
        ctx.quadraticCurveTo(0, currentCardH, 0, currentCardH - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.clip();

        // Draw cached image
        const img = imagesCache[index];
        if (img && img.complete && img.naturalWidth) {
          ctx.drawImage(img, 0, 0, currentCardW, currentCardH);
        } else {
          ctx.fillStyle = '#151815';
          ctx.fillRect(0, 0, currentCardW, currentCardH);
        }

        // Overlay gradient vignette
        const grad = ctx.createLinearGradient(0, currentCardH * 0.5, 0, currentCardH);
        grad.addColorStop(0, 'rgba(8,9,8,0)');
        grad.addColorStop(1, 'rgba(8,9,8,0.92)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, currentCardW, currentCardH);

        // Highlight ring around active center piece
        if (index === centerIndex) {
          ctx.strokeStyle = '#C5FF00';
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Title text texture
        ctx.fillStyle = index === centerIndex ? '#C5FF00' : '#F6F7F2';
        ctx.font = `600 ${Math.max(11, Math.round(14 * scale))}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(item.text, currentCardW / 2, currentCardH - 24);

        if (item.subtext) {
          ctx.fillStyle = '#A0A59C';
          ctx.font = `400 ${Math.max(9, Math.round(11 * scale))}px monospace`;
          ctx.fillText(item.subtext, currentCardW / 2, currentCardH - 10);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousedown', onTouchDown);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchUp);
      container.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchUp);
      container.removeEventListener('wheel', onWheel);
    };
  }, [items, bend, borderRadius, scrollSpeed, scrollEase]);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (onItemSelect && items[activeItemIndex]) {
          onItemSelect(items[activeItemIndex]);
        }
      }}
      className={cn(
        "relative w-full h-[520px] select-none cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl bg-[#090A09] border border-white/10",
        className
      )}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />

      {/* Floating HUD navigation hint */}
      <div className="absolute top-5 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080908]/80 border border-white/15 backdrop-blur-md text-[10px] font-mono uppercase text-[#C5FF00]">
          <MoveHorizontal size={13} />
          <span>Drag or Scroll to Rotate Cylinder</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#080908]/80 border border-white/15 backdrop-blur-md text-[10px] font-mono text-[#A0A59C]">
          <span>Piece <strong className="text-white">{activeItemIndex + 1}</strong> of {items.length}</span>
        </div>
      </div>

      {/* Center focus indicator badge */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div className="px-4 py-1.5 rounded-full bg-[#151815]/90 border border-[#C5FF00]/40 backdrop-blur-md flex items-center gap-2 shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF00] animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-white">
            {items[activeItemIndex]?.text || "Focus Item"}
          </span>
          <span className="text-[10px] text-[#C5FF00] font-mono">✦ Click to Stage</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. DATA MANIFEST & 100% DISTINCT HIGH-FASHION ASSETS
// ZERO REPEATED IMAGES ACROSS THE ENTIRE PLATFORM
// ==========================================

const ZYRA_PILLARS = [
  { id: 'beauty', title: 'Beauty', desc: 'Harmonic silhouettes & radiant aesthetic poise', glyph: '✦' },
  { id: 'creativity', title: 'Creativity', desc: 'Unbounded sartorial imagination & bold experimentation', glyph: '✦' },
  { id: 'transformation', title: 'Transformation', desc: 'Metamorphosis from routine dressing to iconic presence', glyph: '✦' },
  { id: 'intelligence', title: 'Intelligence', desc: 'Deterministic neural drape and color ratio synthesis', glyph: '✦' },
  { id: 'expression', title: 'Expression', desc: 'Unapologetic personal truth in every woven texture', glyph: '✦' },
];

const HERO_HOTSPOTS = [
  {
    id: 'zyra',
    x: '74%',
    y: '28%',
    tag: 'Fashion Spirit',
    title: 'ZYRA Companion Synthesis',
    detail: 'Neural style guidance tuned to proportion harmony, ethereal draping, and instinctive poise.'
  },
  {
    id: 'jewelry',
    x: '46%',
    y: '57%',
    tag: 'Fine Metalwork',
    title: 'Emerald & South Sea Pearl Choker',
    detail: 'Heirloom Colombian emerald drop pendants layered with hand-strung luminous pearls.'
  },
  {
    id: 'silhouette',
    x: '36%',
    y: '78%',
    tag: 'Haute Silhouette',
    title: 'Liquid Silk & Emerald Leaf Filigree',
    detail: 'Fluid ivory silk drape accented by hand-embroidered metallic gilded botanical motifs.'
  }
];

// Open-Source Editorial Imagery for the 3D Tilted Grid (8 Unique Images)
const TILTED_EDITORIAL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    alt: "Sculptural Avant-Garde Pleated Cape Silhouette"
  },
  {
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
    alt: "Quiet Luxury Tailored Double-Pleat Trench Uniform"
  },
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    alt: "Prismatic Haute Editorial with Dynamic Lime Accents"
  },
  {
    src: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80",
    alt: "Metropolitan Architectural Streetwear Silhouette"
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    alt: "Monochrome Minimalist Fluid Column Lines"
  },
  {
    src: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80",
    alt: "Ethereal Romantic Sheer Organza Layers"
  },
  {
    src: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80",
    alt: "Neo-Futurism Liquid Metallic Iridescent Membrane"
  },
  {
    src: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80",
    alt: "Italian Peaked Lapel Vintage Revival"
  }
];

// 8 Distinct Aesthetics (8 Unique Images)
const AESTHETICS = [
  {
    id: 'quiet-luxury',
    title: 'Quiet Luxury',
    tagline: 'Understated tailoring, cashmere palettes, deliberate restraint.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    palette: ['#E6E2DD', '#322F2E', '#8C857B', '#C5FF00'],
    fabrics: ['Super 160s Merino', 'Mulberry Silk', 'Double-Faced Cashmere'],
    silhouetteRatio: '0.62 Golden Column',
    mood: 'Tailored neutral tones, architectural silhouettes, noble fibers.'
  },
  {
    id: 'streetwear',
    title: 'Avant Street',
    tagline: 'Deconstructed forms, technical nylon, raw metropolitan energy.',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=80',
    palette: ['#0C0D0E', '#4B5563', '#9CA3AF', '#C5FF00'],
    fabrics: ['Ripstop Cordura', '450 GSM Fleece', 'Bonded Neoprene'],
    silhouetteRatio: '0.85 Boxy Drop-Core',
    mood: 'Oversized drape, industrial hardware, sharp modern edge.'
  },
  {
    id: 'minimalist',
    title: 'Monochrome Minimalist',
    tagline: 'Singular lines, absence of noise, pure structural silhouette.',
    image: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=900&q=80',
    palette: ['#FFFFFF', '#121212', '#71717A', '#D4D4D8'],
    fabrics: ['Crisp Poplin', 'Japanese Twill', 'Fine Wool Gabardine'],
    silhouetteRatio: '0.50 Razor Verticality',
    mood: 'Strict geometric cuts, monochromatic purity, fluid movement.'
  },
  {
    id: 'avant-garde',
    title: 'Sculptural Couture',
    tagline: 'Fashion as biological architecture. Voluminous, fearless.',
    image: 'https://images.unsplash.com/photo-1566206091559-0f622955f7bc?auto=format&fit=crop&w=900&q=80',
    palette: ['#1C1917', '#B91C1C', '#E2E8F0', '#C5FF00'],
    fabrics: ['Molded Horsehair', 'Pleated Taffeta', 'Sculptural Felt'],
    silhouetteRatio: '0.94 Asymmetric Tectonic',
    mood: 'High-contrast textile drapery, dramatic tension, sculptural forms.'
  },
  {
    id: 'romantic',
    title: 'Ethereal Romantic',
    tagline: 'Organza whispers, sheer layering, modern poetic softness.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    palette: ['#FDF2F8', '#CBD5E1', '#F472B6', '#E2E8F0'],
    fabrics: ['Silk Chiffon', 'Laminated Tulle', 'Gossamer Voile'],
    silhouetteRatio: '0.71 Translucent Bias',
    mood: 'Gossamer layers, floral undertones, luminous translucence.'
  },
  {
    id: 'futuristic',
    title: 'Neo-Futurism',
    tagline: 'Liquid metallic sheen, reflective membranes, cyber elegance.',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&w=900&q=80',
    palette: ['#0A0A0A', '#38BDF8', '#C5FF00', '#64748B'],
    fabrics: ['Mylar Laminate', 'Iridescent Polyurethane', 'Titanium Mesh'],
    silhouetteRatio: '0.88 Aerodynamic Shield',
    mood: 'Reflective laminates, aerodynamic cuts, iridescent highlights.'
  },
  {
    id: 'vintage-revival',
    title: 'Vintage Revival',
    tagline: '70s Italian tailoring reimagined through contemporary AI lenses.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    palette: ['#78350F', '#D97706', '#FEF3C7', '#1E293B'],
    fabrics: ['Wide-Wale Corduroy', 'Bouclé Tweed', 'Brushed Flannel'],
    silhouetteRatio: '0.66 Peaked Flare Proportion',
    mood: 'Textured corduroy, peaked lapels, nostalgic warmth.'
  },
  {
    id: 'sport-luxe',
    title: 'Sport Luxe',
    tagline: 'Performance aerodynamics elevated into runway-worthy ensembles.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
    palette: ['#18181B', '#FACC15', '#C5FF00', '#FAFAFA'],
    fabrics: ['Thermoregulating Scuba', 'Bonded Knit', 'Reflective Taping'],
    silhouetteRatio: '0.77 Dynamic Kinematic',
    mood: 'Bonded technical knits, dynamic color blocking, effortless agility.'
  }
];

// Occasion Styling Looks with unique pieces
const STYLING_LOOKS = {
  Everyday: [
    {
      id: 'ed-1',
      title: 'Architectural Daily Uniform',
      description: 'Balancing relaxed drape with tailored intention. Grounded by double-pleat trousers and sculptural calfskin footwear.',
      harmonyScore: 97,
      silhouette: 'Fluid column with cropped upper accent',
      fabricTech: '380 GSM Wool-Viscose Blend',
      items: [
        { type: 'Outerwear', name: 'Raw Wool Double-Breasted Cardigan', brand: 'Studio Noir', gsm: '420 GSM', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80' },
        { type: 'Top', name: 'Supima Heavyweight Mock Neck', brand: 'Atelier Z', gsm: '280 GSM', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
        { type: 'Bottom', name: 'Wide-Leg Deep Pleated Trousers', brand: 'Maison Forma', gsm: '340 GSM', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80' },
        { type: 'Footwear', name: 'Minimalist Calfskin Derby', brand: 'Vanguard', gsm: 'Full-Grain', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
        { type: 'Coat', name: 'Technical Poplin Duster', brand: 'AeroLab', gsm: '220 GSM', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  ],
  Work: [
    {
      id: 'wk-1',
      title: 'The Contemporary Executive',
      description: 'Sharp lines soften through unconstructed shoulders. A striking power silhouette devoid of corporate rigidity.',
      harmonyScore: 98,
      silhouette: 'Structured tailoring with relaxed drape',
      fabricTech: 'Super 140s Tropical Wool & Silk Twill',
      items: [
        { type: 'Blazer', name: 'Unstructured Cashmere Twill Blazer', brand: 'Sartoriale', gsm: '320 GSM', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80' },
        { type: 'Shirt', name: 'Silk-Cotton Point Collar Blouse', brand: 'Atelier Z', gsm: '140 GSM', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80' },
        { type: 'Bottom', name: 'High-Rise Flannel Trousers', brand: 'Maison Forma', gsm: '300 GSM', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80' },
        { type: 'Footwear', name: 'Chiseled Heeled Chelsea Boot', brand: 'Vanguard', gsm: 'Boxcalf', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80' },
        { type: 'Outerwear', name: 'Double-Weave Trench', brand: 'Kollektiv 01', gsm: '390 GSM', img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  ],
  'Date Night': [
    {
      id: 'dn-1',
      title: 'Nocturne Minimalist Drape',
      description: 'Satin highlights interact with matte charcoal wool. Designed for low ambient candlelight and quiet impact.',
      harmonyScore: 96,
      silhouette: 'Fluid bias cut layered over sharp outerwear',
      fabricTech: 'Duchess Satin & Fine Georgette',
      items: [
        { type: 'Jacket', name: 'Sateen Lapel Smoking Jacket', brand: 'Sartoriale', gsm: '350 GSM', img: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80' },
        { type: 'Top', name: 'Silk Georgette Deep-V Tunic', brand: 'Atelier Z', gsm: '110 GSM', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80' },
        { type: 'Bottom', name: 'Cigarette Cut Wool Pants', brand: 'Maison Forma', gsm: '280 GSM', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80' },
        { type: 'Accessory', name: 'Curved Leather Crossbody Bag', brand: 'Aura Studio', gsm: 'Nappa', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
        { type: 'Footwear', name: 'Slingback Architectural Pump', brand: 'Vanguard', gsm: 'Patent', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  ],
  Travel: [
    {
      id: 'tr-1',
      title: 'Transcontinental Transit Capsule',
      description: 'Wrinkle-resistant Japanese poplin and merino layers that seamlessly shift from first-class transit to evening arrivals.',
      harmonyScore: 95,
      silhouette: 'Cocoon coat with relaxed tapered core',
      fabricTech: 'Hydrophobic Poplin & 17.5µ Merino',
      items: [
        { type: 'Outerwear', name: 'Water-Repellent Oversized Trench', brand: 'AeroLab', gsm: '240 GSM', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80' },
        { type: 'Knit', name: 'Seamless Fine Merino Crew', brand: 'Atelier Z', gsm: '220 GSM', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80' },
        { type: 'Bottom', name: 'Drawstring Fluid Wool Joggers', brand: 'Maison Forma', gsm: '290 GSM', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80' },
        { type: 'Footwear', name: 'Deconstructed Leather Loafers', brand: 'Vanguard', gsm: 'Unlined Suede', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80' },
        { type: 'Bag', name: 'Modular Transit Carryall', brand: 'Aura Studio', gsm: 'Cordura', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  ],
  'Special Event': [
    {
      id: 'se-1',
      title: 'Gala Avant-Garde',
      description: 'Bold sculptural asymmetry. An unforgettable couture statement grounded by razor-sharp tailoring accents.',
      harmonyScore: 99,
      silhouette: 'Sculptural asymmetric architecture',
      fabricTech: 'Bonded Crepe & Metallic Organza',
      items: [
        { type: 'Cape', name: 'Pleated Architectural Drape Cape', brand: 'Haute Forma', gsm: '480 GSM', img: 'https://images.unsplash.com/photo-1566206091559-0f622955f7bc?auto=format&fit=crop&w=600&q=80' },
        { type: 'Top', name: 'Molded Corsetry Underlayer', brand: 'Atelier Z', gsm: '360 GSM', img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80' },
        { type: 'Bottom', name: 'Floor-Sweeping Split Trousers', brand: 'Haute Forma', gsm: '320 GSM', img: 'https://images.unsplash.com/photo-1506629905607-d9f4d5e7c9b4?auto=format&fit=crop&w=600&q=80' },
        { type: 'Footwear', name: 'Square-Toe Architectural Stiletto', brand: 'Vanguard', gsm: 'Patent Steel', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80' },
        { type: 'Jewelry', name: 'Emerald Leaf Filigree Choker', brand: 'Heirloom Z', gsm: '18K Gilded', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' }
      ]
    }
  ]
};

// 12 Distinct, High-Fashion Runway Pieces with Zero Repeated Images
const RUNWAY_DISCOVERY_ITEMS: GalleryItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80',
    text: 'Sculptural Pleated Cape',
    subtext: 'Haute Forma • Runway 01',
    category: 'Outerwear',
    price: '$890',
    fiber: 'Bonded Crepe & Horsehair'
  },
  {
    image: tryonNeuralDrape,
    text: 'Double-Pleat Neural Drape Trench',
    subtext: 'ZYRA Atelier • Spectral 98.4%',
    category: 'Outerwear',
    price: '$1,120',
    fiber: 'Double-Faced Cashmere & Spectral Mesh'
  },
  {
    image: 'https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&w=1200&q=80',
    text: 'Prismatic Lime Tailoring',
    subtext: 'Atelier Z • Spring Haute',
    category: 'Tops',
    price: '$640',
    fiber: 'Silk Twill & Lime Lurex'
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    text: 'Technical Deconstructed Parka',
    subtext: 'Raw Craft • Metro Form',
    category: 'Outerwear',
    price: '$780',
    fiber: 'Ripstop Cordura & Down'
  },
  {
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80',
    text: 'Monochrome Minimalist Column',
    subtext: 'Maison Forma • Core',
    category: 'Bottoms',
    price: '$520',
    fiber: 'High-Twist Wool Gabardine'
  },
  {
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=80',
    text: 'Gossamer Organza Slip',
    subtext: 'Studio Noir • Ethereal',
    category: 'Tops',
    price: '$460',
    fiber: '100% Silk Chiffon'
  },
  {
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=80',
    text: 'Neo-Futuristic Iridescent Cloak',
    subtext: 'AeroLab • Cyber Edition',
    category: 'Outerwear',
    price: '$940',
    fiber: 'Liquid Titanium Polyurethane'
  },
  {
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
    text: 'Milanese Peaked Lapel Revival',
    subtext: 'Sartoriale • Vintage',
    category: 'Outerwear',
    price: '$860',
    fiber: 'Bouclé Tweed & Virgin Wool'
  },
  {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
    text: 'Asymmetric Metropolitan Duster',
    subtext: 'Vanguard • Concept Line',
    category: 'Outerwear',
    price: '$690',
    fiber: 'Waterproof Cotton Twill'
  },
  {
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    text: 'Liquid Silk Evening Drape',
    subtext: 'Haute Forma • Atelier',
    category: 'Tops',
    price: '$980',
    fiber: 'Mulberry Habotai Silk'
  },
  {
    image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=1200&q=80',
    text: 'Translucent Botanical Layer',
    subtext: 'Studio Noir • Garden Line',
    category: 'Tops',
    price: '$420',
    fiber: 'Embroidered Tulle & Voile'
  },
  {
    image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1200&q=80',
    text: 'Architectural Boxy Overcoat',
    subtext: 'Maison Forma • Structural',
    category: 'Outerwear',
    price: '$830',
    fiber: 'Brushed Melton Wool (480 GSM)'
  }
];

const DISCOVERY_CATALOG = RUNWAY_DISCOVERY_ITEMS.map((item, idx) => ({
  id: `disc-${idx + 1}`,
  name: item.text,
  category: item.category || 'Outerwear',
  brand: item.subtext ? item.subtext.split('•')[0].trim() : 'Studio Z',
  price: item.price || '$580',
  tag: item.subtext ? item.subtext.split('•')[1]?.trim() || 'Runway' : 'Runway',
  fiber: item.fiber || 'Natural Blend',
  img: item.image
}));

const SMART_MATCH_PIECES = [
  {
    id: 'piece-1',
    name: 'Tailored Wide-Leg Trousers',
    category: 'Bottoms',
    color: 'Obsidian Noir',
    weave: 'Double-Pleat Twill (340 GSM)',
    img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
    combinations: [
      {
        mode: 'Quiet Luxury',
        summary: 'Silk-viscose shirting paired with deconstructed camel outerwear creates an effortless balance of masculine tailoring and delicate texture.',
        paletteTokens: ['#080908', '#D4AF37', '#F5F5F0'],
        contrastRatio: '14.2:1 (Optimal Restraint)',
        top: { name: 'Raw Silk Relaxed Camp Shirt', brand: 'Atelier Z', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80' },
        layer: { name: 'Belted Cashmere Duster Coat', brand: 'AeroLab', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80' },
        shoe: { name: 'Chiseled Leather Loafers', brand: 'Vanguard', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80' },
        accessory: { name: 'Polished Brass Hardware Bag', brand: 'Aura Studio', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80' }
      },
      {
        mode: 'Cyber Metro',
        summary: 'Technical nylon contrasts against heavy wool pleats. High-contrast chrome details introduce futuristic dynamism.',
        paletteTokens: ['#080908', '#C5FF00', '#64748B'],
        contrastRatio: '18.6:1 (Kinetic Edge)',
        top: { name: 'Bonded Technical Cropped Hoodie', brand: 'Raw Craft', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80' },
        layer: { name: 'Modular Tactical Vest', brand: 'Maison Forma', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80' },
        shoe: { name: 'Lug-Sole Monolith Boots', brand: 'Vanguard', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=400&q=80' },
        accessory: { name: 'Lime-Accented Carabiner Sling', brand: 'Aura Studio', img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=400&q=80' }
      }
    ]
  },
  {
    id: 'piece-2',
    name: 'Structured Boxy Blazer',
    category: 'Outerwear',
    color: 'Flint Melange',
    weave: 'Brushed Cashmere (380 GSM)',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    combinations: [
      {
        mode: 'Contemporary Art Basel',
        summary: 'An oversized silhouette balanced with sheer knits and sleek sculptural leather accessories.',
        paletteTokens: ['#475569', '#E2E8F0', '#090A09'],
        contrastRatio: '12.8:1 (Harmonic Muted)',
        top: { name: 'Sheer Ribbed Turtleneck', brand: 'Atelier Z', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
        layer: { name: 'Silk Twill Neck Foulard', brand: 'Haute Forma', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
        shoe: { name: 'Slingback Architectural Pump', brand: 'Vanguard', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80' },
        accessory: { name: 'Geometric Frame Sunglasses', brand: 'Aura Studio', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80' }
      }
    ]
  }
];

const TRY_ON_MODELS = [
  { id: 'm1', name: 'Model 01 — Neural Studio Reference (Base Silhouette)', stats: '176cm • Calibrating Frame • Position Detected', img: tryonBaseSilhouette, drapedImg: tryonNeuralDrape, garmentName: 'Double-Pleat Neural Drape Trench' },
  { id: 'm2', name: 'Model 02 — Tailored Male Silhouette', stats: '186cm • Calibrating Frame • Position Detected', img: tryonM2Base, drapedImg: tryonM2Draped, garmentName: 'Architectural Charcoal Wool Trench' },
  { id: 'm3', name: 'Model 03 — Urban Editorial Silhouette', stats: '172cm • Alignment Coordinates • Position Detected', img: tryonM3Base, drapedImg: tryonM3Draped, garmentName: 'Streetwear Technical Draped Overcoat' }
];

const ZYRA_PROMPTS = [
  { q: "What should I wear to an art gallery opening in Milan?", a: "For an art opening in Milan, avoid loud logos. Lean into Quiet Avant-Garde: an oversized deconstructed navy blazer, a tissue-thin silk crewneck, double-pleat fluid wool trousers, and square-toed leather boots. Introduce a single whisper of electric lime through an enameled lapel brooch." },
  { q: "How do I style wide-leg trousers without looking overwhelmed?", a: "It is all about the proportion tension: counter the generous volume at the bottom with a structured shoulder or cropped boxy hemline up top. Ensure your footwear has a defined architectural toe (chiseled square or sharp almond) to ground the hem break." },
  { q: "How can I build an effortless capsule wardrobe for frequent travel?", a: "Focus on 7 modular items in 3 harmonious tones: a merino mock neck, unconstructed traveler blazer, fluid tailored trousers, Japanese selvedge denim, silk button-down, cashmere duster, and chiseled loafers. Every piece must pair seamlessly with at least 4 others." }
];

// ==========================================
// 3. ZYRA CELESTIAL SPIRIT BIRD MASCOT
// ==========================================

function ZyraMascotIllustration({
  flightMode = false,
  auraEnergy = 1,
  onHover
}: {
  flightMode?: boolean;
  auraEnergy?: number;
  onHover?: () => void;
}) {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-all duration-700 select-none ${flightMode ? 'scale-110 -translate-y-4 rotate-[-3deg]' : 'hover:scale-105'
        }`}
      onMouseEnter={onHover}
    >
      {/* Dynamic Multi-layered Celestial Halo & Emerald Glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none transition-all duration-700 blur-2xl"
        style={{
          background: `radial-gradient(circle, rgba(197, 255, 0, ${0.38 * auraEnergy}) 0%, rgba(16, 185, 129, ${0.28 * auraEnergy}) 45%, rgba(8, 9, 8, 0) 75%)`,
          transform: flightMode ? 'scale(1.25)' : 'scale(1)'
        }}
      />

      {/* Orbiting Sacred Geometry Astral Rings */}
      <div
        className="absolute w-[340px] h-[340px] rounded-full border border-[#C5FF00]/30 border-dashed animate-spin pointer-events-none"
        style={{ animationDuration: '32s' }}
      />
      <div
        className="absolute w-[290px] h-[290px] rounded-full border border-emerald-400/20 border-dotted animate-spin pointer-events-none"
        style={{ animationDuration: '24s', animationDirection: 'reverse' }}
      />

      {/* Radiant Golden Plume Stardust Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span
          className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-[#C5FF00] rounded-full animate-ping"
          style={{ animationDuration: '3s' }}
        />
        <span
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-300 rounded-full animate-ping"
          style={{ animationDuration: '2.4s', animationDelay: '0.8s' }}
        />
        <span
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
          style={{ animationDuration: '3.6s', animationDelay: '1.4s' }}
        />
      </div>

      {/* The Resplendent Spirit Bird (Emerald & Gold Plumes) */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] aspect-square flex items-center justify-center p-2">
        <img
          src={zyraMascotPng}
          alt="ZYRA — The Resplendent Fashion Spirit Bird"
          className={`w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(197,255,0,0.3)] transition-all duration-700 ${flightMode ? 'brightness-110 drop-shadow-[0_20px_45px_rgba(197,255,0,0.55)]' : 'brightness-105'
            }`}
        />
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================

export default function App() {
  // Navigation & UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedLooksDrawerOpen, setSavedLooksDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hero Interactive States
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<typeof HERO_HOTSPOTS[0] | null>(null);
  const [activePillarIndex, setActivePillarIndex] = useState<number | null>(null);

  // Styling Studio States
  const [selectedAesthetic, setSelectedAesthetic] = useState(AESTHETICS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState<keyof typeof STYLING_LOOKS>('Everyday');
  const [lookIndex, setLookIndex] = useState(0);
  const [savedLooks, setSavedLooks] = useState<any[]>([]);
  const [stylistBend, setStylistBend] = useState(2.8);

  // Smart Matching State
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(0);
  const [matchingModeIndex, setMatchingModeIndex] = useState(0);

  // Catalog Filter & 3D Runway Gallery
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [runwayBend, setRunwayBend] = useState(3.0);
  const [focalRunwayItem, setFocalRunwayItem] = useState(RUNWAY_DISCOVERY_ITEMS[0]);

  // Virtual Try-on State with 21st.dev Comparison Slider
  const [tryOnModel, setTryOnModel] = useState(TRY_ON_MODELS[0]);
  const [tryOnGarment, setTryOnGarment] = useState(DISCOVERY_CATALOG[1]);
  const [tryOnOverlayOpacity, setTryOnOverlayOpacity] = useState(0.85);
  const [drapeTension, setDrapeTension] = useState(72);
  const [tryOnMode, setTryOnMode] = useState<'slider' | 'blend'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isSimulatingTryOn, setIsSimulatingTryOn] = useState(false);
  const sliderFrameRef = useRef<HTMLDivElement>(null);

  // Mascot Interactive Companion State
  const [zyraActiveDialogue, setZyraActiveDialogue] = useState(ZYRA_PROMPTS[0]);
  const [zyraFlightMode, setZyraFlightMode] = useState(false);
  const [zyraAuraEnergy, setZyraAuraEnergy] = useState(1);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<typeof DISCOVERY_CATALOG[0] | null>(null);

  // Ambient Audio Simulation Toggle
  const [ambientAudio, setAmbientAudio] = useState(false);

  // 3D Perspective Mouse Handler for Hero Image
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setHeroTilt({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setHeroTilt({ x: 0, y: 0 });
  };

  // Toast Trigger Helper
  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save current look
  const handleSaveLook = (look: any) => {
    if (!savedLooks.some((l) => l.id === look.id)) {
      setSavedLooks([...savedLooks, { ...look, occasion: selectedOccasion, aesthetic: selectedAesthetic.title }]);
      showToast(`Look "${look.title}" preserved in your Style Vault.`);
    } else {
      showToast(`This look is already curated in your vault.`);
    }
  };

  const handleRemoveSavedLook = (id: string) => {
    setSavedLooks(savedLooks.filter((item) => item.id !== id));
    showToast('Look removed from vault.');
  };

  // 21st.dev Draggable Slider Pointer Event Handlers
  const handleSliderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSlider || !sliderFrameRef.current) return;
    const rect = sliderFrameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(Math.round(pct));
  };

  const handleTriggerSimulate = () => {
    setIsSimulatingTryOn(true);
    setTimeout(() => {
      setIsSimulatingTryOn(false);
      showToast('Neural drape mesh rendered & verified.');
    }, 850);
  };

  // Safe occasion look accessor
  const currentOccasionLooks = STYLING_LOOKS[selectedOccasion] || STYLING_LOOKS['Everyday'];
  const activeLook = currentOccasionLooks[lookIndex % currentOccasionLooks.length];

  const activeAnchorPiece = SMART_MATCH_PIECES[selectedPieceIndex];
  const activeAnchorCombination = activeAnchorPiece.combinations[matchingModeIndex % activeAnchorPiece.combinations.length];

  const filteredRunwayItems = useMemo(() => {
    if (selectedCategory === 'All') return RUNWAY_DISCOVERY_ITEMS;
    return RUNWAY_DISCOVERY_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Format active occasion look garments for the 3D Circular Stylist Gallery
  const stylistGalleryItems = useMemo(() => {
    return activeLook.items.map((it) => ({
      image: it.img,
      text: it.name,
      subtext: `${it.type} • ${it.brand} (${it.gsm})`,
      raw: it
    }));
  }, [activeLook]);

  return (
    <div className="min-h-screen bg-[#080908] text-[#F6F7F2] font-sans antialiased selection:bg-[#C5FF00] selection:text-[#080908] relative overflow-x-hidden">
      {/* Editorial Google Fonts Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        .font-serif-editorial {
          font-family: 'Instrument Serif', Georgia, serif;
        }
        .font-tech {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .editorial-grain {
          background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0);
          background-size: 24px 24px;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1.2deg); }
        }

        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        /* 21st.dev Shimmer Button Glow */
        .btn-shimmer {
          position: relative;
          overflow: hidden;
        }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(60deg, transparent 20%, rgba(255, 255, 255, 0.35) 50%, transparent 80%);
          transform: translateX(-100%);
          animation: btnShimmerAnim 4s infinite;
          pointer-events: none;
        }
        @keyframes btnShimmerAnim {
          0% { transform: translateX(-100%) rotate(25deg); }
          25%, 100% { transform: translateX(100%) rotate(25deg); }
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #080908;
        }
        ::-webkit-scrollbar-thumb {
          background: #272A26;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #C5FF00;
        }
      `}</style>

      {/* Subtle Ambient Grain Layer */}
      <div className="fixed inset-0 pointer-events-none z-10 editorial-grain opacity-60" />

      {/* ==========================================
          TOAST NOTIFICATION COMPONENT
          ========================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#151815] border border-[#C5FF00]/40 text-[#F6F7F2] px-5 py-3.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300">
          <span className="w-2 h-2 rounded-full bg-[#C5FF00] animate-pulse" />
          <p className="text-sm font-medium tracking-wide">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-[#A0A59C] hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ==========================================
          NAVIGATION BAR (SINGLE UNIFIED LUXURY HEADER)
          ========================================== */}
      <header className="sticky top-0 z-40 bg-[#080908]/85 backdrop-blur-md border-b border-white/[0.07] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Brand Logo with Official Quetzal Emblem */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-sm bg-[#151815] border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#C5FF00]">
              <img
                src={zyraMascotPng}
                alt="ZYRA Quetzal Emblem"
                className="w-7 h-7 object-contain transform transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-[0.22em] text-[#F6F7F2] font-tech uppercase flex items-center gap-1">
                <span>ZYRA</span>
                <span className="text-[#C5FF00]">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#A0A59C] -mt-1 font-mono">
                Atelier AI
              </span>
            </div>
          </a>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wider uppercase font-tech text-[#A0A59C]">
            <a href="#discover" className="hover:text-[#F6F7F2] transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#C5FF00]">
              Discover
            </a>
            <a href="#stylist" className="hover:text-[#F6F7F2] transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#C5FF00]">
              Style Studio
            </a>
            <a href="#matching" className="hover:text-[#F6F7F2] transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#C5FF00]">
              Outfit Engine
            </a>
            <a href="#try-on" className="hover:text-[#F6F7F2] transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#C5FF00]">
              Virtual Try-On
            </a>
            <a href="#zyra" className="hover:text-[#F6F7F2] transition-colors relative py-1 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#C5FF00]">
              The Quetzal Spirit
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={() => {
                setAmbientAudio(!ambientAudio);
                showToast(ambientAudio ? "Atelier soundscape paused." : "Atelier ambient soundscape active.");
              }}
              title="Toggle Ambient Audio Experience"
              aria-label="Toggle sound"
              className="w-10 h-10 rounded-full border border-white/10 bg-[#151815] text-[#A0A59C] hover:text-[#C5FF00] hover:border-[#C5FF00]/40 flex items-center justify-center transition-all"
            >
              {ambientAudio ? <Volume2 size={16} className="text-[#C5FF00]" /> : <VolumeX size={16} />}
            </button>

            {/* Wardrobe Vault Button */}
            <button
              onClick={() => setSavedLooksDrawerOpen(true)}
              className="relative p-2.5 rounded-full border border-white/10 bg-[#151815] text-[#F6F7F2] hover:border-[#C5FF00]/60 transition-all"
              aria-label="View Saved Wardrobe"
            >
              <Bookmark size={17} className={savedLooks.length > 0 ? 'text-[#C5FF00]' : ''} />
              {savedLooks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C5FF00] text-[#080908] text-[10px] font-bold flex items-center justify-center">
                  {savedLooks.length}
                </span>
              )}
            </button>

            {/* Primary Action Button (21st.dev Shimmer) */}
            <a
              href="#stylist"
              className="btn-shimmer hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C5FF00] text-[#080908] font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-[#A5F238] hover:shadow-[0_0_24px_rgba(197,255,0,0.35)]"
            >
              <span>Discover Your Style</span>
              <ArrowUpRight size={14} />
            </a>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F6F7F2] hover:text-[#C5FF00] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#101210] border-b border-white/10 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-5 text-base uppercase tracking-widest font-tech text-[#A0A59C]">
              <a onClick={() => setMobileMenuOpen(false)} href="#discover" className="hover:text-white transition-colors">01. Discover Aesthetic</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#stylist" className="hover:text-white transition-colors">02. Style Studio</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#matching" className="hover:text-white transition-colors">03. Outfit Engine</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#try-on" className="hover:text-white transition-colors">04. Virtual Try-On</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#zyra" className="hover:text-white transition-colors">05. The ZYRA Spirit</a>
            </nav>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href="#stylist"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-xs uppercase tracking-wider btn-shimmer"
              >
                Launch Style Studio
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ==========================================
          HERO EXPERIENCE (CINEMATIC & EDITORIAL)
          ========================================== */}
      <section className="relative min-h-[94vh] flex items-center border-b border-white/[0.08] overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5FF00]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[32rem] h-[32rem] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-20">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Status Tag */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-[#151815]/90 backdrop-blur-md mb-8 shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5FF00] animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-[#F6F7F2] uppercase flex items-center gap-2">
                <span>Atelier Preview 2026</span>
                <span className="text-[#C5FF00]">•</span>
                <span className="text-[#A0A59C]">Neural Styling Engine</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.92] mb-6">
              Style Has <br />
              A New <br />
              <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase tracking-normal">
                intelligence.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#A0A59C] max-w-xl font-light leading-relaxed mb-10">
              Discover your aesthetic. Find your next favorite look. Let AI bring your personal style into focus with bespoke garment harmony and proportion intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#stylist"
                className="btn-shimmer w-full sm:w-auto px-8 py-4 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#A5F238] hover:shadow-[0_0_30px_rgba(197,255,0,0.4)]"
              >
                <span>Discover Your Style</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#discover"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-transparent text-[#F6F7F2] font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:border-[#C5FF00] hover:bg-white/[0.04]"
              >
                <span>Explore the Experience</span>
              </a>
            </div>

            {/* 5 Core Pillars Preview Row */}
            <div className="pt-10 mt-10 border-t border-white/10 w-full">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A0A59C] block mb-3">
                The Five Virtues of ZYRA:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {ZYRA_PILLARS.map((pillar, idx) => (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      setActivePillarIndex(idx);
                      showToast(`${pillar.title}: ${pillar.desc}`);
                    }}
                    className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${activePillarIndex === idx
                        ? 'border-[#C5FF00] bg-[#C5FF00]/15 text-[#C5FF00]'
                        : 'border-white/10 bg-[#101210] text-[#A0A59C] hover:text-white hover:border-white/30'
                      }`}
                  >
                    <span className="text-[#C5FF00]">{pillar.glyph}</span>
                    <span>{pillar.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Official Editorial Visual Showcase with Hotspots */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div
              className="relative w-full max-w-lg aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden border border-white/20 bg-[#101210] group shadow-[0_30px_90px_rgba(0,0,0,0.95)] transition-transform duration-300 ease-out"
              style={{
                perspective: '1000px',
                transform: `rotateY(${heroTilt.x}deg) rotateX(${heroTilt.y}deg)`
              }}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
              {/* Dynamic Radial Aura Layer for Depth */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,255,0,0.18)_0%,rgba(16,185,129,0.12)_35%,rgba(8,9,8,0.9)_75%)] pointer-events-none" />

              <img
                src={heroBrandEditorial}
                alt="ZYRA Luxury Fashion Spirit & Editorial Vision"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 filter brightness-[1.02] relative z-10"
              />

              {/* Gradient Vignette Overlays for Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080908] via-transparent to-transparent opacity-80 pointer-events-none z-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080908]/40 via-transparent to-[#080908]/20 pointer-events-none z-20" />

              {/* Editorial Badge (Top Left) */}
              <div className="absolute top-5 left-5 p-3 rounded-2xl bg-[#080908]/85 border border-white/15 backdrop-blur-md shadow-lg pointer-events-none z-30">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C5FF00]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#F6F7F2] font-bold">
                    Editorial No. 01
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#A0A59C] block mt-0.5">
                  ZYRA Spirit & Atelier Form
                </span>
              </div>

              {/* Interactive Hotspots */}
              {HERO_HOTSPOTS.map((spot) => (
                <div
                  key={spot.id}
                  style={{ top: spot.y, left: spot.x }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                  onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
                >
                  <button
                    className="relative group/hotspot w-7 h-7 rounded-full bg-[#080908]/90 border border-[#C5FF00] text-[#C5FF00] flex items-center justify-center transition-transform hover:scale-125 shadow-[0_0_20px_rgba(197,255,0,0.6)]"
                    aria-label={spot.title}
                  >
                    <span className="absolute inset-0 rounded-full bg-[#C5FF00] animate-ping opacity-40 pointer-events-none" />
                    <Sparkles size={13} />
                  </button>
                </div>
              ))}

              {/* Hotspot Popover Detail Card */}
              {activeHotspot && (
                <div
                  className="absolute bottom-24 left-6 right-6 p-4 rounded-2xl bg-[#101210]/95 border border-[#C5FF00]/50 backdrop-blur-xl shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5FF00]">
                      {activeHotspot.tag}
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-[#A0A59C] hover:text-white p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold uppercase text-[#F6F7F2] mb-1">
                    {activeHotspot.title}
                  </h4>
                  <p className="text-xs text-[#A0A59C] leading-relaxed">
                    {activeHotspot.detail}
                  </p>
                </div>
              )}

              {/* Bottom Editorial Banner Detail */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#101210]/90 border border-white/15 backdrop-blur-md z-30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5FF00]" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#F6F7F2]">
                      Sartorial Composition
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-[#C5FF00]">
                    98.4% Ratio Match
                  </span>
                </div>
                <p className="text-xs text-[#A0A59C] line-clamp-1 font-light">
                  High-drape architecture harmonious with iridescent emerald plumage & liquid wool tailoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[#A0A59C]">
          <span className="text-[10px] uppercase font-mono tracking-widest">Scroll To Explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#C5FF00] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ==========================================
          SECTION: DISCOVER YOUR AESTHETIC
          INTEGRATING TILTED GRID HERO (3D CYLINDER CAROUSEL)
          ========================================== */}
      <section id="discover" className="py-20 md:py-28 border-b border-white/[0.08] relative overflow-hidden bg-[#090A09]">
        {/* Subtle Ambient Depth Radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[35rem] bg-[#C5FF00]/[0.03] rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#151815] text-[11px] font-mono uppercase tracking-widest text-[#C5FF00] mb-3">
                <Compass size={13} />
                <span>01 — Spatial Aesthetic Continuum</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
                Which world <br />
                <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                  feels like you?
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A0A59C] max-w-md font-light leading-relaxed">
              Your style isn't a category. It's a living world. Watch continuous cylindrical drape facets unfold in 3D perspective, or select an archetype below to calibrate your personal neural stylist.
            </p>
          </div>
        </div>

        {/* 3D Tilted Grid Hero Carousel Showcase (21st.dev Component) */}
        <div className="w-full relative px-2 sm:px-6 lg:px-10 mb-12">
          <TiltedGridHero
            images={TILTED_EDITORIAL_IMAGES}
            speed={4.5}
            tileHeight={36}
            aspectRatio={16 / 9}
            gap={8}
            axis={52}
            curve={78}
            fade={15}
            className="h-[440px] sm:h-[520px] w-full rounded-3xl border border-white/10 bg-[#080908]/90 shadow-[0_20px_70px_rgba(0,0,0,0.8)]"
          >
            {/* Overlay Editorial HUD floating inside the 3D ribbon */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between py-10 px-6 text-center pointer-events-none">
              <div className="p-3 rounded-2xl bg-[#080908]/70 border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C5FF00] flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF00] animate-ping" />
                  Cylindrical Facet Stream • 16-Strip Projection
                </span>
              </div>

              <div className="max-w-lg p-5 rounded-2xl bg-[#080908]/85 border border-white/15 backdrop-blur-xl shadow-2xl">
                <span className="text-xs font-mono uppercase text-[#A0A59C] block mb-1">
                  Active Calibration
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase text-white font-tech mb-2">
                  {selectedAesthetic.title}
                </h3>
                <p className="text-xs text-[#A0A59C] leading-relaxed line-clamp-2">
                  {selectedAesthetic.tagline}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono text-[#A0A59C] bg-[#080908]/70 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <span>Curve: 78° Arc</span>
                <span className="text-[#C5FF00]">•</span>
                <span>Aspect: 16:9 Dynamic Facets</span>
              </div>
            </div>
          </TiltedGridHero>
        </div>

        {/* Dynamic Aesthetic Selector Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="p-6 rounded-3xl bg-[#101210] border border-white/15 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 flex-wrap gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF00] flex items-center gap-2">
                <SlidersHorizontal size={14} />
                <span>Select Archetype To Re-Calibrate Outfit Engine</span>
              </span>
              <span className="text-[11px] font-mono text-[#A0A59C]">
                Selected: <strong className="text-white">{selectedAesthetic.title}</strong>
              </span>
            </div>

            {/* Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-6">
              {AESTHETICS.map((item) => {
                const isSelected = selectedAesthetic.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedAesthetic(item);
                      showToast(`Aesthetic calibrated to "${item.title}".`);
                    }}
                    className={`py-3 px-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 ${isSelected
                        ? 'border-[#C5FF00] bg-[#151815] shadow-[0_0_20px_rgba(197,255,0,0.25)] text-white scale-[1.02]'
                        : 'border-white/10 bg-[#080908]/60 text-[#A0A59C] hover:border-white/30 hover:text-white'
                      }`}
                  >
                    <span className="text-[9px] font-mono uppercase text-[#A0A59C] block mb-1">
                      {item.id.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-bold font-tech uppercase line-clamp-1">
                      {item.title}
                    </span>
                    <div className="flex gap-1 mt-2">
                      {item.palette.slice(0, 3).map((col, idx) => (
                        <span
                          key={idx}
                          className="w-2 h-2 rounded-full border border-black/50"
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Telemetry Strip for Active Aesthetic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151815] border border-white/10">
                <div className="p-2 rounded-lg bg-[#080908] text-[#C5FF00]">
                  <Palette size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#A0A59C] block">Color Spectrum:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selectedAesthetic.palette.map((color, idx) => (
                      <span
                        key={idx}
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                    <span className="text-[10px] text-[#A0A59C] ml-1">{selectedAesthetic.palette[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151815] border border-white/10">
                <div className="p-2 rounded-lg bg-[#080908] text-[#C5FF00]">
                  <Layers size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#A0A59C] block">Signature Fibers:</span>
                  <span className="text-[11px] text-white">
                    {selectedAesthetic.fabrics.join(' • ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#151815] border border-white/10">
                <div className="p-2 rounded-lg bg-[#080908] text-[#C5FF00]">
                  <Wand2 size={16} />
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#A0A59C] block">Silhouette Architecture:</span>
                  <span className="text-[11px] text-[#C5FF00]">
                    {selectedAesthetic.silhouetteRatio}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: THE PERSONAL STYLIST
          3D CIRCULAR CYLINDER GALLERY (21st.dev Component)
          ========================================== */}
      <section id="stylist" className="py-24 md:py-32 border-b border-white/[0.08] relative bg-[#0B0C0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5FF00] block mb-3">
                02 — Dynamic 3D Style Studio
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
                Your wardrobe. <br />
                <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                  a new perspective.
                </span>
              </h2>
            </div>

            {/* Occasion Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {(['Everyday', 'Work', 'Date Night', 'Travel', 'Special Event'] as (keyof typeof STYLING_LOOKS)[]).map((occ) => (
                <button
                  key={occ}
                  onClick={() => {
                    setSelectedOccasion(occ);
                    setLookIndex(0);
                    showToast(`Occasion calibrated to ${occ}.`);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${selectedOccasion === occ
                      ? 'bg-[#C5FF00] text-[#080908] font-bold shadow-[0_0_20px_rgba(197,255,0,0.3)]'
                      : 'border border-white/15 bg-[#151815] text-[#A0A59C] hover:border-white/30 hover:text-white'
                    }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 3D Cylindrical Outfit Studio */}
          <div className="rounded-3xl border border-white/15 bg-[#101210] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Header of the Studio Look */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono uppercase text-[#C5FF00]">
                    Active Occasion: {selectedOccasion}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs font-mono uppercase text-[#A0A59C]">
                    Calibrated to {selectedAesthetic.title}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold uppercase text-[#F6F7F2] font-tech">
                  {activeLook.title}
                </h3>
              </div>

              {/* Action Buttons & Curvature Slider */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151815] border border-white/10 text-xs font-mono">
                  <span className="text-[#A0A59C]">Bend:</span>
                  <input
                    type="range"
                    min="1.0"
                    max="4.5"
                    step="0.2"
                    value={stylistBend}
                    onChange={(e) => setStylistBend(parseFloat(e.target.value))}
                    className="w-20 accent-[#C5FF00] cursor-pointer"
                  />
                  <span className="text-[#C5FF00]">{stylistBend.toFixed(1)}</span>
                </div>

                <button
                  onClick={() => setLookIndex((prev) => prev + 1)}
                  className="px-4 py-2 rounded-full border border-white/15 bg-[#151815] text-[#F6F7F2] hover:border-[#C5FF00] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <RefreshCw size={13} className="text-[#C5FF00]" />
                  <span>Shuffle Variation</span>
                </button>

                <button
                  onClick={() => handleSaveLook(activeLook)}
                  className="btn-shimmer px-5 py-2 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-[#A5F238] transition-all shadow-[0_0_20px_rgba(197,255,0,0.3)]"
                >
                  <Bookmark size={13} />
                  <span>Save Look</span>
                </button>
              </div>
            </div>

            {/* 3D CIRCULAR GALLERY: Garment Carousel */}
            <div className="mb-8">
              <CircularGallery
                items={stylistGalleryItems}
                bend={stylistBend}
                borderRadius={0.06}
                scrollSpeed={2.2}
                scrollEase={0.05}
                className="h-[460px]"
                onItemSelect={(item) => {
                  const rawItem = item.raw as { name: string; type: string; brand: string; gsm: string; img: string };
                  if (rawItem) {
                    setTryOnGarment({
                      id: `stylist-${Date.now()}`,
                      name: rawItem.name,
                      category: rawItem.type,
                      brand: rawItem.brand,
                      price: '$680',
                      tag: 'Atelier',
                      fiber: rawItem.gsm,
                      img: rawItem.img
                    });
                    showToast(`"${rawItem.name}" staged into Virtual Try-On!`);
                  }
                }}
              />
            </div>

            {/* Neural Styling Breakdown Analysis */}
            <div className="p-6 rounded-2xl bg-[#080908] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5FF00] block mb-1">
                  Stylist Recommendation Rationale
                </span>
                <p className="text-xs sm:text-sm text-[#A0A59C] leading-relaxed">
                  {activeLook.description}
                </p>
                <div className="mt-2 text-[10px] font-mono text-white/50">
                  Textile Matrix: <span className="text-[#F6F7F2]">{activeLook.fabricTech}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 shrink-0">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A59C] block">
                    Harmony Score
                  </span>
                  <span className="text-2xl font-bold font-tech text-[#C5FF00]">
                    {activeLook.harmonyScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A59C] block">
                    Silhouette Flow
                  </span>
                  <span className="text-xs font-mono text-[#F6F7F2]">
                    {activeLook.silhouette}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: SMART OUTFIT MATCHING
          "One piece. Endless possibilities."
          ========================================== */}
      <section id="matching" className="py-24 md:py-32 border-b border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5FF00] block mb-3">
                03 — Outfit Matching Engine
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
                One piece. <br />
                <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                  endless possibilities.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A0A59C] max-w-md font-light leading-relaxed">
              Anchor your outfit around a single core garment. Explore how deterministic neural pairing creates entirely different aesthetic identities.
            </p>
          </div>

          {/* Anchor Selection & Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Anchor Garment Card */}
            <div className="lg:col-span-4 rounded-3xl border border-white/15 bg-[#101210] p-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5FF00] block mb-3">
                Select Anchor Piece
              </span>

              {/* Selector Tabs */}
              <div className="flex gap-2 mb-6">
                {SMART_MATCH_PIECES.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => {
                      setSelectedPieceIndex(idx);
                      setMatchingModeIndex(0);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all ${selectedPieceIndex === idx
                        ? 'border-[#C5FF00] bg-[#C5FF00]/15 text-[#C5FF00]'
                        : 'border-white/10 bg-[#151815] text-[#A0A59C]'
                      }`}
                  >
                    {piece.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Garment Visual */}
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-black mb-4 border border-white/10 relative">
                <img
                  src={activeAnchorPiece.img}
                  alt={activeAnchorPiece.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#080908]/90 text-[10px] font-mono text-[#C5FF00]">
                  {activeAnchorPiece.weave}
                </span>
              </div>

              <h4 className="text-lg font-bold uppercase text-[#F6F7F2]">
                {activeAnchorPiece.name}
              </h4>
              <p className="text-xs font-mono text-[#A0A59C] mb-4">
                Category: {activeAnchorPiece.category} • Tone: {activeAnchorPiece.color}
              </p>

              {/* Combinations Mode Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-[#A0A59C]">
                  Styling Dial:
                </span>
                {activeAnchorPiece.combinations.map((comb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMatchingModeIndex(idx)}
                    className={`text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${matchingModeIndex === idx
                        ? 'border-[#C5FF00] bg-[#151815] text-[#F6F7F2]'
                        : 'border-white/5 bg-[#080908] text-[#A0A59C] hover:border-white/20'
                      }`}
                  >
                    <span>{comb.mode}</span>
                    {matchingModeIndex === idx && <Check size={14} className="text-[#C5FF00]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Complementary Ensemble Results */}
            <div className="lg:col-span-8 rounded-3xl border border-white/15 bg-[#101210] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5FF00]">
                    Generated Coordination • {activeAnchorCombination.contrastRatio}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase text-[#F6F7F2] font-tech">
                    {activeAnchorCombination.mode}
                  </h3>
                </div>
                {/* Palette Tokens */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#A0A59C]">Harmony:</span>
                  {activeAnchorCombination.paletteTokens.map((col, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A0A59C] leading-relaxed mb-8">
                {activeAnchorCombination.summary}
              </p>

              {/* 4 Complementary Matching Pieces */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Layer', item: activeAnchorCombination.layer },
                  { label: 'Top', item: activeAnchorCombination.top },
                  { label: 'Footwear', item: activeAnchorCombination.shoe },
                  { label: 'Accents', item: activeAnchorCombination.accessory }
                ].map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#151815] border border-white/10 flex flex-col justify-between hover:border-white/30 transition-all cursor-pointer group"
                    onClick={() => {
                      setQuickViewProduct({
                        id: `match-${idx}`,
                        name: slot.item.name,
                        category: slot.label,
                        brand: slot.item.brand,
                        price: '$490',
                        tag: 'Ensemble Spec',
                        fiber: 'Natural Italian Fiber',
                        img: slot.item.img
                      });
                    }}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-black mb-2.5">
                      <img
                        src={slot.item.img}
                        alt={slot.item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase text-[#C5FF00] block mb-0.5">
                        {slot.label}
                      </span>
                      <h5 className="text-xs font-bold uppercase text-[#F6F7F2] line-clamp-1">
                        {slot.item.name}
                      </h5>
                      <span className="text-[10px] font-mono text-[#A0A59C] block">
                        {slot.item.brand}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: VIRTUAL TRY-ON (21ST.DEV DRAGGABLE COMPARISON LAB)
          "See the possibility. Before the purchase."
          ========================================== */}
      <section id="try-on" className="py-24 md:py-32 border-b border-white/[0.08] relative bg-[#0B0C0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5FF00] block mb-3">
                04 — Virtual Fitting Laboratory
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
                See the possibility. <br />
                <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                  before the purchase.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#A0A59C] max-w-md font-light leading-relaxed">
              Visualize drape, proportion tension, and silhouette scale. Use the 21st.dev interactive split-comparison slider or layer-blend modes with 100% private local processing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-[#101210] p-6 sm:p-8">
              {/* Mode Toggle (Slider vs Blend) */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF00]">
                  Interaction Dial:
                </span>
                <div className="flex items-center bg-[#151815] p-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setTryOnMode('slider')}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase transition-all ${tryOnMode === 'slider' ? 'bg-[#C5FF00] text-[#080908] font-bold' : 'text-[#A0A59C]'
                      }`}
                  >
                    Split Slider
                  </button>
                  <button
                    onClick={() => setTryOnMode('blend')}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase transition-all ${tryOnMode === 'blend' ? 'bg-[#C5FF00] text-[#080908] font-bold' : 'text-[#A0A59C]'
                      }`}
                  >
                    Layer Blend
                  </button>
                </div>
              </div>

              {/* Silhouette Models */}
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF00] block mb-3">
                  01. Select Reference Silhouette
                </span>
                <div className="flex flex-col gap-2">
                  {TRY_ON_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setTryOnModel(model)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${tryOnModel.id === model.id
                          ? 'border-[#C5FF00] bg-[#151815] text-[#F6F7F2]'
                          : 'border-white/5 bg-[#080908] text-[#A0A59C] hover:border-white/20'
                        }`}
                    >
                      <img
                        src={model.img}
                        alt={model.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <span className="text-xs font-mono uppercase block">{model.name}</span>
                        <span className="text-[10px] font-mono text-[#A0A59C]">{model.stats}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Garment Selector */}
              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF00] block mb-3">
                  02. Garment for Neural Mapping
                </span>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-[#151815]">
                  <img
                    src={tryOnGarment.img}
                    alt={tryOnGarment.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold uppercase text-white">{tryOnGarment.name}</h5>
                    <p className="text-[10px] font-mono text-[#A0A59C]">{tryOnGarment.brand} • {tryOnGarment.price} • {tryOnGarment.fiber}</p>
                  </div>
                </div>
              </div>

              {/* Sliders Depending on Mode */}
              {tryOnMode === 'slider' ? (
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-[#A0A59C]">Divider Position:</span>
                    <span className="text-[#C5FF00]">{sliderPosition}%</span>
                  </div>
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => setSliderPosition(val)}
                        className={`flex-1 py-1.5 rounded-lg border text-[11px] font-mono ${sliderPosition === val
                            ? 'border-[#C5FF00] bg-[#C5FF00]/15 text-[#C5FF00]'
                            : 'border-white/10 bg-[#151815] text-[#A0A59C]'
                          }`}
                      >
                        {val === 50 ? '50% Split' : `${val}%`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-[#A0A59C]">Silhouette Blending:</span>
                      <span className="text-[#C5FF00]">{Math.round(tryOnOverlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.05"
                      value={tryOnOverlayOpacity}
                      onChange={(e) => setTryOnOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full accent-[#C5FF00] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-[#A0A59C]">Fabric Drape Tension:</span>
                      <span className="text-[#C5FF00]">{drapeTension}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="1"
                      value={drapeTension}
                      onChange={(e) => setDrapeTension(parseInt(e.target.value, 10))}
                      className="w-full accent-[#C5FF00] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleTriggerSimulate}
                disabled={isSimulatingTryOn}
                className="btn-shimmer w-full py-3.5 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 hover:bg-[#A5F238] transition-all"
              >
                {isSimulatingTryOn ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Mapping Garment Silhouette...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Simulate Virtual Drape</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-[#A0A59C]">
                <ShieldCheck size={14} className="text-[#C5FF00]" />
                <span>Private local rendering • No biometric data retained</span>
              </div>
            </div>

            {/* Right Display: 21st.dev Interactive Comparison Canvas */}
            <div className="lg:col-span-7 flex justify-center">
              <div
                ref={sliderFrameRef}
                className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl select-none"
                onPointerDown={() => setIsDraggingSlider(true)}
                onPointerMove={handleSliderPointerMove}
                onPointerUp={() => setIsDraggingSlider(false)}
                onPointerLeave={() => setIsDraggingSlider(false)}
                style={{ cursor: tryOnMode === 'slider' ? 'ew-resize' : 'default' }}
              >
                {/* Base Silhouette (Before Layer) */}
                <img
                  src={tryOnModel.img}
                  alt={tryOnModel.name}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
                />

                {/* Overlaid Draped Layer (After Layer) */}
                {tryOnMode === 'slider' ? (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
                    }}
                  >
                    <img
                      src={tryOnModel.drapedImg || tryOnGarment.img}
                      alt={tryOnModel.garmentName || tryOnGarment.name}
                      className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105"
                    />
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                    style={{ opacity: tryOnOverlayOpacity }}
                  >
                    <img
                      src={tryOnModel.drapedImg || tryOnGarment.img}
                      alt={tryOnModel.garmentName || tryOnGarment.name}
                      className="absolute inset-0 w-full h-full object-cover object-center filter contrast-105"
                    />
                  </div>
                )}

                {/* Draggable Divider Handle (21st.dev Component) */}
                {tryOnMode === 'slider' && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#C5FF00] z-30 pointer-events-none shadow-[0_0_15px_#C5FF00]"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#080908] border-2 border-[#C5FF00] flex items-center justify-center text-[#C5FF00] shadow-xl text-xs font-bold">
                      ⟷
                    </div>
                  </div>
                )}

                {/* Overlaid Specs */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#080908]/90 border border-white/15 backdrop-blur-md flex items-center justify-between text-xs z-20">
                  <div>
                    <h5 className="font-bold uppercase text-white">
                      {tryOnModel.garmentName || tryOnGarment.name}
                    </h5>
                    <p className="text-[10px] font-mono text-[#A0A59C]">
                      Spectral Match 98.4% • Drag handle ⟷
                    </p>
                  </div>
                  <button
                    onClick={() => showToast(`Garment "${tryOnModel.garmentName || tryOnGarment.name}" added to wishlist.`)}
                    className="px-3 py-1.5 rounded-full border border-white/20 text-[#C5FF00] hover:border-[#C5FF00] font-mono text-[10px] uppercase"
                  >
                    Add To Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: THE ZYRA EXPERIENCE (SIGNATURE MASCOT)
          "Meet your fashion spirit."
          ========================================== */}
      <section id="zyra" className="py-24 md:py-32 border-b border-white/[0.08] relative bg-[#090A09] overflow-hidden">
        {/* Luminous emerald and lime radial lights */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[34rem] h-[34rem] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-[#C5FF00]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Mascot Visual Presentation with Vector Mascot Component */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div
                className="relative w-80 sm:w-96 aspect-square flex items-center justify-center cursor-pointer group"
                onClick={() => {
                  setZyraFlightMode(!zyraFlightMode);
                  setZyraAuraEnergy((prev) => (prev >= 2 ? 1 : prev + 0.5));
                  showToast("Zyra takes flight — Spirit energy elevated!");
                }}
              >
                {/* Luminous Halo Ring */}
                <div
                  className="absolute inset-4 rounded-full border border-[#C5FF00]/25 transition-transform duration-1000 group-hover:scale-110 pointer-events-none"
                  style={{
                    boxShadow: `0 0 ${35 * zyraAuraEnergy}px rgba(197, 255, 0, ${0.25 * zyraAuraEnergy})`
                  }}
                />

                {/* Character Asset */}
                <div className={zyraFlightMode ? 'animate-bounce' : 'animate-float-slow'}>
                  <ZyraMascotIllustration
                    flightMode={zyraFlightMode}
                    auraEnergy={zyraAuraEnergy}
                    onHover={() => setZyraAuraEnergy(1.5)}
                  />
                </div>

                {/* Interactive Tooltip */}
                <div className="absolute bottom-2 bg-[#151815]/90 border border-white/15 px-4 py-1.5 rounded-full text-xs font-mono text-[#F6F7F2] flex items-center gap-2 shadow-xl backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#C5FF00] animate-ping" />
                  <span>Click to interact with Zyra ({zyraFlightMode ? 'In Flight' : 'Perched'})</span>
                </div>
              </div>

              {/* Action Controls for Mascot */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setZyraFlightMode(!zyraFlightMode);
                    showToast(zyraFlightMode ? "Zyra gracefully settles." : "Zyra glides through the digital atelier!");
                  }}
                  className="px-4 py-2 rounded-full border border-white/15 bg-[#101210] text-[#F6F7F2] hover:border-[#C5FF00] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Feather size={13} className="text-[#C5FF00]" />
                  <span>{zyraFlightMode ? "Perch Spirit" : "Summon Flight"}</span>
                </button>
                <button
                  onClick={() => {
                    setZyraAuraEnergy((prev) => (prev >= 2 ? 1 : prev + 0.5));
                    showToast("Spirit aura intensified.");
                  }}
                  className="px-4 py-2 rounded-full border border-white/15 bg-[#101210] text-[#F6F7F2] hover:border-[#C5FF00] text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Flame size={13} className="text-[#C5FF00]" />
                  <span>Channel Aura</span>
                </button>
              </div>
            </div>

            {/* Mascot Editorial Narrative */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#C5FF00] mb-3">
                <Sparkles size={14} />
                <span>The Brand Mascot & Fashion Spirit</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">
                Meet your <br />
                <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                  fashion spirit.
                </span>
              </h2>

              <p className="text-lg text-[#F6F7F2] font-light leading-relaxed mb-4">
                ZYRA is a magical bird inspired by the Resplendent Quetzal, representing creativity, transformation, intelligence, and personal expression.
              </p>

              <p className="text-sm text-[#A0A59C] leading-relaxed mb-8">
                In fashion mythology, the creature represents the wings of personal identity.
                ZYRA studies proportion, color balance, and drape harmony to guide you toward quiet, unforgettable confidence.
              </p>

              {/* Interactive Scripted Companion Terminal */}
              <div className="w-full bg-[#101210] border border-white/15 rounded-2xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5FF00]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-[#F6F7F2]">
                      Consult ZYRA’s Fashion Intelligence
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#A0A59C]">Spirit Mode 3.4</span>
                </div>

                {/* Prompt selector */}
                <div className="flex flex-col gap-2 mb-4">
                  {ZYRA_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setZyraActiveDialogue(p)}
                      className={`text-left text-xs p-3 rounded-lg border transition-all ${zyraActiveDialogue.q === p.q
                          ? 'bg-[#151815] border-[#C5FF00] text-[#F6F7F2]'
                          : 'bg-[#151815]/50 border-white/5 text-[#A0A59C] hover:border-white/20 hover:text-white'
                        }`}
                    >
                      "{p.q}"
                    </button>
                  ))}
                </div>

                {/* ZYRA Response Window */}
                <div className="p-4 rounded-xl bg-[#080908] border border-white/10 text-xs leading-relaxed text-[#A0A59C]">
                  <span className="font-mono text-[#C5FF00] block mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>ZYRA Speaks:</span>
                  </span>
                  <p className="text-[#F6F7F2] font-light">{zyraActiveDialogue.a}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: FASHION DISCOVERY (CURATED CATALOG)
          3D CIRCULAR RUNWAY (21st.dev Component)
          ========================================== */}
      <section className="py-24 md:py-32 border-b border-white/[0.08] relative bg-[#080908]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5FF00] block mb-3">
                05 — 3D Circular Runway & Curated Discovery
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
                Find the pieces. <br />
                <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                  create the look.
                </span>
              </h2>
            </div>

            {/* Category Filter Pills & Arc Curvature Slider */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151815] border border-white/10 text-xs font-mono">
                <span className="text-[#A0A59C]">Curve Bend:</span>
                <input
                  type="range"
                  min="1.2"
                  max="4.8"
                  step="0.2"
                  value={runwayBend}
                  onChange={(e) => setRunwayBend(parseFloat(e.target.value))}
                  className="w-20 accent-[#C5FF00] cursor-pointer"
                />
                <span className="text-[#C5FF00]">{runwayBend.toFixed(1)}</span>
              </div>

              {['All', 'Outerwear', 'Tops', 'Bottoms'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${selectedCategory === cat
                      ? 'bg-[#C5FF00] text-[#080908] font-bold shadow-[0_0_15px_rgba(197,255,0,0.3)]'
                      : 'border border-white/15 bg-[#151815] text-[#A0A59C] hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Circular Gallery: Full Runway Showcase */}
          <div className="relative mb-10">
            <CircularGallery
              items={filteredRunwayItems}
              bend={runwayBend}
              borderRadius={0.06}
              scrollSpeed={2.0}
              scrollEase={0.04}
              className="h-[520px]"
              onItemSelect={(item) => {
                setFocalRunwayItem(item);
                showToast(`Staged "${item.text}" into Focal Atelier Inspector.`);
              }}
            />
          </div>

          {/* Dynamic Runway Inspector Card for Selected Piece */}
          {focalRunwayItem && (
            <div className="p-6 rounded-3xl bg-[#101210] border border-white/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={focalRunwayItem.image}
                  alt={focalRunwayItem.text}
                  className="w-20 h-20 rounded-2xl object-cover border border-[#C5FF00]/40 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5FF00]">
                      {focalRunwayItem.category} • {focalRunwayItem.subtext}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs font-mono font-bold text-white">{focalRunwayItem.price}</span>
                  </div>
                  <h4 className="text-lg font-bold uppercase text-white font-tech">
                    {focalRunwayItem.text}
                  </h4>
                  <p className="text-xs font-mono text-[#A0A59C]">
                    Fiber Composition: {focalRunwayItem.fiber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setTryOnGarment({
                      id: `runway-${Date.now()}`,
                      name: focalRunwayItem.text,
                      category: focalRunwayItem.category || 'Outerwear',
                      brand: focalRunwayItem.subtext ? focalRunwayItem.subtext.split('•')[0].trim() : 'Haute Forma',
                      price: focalRunwayItem.price || '$890',
                      tag: 'Runway Focus',
                      fiber: focalRunwayItem.fiber || 'Natural Wool',
                      img: focalRunwayItem.image
                    });
                    showToast(`"${focalRunwayItem.text}" staged in Virtual Try-On!`);
                  }}
                  className="btn-shimmer flex-1 md:flex-none px-6 py-3 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-xs uppercase font-mono tracking-wider hover:bg-[#A5F238] transition-all shadow-[0_0_20px_rgba(197,255,0,0.3)]"
                >
                  Stage in Virtual Try-On
                </button>

                <button
                  onClick={() => {
                    showToast(`Bookmarked "${focalRunwayItem.text}" to Wishlist.`);
                  }}
                  className="px-5 py-3 rounded-full border border-white/20 text-white hover:border-[#C5FF00] text-xs font-mono uppercase flex items-center gap-2"
                >
                  <Bookmark size={14} />
                  <span>Wishlist</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          SECTION: HOW ZYRA WORKS (METHODOLOGY)
          ========================================== */}
      <section className="py-24 md:py-32 border-b border-white/[0.08] relative bg-[#0B0C0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5FF00] block mb-3">
              06 — Methodology
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              Three steps to <br />
              <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                effortless clarity.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Discover',
                subtitle: 'Calibrate Preferences',
                desc: 'Explore your aesthetics, select mood archetypes, and establish silhouette parameters tailored to your lifestyle.'
              },
              {
                num: '02',
                title: 'Coordinate',
                subtitle: 'Neural Proportion Flow',
                desc: 'Our engine pairs garments across fabrics, silhouettes, and color ratios—generating cohesive outfits tailored for any moment.'
              },
              {
                num: '03',
                title: 'Refine',
                subtitle: 'Build Your Style Vault',
                desc: 'Save your favorite looks, experiment with versatile anchor pieces, and evolve your wardrobe with deliberate confidence.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl border border-white/10 bg-[#101210] relative overflow-hidden group hover:border-[#C5FF00]/50 transition-all"
              >
                <span className="text-5xl font-black font-tech text-white/10 group-hover:text-[#C5FF00]/20 transition-colors block mb-6">
                  {step.num}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5FF00] block mb-1">
                  {step.subtitle}
                </span>
                <h3 className="text-2xl font-bold uppercase text-[#F6F7F2] mb-4 font-tech">
                  {step.title}
                </h3>
                <p className="text-sm text-[#A0A59C] font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: WHY ZYRA (BENEFITS & PHILOSOPHY)
          ========================================== */}
      <section className="py-24 md:py-32 border-b border-white/[0.08] relative bg-[#090A09]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C5FF00] block mb-3">
              07 — The Philosophy
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
              Fashion is personal. <br />
              <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
                your tools should be, too.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Coherent Combinations', desc: 'No more disconnected garments. Outfits are composed with conscious attention to balance and proportion.' },
              { title: 'Fluid Aesthetic Discovery', desc: 'Break out of rigid fashion boxes. Discover combinations that bridge disparate aesthetic worlds.' },
              { title: 'Organized Style Vault', desc: 'Curate your own high-fashion capsule catalog accessible across devices whenever inspiration strikes.' },
              { title: 'Frictionless Styling', desc: 'Eliminate morning decision fatigue with deterministic recommendations tuned to the day’s agenda.' }
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/10 bg-[#101210] hover:border-[#C5FF00]/40 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#151815] border border-white/10 flex items-center justify-center text-[#C5FF00] mb-4">
                  <span className="font-mono text-xs">0{idx + 1}</span>
                </div>
                <h4 className="text-base font-bold uppercase text-[#F6F7F2] mb-2 font-tech">
                  {benefit.title}
                </h4>
                <p className="text-xs text-[#A0A59C] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION: FINAL CALL TO ACTION
          ========================================== */}
      <section className="py-24 md:py-36 border-b border-white/[0.08] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5FF00]/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#C5FF00] mb-4">
            Begin Your Transformation
          </span>
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-6">
            Your next look <br />
            <span className="font-serif-editorial italic font-normal text-[#C5FF00] lowercase">
              starts here.
            </span>
          </h2>
          <p className="text-base sm:text-xl text-[#A0A59C] max-w-xl font-light leading-relaxed mb-10">
            Discover your aesthetic. Explore new combinations. Make style your own with the intelligence of ZYRA.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#stylist"
              className="btn-shimmer px-8 py-4 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-sm uppercase tracking-wider hover:bg-[#A5F238] transition-all shadow-[0_0_30px_rgba(197,255,0,0.35)]"
            >
              Start Exploring
            </a>
            <a
              href="#zyra"
              className="px-8 py-4 rounded-full border border-white/20 text-[#F6F7F2] font-semibold text-sm uppercase tracking-wider hover:border-[#C5FF00] transition-all"
            >
              Meet ZYRA
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="py-16 bg-[#080908] border-t border-white/10 text-xs text-[#A0A59C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-sm bg-[#151815] border border-white/10 flex items-center justify-center">
                <img src={zyraMascotPng} alt="ZYRA Emblem" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-[#F6F7F2] font-tech uppercase">
                ZYRA<span className="text-[#C5FF00]">.</span>
              </span>
            </div>
            <p className="text-xs text-[#A0A59C] max-w-sm leading-relaxed mb-4">
              AI fashion technology and personal styling. Your style, reimagined through neural harmony and architectural silhouettes.
            </p>
            <span className="font-mono text-[10px] text-[#A0A59C]/70">
              © 2026 ZYRA Atelier. All rights reserved.
            </span>
          </div>

          <div className="md:col-span-2">
            <h5 className="font-mono text-xs uppercase tracking-wider text-[#F6F7F2] mb-3">Product</h5>
            <ul className="flex flex-col gap-2 font-mono text-[11px]">
              <li><a href="#discover" className="hover:text-[#C5FF00] transition-colors">Aesthetic Discovery</a></li>
              <li><a href="#stylist" className="hover:text-[#C5FF00] transition-colors">Style Studio</a></li>
              <li><a href="#matching" className="hover:text-[#C5FF00] transition-colors">Outfit Matching</a></li>
              <li><a href="#try-on" className="hover:text-[#C5FF00] transition-colors">Virtual Try-On</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h5 className="font-mono text-xs uppercase tracking-wider text-[#F6F7F2] mb-3">Company</h5>
            <ul className="flex flex-col gap-2 font-mono text-[11px]">
              <li><a href="#zyra" className="hover:text-[#C5FF00] transition-colors">About ZYRA</a></li>
              <li><a href="#" className="hover:text-[#C5FF00] transition-colors">Privacy Principles</a></li>
              <li><a href="#" className="hover:text-[#C5FF00] transition-colors">Terms of Atelier</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h5 className="font-mono text-xs uppercase tracking-wider text-[#F6F7F2] mb-3">Atelier Status</h5>
            <div className="p-4 rounded-xl bg-[#101210] border border-white/10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5FF00]" />
                <span className="font-mono text-[11px] text-[#F6F7F2]">Neural Engine Active</span>
              </div>
              <p className="text-[10px] text-[#A0A59C]">All styling algorithms running with deterministic harmony verification.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          SAVED WARDROBE VAULT DRAWER
          ========================================== */}
      {savedLooksDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSavedLooksDrawerOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#101210] border-l border-white/15 h-full z-10 flex flex-col p-6 sm:p-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="text-[#C5FF00]" />
                <h3 className="text-lg font-bold uppercase text-[#F6F7F2] font-tech">
                  Style Vault ({savedLooks.length})
                </h3>
              </div>
              <button
                onClick={() => setSavedLooksDrawerOpen(false)}
                className="text-[#A0A59C] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {savedLooks.length === 0 ? (
                <div className="text-center py-16 text-[#A0A59C]">
                  <Bookmark size={32} className="mx-auto mb-3 opacity-30 text-[#C5FF00]" />
                  <p className="text-sm font-mono uppercase">Your Vault is empty</p>
                  <p className="text-xs text-[#A0A59C] mt-1 max-w-xs mx-auto">
                    Preserve looks in the Style Studio to build your personal capsule.
                  </p>
                </div>
              ) : (
                savedLooks.map((look) => (
                  <div
                    key={look.id}
                    className="p-4 rounded-2xl bg-[#151815] border border-white/10 relative group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#C5FF00]">
                          {look.occasion} • {look.aesthetic}
                        </span>
                        <h4 className="text-sm font-bold uppercase text-[#F6F7F2] font-tech">
                          {look.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleRemoveSavedLook(look.id)}
                        className="text-[#A0A59C] hover:text-rose-400 p-1"
                        title="Remove look"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 my-3">
                      {look.items.map((item: any, idx: number) => (
                        <img
                          key={idx}
                          src={item.img}
                          alt={item.name}
                          className="aspect-square rounded-lg object-cover border border-white/10"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A0A59C] pt-2 border-t border-white/10">
                      <span>Harmony: {look.harmonyScore}%</span>
                      <span className="text-[#C5FF00]">{look.items.length} garments</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {savedLooks.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => showToast("Vault exported to personal style sheet.")}
                  className="w-full py-3 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-xs uppercase tracking-wider font-mono hover:bg-[#A5F238] transition-all"
                >
                  Export Style Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          PRODUCT QUICK VIEW MODAL
          ========================================== */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="relative max-w-lg w-full bg-[#101210] border border-white/15 rounded-3xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-6 right-6 text-[#A0A59C] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-6">
              <img
                src={quickViewProduct.img}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-[#C5FF00]">
                {quickViewProduct.category} • {quickViewProduct.tag}
              </span>
              <span className="text-base font-bold font-mono text-white">
                {quickViewProduct.price}
              </span>
            </div>

            <h3 className="text-xl font-bold uppercase text-white font-tech mb-1">
              {quickViewProduct.name}
            </h3>
            <p className="text-xs font-mono text-[#A0A59C] mb-2">
              Designed by {quickViewProduct.brand} • {quickViewProduct.fiber}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setTryOnGarment(quickViewProduct);
                  setQuickViewProduct(null);
                  showToast(`"${quickViewProduct.name}" staged in Virtual Try-On.`);
                }}
                className="flex-1 py-3 rounded-full bg-[#C5FF00] text-[#080908] font-bold text-xs uppercase font-mono tracking-wider hover:bg-[#A5F238] transition-all"
              >
                Stage In Try-On
              </button>
              <button
                onClick={() => {
                  showToast(`Bookmarked "${quickViewProduct.name}".`);
                  setQuickViewProduct(null);
                }}
                className="px-5 py-3 rounded-full border border-white/20 text-white hover:border-[#C5FF00] text-xs font-mono uppercase"
              >
                Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
