import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Heart,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import "./FashionUniverse.css";

type Category =
  | "All"
  | "Tops"
  | "Bottoms"
  | "Footwear"
  | "Accessories";

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  style: string;
  description: string;
  price: string;
  image: string;
  accent: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "The Essential Shirt",
    category: "Tops",
    style: "Minimal",
    description: "Relaxed fit · Warm ivory",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    accent: "WARDROBE ESSENTIAL",
  },
  {
    id: 2,
    name: "Everyday Structure",
    category: "Bottoms",
    style: "Classic",
    description: "Tailored fit · Neutral",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85",
    accent: "TIMELESS FORM",
  },
  {
    id: 3,
    name: "The Street Essential",
    category: "Footwear",
    style: "Streetwear",
    description: "Everyday silhouette · Urban",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    accent: "OFF-DUTY ICON",
  },
  {
    id: 4,
    name: "The Finishing Touch",
    category: "Accessories",
    style: "Minimal",
    description: "Understated detail · Modern",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=85",
    accent: "THE FINAL DETAIL",
  },
  {
    id: 5,
    name: "The Modern Layer",
    category: "Tops",
    style: "Streetwear",
    description: "Contemporary layers · Relaxed",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    accent: "NEW PERSPECTIVE",
  },
  {
    id: 6,
    name: "The Everyday Classic",
    category: "Footwear",
    style: "Classic",
    description: "Clean profile · Versatile",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",
    accent: "BUILT TO LAST",
  },
  {
    id: 7,
    name: "The Statement Piece",
    category: "Accessories",
    style: "Experimental",
    description: "Distinctive detail · Expressive",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9a0d7b9c4d1?auto=format&fit=crop&w=800&q=85",
    accent: "MAKE IT YOURS",
  },
  {
    id: 8,
    name: "The Daily Essential",
    category: "Bottoms",
    style: "Streetwear",
    description: "Relaxed proportions · Everyday",
    price: "Explore piece",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85",
    accent: "EASY BY DESIGN",
  },
];

const categories: Category[] = [
  "All",
  "Tops",
  "Bottoms",
  "Footwear",
  "Accessories",
];

const styleFilters = [
  "All styles",
  "Minimal",
  "Streetwear",
  "Classic",
  "Experimental",
];

