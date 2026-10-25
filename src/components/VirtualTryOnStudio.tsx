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
} from "lucide-react";
import "./VirtualTryOnStudio.css";

type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
};

const garments: Garment[] = [
  {
    id: "01",
    name: "The Essential",
    category: "Minimal",
    color: "#d9d1c2",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "02",
    name: "Urban Form",
    category: "Streetwear",
    color: "#737c73",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "03",
    name: "Modern Classic",
    category: "Smart Casual",
    color: "#a48c72",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  },
];

export default function VirtualTryOnStudio() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedGarment, setSelectedGarment] =
    useState<Garment>(garments[0]);

  const [uploadedImage, setUploadedImage] =
    useState<string | null>(null);

  const [fileName, setFileName] = useState("");

  const [previewMode, setPreviewMode] = useState<
    "model" | "upload"
  >("model");

  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      window.alert("Please select an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
        setFileName(file.name);
        setPreviewMode("upload");
      }
    };

    reader.readAsDataURL(file);
  }

  function clearUpload() {
    setUploadedImage(null);
    setFileName("");
    setPreviewMode("model");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <section className="vts-section" id="virtual-try-on">
      <div className="vts-container">
        <motion.div
          className="vts-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="vts-eyebrow">
            <span className="vts-status-dot" />
            VIRTUAL TRY-ON STUDIO
          </div>

          <div className="vts-heading-row">
            <h2>
              See yourself
              <br />
              <span>in a new light.</span>
            </h2>

            <p>
              Your next favorite outfit starts with a
              possibility. Explore a look, upload your
              photo, and discover a new direction for
              your personal style.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="vts-studio"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          {/* Preview area */}

          <div className="vts-preview">
            <div className="vts-preview-top">
              <span>ZYRA / FIT LAB</span>

              <span className="vts-preview-live">
                <span />
                INTERACTIVE PREVIEW
              </span>
            </div>

            <div className="vts-preview-image">
              <AnimatePresence mode="wait">
                {previewMode === "upload" && uploadedImage ? (
                  <motion.div
                    key="uploaded"
                    className="vts-uploaded-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={uploadedImage}
                      alt="Your uploaded photo"
                    />

                    <div className="vts-uploaded-label">
                      <Check size={14} />
                      YOUR PHOTO LOADED
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="model"
                    className="vts-model-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={selectedGarment.image}
                      alt={`${selectedGarment.category} fashion inspiration`}
                    />

                    <div className="vts-model-overlay" />

                    <div className="vts-model-caption">
                      <span>STYLE STUDY 0{selectedGarment.id}</span>
                      <h3>{selectedGarment.name}</h3>
                      <p>{selectedGarment.category} collection</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="vts-preview-bottom">
              <span>
                {previewMode === "upload"
                  ? fileName
                  : "EDITORIAL PREVIEW"}
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

          {/* Controls */}

          <div className="vts-controls">
            <div className="vts-controls-heading">
              <span className="vts-controls-label">
                YOUR VIRTUAL WARDROBE
              </span>

              <h3>Choose your look.</h3>

              <p>
                Explore a few style directions before
                building your perfect outfit.
              </p>
            </div>

            <div className="vts-garments">
              {garments.map((garment) => {
                const selected =
                  selectedGarment.id === garment.id;

                return (
                  <button
                    type="button"
                    key={garment.id}
                    className={`vts-garment ${
                      selected ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedGarment(garment);

                      if (!uploadedImage) {
                        setPreviewMode("model");
                      }
                    }}
                    aria-pressed={selected}
                  >
                    <img
                      src={garment.image}
                      alt=""
                      loading="lazy"
                    />

                    <span className="vts-garment-info">
                      <span>{garment.name}</span>
                      <small>{garment.category}</small>
                    </span>

                    <span
                      className="vts-garment-color"
                      style={{
                        backgroundColor: garment.color,
                      }}
                    />

                    {selected && (
                      <span className="vts-garment-check">
                        <Check size={13} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="vts-upload-box">
              <div className="vts-upload-icon">
                <ImagePlus size={20} />
              </div>

              <div className="vts-upload-copy">
                <strong>Make it personal.</strong>

                <span>
                  Add a photo to explore your own style.
                </span>
              </div>

              <button
                type="button"
                className="vts-upload-button"
                onClick={() => inputRef.current?.click()}
              >
                <Upload size={15} />
                Upload
              </button>

              <input
                ref={inputRef}
                className="vts-file-input"
                type="file"
                accept="image/*"
                onChange={handleUpload}
              />
            </div>

            <button
              type="button"
              className="vts-try-button"
              onClick={() => {
                if (!uploadedImage) {
                  inputRef.current?.click();
                  return;
                }

                window.alert(
                  "Your photo is loaded! Realistic virtual garment try-on will be available after the AI try-on engine is connected."
                );
              }}
            >
              <Sparkles size={17} />
              {uploadedImage
                ? "Prepare my virtual try-on"
                : "Start with my photo"}
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="vts-reset-button"
              onClick={() => {
                setSelectedGarment(garments[0]);
                clearUpload();
              }}
            >
              <RotateCcw size={13} />
              Reset studio
            </button>

            <p className="vts-privacy-note">
              Your photo is previewed locally in this browser.
              This prototype does not upload it to a server.
            </p>
          </div>
        </motion.div>

        <div className="vts-footer">
          <span>YOUR STYLE. YOUR RULES.</span>
          <span>THE FUTURE OF PERSONAL FASHION.</span>
        </div>
      </div>
    </section>
  );
}