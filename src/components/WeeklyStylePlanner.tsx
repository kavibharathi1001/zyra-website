import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Sparkles,
} from "lucide-react";
import "./WeeklyStylePlanner.css";

const weeklyLooks = [
  {
    day: "MON",
    fullDay: "Monday",
    occasion: "THE WORKDAY",
    title: "Quiet confidence.",
    description:
      "Start the week with a polished look that feels effortless, comfortable, and completely you.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85",
    items: ["Structured blazer", "Straight-leg trousers", "Minimal sneakers"],
    palette: ["#D7C8B5", "#343B32", "#EAE6DD"],
    mood: "Polished · Confident · Effortless",
    tip: "Keep your silhouette clean and use one neutral colour as your foundation.",
  },
  {
    day: "TUE",
    fullDay: "Tuesday",
    occasion: "CAMPUS DAYS",
    title: "Casual, never ordinary.",
    description:
      "Build an everyday outfit around comfortable layers, versatile essentials, and one standout detail.",
    image:
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=85",
    items: ["Relaxed overshirt", "Classic denim", "Everyday trainers"],
    palette: ["#8E9D8B", "#D5C3AA", "#292D2A"],
    mood: "Relaxed · Fresh · Expressive",
    tip: "Use contrasting textures to make simple basics feel more considered.",
  },
  {
    day: "WED",
    fullDay: "Wednesday",
    occasion: "COFFEE & CONNECTIONS",
    title: "Meet me somewhere.",
    description:
      "A balanced, relaxed outfit for spontaneous coffee plans, creative meetings, and city afternoons.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=85",
    items: ["Soft knitwear", "Tailored denim", "Layered accessories"],
    palette: ["#D6BEB3", "#B7A58E", "#F0E9E0"],
    mood: "Approachable · Modern · Natural",
    tip: "One thoughtfully chosen accessory can make an uncomplicated outfit memorable.",
  },
  {
    day: "THU",
    fullDay: "Thursday",
    occasion: "THE CREATIVE DAY",
    title: "Think outside the fit.",
    description:
      "Combine unexpected shapes and confident layers for a look that communicates personality.",
    image:
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85",
    items: ["Statement outerwear", "Relaxed trousers", "Bold footwear"],
    palette: ["#2B302B", "#A7B89A", "#D6D3C9"],
    mood: "Creative · Bold · Individual",
    tip: "Try one statement piece, then keep the rest of the outfit balanced.",
  },
  {
    day: "FRI",
    fullDay: "Friday",
    occasion: "AFTER-HOURS",
    title: "Make an entrance.",
    description:
      "Transition from daytime plans to evening energy with stronger silhouettes and considered details.",
    image:
      "https://images.unsplash.com/photo-1566206091559-0f622955f7bc?auto=format&fit=crop&w=1200&q=85",
    items: ["Statement top", "Dark tailored trousers", "Sculptural accessories"],
    palette: ["#171A18", "#7B8B76", "#D3C4AD"],
    mood: "Confident · Refined · Magnetic",
    tip: "Change your accessories or outer layer to make a familiar outfit feel evening-ready.",
  },
  {
    day: "SAT",
    fullDay: "Saturday",
    occasion: "OFF-DUTY",
    title: "Your rules. Your weekend.",
    description:
      "Make room for comfort, colour, and the pieces you love wearing when nobody sets the dress code.",
    image:
      "https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&w=1200&q=85",
    items: ["Relaxed statement piece", "Comfort-first bottoms", "Favourite accessories"],
    palette: ["#B9C9AF", "#D6B9A9", "#E8E2D7"],
    mood: "Playful · Relaxed · Authentic",
    tip: "Start with the piece you most want to wear and build the rest around it.",
  },
  {
    day: "SUN",
    fullDay: "Sunday",
    occasion: "SLOW LIVING",
    title: "Softness looks good on you.",
    description:
      "Finish the week with breathable fabrics, gentle colours, and an outfit that feels as good as it looks.",
    image:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=85",
    items: ["Soft everyday layers", "Lightweight trousers", "Simple jewellery"],
    palette: ["#D8CDBB", "#A9B9A5", "#F1ECE4"],
    mood: "Comfortable · Calm · Timeless",
    tip: "Choose pieces that work together naturally instead of overcomplicating the combination.",
  },
];

