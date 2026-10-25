import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Bookmark,
  Check,
  Heart,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import "./PersonalStylist.css";

type Aesthetic =
  | "quiet-luxury"
  | "minimalist"
  | "streetwear"
  | "romantic"
  | "dark-academia"
  | "future-couture";

type Occasion =
  | "college"
  | "work"
  | "date-night"
  | "weekend"
  | "party"
  | "travel";

type Budget = "essential" | "balanced" | "premium" | "any";

interface StyleLook {
  id: string;
  name: string;
  tagline: string;
  image: string;
  aesthetic: Aesthetic[];
  occasions: Occasion[];
  budget: Exclude<Budget, "any">;
  budgetLabel: string;
  products: string[];
  colours: string[];
  reason: string;
}

const aesthetics: { value: Aesthetic; label: string; description: string }[] = [
  {
    value: "quiet-luxury",
    label: "Quiet Luxury",
    description: "Refined, timeless, understated",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Clean, versatile, effortless",
  },
  {
    value: "streetwear",
    label: "Streetwear",
    description: "Relaxed, urban, expressive",
  },
  {
    value: "romantic",
    label: "Soft Romantic",
    description: "Dreamy, delicate, graceful",
  },
  {
    value: "dark-academia",
    label: "Dark Academia",
    description: "Vintage, layered, mysterious",
  },
  {
    value: "future-couture",
    label: "Future Couture",
    description: "Experimental, bold, futuristic",
  },
];

const occasions: { value: Occasion; label: string }[] = [
  { value: "college", label: "College" },
  { value: "work", label: "Work" },
  { value: "date-night", label: "Date night" },
  { value: "weekend", label: "Weekend" },
  { value: "party", label: "Party" },
  { value: "travel", label: "Travel" },
];

const budgets: { value: Budget; label: string; detail: string }[] = [
  {
    value: "essential",
    label: "Essential",
    detail: "Budget-friendly pieces",
  },
  {
    value: "balanced",
    label: "Balanced",
    detail: "Quality meets value",
  },
  {
    value: "premium",
    label: "Premium",
    detail: "Elevated statement pieces",
  },
  {
    value: "any",
    label: "Surprise me",
    detail: "Explore every budget",
  },
];

