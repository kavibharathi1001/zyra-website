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
  aesthetic: string;
  description: string;
  items: FashionItem[];
};

const outfits: Outfit[] = [
  {
    name: "The Midnight Edit",
    aesthetic: "Quiet Luxury",
    description:
      "A refined monochrome combination with clean lines, structured silhouette, and understated details.",
    items: [
      {
        id: "top-1",
        category: "01 / TOP",
        name: "Essential Oversized Tee",
        price: "Minimal",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
        description: "A versatile foundation for a modern wardrobe with drape.",
      },
      {
        id: "bottom-1",
        category: "02 / BOTTOM",
        name: "Relaxed Tailored Trousers",
        price: "Refined",
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=85",
        description: "Balances the relaxed silhouette with clean structural pleating.",
      },
      {
        id: "shoe-1",
        category: "03 / FOOTWEAR",
        name: "Everyday Minimal Sneakers",
        price: "Essential",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
        description: "A clean, monochromatic finishing touch for effortless wear.",
      },
    ],
  },
  {
    name: "The Earth Edit",
    aesthetic: "Warm Minimalist",
    description:
      "Muted neutrals and earthy tones creating an organic, relaxed, and deeply considered look.",
    items: [
      {
        id: "top-2",
        category: "01 / TOP",
        name: "Relaxed Neutral Linen Shirt",
        price: "Natural",
        image:
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85",
        description: "An easy layer for a soft, breathable neutral palette.",
      },
      {
        id: "bottom-2",
        category: "02 / BOTTOM",
        name: "Everyday Tonal Chinos",
        price: "Balanced",
        image:
          "https://images.unsplash.com/photo-1506629905607-d9f4d5e7c9b4?auto=format&fit=crop&w=700&q=85",
        description: "Creates an unbroken silhouette with gentle earthy contrast.",
      },
      {
        id: "shoe-2",
        category: "03 / FOOTWEAR",
        name: "Classic Low Profile Trainers",
        price: "Versatile",
        image:
          "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85",
        description: "Keeps the ensemble grounded with textured suede accents.",
      },
    ],
  },
  {
    name: "The Atelier Edit",
    aesthetic: "Modern Classic",
    description:
      "Tailored outerwear paired with relaxed knitwear and sculpted leather accessories for city days.",
    items: [
      {
        id: "top-3",
        category: "01 / TOP",
        name: "Double-Breasted Wool Blazer",
        price: "Structured",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85",
        description: "Architectural shoulders and a tailored drape for quiet authority.",
      },
      {
        id: "bottom-3",
        category: "02 / BOTTOM",
        name: "Straight-Leg Selvedge Denim",
        price: "Classic",
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85",
        description: "Deep indigo denim adding raw texture against formal tailoring.",
      },
      {
        id: "shoe-3",
        category: "03 / FOOTWEAR",
        name: "Polished Lug Loafers",
        price: "Statement",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85",
        description: "Understated craftsmanship with an elevated commando sole.",
      },
    ],
  },
  {
    name: "The City Rebel Edit",
    aesthetic: "Streetwear",
    description:
      "Expressive proportions, utility hardware, and high-contrast styling for confident presence.",
    items: [
      {
        id: "top-4",
        category: "01 / TOP",
        name: "Oversized Utility Trench",
        price: "Expressive",
        image:
          "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=85",
        description: "Voluminous cut with water-resistant technical cotton.",
      },
      {
        id: "bottom-4",
        category: "02 / BOTTOM",
        name: "Wide Cargo Trousers",
        price: "Relaxed",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
        description: "Deep gusset pockets and an adjustable cinch hem.",
      },
      {
        id: "shoe-4",
        category: "03 / FOOTWEAR",
        name: "Sculpted Runner Sneakers",
        price: "Dynamic",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85",
        description: "Chunky ergonomic silhouette in muted chalk and anthracite.",
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
            01 / CURATED STYLE STUDY
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
            together. Explore curated combinations and discover how single
            garments transform into complete, signature looks.
          </p>

          <a className="sd-text-link" href="#infinite-outfit-lab">
            Explore Outfit Lab
            <ArrowDownRight size={17} strokeWidth={1.5} />
          </a>

          <div className="sd-note">
            <Sparkles size={15} />
            <span>Interactive curation · Discover 4 signature edits</span>
          </div>
        </motion.div>

        <div className="sd-showcase">
          <div className="sd-showcase-top">
            <div className="sd-look-info">
              <span className="sd-look-label">
                THE ZYRA EDIT · {outfit.aesthetic}
              </span>
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
                  ? "Garment inspect active · Tap again to minimize"
                  : "Curated composition · Click any piece to inspect details"}
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
            <span>Interactive editorial lookbook · Real styling combinations</span>
          </div>
        </div>
      </div>
    </section>
  );
}