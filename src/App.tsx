import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  Menu,
  Search,
  Sparkles,
  X,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StyleDiscovery from "./components/StyleDiscovery";
import InfiniteOutfitLab from "./components/InfiniteOutfitLab";
import PersonalStyleIntelligence from "./components/PersonalStyleIntelligence";
import VirtualTryOnStudio from "./components/VirtualTryOnStudio";
import FashionUniverse from "./components/FashionUniverse";
import StyleMultiverse from "./components/StyleMultiverse";
import WeeklyStylePlanner from "./components/WeeklyStylePlanner";
import PersonalStylist from "./components/PersonalStylist";
import {
  GlassTiles,
  type GlassTilesPalette,
} from "./components/ui/glass-tiles";
import "./App.css";

const FashionScene = lazy(() => import("./FashionScene"));

const navigation = [
  { label: "Discover", href: "#style-discovery" },
  { label: "Outfit Lab", href: "#infinite-outfit-lab" },
  { label: "Style DNA", href: "#style-dna" },
  { label: "Try-On", href: "#virtual-try-on" },
  { label: "Universe", href: "#fashion-universe" },
  { label: "Multiverse", href: "#style-multiverse" },
  { label: "Planner", href: "#weekly-style" },
  { label: "Stylist", href: "#personal-stylist" },
];

const zyraPalette: GlassTilesPalette = {
  glow: "#8fc99a",
  deep: "#0d2b1a",
  ground: "#050805",
};