const looks: StyleLook[] = [
  {
    id: "quiet-office",
    name: "The Modern Essential",
    tagline: "Understated. Unforgettable.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["quiet-luxury", "minimalist"],
    occasions: ["work", "travel"],
    budget: "premium",
    budgetLabel: "Premium",
    products: [
      "Structured neutral blazer",
      "Tailored straight-leg trousers",
      "Minimal leather accessories",
    ],
    colours: ["#D4C4AE", "#898B7B", "#30362E"],
    reason:
      "The neutral palette and clean silhouette create a polished outfit without unnecessary details.",
  },
  {
    id: "campus-easy",
    name: "The Campus Edit",
    tagline: "Comfort with character.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["minimalist", "streetwear"],
    occasions: ["college", "weekend"],
    budget: "essential",
    budgetLabel: "Essential",
    products: [
      "Relaxed everyday shirt",
      "Classic straight-leg denim",
      "Comfortable trainers",
    ],
    colours: ["#C9C8B7", "#778775", "#30312F"],
    reason:
      "Versatile basics make this combination comfortable for a busy day while leaving room for personal expression.",
  },
  {
    id: "romantic-evening",
    name: "The Soft Focus",
    tagline: "A little romance, every day.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["romantic", "minimalist"],
    occasions: ["date-night", "weekend"],
    budget: "balanced",
    budgetLabel: "Balanced",
    products: [
      "Flowing blouse",
      "Midi skirt or tailored trousers",
      "Delicate jewellery",
    ],
    colours: ["#D9B8BC", "#D9CDBB", "#71666B"],
    reason:
      "Soft colours and fluid shapes create a graceful outfit that can be adapted to different personal preferences.",
  },
  {
    id: "street-statement",
    name: "The City Rebel",
    tagline: "Never dress to disappear.",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["streetwear", "future-couture"],
    occasions: ["college", "weekend", "party"],
    budget: "balanced",
    budgetLabel: "Balanced",
    products: [
      "Oversized statement jacket",
      "Relaxed utility trousers",
      "Contrast sneakers",
    ],
    colours: ["#282D2A", "#9DAE8E", "#DED7C9"],
    reason:
      "Oversized proportions and contrasting colours give this look a bold silhouette without requiring a complicated wardrobe.",
  },
  {
    id: "academic-layers",
    name: "The After-Hours Scholar",
    tagline: "Classic with a little mystery.",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9a0d7b9c4d1?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["dark-academia", "quiet-luxury"],
    occasions: ["college", "work", "weekend"],
    budget: "balanced",
    budgetLabel: "Balanced",
    products: [
      "Textured knitwear",
      "Structured dark trousers",
      "Leather-inspired footwear",
    ],
    colours: ["#514435", "#8A8068", "#282B25"],
    reason:
      "Layering, muted colours, and textured fabrics create a thoughtful vintage-inspired aesthetic.",
  },
  {
    id: "minimal-travel",
    name: "The Anywhere Uniform",
    tagline: "Pack less. Create more.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["minimalist", "quiet-luxury"],
    occasions: ["travel", "weekend"],
    budget: "essential",
    budgetLabel: "Essential",
    products: [
      "Versatile lightweight top",
      "Comfortable neutral trousers",
      "Everyday walking shoes",
    ],
    colours: ["#E4DCCF", "#A4B09D", "#383B34"],
    reason:
      "Coordinated basics make it easier to create multiple combinations from a small selection of versatile pieces.",
  },
  {
    id: "party-afterdark",
    name: "The After-Dark Edit",
    tagline: "Let the details speak.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["quiet-luxury", "future-couture", "romantic"],
    occasions: ["party", "date-night"],
    budget: "premium",
    budgetLabel: "Premium",
    products: [
      "Statement evening piece",
      "Tailored complementary layer",
      "Sculptural accessories",
    ],
    colours: ["#20221F", "#8A9B82", "#CBBBA5"],
    reason:
      "A strong main piece and carefully chosen accessories create an elevated evening look.",
  },
  {
    id: "creative-traveller",
    name: "The Creative Nomad",
    tagline: "Made for the unexpected.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
    aesthetic: ["streetwear", "romantic", "future-couture"],
    occasions: ["travel", "weekend", "college"],
    budget: "balanced",
    budgetLabel: "Balanced",
    products: [
      "Expressive layering piece",
      "Relaxed everyday bottoms",
      "Compact statement accessories",
    ],
    colours: ["#A5B99C", "#D5B9A6", "#3C4039"],
    reason:
      "An expressive layer adds personality, while comfortable foundational pieces keep the outfit adaptable.",
  },
];

const STORAGE_KEY = "zyra-personal-stylist-v1";

interface SavedState {
  savedIds: string[];
  aesthetic: Aesthetic;
  occasion: Occasion;
  budget: Budget;
}

function loadSavedState(): SavedState {
  const fallback: SavedState = {
    savedIds: [],
    aesthetic: "minimalist",
    occasion: "college",
    budget: "balanced",
  };

  if (typeof window === "undefined") return fallback;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return fallback;

    const parsed: unknown = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") return fallback;

    const data = parsed as Partial<SavedState>;

    return {
      savedIds: Array.isArray(data.savedIds)
        ? data.savedIds.filter((id): id is string => typeof id === "string")
        : fallback.savedIds,
      aesthetic: aesthetics.some((item) => item.value === data.aesthetic)
        ? (data.aesthetic as Aesthetic)
        : fallback.aesthetic,
      occasion: occasions.some((item) => item.value === data.occasion)
        ? (data.occasion as Occasion)
        : fallback.occasion,
      budget: budgets.some((item) => item.value === data.budget)
        ? (data.budget as Budget)
        : fallback.budget,
    };
  } catch {
    return fallback;
  }
}

