import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Bookmark,
  Sparkles,
  Layers,
} from "lucide-react";
import "./InfiniteOutfitLab.css";

type StyleName = "Minimal" | "Streetwear" | "Smart Casual" | "Old Money";

type Outfit = {
  name: string;
  description: string;
  image: string;
  label: string;
  reason: string;
  layers: string[];
};

const outfits: Record<StyleName, Outfit> = {
  Minimal: {
    name: "Quiet Confidence",
    description: "Clean lines. Effortless balance.",
    label: "LOOK 01 / MINIMAL",
    reason:
      "Neutral tones, unembellished textures, and simple silhouettes create a balanced, timeless foundation that lets the wearer lead.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1100&q=85",
    layers: ["Tailored Wool Trench", "Relaxed Cotton Poplin", "Clean Trousers"],
  },

  Streetwear: {
    name: "Off-Duty Energy",
    description: "Relaxed proportions. Distinct attitude.",
    label: "LOOK 02 / STREETWEAR",
    reason:
      "Relaxed oversized cuts, technical textiles, and contrasting layers combine to deliver an expressive street-forward attitude.",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1100&q=85",
    layers: ["Boxy Utility Parka", "Heavyweight Hooded Layer", "Wide Leg Cargo"],
  },

  "Smart Casual": {
    name: "Modern Structure",
    description: "Refined layers. Everyday sophistication.",
    label: "LOOK 03 / SMART CASUAL",
    reason:
      "Softly structured outerwear and understated earthy colors bring an elevated finish to casual dining, creative workplaces, and gallery weekends.",
    image:
      "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1100&q=85",
    layers: ["Unstructured Cashmere Coat", "Merino Fine Knit", "Tonal Chinos"],
  },

  "Old Money": {
    name: "Heritage Tailoring",
    description: "Subtle elegance. Timeless fabrics.",
    label: "LOOK 04 / OLD MONEY",
    reason:
      "Heritage houndstooth, rich cream knitwear, and sculpted pleats communicate quiet luxury without logos or loud elements.",
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1100&q=85",
    layers: ["Textured Houndstooth Blazer", "Cable Knit Crew", "Pleated Flannel"],
  },
};

const styles: StyleName[] = [
  "Minimal",
  "Streetwear",
  "Smart Casual",
  "Old Money",
];

const SAVED_LAB_STORAGE_KEY = "zyra_saved_lab_v1";

export default function InfiniteOutfitLab() {
  const [activeStyle, setActiveStyle] = useState<StyleName>("Minimal");
  const [savedStyles, setSavedStyles] = useState<StyleName[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_LAB_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activeOutfit = outfits[activeStyle];
  const isSaved = savedStyles.includes(activeStyle);

  function toggleSaved() {
    setSavedStyles((current) => {
      const updated = current.includes(activeStyle)
        ? current.filter((style) => style !== activeStyle)
        : [...current, activeStyle];

      try {
        localStorage.setItem(SAVED_LAB_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("zyra-saved-updated"));
      } catch {
        // ignore storage error
      }
      return updated;
    });
  }

  return (
    <section className="iol-section" id="infinite-outfit-lab">
      <div className="iol-container">
        {/* Section heading */}
        <motion.div
          className="iol-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className="iol-eyebrow">
            <span className="iol-eyebrow-dot" />
            02 / INFINITE OUTFIT LAB
          </div>

          <div className="iol-heading-row">
            <h2>
              One piece.
              <br />
              <span>A whole new perspective.</span>
            </h2>

            <p>
              Your wardrobe holds far more styling potential than you imagine.
              Explore how silhouette, color temperature, and layering shift the
              exact same core garments across four distinct aesthetic worlds.
            </p>
          </div>
        </motion.div>

        {/* Interactive styling workspace */}
        <motion.div
          className="iol-workspace"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Left: featured visual */}
          <div className="iol-feature">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStyle}
                className="iol-feature-image"
                src={activeOutfit.image}
                alt={`${activeStyle} fashion styling demonstration`}
                loading="lazy"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            <div className="iol-feature-shade" />

            <div className="iol-feature-top">
              <span>ZYRA / STYLE STUDY</span>
              <span>
                {String(styles.indexOf(activeStyle) + 1).padStart(2, "0")} —{" "}
                {String(styles.length).padStart(2, "0")}
              </span>
            </div>

            <div className="iol-feature-bottom">
              <span className="iol-feature-label">{activeOutfit.label}</span>
              <h3>{activeOutfit.name}</h3>
              <p>{activeOutfit.description}</p>

              <div className="iol-layers-pill" aria-label="Key layers">
                <Layers size={13} />
                <span>{activeOutfit.layers.join(" · ")}</span>
              </div>
            </div>

            <div className="iol-feature-mark">
              <Sparkles size={18} strokeWidth={1.5} />
            </div>
          </div>

          {/* Right: style selection and results */}
          <div className="iol-discovery">
            <div className="iol-discovery-header">
              <div>
                <span className="iol-small-label">EXPLORE YOUR AESTHETIC</span>
                <h3>Choose your mood.</h3>
              </div>

              <ArrowDownRight
                className="iol-header-icon"
                size={25}
                strokeWidth={1.2}
              />
            </div>

            {/* Style selector */}
            <div className="iol-style-list" role="tablist">
              {styles.map((style, index) => {
                const selected = activeStyle === style;

                return (
                  <button
                    key={style}
                    type="button"
                    role="tab"
                    className={`iol-style-option ${
                      selected ? "is-active" : ""
                    }`}
                    onClick={() => setActiveStyle(style)}
                    aria-selected={selected}
                  >
                    <span className="iol-style-number">0{index + 1}</span>
                    <span className="iol-style-name">{style}</span>
                    <span className="iol-style-action">
                      {selected ? <Check size={16} /> : <ArrowRight size={17} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Animated styling insight */}
            <div className="iol-insight">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStyle}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="iol-insight-heading">
                    <Sparkles size={15} />
                    <span>THE STYLING INSIGHT</span>
                  </div>

                  <p>{activeOutfit.reason}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              className={`iol-save-button ${isSaved ? "is-saved" : ""}`}
              onClick={toggleSaved}
            >
              <Bookmark size={16} />
              {isSaved ? "Look saved to collection" : "Save this look"}
              {isSaved ? <Check size={17} /> : <ArrowRight size={17} />}
            </button>

            <p className="iol-save-note">
              {savedStyles.length > 0
                ? `${savedStyles.length} look${
                    savedStyles.length > 1 ? "s" : ""
                  } saved in your ZYRA atelier`
                : "Explore the possibilities. Save favorites to revisit later."}
            </p>
          </div>
        </motion.div>

        {/* Bottom brand statement connecting to next phase */}
        <div className="iol-footer">
          <span>LESS GUESSWORK. MORE PERSONAL STYLE.</span>

          <a href="#personal-style-intelligence">
            Discover your style DNA
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}