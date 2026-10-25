import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  Check,
  Menu,
  Search,
  Sparkles,
  X,
  Shirt,
  ScanFace,
  Layers3,
  Palette,
  WandSparkles,
} from "lucide-react";
import StyleDiscovery from "./components/StyleDiscovery";
import InfiniteOutfitLab from "./components/InfiniteOutfitLab";
import PersonalStyleIntelligence from "./components/PersonalStyleIntelligence";
import VirtualTryOnStudio from "./components/VirtualTryOnStudio";
import { motion } from "motion/react";
import "./App.css";
import {
  GlassTiles,
  type GlassTilesPalette,
} from "./components/ui/glass-tiles";
import FashionUniverse from "./components/FashionUniverse";
import StyleMultiverse from "./components/StyleMultiverse";
import WeeklyStylePlanner from "./components/WeeklyStylePlanner";
import PersonalStylist from "./components/PersonalStylist";
import ProductNavigation from "./components/ProductNavigation";

const FashionScene = lazy(() => import("./FashionScene"));

const navigation = [
  { label: "Discover", href: "#style-discovery" },
  { label: "AI Studio", href: "#infinite-outfit-lab" },
  { label: "Try-On", href: "#virtual-try-on" },
  { label: "Explore", href: "#fashion-universe" },
  { label: "My Style", href: "#personal-stylist" },
];
const zyraPalette: GlassTilesPalette = {
  glow: "#73FFB2",
  deep: "#064E36",
  ground: "#030504",
};
const styleOptions = [
"Minimal",
"Streetwear",
"Old money",
"Casual",
"Smart casual",
"Experimental",
];

const occasions = [
"Everyday",
"College",
"Office",
"Date night",
"Party",
"Wedding",
"Travel",
];

const capabilities = [
{
number: "01",
icon: Palette,
title: "Understand the colors",
description:
"Explore complementary colors and combinations that make your existing pieces work together.",
tag: "COLOR INTELLIGENCE",
},
{
number: "02",
icon: Layers3,
title: "Build the complete look",
description:
"Discover tops, bottoms, footwear, and accessories that bring an outfit together.",
tag: "OUTFIT MATCHING",
},
{
number: "03",
icon: ScanFace,
title: "Visualize your style",
description:
"Explore the possibilities of virtual try-on and see how different looks could work for you.",
tag: "VISUAL DISCOVERY",
},
];

