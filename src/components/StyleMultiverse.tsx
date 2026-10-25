import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Sparkles,
  X,
  Compass,
} from "lucide-react";
import "./StyleMultiverse.css";

const universes = [
  {
    id: "quiet-luxury",
    number: "01",
    name: "Quiet Luxury",
    tagline: "Elegance never needs to shout.",
    imageAlt: "Tailored neutral fashion with understated editorial styling",
    description:
      "Refined silhouettes, luxurious textures, and timeless pieces that make simplicity feel extraordinary.",
    colors: ["#C6B8A3", "#827665", "#252923"],
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1100&q=85",
    mood: "Understated · Refined · Timeless",
    pieces: ["Tailored blazer", "Wide-leg trousers", "Minimal accessories"],
  },
  {
    id: "dark-academia",
    number: "02",
    name: "Dark Academia",
    tagline: "A little mystery. A lot of character.",
    imageAlt: "Textured dark outerwear with a vintage, academic character",
    description:
      "Rich layers, vintage influences, and thoughtful details inspired by old libraries and timeless literature.",
    colors: ["#46392D", "#84745A", "#20241F"],
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1100&q=85",
    mood: "Intellectual · Vintage · Mysterious",
    pieces: ["Structured coat", "Textured knitwear", "Leather loafers"],
  },
  {
    id: "streetwear",
    number: "03",
    name: "Streetwear Rebel",
    tagline: "Make the ordinary unforgettable.",
    imageAlt: "Expressive urban streetwear with relaxed, oversized proportions",
    description:
      "Oversized proportions, confident contrasts, and street-inspired pieces that refuse to blend in.",
    colors: ["#242424", "#8A8F86", "#8fc99a"],
    image:
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=1100&q=85",
    mood: "Bold · Urban · Unapologetic",
    pieces: ["Oversized jacket", "Statement sneakers", "Utility trousers"],
  },
  {
    id: "minimalist",
    number: "04",
    name: "Clean Minimalist",
    tagline: "Less noise. More you.",
    imageAlt: "Clean, modern fashion with simple silhouettes and neutral tones",
    description:
      "Clean lines, balanced proportions, and a carefully edited wardrobe where every piece earns its place.",
    colors: ["#E9E5DD", "#A7A49C", "#353832"],
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1100&q=85",
    mood: "Effortless · Modern · Balanced",
    pieces: ["Essential white shirt", "Straight-leg denim", "Everyday trainers"],
  },
  {
    id: "romantic",
    number: "05",
    name: "Soft Romantic",
    tagline: "Dress like a beautiful daydream.",
    imageAlt: "Soft, flowing fashion in a delicate romantic palette",
    description:
      "Fluid fabrics, gentle colours, and expressive details that make everyday outfits feel a little magical.",
    colors: ["#E8C8CB", "#B7A4B7", "#F2E9DF"],
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1100&q=85",
    mood: "Dreamy · Expressive · Delicate",
    pieces: ["Flowing blouse", "Midi skirt", "Delicate jewellery"],
  },
  {
    id: "future-couture",
    number: "06",
    name: "Future Couture",
    tagline: "Wear what doesn't exist yet.",
    imageAlt: "Avant-garde editorial fashion with sculptural, forward-looking styling",
    description:
      "Unexpected shapes, experimental combinations, and forward-looking fashion for those who imagine beyond trends.",
    colors: ["#8fc99a", "#424C49", "#171A19"],
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1100&q=85",
    mood: "Experimental · Futuristic · Artistic",
    pieces: ["Sculptural outerwear", "Technical fabrics", "Architectural accessories"],
  },
];

