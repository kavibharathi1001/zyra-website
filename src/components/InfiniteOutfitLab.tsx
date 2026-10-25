import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import "./InfiniteOutfitLab.css";

type StyleName = "Minimal" | "Streetwear" | "Smart Casual";

type Outfit = {
  name: string;
  description: string;
  image: string;
  label: string;
  reason: string;
};

const outfits: Record<StyleName, Outfit> = {
  Minimal: {
    name: "Quiet Confidence",
    description: "Clean lines. Effortless balance.",
    label: "LOOK 01 / MINIMAL",
    reason:
      "Neutral tones and simple silhouettes create a balanced, timeless outfit.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85",
  },

  Streetwear: {
    name: "Off-Duty Energy",
    description: "Relaxed proportions. Distinct attitude.",
    label: "LOOK 02 / STREETWEAR",
    reason:
      "Relaxed proportions and contrasting layers create a more expressive streetwear-inspired look.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1100&q=85",
  },

  "Smart Casual": {
    name: "Modern Structure",
    description: "Refined layers. Everyday sophistication.",
    label: "LOOK 03 / SMART CASUAL",
    reason:
      "Structured outerwear and understated colors bring a polished finish to everyday dressing.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85",
  },
};

const styles: StyleName[] = [
  "Minimal",
  "Streetwear",
  "Smart Casual",
];

export default function InfiniteOutfitLab() {
  const [activeStyle, setActiveStyle] =
    useState<StyleName>("Minimal");

  const [savedStyles, setSavedStyles] = useState<StyleName[]>([]);

  const activeOutfit = outfits[activeStyle];
  const isSaved = savedStyles.includes(activeStyle);

  function toggleSaved() {
    setSavedStyles((current) =>
      current.includes(activeStyle)
        ? current.filter((style) => style !== activeStyle)
        : [...current, activeStyle]
    );
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
            YOUR PERSONAL STYLE LAB
          </div>

          <div className="iol-heading-row">
            <h2>
              One piece.
              <br />
              <span>A whole new perspective.</span>
            </h2>

            <p>
              Your wardrobe has more possibilities than you think.
              Explore different aesthetics and discover new ways
              to style your everyday essentials.
            </p>
          </div>
        </motion.div>

        {/* Interactive styling experience */}
        <motion.div
          className="iol-workspace"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Left: featured visual */}
          <div className="iol-feature">
            <img
              className="iol-feature-image"
              src={activeOutfit.image}
              alt={`${activeStyle} fashion inspiration`}
              loading="lazy"
            />

            <div className="iol-feature-shade" />

            <div className="iol-feature-top">
              <span>ZYRA / STYLE STUDY</span>
              <span>01 — 03</span>
            </div>

            <div className="iol-feature-bottom">
              <span className="iol-feature-label">
                {activeOutfit.label}
              </span>

              <h3>{activeOutfit.name}</h3>

              <p>{activeOutfit.description}</p>
            </div>

            <div className="iol-feature-mark">
              <Sparkles size={18} strokeWidth={1.5} />
            </div>
          </div>

          {/* Right: style selection and results */}
          <div className="iol-discovery">
            <div className="iol-discovery-header">
              <div>
                <span className="iol-small-label">
                  EXPLORE YOUR AESTHETIC
                </span>

                <h3>Choose your mood.</h3>
              </div>

              <ArrowDownRight
                className="iol-header-icon"
                size={25}
                strokeWidth={1.2}
              />
            </div>

            {/* Style selector */}
            <div className="iol-style-list">
              {styles.map((style, index) => {
                const selected = activeStyle === style;

                return (
                  <button
                    key={style}
                    type="button"
                    className={`iol-style-option ${
                      selected ? "is-active" : ""
                    }`}
                    onClick={() => setActiveStyle(style)}
                    aria-pressed={selected}
                  >
                    <span className="iol-style-number">
                      0{index + 1}
                    </span>

                    <span className="iol-style-name">
                      {style}
                    </span>

                    <span className="iol-style-action">
                      {selected ? (
                        <Check size={16} />
                      ) : (
                        <ArrowRight size={17} />
                      )}
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
              className={`iol-save-button ${
                isSaved ? "is-saved" : ""
              }`}
              onClick={toggleSaved}
            >
              {isSaved ? "Look saved" : "Save this look"}

              {isSaved ? (
                <Check size={17} />
              ) : (
                <ArrowRight size={17} />
              )}
            </button>

            <p className="iol-save-note">
              {savedStyles.length > 0
                ? `${savedStyles.length} look${
                    savedStyles.length > 1 ? "s" : ""
                  } saved in this session`
                : "Explore the possibilities. Find your signature."}
            </p>
          </div>
        </motion.div>

        {/* Bottom brand statement */}
        <div className="iol-footer">
          <span>LESS GUESSWORK. MORE PERSONAL STYLE.</span>

          <a href="#virtual-try-on">
            Discover your style
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}