export default function FashionUniverse() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [activeStyle, setActiveStyle] = useState("All styles");
  const [saved, setSaved] = useState<number[]>([]);
  const [showCollection, setShowCollection] = useState(false);
  const [showStylingNote, setShowStylingNote] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStyle =
        activeStyle === "All styles" ||
        product.style === activeStyle;

      const matchesSearch =
        !query ||
        [
          product.name,
          product.category,
          product.style,
          product.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCollection =
        !showCollection || saved.includes(product.id);

      return (
        matchesCategory &&
        matchesStyle &&
        matchesSearch &&
        matchesCollection
      );
    });
  }, [search, category, activeStyle, showCollection, saved]);

  function toggleSaved(id: number) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setActiveStyle("All styles");
    setShowCollection(false);
  }

  return (
    <section className="fu-section" id="fashion-universe">
      <div className="fu-container">
        {/* Heading */}

        <motion.div
          className="fu-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="fu-eyebrow">
            <span />
            THE ZYRA FASHION UNIVERSE
          </div>

          <div className="fu-heading-row">
            <h2>
              Your next great outfit
              <br />
              <span>is out there.</span>
            </h2>

            <p>
              Discover pieces that speak your language.
              Explore different aesthetics and find
              inspiration for the way you want to dress.
            </p>
          </div>
        </motion.div>

        {/* Search and controls */}

        <div className="fu-toolbar">
          <div className="fu-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search shirts, sneakers, accessories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search fashion inspiration"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`fu-collection-button ${
              showCollection ? "is-active" : ""
            }`}
            onClick={() => setShowCollection((value) => !value)}
          >
            <Heart size={16} />

            My collection

            <span>{saved.length}</span>
          </button>
        </div>

        {/* Category navigation */}

        <div className="fu-category-row">
          <div className="fu-categories" aria-label="Product categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? "is-active" : ""}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>

          <span className="fu-result-count">
            {filteredProducts.length.toString().padStart(2, "0")} PIECES
          </span>
        </div>

        {/* Style filters */}

        <div className="fu-style-row">
          <span>CURATE YOUR AESTHETIC</span>

          <div className="fu-style-filters">
            {styleFilters.map((style) => (
              <button
                key={style}
                type="button"
                className={activeStyle === style ? "is-active" : ""}
                onClick={() => setActiveStyle(style)}
                aria-pressed={activeStyle === style}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Product gallery */}

        <motion.div layout className="fu-grid">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.article
                layout
                key={product.id}
                className="fu-product"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.035, 0.2),
                }}
              >
                <div className="fu-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />

                  <span className="fu-product-label">
                    {product.accent}
                  </span>

                  <button
                    type="button"
                    className={`fu-heart ${
                      saved.includes(product.id) ? "is-saved" : ""
                    }`}
                    onClick={() => toggleSaved(product.id)}
                    aria-label={
                      saved.includes(product.id)
                        ? `Remove ${product.name} from collection`
                        : `Save ${product.name} to collection`
                    }
                    aria-pressed={saved.includes(product.id)}
                  >
                    {saved.includes(product.id) ? (
                      <Check size={17} />
                    ) : (
                      <Heart size={17} />
                    )}
                  </button>

                  <div className="fu-product-hover">
                    <button
                      type="button"
                      onClick={() => setShowStylingNote(true)}
                    >
                      Explore this piece
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                <div className="fu-product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>

                  <span className="fu-product-category">
                    {product.category}
                  </span>
                </div>

                <div className="fu-product-bottom">
                  <span>{product.style} EDIT</span>

                  <button
                    type="button"
                    onClick={() => setShowStylingNote(true)}
                  >
                    Discover <ArrowRight size={13} />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}

        {filteredProducts.length === 0 && (
          <div className="fu-empty">
            <Sparkles size={26} />

            <h3>
              {showCollection
                ? "Your collection is waiting."
                : "Let's try a different direction."}
            </h3>

            <p>
              {showCollection
                ? "Save a few pieces you love and find them here."
                : "Explore another category or adjust your search."}
            </p>

            <button type="button" onClick={resetFilters}>
              Explore all pieces <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Styling insight */}

        <div className="fu-style-callout">
          <div className="fu-callout-icon">
            <Sparkles size={22} />
          </div>

          <div className="fu-callout-copy">
            <span>THE ZYRA DIFFERENCE</span>

            <h3>One great piece. A world of possibilities.</h3>

            <p>
              The goal isn't to own more. It's to discover
              more ways to make your wardrobe work for you.
            </p>
          </div>

          <button
            type="button"
            className="fu-callout-button"
            onClick={() => setShowStylingNote(true)}
          >
            Explore the concept
            <ArrowDownRight size={17} />
          </button>
        </div>

        {/* Informational dialog */}

        <AnimatePresence>
          {showStylingNote && (
            <motion.div
              className="fu-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setShowStylingNote(false);
                }
              }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="fu-modal-title"
                className="fu-modal"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <button
                  type="button"
                  className="fu-modal-close"
                  onClick={() => setShowStylingNote(false)}
                  aria-label="Close dialog"
                >
                  <X size={19} />
                </button>

                <div className="fu-modal-symbol">
                  <ShoppingBag size={24} />
                </div>

                <span>COMING TO ZYRA</span>

                <h3 id="fu-modal-title">
                  From discovery to your next great outfit.
                </h3>

                <p>
                  This is the foundation for connected fashion
                  discovery. Future versions can connect real
                  product catalogs, retailer links, and outfit
                  matching services.
                </p>

                <button
                  type="button"
                  className="fu-modal-action"
                  onClick={() => setShowStylingNote(false)}
                >
                  Keep exploring <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}

        <div className="fu-footer">
          <span>FASHION IS BETTER WHEN IT CONNECTS.</span>

          <a href="#virtual-try-on">
            Explore virtual try-on <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}