export default function PersonalStylist() {
  const [initialState] = useState(loadSavedState);

  const [aesthetic, setAesthetic] = useState<Aesthetic>(
    initialState.aesthetic,
  );

  const [occasion, setOccasion] = useState<Occasion>(
    initialState.occasion,
  );

  const [budget, setBudget] = useState<Budget>(initialState.budget);

  const [savedIds, setSavedIds] = useState<string[]>(
    initialState.savedIds,
  );

  const [results, setResults] = useState<StyleLook[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  function persist(nextSavedIds: string[], nextProfile?: {
    aesthetic: Aesthetic;
    occasion: Occasion;
    budget: Budget;
  }) {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          savedIds: nextSavedIds,
          aesthetic: nextProfile?.aesthetic ?? aesthetic,
          occasion: nextProfile?.occasion ?? occasion,
          budget: nextProfile?.budget ?? budget,
        }),
      );
    } catch {
      // The styling experience still works if browser storage is unavailable.
    }
  }

  function generateLooks() {
    const ranked = looks
      .map((look) => {
        let score = 0;

        if (look.aesthetic.includes(aesthetic)) score += 5;
        if (look.occasions.includes(occasion)) score += 4;

        if (budget === "any" || look.budget === budget) {
          score += 2;
        }

        // Small secondary preference: versatile looks can suit more situations.
        if (look.occasions.length >= 2) score += 0.5;

        return { look, score };
      })
      .sort((a, b) => b.score - a.score);

    const rankedLooks = ranked.slice(0, 3).map((entry) => entry.look);

    setResults(rankedLooks);
    setHasGenerated(true);
    setShowSavedOnly(false);

    persist(savedIds, { aesthetic, occasion, budget });
  }

  function toggleSaved(id: string) {
    const nextSavedIds = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    setSavedIds(nextSavedIds);
    persist(nextSavedIds);
  }

  function showSavedLooks() {
    setShowSavedOnly(true);
    setResults(looks.filter((look) => savedIds.includes(look.id)));
    setHasGenerated(true);
  }

  function resetPreferences() {
    setAesthetic("minimalist");
    setOccasion("college");
    setBudget("balanced");
    setResults([]);
    setHasGenerated(false);
    setShowSavedOnly(false);
  }

  return (
    <section className="ps-section" id="personal-stylist">
      <div className="ps-glow ps-glow-one" aria-hidden="true" />
      <div className="ps-glow ps-glow-two" aria-hidden="true" />

      <div className="ps-container">
        <motion.header
          className="ps-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="ps-eyebrow">
            <WandSparkles size={15} />
            YOUR PERSONAL STYLE ENGINE
          </div>

          <h2>
            Less guessing.
            <br />
            <span>More you.</span>
          </h2>

          <p>
            Tell ZYRA where you're going, the style you love, and what
            you're comfortable spending. Discover outfit ideas that feel
            like you.
          </p>
        </motion.header>

        <div className="ps-workspace">
          <div className="ps-controls">
            <div className="ps-panel-top">
              <div>
                <span className="ps-overline">YOUR STYLE PROFILE</span>
                <h3>Let's find your look.</h3>
              </div>

              <div className="ps-step-badge">01 / 03</div>
            </div>

            <div className="ps-field">
              <div className="ps-field-title">
                <span>01</span>
                <h4>What's your aesthetic?</h4>
              </div>

              <div className="ps-aesthetic-grid">
                {aesthetics.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`ps-aesthetic-option ${
                      aesthetic === item.value ? "ps-option-active" : ""
                    }`}
                    onClick={() => setAesthetic(item.value)}
                    aria-pressed={aesthetic === item.value}
                  >
                    <span>{item.label}</span>
                    <small>{item.description}</small>

                    {aesthetic === item.value && (
                      <Check className="ps-option-check" size={15} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="ps-field">
              <div className="ps-field-title">
                <span>02</span>
                <h4>Where are you headed?</h4>
              </div>

              <div className="ps-occasion-grid">
                {occasions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`ps-occasion-option ${
                      occasion === item.value ? "ps-option-active" : ""
                    }`}
                    onClick={() => setOccasion(item.value)}
                    aria-pressed={occasion === item.value}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ps-field">
              <div className="ps-field-title">
                <span>03</span>
                <h4>What's your budget mood?</h4>
              </div>

              <div className="ps-budget-list">
                {budgets.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    className={`ps-budget-option ${
                      budget === item.value ? "ps-option-active" : ""
                    }`}
                    onClick={() => setBudget(item.value)}
                    aria-pressed={budget === item.value}
                  >
                    <span className="ps-budget-radio">
                      {budget === item.value && (
                        <span className="ps-budget-radio-inner" />
                      )}
                    </span>

                    <span className="ps-budget-copy">
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </span>

                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="ps-generate-button"
              onClick={generateLooks}
            >
              <Sparkles size={17} />
              Discover my looks
              <ArrowRight size={17} />
            </button>

            <p className="ps-privacy-note">
              <Check size={13} />
              Your choices stay in this browser.
            </p>
          </div>

          <div className="ps-results">
            <div className="ps-results-heading">
              <div>
                <span className="ps-overline">
                  {showSavedOnly ? "YOUR COLLECTION" : "THE PERSONAL EDIT"}
                </span>

                <h3>
                  {showSavedOnly
                    ? "Looks you've saved."
                    : hasGenerated
                      ? "Picked for your vibe."
                      : "Your next favourite look."}
                </h3>
              </div>

              <button
                type="button"
                className={`ps-saved-filter ${
                  showSavedOnly ? "ps-saved-filter-active" : ""
                }`}
                onClick={showSavedLooks}
                aria-label="Show saved outfits"
              >
                <Bookmark size={16} />
                <span>{savedIds.length}</span>
              </button>
            </div>

            {!hasGenerated ? (
              <motion.div
                className="ps-empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="ps-empty-art">
                  <div className="ps-empty-ring ps-ring-one" />
                  <div className="ps-empty-ring ps-ring-two" />

                  <div className="ps-empty-icon">
                    <Sparkles size={33} />
                  </div>
                </div>

                <span className="ps-empty-label">A LITTLE STYLE MAGIC</span>

                <h4>Your next look starts here.</h4>

                <p>
                  Choose your aesthetic, occasion, and budget. Your
                  personalised style edit will appear right here.
                </p>

                <button
                  type="button"
                  className="ps-text-button"
                  onClick={generateLooks}
                >
                  Create my first edit <ArrowRight size={15} />
                </button>
              </motion.div>
            ) : results.length === 0 ? (
              <div className="ps-empty-results">
                <div className="ps-empty-results-icon">
                  <Heart size={25} />
                </div>

                <h4>Your collection is ready for its first look.</h4>

                <p>
                  Save an outfit from your recommendations and it will
                  appear here.
                </p>

                <button
                  type="button"
                  className="ps-text-button"
                  onClick={() => {
                    setShowSavedOnly(false);
                    generateLooks();
                  }}
                >
                  Explore recommendations <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${showSavedOnly ? "saved" : "results"}-${results
                    .map((look) => look.id)
                    .join("-")}`}
                  className="ps-look-list"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {results.map((look, index) => {
                    const isSaved = savedIds.includes(look.id);

                    return (
                      <motion.article
                        className="ps-look-card"
                        key={look.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                      >
                        <div className="ps-look-image-wrap">
                          <img
                            src={look.image}
                            alt={`${look.name} fashion inspiration`}
                            className="ps-look-image"
                            loading="lazy"
                          />

                          <span className="ps-look-number">
                            LOOK 0{index + 1}
                          </span>

                          <button
                            type="button"
                            className={`ps-save-button ${
                              isSaved ? "ps-save-button-active" : ""
                            }`}
                            onClick={() => toggleSaved(look.id)}
                            aria-label={
                              isSaved
                                ? `Remove ${look.name} from saved looks`
                                : `Save ${look.name}`
                            }
                            aria-pressed={isSaved}
                          >
                            {isSaved ? (
                              <Check size={17} />
                            ) : (
                              <Bookmark size={17} />
                            )}
                          </button>
                        </div>

                        <div className="ps-look-info">
                          <div className="ps-look-title-row">
                            <div>
                              <h4>{look.name}</h4>
                              <p>{look.tagline}</p>
                            </div>

                            <span className="ps-budget-tag">
                              {look.budgetLabel}
                            </span>
                          </div>

                          <div className="ps-colour-line">
                            {look.colours.map((colour) => (
                              <span
                                key={colour}
                                className="ps-colour-dot"
                                style={{ backgroundColor: colour }}
                                title={colour}
                              />
                            ))}
                          </div>

                          <span className="ps-list-label">
                            THE LOOK FORMULA
                          </span>

                          <ul className="ps-product-list">
                            {look.products.map((product) => (
                              <li key={product}>{product}</li>
                            ))}
                          </ul>

                          <div className="ps-match-note">
                            <Sparkles size={14} />
                            <p>{look.reason}</p>
                          </div>

                          <button
                            type="button"
                            className="ps-look-save-link"
                            onClick={() => toggleSaved(look.id)}
                          >
                            {isSaved ? "Saved to collection" : "Save this look"}
                            {isSaved ? (
                              <Check size={15} />
                            ) : (
                              <Bookmark size={15} />
                            )}
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}

                  <button
                    type="button"
                    className="ps-reset-button"
                    onClick={resetPreferences}
                  >
                    <RefreshCw size={14} />
                    Start a fresh style search
                  </button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="ps-bottom-note">
          <Sparkles size={17} />

          <p>
            <strong>Your style. Your rules.</strong>
            <span>
              These are curated outfit suggestions, not live AI-generated
              results or verified retail products.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}