export default function WeeklyStylePlanner() {
  const [activeDay, setActiveDay] = useState(0);
  const [plannedDays, setPlannedDays] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("zyra_planned_days_v1");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const look = weeklyLooks[activeDay];
  const isPlanned = plannedDays.includes(activeDay);

  function togglePlannedDay() {
    setPlannedDays((previous) => {
      const next = previous.includes(activeDay)
        ? previous.filter((day) => day !== activeDay)
        : [...previous, activeDay];
      try {
        localStorage.setItem("zyra_planned_days_v1", JSON.stringify(next));
        window.dispatchEvent(new Event("zyra-saved-updated"));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <section className="weekly-planner" id="weekly-style">
      <div className="wp-orb wp-orb-one" aria-hidden="true" />
      <div className="wp-orb wp-orb-two" aria-hidden="true" />

      <div className="wp-container">
        <motion.div
          className="wp-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <div className="wp-eyebrow">
            <CalendarDays size={15} />
            <span>YOUR LIFE, YOUR LOOKBOOK</span>
          </div>

          <h2>
            Seven days.
            <br />
            <span>A new feeling every day.</span>
          </h2>

          <div className="wp-header-bottom">
            <p>
              College in the morning. Coffee with friends. A last-minute plan.
              Explore a week of outfit inspiration, designed around the many
              ways you show up in the world.
            </p>

            <div className="wp-week-count">
              <span>YOUR WEEK</span>
              <strong>07</strong>
              <span>DAYS OF POSSIBILITY</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="wp-day-selector"
          role="group"
          aria-label="Choose a day to explore"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {weeklyLooks.map((item, index) => (
            <button
              key={item.day}
              type="button"
              className={`wp-day-button ${
                activeDay === index ? "wp-day-active" : ""
              }`}
              onClick={() => setActiveDay(index)}
              aria-pressed={activeDay === index}
            >
              <span className="wp-day-name">{item.day}</span>
              <span className="wp-day-dot">
                {plannedDays.includes(index) ? <Check size={12} /> : null}
              </span>
            </button>
          ))}
        </motion.div>

        <div className="wp-experience">
          <div className="wp-image-column">
            <AnimatePresence mode="wait">
              <motion.div
                className="wp-image-frame"
                key={look.day}
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.35 }}
              >
                <img
                  src={look.image}
                  alt={`${look.fullDay} fashion inspiration`}
                  className="wp-fashion-image"
                />

                <div className="wp-image-overlay" />

                <div className="wp-image-topline">
                  <span>ZYRA / STYLE FILE</span>
                  <span>{look.day} — 07</span>
                </div>

                <div className="wp-image-caption">
                  <span>{look.occasion}</span>
                  <h3>{look.title}</h3>
                  <p>{look.fullDay}, reimagined.</p>
                </div>

                <div className="wp-image-index">
                  <span>{String(activeDay + 1).padStart(2, "0")}</span>
                  <span className="wp-index-line" />
                  <span>07</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="wp-details-column">
            <AnimatePresence mode="wait">
              <motion.div
                key={look.day}
                className="wp-look-details"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="wp-details-kicker">
                  <Sparkles size={14} />
                  <span>THE DAILY EDIT</span>
                </div>

                <span className="wp-current-day">
                  {look.fullDay.toUpperCase()}
                </span>

                <h3>{look.title}</h3>

                <p className="wp-description">{look.description}</p>

                <div className="wp-detail-divider" />

                <span className="wp-detail-label">THE OUTFIT FORMULA</span>

                <div className="wp-items-list">
                  {look.items.map((item, index) => (
                    <div className="wp-item" key={item}>
                      <span className="wp-item-number">
                        0{index + 1}
                      </span>
                      <span>{item}</span>
                      <ArrowUpRight size={15} />
                    </div>
                  ))}
                </div>

                <span className="wp-detail-label wp-palette-label">
                  THE COLOUR STORY
                </span>

                <div className="wp-palette-row">
                  <div className="wp-colour-swatches">
                    {look.palette.map((color) => (
                      <span
                        key={color}
                        className="wp-colour-swatch"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  <span className="wp-mood">{look.mood}</span>
                </div>

                <div className="wp-style-tip">
                  <Sparkles size={16} />
                  <div>
                    <strong>ZYRA'S STYLE NOTE</strong>
                    <p>{look.tip}</p>
                  </div>
                </div>

                <button
                  className={`wp-plan-button ${
                    isPlanned ? "wp-plan-button-saved" : ""
                  }`}
                  type="button"
                  onClick={togglePlannedDay}
                >
                  {isPlanned ? (
                    <>
                      <Check size={17} />
                      Added to my week
                    </>
                  ) : (
                    <>
                      Plan this outfit
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="wp-footer"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="wp-footer-left">
            <div className="wp-footer-icon">
              <Sparkles size={19} />
            </div>

            <div>
              <span>YOUR WEEK, YOUR WAY</span>
              <p>
                {plannedDays.length === 0
                  ? "Pick the looks you love. Build your own style week."
                  : `${plannedDays.length} of 7 days added to your demo plan.`}
              </p>
            </div>
          </div>

          <a href="#personal-stylist" className="wp-footer-link">
            Discover my style <ArrowDownRight size={17} />
          </a>
        </motion.div>

        <p className="wp-disclaimer">
          A curated styling preview. Personalised AI recommendations and
          wardrobe-based planning require product integration.
        </p>
      </div>
    </section>
  );
}