export default function StyleMultiverse() {
  const [selected, setSelected] = useState<(typeof universes)[number] | null>(
    null,
  );
  const rows = [
    universes.slice(0, 2),
    universes.slice(2, 4),
    universes.slice(4, 6),
  ];

  return (
    <section
      className="multiverse"
      id="style-multiverse"
      aria-label="The ZYRA Style Multiverse"
    >
      <div className="mv-noise" aria-hidden="true" />

      <div className="mv-stage">
        <div
          className="mv-grid-viewport"
          role="group"
          aria-label="Explore 6 distinctive fashion aesthetics"
        >
          <div className="mv-grid-plane">
            {rows.map((row, rowIndex) => (
              <div className={`mv-row mv-row-${rowIndex + 1}`} key={rowIndex}>
                <div className="mv-track">
                  {[0, 1, 2].map((copy) => (
                    <div
                      className="mv-sequence"
                      key={copy}
                      aria-hidden={copy > 0 ? true : undefined}
                    >
                      {row.map((universe) =>
                        copy === 0 ? (
                          <button
                            className="mv-tile"
                            type="button"
                            key={universe.id}
                            onClick={() => setSelected(universe)}
                            aria-label={`Explore ${universe.name}: ${universe.tagline}`}
                          >
                            <img
                              src={universe.image}
                              alt={universe.imageAlt}
                              loading="lazy"
                              decoding="async"
                              width="600"
                              height="820"
                            />
                            <span className="mv-tile-shade" aria-hidden="true" />
                            <span className="mv-tile-label">
                              <span>{universe.number} / 06</span>
                              <strong>{universe.name}</strong>
                            </span>
                          </button>
                        ) : (
                          <div className="mv-tile mv-tile-copy" key={universe.id}>
                            <img
                              src={universe.image}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              width="600"
                              height="820"
                            />
                            <span className="mv-tile-shade" aria-hidden="true" />
                          </div>
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mv-vignette" aria-hidden="true" />

        <motion.div
          className="mv-copy"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mv-eyebrow">
            <Sparkles size={14} />
            <span>06 / THE STYLE MULTIVERSE</span>
          </div>

          <h2>
            Which world
            <br />
            <span>feels like you?</span>
          </h2>

          <p className="mv-lead">
            Six aesthetics. Infinite expressions. Step into a cinematic gallery
            of self-expression designed to help you discover the side of your
            style you&apos;ve been waiting to meet.
          </p>
          <p className="mv-support">
            Tap any moving frame to explore key foundation pieces, palette moods,
            and complete outfit formulas.
          </p>

          <a href="#personal-stylist" className="mv-banner-cta">
            <Compass size={16} />
            <span>EXPLORE YOUR STYLE IN STYLIST</span>
            <ArrowUpRight size={17} />
          </a>
        </motion.div>

        <div className="mv-stage-caption" aria-hidden="true">
          <span>AN OPEN UNIVERSE OF SELF-EXPRESSION</span>
          <span>01 — 06</span>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="mv-modal-backdrop"
            role="presentation"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mv-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mv-modal-title"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="mv-modal-close"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close style details"
              >
                <X size={20} />
              </button>

              <div className="mv-modal-image">
                <img src={selected.image} alt={selected.imageAlt} />
              </div>

              <div className="mv-modal-content">
                <span className="mv-eyebrow">YOUR NEXT STYLE CHAPTER</span>
                <h3 id="mv-modal-title">{selected.name}</h3>
                <p className="mv-modal-tagline">{selected.tagline}</p>
                <p className="mv-modal-description">{selected.description}</p>

                <span className="mv-modal-label">THE MOOD</span>
                <p>{selected.mood}</p>

                <span className="mv-modal-label">BUILD YOUR LOOK AROUND</span>
                <ul>
                  {selected.pieces.map((piece) => (
                    <li key={piece}>{piece}</li>
                  ))}
                </ul>

                <div className="mv-modal-palette">
                  {selected.colors.map((color) => (
                    <span
                      key={color}
                      className="mv-swatch"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <a
                  href="#personal-stylist"
                  className="mv-modal-cta"
                  onClick={() => {
                    try {
                      localStorage.setItem(
                        "ps_preselected_aesthetic",
                        selected.id
                      );
                      window.dispatchEvent(
                        new Event("zyra-aesthetic-selected")
                      );
                    } catch {
                      // ignore
                    }
                    setSelected(null);
                  }}
                >
                  Explore this aesthetic in Stylist <ArrowUpRight size={17} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
