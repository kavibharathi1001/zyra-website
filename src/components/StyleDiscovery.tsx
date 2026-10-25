import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Check,
} from "lucide-react";
import "./StyleDiscovery.css";

type FashionItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  image: string;
  description: string;
};

type Outfit = {
  name: string;
  description: string;
  items: FashionItem[];
};

const outfits: Outfit[] = [
  {
    name: "The Midnight Edit",
    description:
      "A refined monochrome combination with clean lines and understated details.",
    items: [
      {
        id: "top-1",
        category: "01 / TOP",
        name: "Essential Oversized Tee",
        price: "Minimal",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
        description: "A versatile foundation for a modern wardrobe.",
      },
      {
        id: "bottom-1",
        category: "02 / BOTTOM",
        name: "Relaxed Tailored Trousers",
        price: "Refined",
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=85",
        description: "Balances the relaxed silhouette with structure.",
      },
      {
        id: "shoe-1",
        category: "03 / FOOTWEAR",
        name: "Everyday Minimal Sneakers",
        price: "Essential",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
        description: "A clean finishing touch for everyday wear.",
      },
    ],
  },
  {
    name: "The Earth Edit",
    description:
      "Muted neutrals and earthy tones create a relaxed, considered look.",
    items: [
      {
        id: "top-2",
        category: "01 / TOP",
        name: "Relaxed Neutral Shirt",
        price: "Natural",
        image:
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85",
        description: "An easy layer for a soft, neutral palette.",
      },
      {
        id: "bottom-2",
        category: "02 / BOTTOM",
        name: "Everyday Neutral Trousers",
        price: "Balanced",
        image:
          "https://images.unsplash.com/photo-1506629905607-d9f4d5e7c9b4?auto=format&fit=crop&w=700&q=85",
        description: "Creates a balanced silhouette and tonal contrast.",
      },
      {
        id: "shoe-2",
        category: "03 / FOOTWEAR",
        name: "Classic Street Sneakers",
        price: "Versatile",
        image:
          "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85",
        description: "Keeps the outfit grounded and effortless.",
      },
    ],
  },
];

export default function StyleDiscovery() {
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const outfit = outfits[outfitIndex];

  function nextOutfit() {
    setOutfitIndex((current) => (current + 1) % outfits.length);
    setSelectedItem(null);
  }

  return (
    <section className="style-discovery" id="style-discovery">
      <div className="sd-orb sd-orb-one" aria-hidden="true" />
      <div className="sd-orb sd-orb-two" aria-hidden="true" />

      <div className="sd-container">
        <motion.div
          className="sd-intro"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <span className="sd-eyebrow">
            <span className="sd-eyebrow-dot" />
            01 / INTELLIGENT STYLE
          </span>

          <h2>
            One piece.
            <br />
            <span>Infinite</span>
            <br />
            possibilities.
          </h2>

          <p className="sd-description">
            Great style isn't about owning more. It's about seeing what works
            together. Discover unexpected combinations with ZYRA.
          </p>

          <a className="sd-text-link" href="#style-discovery">
            Explore the experience
            <ArrowDownRight size={17} strokeWidth={1.5} />
          </a>

          <div className="sd-note">
            <Sparkles size={15} />
            <span>Curated combinations. A new perspective.</span>
          </div>
        </motion.div>

        <div className="sd-showcase">
          <div className="sd-showcase-top">
            <div className="sd-look-info">
              <span className="sd-look-label">THE ZYRA EDIT</span>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={outfit.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {outfit.name}
                </motion.h3>
              </AnimatePresence>
            </div>

            <span className="sd-look-number">
              0{outfitIndex + 1} <span>/ 0{outfits.length}</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              className="sd-look-description"
              key={outfit.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {outfit.description}
            </motion.p>
          </AnimatePresence>

          <div className="sd-cards">
            {outfit.items.map((item, index) => {
              const isSelected = selectedItem === item.id;

              return (
                <motion.button
                  type="button"
                  key={item.id}
                  className={`sd-product-card ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedItem(isSelected ? null : item.id)
                  }
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.12,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -7 }}
                  whileTap={{ scale: 0.985 }}
                  aria-pressed={isSelected}
                  aria-label={`${item.name}. ${item.description}`}
                >
                  <div className="sd-product-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0";
                      }}
                    />

                    <span className="sd-product-index">{item.category}</span>

                    <span className="sd-select-indicator">
                      {isSelected ? (
                        <Check size={15} />
                      ) : (
                        <ArrowRight size={15} />
                      )}
                    </span>

                    <span className="sd-image-shade" />
                  </div>

                  <div className="sd-product-details">
                    <span className="sd-product-type">{item.price}</span>
                    <span className="sd-product-name">{item.name}</span>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          className="sd-product-description"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {item.description}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="sd-showcase-bottom">
            <div className="sd-match-status">
              <span className="sd-status-light" />
              <span>
                {selectedItem
                  ? "Piece selected · Explore its details"
                  : "A considered combination"}
              </span>
            </div>

            <button
              type="button"
              className="sd-generate-button"
              onClick={nextOutfit}
            >
              <RefreshCw size={15} strokeWidth={1.7} />
              <span>Discover another look</span>
              <ArrowRight size={16} strokeWidth={1.7} />
            </button>
          </div>

          <div className="sd-disclaimer">
            <span>ZYRA / STYLE STUDY</span>
            <span>Conceptual outfit inspiration · Demo experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}