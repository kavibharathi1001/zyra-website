import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  ImagePlus,
  RotateCcw,
  Sparkles,
  Upload,
  X,
  Sliders,
  ShieldCheck,
  Eye,
  Columns,
  Layers,
} from "lucide-react";
import "./VirtualTryOnStudio.css";

type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;
  colorName: string;
  image: string;
  drapedImage: string;
  description: string;
};

const garments: Garment[] = [
  {
    id: "01",
    name: "Atelier Structured Camel Trench",
    category: "Quiet Luxury",
    color: "#c2a98f",
    colorName: "Sand Stone Camel",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80",
    drapedImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85",
    description: "Double-breasted Italian wool with drop-shoulder silhouette.",
  },
  {
    id: "02",
    name: "Tokyo Raw Selvedge Overshirt",
    category: "Streetwear",
    color: "#3a464a",
    colorName: "Deep Indigo Coal",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80",
    drapedImage:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=85",
    description: "14oz Japanese denim cut with relaxed boxy proportions.",
  },
  {
    id: "03",
    name: "Milanese Fine Gauge Cashmere",
    category: "Minimalist Atelier",
    color: "#d8cfc4",
    colorName: "Oatmeal Melange",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80",
    drapedImage:
      "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=800&q=85",
    description: "Ultra-soft grade-A Mongolian cashmere with ribbed neckline.",
  },
  {
    id: "04",
    name: "Architectural Noir Evening Blazer",
    category: "Avant-Garde",
    color: "#181a18",
    colorName: "Pitch Obsidian",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
    drapedImage:
      "https://images.unsplash.com/photo-1566206091559-0f622955f7bc?auto=format&fit=crop&w=800&q=85",
    description: "Sculpted peak lapels with satin-faced architectural shoulders.",
  },
];

const sampleModelPhotos = [
  {
    id: "studio-1",
    label: "Studio Model A",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "studio-2",
    label: "Studio Model B",
    url: "https://images.unsplash.com/photo-1506629905607-d9f4d5e7c9b4?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "studio-3",
    label: "Studio Model C",
    url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=85",
  },
];