export default function App() {
const [menuOpen, setMenuOpen] = useState(false);
const [item, setItem] = useState("");
const [occasion, setOccasion] = useState("Everyday");
const [style, setStyle] = useState("Minimal");
const [feedback, setFeedback] = useState("");
const [submitted, setSubmitted] = useState(false);
const [scrollProgress, setScrollProgress] = useState(0);
const currentYear = 2026;

useEffect(() => {
  function updateProgress() {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const nextProgress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    setScrollProgress(Math.min(100, Math.max(0, nextProgress)));
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  return () => {
    window.removeEventListener("scroll", updateProgress);
  };
}, []);

function handleDiscover(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

if (!item.trim()) {
  setFeedback("Start with a clothing piece you already love.");
  setSubmitted(false);
  return;
}

setFeedback(
  `Your style brief is ready: ${item.trim()} · ${style} · ${occasion}. Connect the recommendation engine to generate personalized outfit matches.`
);
setSubmitted(true);


}

return (
  <main>
    <div className="zyra-progress-bar" aria-hidden="true">
      <motion.div
        className="zyra-progress-fill"
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </div>

    <header className={`navbar ${menuOpen ? "navbar-menu-open" : ""}`}>
      <a href="#home" className="brand" aria-label="ZYRA home">
        ZYRA<span>.</span>
      </a>

      <nav
        className={`nav-links ${menuOpen ? "nav-open" : ""}`}
        aria-label="Main navigation"
      >
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

      <div className="nav-tools">
        <button
          type="button"
          className="nav-search"
          aria-label="Search the ZYRA experience"
        >
          <Search size={16} />
        </button>
        <a href="#personal-stylist" className="saved-looks-pill">
          <Bookmark size={12} />
          Saved Looks
        </a>
        <a href="#personal-stylist" className="nav-cta">
          Find My Style <ArrowRight size={15} />
        </a>
      </div>

      <button
        className="menu-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>

    <ProductNavigation />

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
          Great style isn't about having more.
          <br className="desktop-break" />
          It's about discovering what works together.
        </p>

        <div className="hero-actions">
          <a href="#discover" className="button-primary">
            Discover your style <ArrowRight size={17} />
          </a>

          <a href="#experience" className="button-secondary">
            Meet ZYRA <span className="play-symbol">↗</span>
          </a>
        </div>
      </motion.div>

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
            ground: zyraPalette.ground
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
                  fallback={<div className="fashion-scene" aria-hidden="true" />}
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
                    <p>Your next look starts here.</p>
                  </div>
                </div>

                <div className="visual-label visual-label-bottom">
                  <span className="status-dot" />
                  ZYRA INTELLIGENCE <span>·</span> FASHION, EVOLVED
                </div>
              </div>

              <a className="scroll-indicator" href="#experience">
                <ArrowDown size={15} />
                SCROLL TO DISCOVER
              </a>

              <div className="hero-index" aria-hidden="true">
                Z / 001
              </div>
          </div>
        </GlassTiles>
      </motion.div>
    </section>

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
      <span className="accent-text">
        Discovery should be too.
      </span>
    </motion.h2>

    <div className="manifesto-bottom">
      <p>
        Start with a single piece. Explore unexpected combinations.
        Discover a look that feels entirely your own.
      </p>
      <a href="#discover" className="text-link">
        Explore your possibilities <ArrowRight size={16} />
      </a>
    </div>

    <div className="manifesto-line" />
  </section>
  <StyleDiscovery />
  <InfiniteOutfitLab />
  <PersonalStyleIntelligence />
  <VirtualTryOnStudio />
  <FashionUniverse />
  <StyleMultiverse />
  <WeeklyStylePlanner />
  <PersonalStylist />
  <section className="discover-section section-shell" id="discover">
    <div className="section-heading-row">
      <div>
        <div className="section-kicker">
          02 — YOUR PERSONAL STYLE ENGINE
        </div>

        <h2>
          One piece.
          <br />
          <span className="accent-text">A whole new look.</span>
        </h2>
      </div>

      <p className="section-description">
        Your wardrobe is full of possibilities.
        Let's find the combinations you haven't discovered yet.
      </p>
    </div>

    <div className="discovery-layout">
      <div className="discovery-copy">
        <div className="discovery-number">01 / START WITH WHAT YOU OWN</div>

        <h3>
          Every great outfit
          <br />
          starts somewhere.
        </h3>

        <p>
          Tell us about one piece you love. Choose your aesthetic and
          occasion to create a style brief for your next look.
        </p>

        <div className="discovery-benefits">
          <div>
            <Check size={16} />
            <span>Built around your starting piece</span>
          </div>
          <div>
            <Check size={16} />
            <span>Designed for your preferred aesthetic</span>
          </div>
          <div>
            <Check size={16} />
            <span>Ready for personalized recommendations</span>
          </div>
        </div>

        <div className="discovery-footnote">
          <Sparkles size={15} />
          Your style. Your starting point.
        </div>
      </div>

      <form className="discover-form" onSubmit={handleDiscover}>
        <div className="form-header">
          <div>
            <span className="form-step">YOUR STYLE BRIEF</span>
            <h3>Let's find your match.</h3>
          </div>
          <span className="form-sparkle">
            <WandSparkles size={21} />
          </span>
        </div>

        <label htmlFor="fashion-item">
          01 <span>What would you like to match?</span>
        </label>

        <div className="input-with-icon">
          <Shirt size={18} />
          <input
            id="fashion-item"
            value={item}
            onChange={(event) => {
              setItem(event.target.value);
              setFeedback("");
              setSubmitted(false);
            }}
            placeholder="e.g. black cargo pants"
            maxLength={120}
          />
        </div>

        <label htmlFor="style-choice">
          02 <span>Choose your aesthetic</span>
        </label>

        <div className="style-options">
          {styleOptions.map((option) => (
            <button
              type="button"
              key={option}
              className={`style-chip ${
                style === option ? "style-chip-active" : ""
              }`}
              aria-pressed={style === option}
              onClick={() => setStyle(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <label htmlFor="occasion">
          03 <span>Where are you going?</span>
        </label>

        <select
          id="occasion"
          value={occasion}
          onChange={(event) => setOccasion(event.target.value)}
        >
          {occasions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <button type="submit" className="button-primary form-button">
          Create my style brief <ArrowRight size={17} />
        </button>

        {feedback && (
          <p
            className={`form-feedback ${
              submitted ? "form-feedback-success" : ""
            }`}
            role="status"
          >
            {feedback}
          </p>
        )}

        <p className="form-disclaimer">
          Your starting point for a more personal style.
        </p>
      </form>
    </div>
  </section>

  <section className="capabilities-section section-shell">
    <div className="section-kicker">03 — THE ZYRA APPROACH</div>

    <div className="capabilities-heading">
      <h2>
        More than matching.
        <br />
        <span className="accent-text">A way to see style differently.</span>
      </h2>

      <p>
        A more considered approach to choosing, combining, and
        discovering the clothes you love.
      </p>
    </div>

    <div className="capabilities-grid">
      {capabilities.map((capability) => {
        const Icon = capability.icon;

        return (
          <motion.article
            className="capability-card"
            key={capability.number}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: Number(capability.number) * 0.08,
            }}
          >
            <div className="capability-top">
              <span>{capability.number}</span>
              <Icon size={23} strokeWidth={1.5} />
            </div>

            <div className="capability-visual">
              <div className={`capability-art art-${capability.number}`}>
                {capability.number === "01" && (
                  <div className="palette-art">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                )}

                {capability.number === "02" && (
                  <div className="layers-art">
                    <div>TOP</div>
                    <div>BOTTOM</div>
                    <div>DETAIL</div>
                  </div>
                )}

                {capability.number === "03" && (
                  <div className="visualize-art">
                    <ScanFace size={55} strokeWidth={0.8} />
                    <span />
                  </div>
                )}
              </div>
            </div>

            <span className="capability-tag">{capability.tag}</span>
            <h3>{capability.title}</h3>
            <p>{capability.description}</p>
          </motion.article>
        );
      })}
    </div>
  </section>

  <section className="product-section section-shell" id="products">
    <div className="product-copy">
      <div className="section-kicker">04 — FROM INSPIRATION TO DISCOVERY</div>

      <h2>
        Complete
        <br />
        <span className="accent-text">the look.</span>
      </h2>

      <p>
        Find complementary pieces that bring your outfit together.
        Explore new combinations and discover products that fit your
        personal style.
      </p>

      <a href="#discover" className="button-secondary">
        Explore outfit matching <ArrowRight size={16} />
      </a>
    </div>

    <div className="product-visual">
      <div className="product-visual-orb" />
      <div className="product-composition">
        <div className="product-piece product-piece-top">
          <span>01</span>
          <div className="piece-shirt" />
          <p>THE TOP</p>
        </div>

        <div className="product-piece product-piece-bottom">
          <span>02</span>
          <div className="piece-trousers" />
          <p>THE BASE</p>
        </div>

        <div className="product-piece product-piece-detail">
          <span>03</span>
          <div className="piece-accessory" />
          <p>THE DETAIL</p>
        </div>
      </div>

      <div className="composition-caption">
        <Sparkles size={15} />
        THE ART OF PUTTING IT TOGETHER
      </div>
    </div>
  </section>

  <section className="tryon-section section-shell" id="try-on">
    <div className="tryon-visual">
      <div className="tryon-frame">
        <div className="tryon-frame-glow" />
        <div className="tryon-silhouette">
          <div className="silhouette-head" />
          <div className="silhouette-body" />
          <div className="silhouette-leg silhouette-leg-left" />
          <div className="silhouette-leg silhouette-leg-right" />
        </div>

        <span className="tryon-corner tryon-corner-tl" />
        <span className="tryon-corner tryon-corner-tr" />
        <span className="tryon-corner tryon-corner-bl" />
        <span className="tryon-corner tryon-corner-br" />

        <div className="tryon-label">
          <ScanFace size={16} />
          VIRTUAL TRY-ON
        </div>
        <span className="tryon-coming">COMING SOON</span>
      </div>
    </div>

    <div className="tryon-copy">
      <div className="section-kicker">05 — A NEW WAY TO VISUALIZE</div>

      <h2>
        Imagine it.
        <br />
        <span className="accent-text">Then see it.</span>
      </h2>

      <p>
        Explore the possibility of seeing clothing combinations on your
        own photo. ZYRA's virtual try-on experience is planned to help
        you visualize your next look before making a decision.
      </p>

      <div className="tryon-status">
        <span className="status-dot" />
        IN DEVELOPMENT
      </div>
    </div>
  </section>

  <section className="mascot-section section-shell" id="about">
    <div className="section-kicker">06 — YOUR STYLE SPIRIT</div>

    <div className="mascot-heading">
      <h2>
        A little magic.
        <br />
        <span className="accent-text">A lot more style.</span>
      </h2>

      <p>
        Meet ZYRA — a curious spirit designed to guide you through
        the world of personal style.
      </p>
    </div>

    <div className="mascot-stage">
      <div className="mascot-stage-glow" />

      <div className="mascot-placeholder">
        <div className="mascot-placeholder-icon">
          <Sparkles size={34} strokeWidth={1.2} />
        </div>
        <span>MEET YOUR STYLE COMPANION</span>
        <p>
          An original interactive bird-butterfly character is being
          developed for the ZYRA experience.
        </p>
      </div>

      <div className="mascot-orbit-label mascot-label-left">
        <span>01</span>
        CURIOUS BY NATURE
      </div>

      <div className="mascot-orbit-label mascot-label-right">
        <span>02</span>
        DESIGNED TO INSPIRE
      </div>
    </div>

    <div className="mascot-footer">
      <p>
        Not just an assistant. A little character with a world of its own.
      </p>
      <span>THE WORLD OF ZYRA / 001</span>
    </div>
  </section>

  <section className="privacy-section section-shell">
    <div className="privacy-mark">
      <Sparkles size={24} />
    </div>

    <div>
      <div className="section-kicker">07 — BUILT AROUND YOU</div>
      <h2>
        Your style is personal.
        <br />
        <span className="accent-text">It should stay that way.</span>
      </h2>
      <p>
        Personal fashion tools should make it clear how photos,
        preferences, and saved looks are handled. Privacy-conscious
        design is part of the ZYRA vision.
      </p>
    </div>
  </section>

  <section className="final-cta">
    <div className="final-cta-glow" />

    <div className="section-kicker">YOUR NEXT CHAPTER IN STYLE</div>

    <h2>
      Your next favorite look
      <br />
      <span className="accent-text">starts here.</span>
    </h2>

    <p>
      Start with one piece. Discover what's possible.
    </p>

    <a href="#personal-stylist" className="button-primary">
      Find your perfect match <ArrowRight size={17} />
    </a>

    <span className="final-cta-footnote">
      ZYRA — A NEW PERSPECTIVE ON PERSONAL STYLE.
    </span>
  </section>

  <footer className="footer">
    <a href="#home" className="brand" aria-label="ZYRA home">
      ZYRA<span>.</span>
    </a>

    <p>Discover your style. Make it your own.</p>

    <div className="footer-links">
      <a href="#style-discovery">Discover</a>
      <a href="#experience">About</a>
      <a href="#home">Back to top ↑</a>
    </div>

    <span>© {currentYear} ZYRA</span>
  </footer>
</main>

);
}
