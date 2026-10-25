import { useRef, useState } from "react";
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
} from "lucide-react";
import "./VirtualTryOnStudio.css";

type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;
  colorName: string;
  image: string;
  overlayImage: string;
};

const garments: Garment[] = [
  {
    id: "01",
    name: "Essential Minimal Blazer",
    category: "Quiet Luxury",
    color: "#d9d1c2",
    colorName: "Sand Stone",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    overlayImage:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "02",
    name: "Urban Utility Overshirt",
    category: "Streetwear",
    color: "#5e695d",
    colorName: "Sage Anthracite",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    overlayImage:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "03",
    name: "Atelier Relaxed Trench",
    category: "Smart Casual",
    color: "#a48c72",
    colorName: "Warm Camel",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    overlayImage:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "04",
    name: "Ribbed Cashmere Layer",
    category: "Minimalist",
    color: "#ece6db",
    colorName: "Oatmeal Ecru",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    overlayImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
];

const sampleModelPhotos = [
  {
    id: "studio-1",
    label: "Studio Model A",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "studio-2",
    label: "Studio Model B",
    url: "https://images.unsplash.com/photo-1506629905607-d9f4d5e7c9b4?auto=format&fit=crop&w=700&q=85",
  },
];

export default function VirtualTryOnStudio() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedGarment, setSelectedGarment] = useState<Garment>(garments[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeModelPhoto, setActiveModelPhoto] = useState<string>(
    sampleModelPhotos[0].url
  );
  const [fileName, setFileName] = useState("");
  const [previewMode, setPreviewMode] = useState<"model" | "upload">("model");
  const [isSimulating, setIsSimulating] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(82);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
        setIsSimulating(true);
        setStatusMessage("Photo loaded successfully into private local canvas.");
      }
    };
    reader.readAsDataURL(file);
  }

  function clearUpload() {
    setUploadedImage(null);
    setFileName("");
    setPreviewMode("model");
    setIsSimulating(false);
    setStatusMessage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const currentDisplayImage =
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
              commit. Upload your portrait or use studio models to preview how
              curated garments align with your proportions on a private local
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
          {/* Left Preview Screen */}
          <div className="vts-preview">
            <div className="vts-preview-top">
              <span>ZYRA / FIT LAB CANVAS</span>

              <div className="vts-live-pill">
                <span className="vts-pulse-dot" />
                <span>
                  {isSimulating ? "SIMULATION ACTIVE" : "STUDIO PREVIEW"}
                </span>
              </div>
            </div>

            <div className="vts-preview-image">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${previewMode}-${currentDisplayImage}-${selectedGarment.id}`}
                  className="vts-image-frame"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={currentDisplayImage}
                    alt={
                      previewMode === "upload"
                        ? "Your uploaded portrait"
                        : "Studio model look"
                    }
                    className="vts-base-photo"
                  />

                  {/* Simulated Garment Silhouette Alignment Overlay */}
                  {isSimulating && (
                    <motion.div
                      className="vts-garment-overlay-layer"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: overlayOpacity / 100, scale: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <img
                        src={selectedGarment.overlayImage}
                        alt={`${selectedGarment.name} silhouette overlay`}
                        className="vts-overlay-img"
                      />
                      <div className="vts-overlay-grid" aria-hidden="true" />
                    </motion.div>
                  )}

                  <div className="vts-corner vts-corner-tl" />
                  <div className="vts-corner vts-corner-tr" />
                  <div className="vts-corner vts-corner-bl" />
                  <div className="vts-corner vts-corner-br" />

                  {/* Floating Canvas Tag */}
                  <div className="vts-canvas-tag">
                    <Sparkles size={13} />
                    <span>
                      {selectedGarment.name} · {selectedGarment.colorName}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Canvas Toolbar & Simulation Controls */}
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

              {isSimulating && (
                <div className="vts-opacity-slider">
                  <Sliders size={13} />
                  <label htmlFor="overlay-opacity">Drape Blend</label>
                  <input
                    id="overlay-opacity"
                    type="range"
                    min="30"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    aria-label="Garment overlay opacity"
                  />
                  <span>{overlayOpacity}%</span>
                </div>
              )}
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
                  Remove custom photo
                </button>
              )}
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
                Select from ZYRA's architectural foundation pieces to drape
                against your canvas.
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
                      setIsSimulating(true);
                      setStatusMessage(
                        `Applied ${garment.name} (${garment.colorName}) to canvas.`
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

            {/* Primary Action Button */}
            <button
              type="button"
              className={`vts-try-button ${isSimulating ? "is-active" : ""}`}
              onClick={() => {
                setIsSimulating(!isSimulating);
                setStatusMessage(
                  !isSimulating
                    ? `Silhouette fit alignment active for ${selectedGarment.name}.`
                    : "Studio preview active without overlay."
                );
              }}
            >
              <Eye size={17} />
              {isSimulating
                ? "Toggle Garment Overlay Off"
                : "Simulate Garment Fit on Canvas"}
              <ArrowRight size={17} />
            </button>

            {/* Status Notification Message */}
            {statusMessage && (
              <motion.div
                className="vts-inline-status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
              >
                <Check size={14} />
                <span>{statusMessage}</span>
              </motion.div>
            )}

            <div className="vts-action-row">
              <button
                type="button"
                className="vts-reset-button"
                onClick={() => {
                  setSelectedGarment(garments[0]);
                  setIsSimulating(false);
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
                <strong>Zero Server Uploads:</strong> Photos are rendered
                strictly within your browser's private memory and are never
                stored or transmitted.
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