export default function VirtualTryOnStudio() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedGarment, setSelectedGarment] = useState<Garment>(garments[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeModelPhoto, setActiveModelPhoto] = useState<string>(
    sampleModelPhotos[0].url
  );
  const [fileName, setFileName] = useState("");
  const [previewMode, setPreviewMode] = useState<"model" | "upload">("model");
  const [comparisonMode, setComparisonMode] = useState<"slider" | "blend">("slider");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(85);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const updateSliderFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(Math.round(percentage));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSliderFromClientX(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, []);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Please select a valid image file (PNG, JPG, WEBP).");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage("Please select an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
        setFileName(file.name);
        setPreviewMode("upload");
        setStatusMessage("Custom portrait loaded into private local sandbox.");
      }
    };
    reader.readAsDataURL(file);
  }

  function clearUpload() {
    setUploadedImage(null);
    setFileName("");
    setPreviewMode("model");
    setStatusMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const currentDisplayBaseImage =
    previewMode === "upload" && uploadedImage
      ? uploadedImage
      : activeModelPhoto;

  return (
    <section className="vts-section" id="virtual-try-on">
      <div className="vts-container">
        {/* Section Header */}
        <motion.div
          className="vts-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="vts-eyebrow">
            <span className="vts-status-dot" />
            04 / VIRTUAL TRY-ON STUDIO
          </div>

          <div className="vts-heading-row">
            <h2>
              See yourself
              <br />
              <span>in a new light.</span>
            </h2>

            <p>
              Experience how silhouettes, cuts, and palettes drape before you
              commit. Drag the interactive comparison slider to reveal how
              curated garments adapt to real human proportions on a private local
              canvas.
            </p>
          </div>
        </motion.div>

        {/* Studio Workspace */}
        <motion.div
          className="vts-studio"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Preview Screen with 21st.dev Comparison Slider */}
          <div className="vts-preview">
            <div className="vts-preview-top">
              <span>ZYRA / FIT LAB CANVAS</span>

              <div className="vts-top-actions">
                <div className="vts-view-toggle">
                  <button
                    type="button"
                    className={`vts-toggle-btn ${comparisonMode === "slider" ? "is-active" : ""}`}
                    onClick={() => setComparisonMode("slider")}
                    title="Interactive Split Comparison Slider"
                  >
                    <Columns size={12} />
                    <span>Split Slider</span>
                  </button>
                  <button
                    type="button"
                    className={`vts-toggle-btn ${comparisonMode === "blend" ? "is-active" : ""}`}
                    onClick={() => setComparisonMode("blend")}
                    title="Layer Blend Mode"
                  >
                    <Layers size={12} />
                    <span>Blend</span>
                  </button>
                </div>

                <div className="vts-live-pill">
                  <span className="vts-pulse-dot" />
                  <span>21st AI COMPARISON</span>
                </div>
              </div>
            </div>

            {/* Interactive Image Frame */}
            <div
              ref={containerRef}
              className={`vts-preview-image ${isDragging ? "is-dragging" : ""}`}
              onPointerDown={comparisonMode === "slider" ? handlePointerDown : undefined}
              onPointerMove={comparisonMode === "slider" ? handlePointerMove : undefined}
              onPointerUp={comparisonMode === "slider" ? handlePointerUp : undefined}
            >
              {/* BASE LAYER (BEFORE) */}
              <div className="vts-layer vts-layer-base">
                <img
                  src={currentDisplayBaseImage}
                  alt={
                    previewMode === "upload"
                      ? "Your uploaded portrait"
                      : "Studio model look"
                  }
                  className="vts-photo"
                  draggable={false}
                />
                <div className="vts-layer-badge vts-badge-before">
                  BEFORE · BASE SILHOUETTE
                </div>
              </div>

              {/* OVERLAY LAYER (AFTER) */}
              {comparisonMode === "slider" ? (
                <div
                  className="vts-layer vts-layer-draped"
                  style={{
                    clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                  }}
                >
                  <img
                    src={selectedGarment.drapedImage}
                    alt={`${selectedGarment.name} draped fit`}
                    className="vts-photo"
                    draggable={false}
                  />
                  <div className="vts-overlay-grid" aria-hidden="true" />
                  <div className="vts-layer-badge vts-badge-after">
                    AFTER · ZYRA AI FIT
                  </div>
                </div>
              ) : (
                <motion.div
                  className="vts-layer vts-layer-blend"
                  style={{ opacity: overlayOpacity / 100 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: overlayOpacity / 100 }}
                  transition={{ duration: 0.25 }}
                >
                  <img
                    src={selectedGarment.drapedImage}
                    alt={`${selectedGarment.name} draped fit`}
                    className="vts-photo"
                    draggable={false}
                  />
                  <div className="vts-overlay-grid" aria-hidden="true" />
                  <div className="vts-layer-badge vts-badge-after">
                    BLEND: {overlayOpacity}%
                  </div>
                </motion.div>
              )}

              {/* DRAGGABLE DIVIDER HANDLE (21st.dev Component Pattern) */}
              {comparisonMode === "slider" && (
                <div
                  className="vts-slider-divider"
                  style={{ left: `${sliderPosition}%` }}
                  aria-hidden="true"
                >
                  <div className="vts-slider-line" />
                  <div className="vts-slider-thumb">
                    <span className="vts-thumb-arrows">⟷</span>
                    <span className="vts-thumb-pct">{sliderPosition}%</span>
                  </div>
                </div>
              )}

              {/* Visual Corner Markers */}
              <div className="vts-corner vts-corner-tl" />
              <div className="vts-corner vts-corner-tr" />
              <div className="vts-corner vts-corner-bl" />
              <div className="vts-corner vts-corner-br" />

              {/* Floating Garment Tag */}
              <div className="vts-canvas-tag">
                <Sparkles size={13} />
                <span>
                  {selectedGarment.name} · {selectedGarment.colorName}
                </span>
              </div>
            </div>

            {/* Slider Presets & Controls */}
            {comparisonMode === "slider" ? (
              <div className="vts-slider-presets">
                <span className="vts-presets-label">Preset splits:</span>
                {[
                  { label: "25%", val: 25 },
                  { label: "50% Split", val: 50 },
                  { label: "75%", val: 75 },
                  { label: "100% Fit", val: 0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`vts-preset-chip ${sliderPosition === preset.val ? "is-active" : ""}`}
                    onClick={() => setSliderPosition(preset.val)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="vts-blend-control">
                <Sliders size={13} />
                <label htmlFor="overlay-opacity">Drape Blend</label>
                <input
                  id="overlay-opacity"
                  type="range"
                  min="20"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  aria-label="Garment overlay opacity"
                />
                <span>{overlayOpacity}%</span>
              </div>
            )}

            {/* Canvas Toolbar & Model Switcher */}
            <div className="vts-canvas-toolbar">
              <div className="vts-mode-toggles">
                {uploadedImage && (
                  <button
                    type="button"
                    className={`vts-mode-btn ${
                      previewMode === "upload" ? "is-active" : ""
                    }`}
                    onClick={() => setPreviewMode("upload")}
                  >
                    Your Photo
                  </button>
                )}

                {sampleModelPhotos.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={`vts-mode-btn ${
                      previewMode === "model" &&
                      activeModelPhoto === model.url
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveModelPhoto(model.url);
                      setPreviewMode("model");
                    }}
                  >
                    {model.label}
                  </button>
                ))}
              </div>

              <div className="vts-preview-bottom">
                <span className="vts-preview-filename">
                  {previewMode === "upload" && fileName
                    ? `File: ${fileName}`
                    : `Model: ${
                        sampleModelPhotos.find((m) => m.url === activeModelPhoto)
                          ?.label ?? "Editorial Look"
                      }`}
                </span>

                {uploadedImage && (
                  <button
                    type="button"
                    className="vts-clear-upload"
                    onClick={clearUpload}
                    aria-label="Remove uploaded image"
                  >
                    <X size={15} />
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="vts-controls">
            <div className="vts-controls-heading">
              <span className="vts-controls-label">
                CURATED ATELIER GARMENTS
              </span>
              <h3>Choose a piece to try on.</h3>
              <p>
                Select from ZYRA's architectural foundation pieces to preview
                instant drape and silhouette harmony.
              </p>
            </div>

            {/* Garment Selector */}
            <div className="vts-garments" role="list">
              {garments.map((garment) => {
                const selected = selectedGarment.id === garment.id;

                return (
                  <button
                    type="button"
                    key={garment.id}
                    className={`vts-garment ${selected ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelectedGarment(garment);
                      setStatusMessage(
                        `Simulating ${garment.name} (${garment.colorName}) on active silhouette.`
                      );
                    }}
                    aria-pressed={selected}
                  >
                    <img
                      src={garment.image}
                      alt={garment.name}
                      loading="lazy"
                    />

                    <span className="vts-garment-info">
                      <strong>{garment.name}</strong>
                      <small>
                        {garment.category} · {garment.colorName}
                      </small>
                      <span className="vts-garment-desc">{garment.description}</span>
                    </span>

                    <span
                      className="vts-garment-color"
                      style={{ backgroundColor: garment.color }}
                      title={garment.colorName}
                    />

                    {selected && (
                      <span className="vts-garment-check">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Photo Upload Zone */}
            <div className="vts-upload-box">
              <div className="vts-upload-icon">
                <ImagePlus size={20} />
              </div>

              <div className="vts-upload-copy">
                <strong>Try on your own photo</strong>
                <span>
                  PNG, JPG or WEBP · 100% Client-side local preview
                </span>
              </div>

              <button
                type="button"
                className="vts-upload-button"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={14} />
                Select Photo
              </button>

              <input
                ref={inputRef}
                className="vts-file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleUpload}
                aria-label="Upload photo for virtual try-on"
              />
            </div>

            {/* Quick Interactive Slider Action */}
            <button
              type="button"
              className="vts-try-button"
              onClick={() => {
                setSliderPosition((prev) => (prev > 50 ? 20 : 80));
                setStatusMessage("Animated comparison slider across garment drape.");
              }}
            >
              <Eye size={17} />
              Slide Comparison View
              <ArrowRight size={17} />
            </button>

            {/* Status Notification Message */}
            <AnimatePresence>
              {statusMessage && (
                <motion.div
                  className="vts-inline-status"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="status"
                >
                  <Check size={14} />
                  <span>{statusMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="vts-action-row">
              <button
                type="button"
                className="vts-reset-button"
                onClick={() => {
                  setSelectedGarment(garments[0]);
                  setSliderPosition(50);
                  setStatusMessage(null);
                  clearUpload();
                }}
              >
                <RotateCcw size={13} />
                Reset canvas
              </button>

              <a href="#fashion-universe" className="vts-explore-link">
                Explore Universe Pieces <ArrowRight size={14} />
              </a>
            </div>

            {/* Trust and Privacy Guarantee */}
            <div className="vts-privacy-badge">
              <ShieldCheck size={15} />
              <span>
                <strong>Zero Server Uploads:</strong> Photos are processed
                strictly inside your local browser sandbox and never leave your
                device.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Section Footer */}
        <div className="vts-footer">
          <span>PRIVATE LOCAL CANVAS · ZERO SURVEILLANCE</span>
          <a href="#fashion-universe">
            Next: Browse Fashion Universe <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}