function getSavedCount(): number {
  let count = 0;
  try {
    const ps = localStorage.getItem("ps_saved_looks_v1");
    if (ps) {
      const parsed = JSON.parse(ps);
      if (Array.isArray(parsed?.savedIds)) count += parsed.savedIds.length;
    }
    const fu = localStorage.getItem("fu_saved_products_v1");
    if (fu) {
      const parsed = JSON.parse(fu);
      if (Array.isArray(parsed)) count += parsed.length;
    }
    const lab = localStorage.getItem("zyra_saved_lab_v1");
    if (lab) {
      const parsed = JSON.parse(lab);
      if (Array.isArray(parsed)) count += parsed.length;
    }
  } catch {
    // storage fallback
  }
  return count;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [activeSection, setActiveSection] = useState("style-discovery");

  const currentYear = 2026;

  useEffect(() => {
    function updateProgress() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  useEffect(() => {
    const sectionIds = [
      "home",
      "style-discovery",
      "infinite-outfit-lab",
      "style-dna",
      "virtual-try-on",
      "fashion-universe",
      "style-multiverse",
      "weekly-style",
      "personal-stylist",
    ];

    function handleScroll() {
      const scrollPos = window.scrollY + 240;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function syncSaved() {
      setSavedCount(getSavedCount());
    }

    syncSaved();
    window.addEventListener("zyra-saved-updated", syncSaved);
    window.addEventListener("storage", syncSaved);

    return () => {
      window.removeEventListener("zyra-saved-updated", syncSaved);
      window.removeEventListener("storage", syncSaved);
    };
  }, []);

  function handleSearchClick() {
    const target = document.getElementById("fashion-universe");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const searchInput = target.querySelector<HTMLInputElement>(
        'input[type="search"]'
      );
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 600);
      }
    }
  }

  return (
    <main>
      {/* Top Scroll Progress Indicator */}
      <div className="zyra-progress-bar" aria-hidden="true">
        <motion.div
          className="zyra-progress-fill"
          animate={{ scaleX: scrollProgress / 100 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* Primary Floating Header */}
      <header className={`navbar ${menuOpen ? "navbar-menu-open" : ""}`}>
        <a href="#home" className="brand" aria-label="ZYRA home">
          ZYRA<span>.</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-nav" aria-label="Main navigation">
          {navigation.map((link) => {
            const targetId = link.href.replace("#", "");
            const isActive = activeSection === targetId;
            return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? "nav-link is-active" : "nav-link"}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Global Action Tools */}
        <div className="nav-tools">
          <button
            type="button"
            className="nav-search"
            onClick={handleSearchClick}
            aria-label="Search garments in Fashion Universe"
            title="Search garments"
          >
            <Search size={16} />
          </button>

          <a href="#personal-stylist" className="saved-looks-pill">
            <Bookmark size={13} />
            <span>Saved Looks</span>
            {savedCount > 0 && (
              <span className="saved-badge">{savedCount}</span>
            )}
          </a>

          <a href="#personal-stylist" className="nav-cta">
            Find My Style <ArrowRight size={14} />
          </a>

          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu-drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <nav aria-label="Mobile navigation">
                {navigation.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mobile-drawer-footer">
                <a
                  href="#personal-stylist"
                  className="mobile-saved-pill"
                  onClick={() => setMenuOpen(false)}
                >
                  <Bookmark size={14} />
                  <span>Saved Looks ({savedCount})</span>
                </a>

                <a
                  href="#personal-stylist"
                  className="mobile-primary-cta"
                  onClick={() => setMenuOpen(false)}
                >
                  Launch Personal Stylist <ArrowRight size={15} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" />

        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <div className="eyebrow">
            <span className="eyebrow-line" />
            <Sparkles size={14} />
            <span>PERSONAL STYLE, REIMAGINED</span>
          </div>

          <h1>
            Find Your
            <br />
            Perfect <span className="accent-text">Match.</span>
          </h1>

          <p className="hero-description">
            Great style isn't about having more clothes.
            <br className="desktop-break" />
            It's about understanding how pieces, silhouettes, and colors
            harmonize together.
          </p>

          <div className="hero-actions">
            <a href="#style-discovery" className="button-primary">
              Discover your style <ArrowRight size={17} />
            </a>

            <a href="#personal-stylist" className="button-secondary">
              Meet Personal Stylist <span className="play-symbol">↗</span>
            </a>
          </div>
        </motion.div>

        {/* Hero Artwork with GlassTiles and 3D FashionScene */}
        <motion.div
          className="hero-artwork"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12 }}
        >
          <GlassTiles
            palette={{
              glow: zyraPalette.glow,
              deep: zyraPalette.deep,
              ground: zyraPalette.ground,
            }}
            columns={8}
            speed={0.6}
            className="zyra-glass-background"
            style={{ width: "100%", height: "100%" }}
          >
            <div className="zyra-glass-overlay">
              <div className="hero-note">
                <span className="status-dot" />
                One piece. Endless possibilities.
              </div>

              <div className="hero-proof">
                <span>STYLE</span>
                <span className="proof-divider" />
                <span>INTELLIGENCE</span>
                <span className="proof-divider" />
                <span>DISCOVERY</span>
              </div>

              <div className="hero-visual">
                <div className="visual-orbit visual-orbit-one" />
                <div className="visual-orbit visual-orbit-two" />

                <div className="visual-label visual-label-top">
                  <span>01 / DISCOVER</span>
                  <span>PERSONAL STYLE</span>
                </div>

                <Suspense
                  fallback={
                    <div className="fashion-scene" aria-hidden="true" />
                  }
                >
                  <FashionScene />
                </Suspense>

                <div className="floating-card">
                  <span className="floating-icon">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <span className="card-overline">A NEW PERSPECTIVE</span>
                    <strong>Style, reimagined.</strong>
                    <p>Your next signature look starts here.</p>
                  </div>
                </div>

                <div className="visual-label visual-label-bottom">
                  <span className="status-dot" />
                  ZYRA INTELLIGENCE <span>·</span> FASHION, EVOLVED
                </div>
              </div>

              <a className="scroll-indicator" href="#experience">
                <ArrowDown size={14} />
                SCROLL TO DISCOVER
              </a>

              <div className="hero-index" aria-hidden="true">
                Z / 2026
              </div>
            </div>
          </GlassTiles>
        </motion.div>
      </section>

      {/* Manifesto Transition Bridge */}
      <section className="manifesto section-shell" id="experience">
        <div className="manifesto-top">
          <div className="section-kicker">01 — A DIFFERENT PERSPECTIVE</div>
          <span className="section-coordinate">STYLE IS AN EXPLORATION</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          Style is personal.
          <br />
          <span className="accent-text">Discovery should be too.</span>
        </motion.h2>

        <div className="manifesto-bottom">
          <p>
            Start with a single piece you already love. Explore unexpected
            layering, balanced proportions, and color stories that feel
            completely, unmistakably your own.
          </p>
          <a href="#style-discovery" className="text-link">
            Explore your possibilities <ArrowRight size={16} />
          </a>
        </div>

        <div className="manifesto-line" />
      </section>

      {/* 21st.dev Luxury Editorial Marquee Strip */}
      <div className="zyra-marquee-strip" aria-hidden="true">
        <div className="zyra-marquee-track">
          {[1, 2].map((group) => (
            <div key={group} className="zyra-marquee-group">
              <span className="zyra-marquee-item">
                <span className="star">✦</span> 21st VIRTUAL TRY-ON STUDIO
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> DRAGGABLE SPLIT COMPARISON
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> ARCHITECTURAL SILHOUETTE SYNTHESIS
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> CLIENT-SIDE FIT LAB
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> 100% PRIVATE LOCAL MEMORY
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> BESPOKE COLOR HARMONY MATRIX
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> EDITORIAL ATELIER CURATION
              </span>
              <span className="zyra-marquee-item">
                <span className="star">✦</span> INTERACTIVE STYLE MULTIVERSE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* The 8 Connected Product Experiences */}
      <StyleDiscovery />
      <InfiniteOutfitLab />
      <PersonalStyleIntelligence />
      <VirtualTryOnStudio />
      <FashionUniverse />
      <StyleMultiverse />
      <WeeklyStylePlanner />
      <PersonalStylist />

      {/* Final Editorial High-Conversion Call to Action */}
      <section className="final-cta" id="start">
        <div className="final-cta-glow" />

        <div className="section-kicker">YOUR NEXT CHAPTER IN STYLE</div>

        <h2>
          Your next favorite look
          <br />
          <span className="accent-text">starts here.</span>
        </h2>

        <p>
          Start with one piece you own. Discover what's possible with ZYRA's
          intelligent fashion discovery platform.
        </p>

        <div className="final-cta-actions">
          <a href="#personal-stylist" className="button-primary">
            Launch Personal Stylist <ArrowRight size={17} />
          </a>
          <a href="#fashion-universe" className="button-secondary">
            <Compass size={16} />
            Explore Universe Pieces
          </a>
        </div>

        <span className="final-cta-footnote">
          ZYRA — LUXURY EDITORIAL AI · CLIENT-SIDE PRIVACY PLEDGE · 2026
        </span>
      </section>

      {/* Luxury Brand Footer */}
      <footer className="footer">
        <a href="#home" className="brand" aria-label="ZYRA home">
          ZYRA<span>.</span>
        </a>

        <p>Discover your personal style. Make it completely your own.</p>

        <div className="footer-links">
          <a href="#style-discovery">Discover</a>
          <a href="#infinite-outfit-lab">Outfit Lab</a>
          <a href="#virtual-try-on">Try-On Studio</a>
          <a href="#fashion-universe">Universe</a>
          <a href="#style-multiverse">Multiverse</a>
          <a href="#personal-stylist">Stylist</a>
          <a href="#home">Back to top ↑</a>
        </div>

        <span>© {currentYear} ZYRA AI Technologies. All rights reserved.</span>
      </footer>
    </main>
  );
}
