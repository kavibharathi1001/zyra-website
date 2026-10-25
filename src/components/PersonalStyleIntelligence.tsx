import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import "./PersonalStyleIntelligence.css";

type StyleOption = {
  id: string;
  name: string;
  description: string;
  image: string;
  profile: string;
  advice: string;
};

type Question = {
  eyebrow: string;
  title: string;
  description: string;
  options: StyleOption[];
};

const questions: Question[] = [
  {
    eyebrow: "YOUR AESTHETIC",
    title: "Which world feels like you?",
    description:
      "Choose the visual direction you naturally gravitate towards.",
    options: [
      {
        id: "minimal",
        name: "Minimalist",
        description: "Less, but better.",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
        profile: "The Modern Minimalist",
        advice:
          "Build around versatile essentials, clean silhouettes, and a restrained color palette.",
      },
      {
        id: "streetwear",
        name: "Streetwear",
        description: "Make your own rules.",
        image:
          "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80",
        profile: "The Urban Original",
        advice:
          "Experiment with proportions, layered pieces, statement sneakers, and unexpected combinations.",
      },
      {
        id: "classic",
        name: "Old Money",
        description: "Quietly sophisticated.",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
        profile: "The Quiet Sophisticate",
        advice:
          "Explore tailored pieces, timeless accessories, textured fabrics, and understated neutrals.",
      },
      {
        id: "sporty",
        name: "Sporty",
        description: "Comfort meets energy.",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
        profile: "The Active Original",
        advice:
          "Combine functional layers, comfortable fabrics, and athletic details with everyday essentials.",
      },
      {
        id: "experimental",
        name: "Experimental",
        description: "Unexpected by design.",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
        profile: "The Creative Visionary",
        advice:
          "Explore expressive shapes, contrasting textures, unexpected colors, and statement pieces.",
      },
    ],
  },
  {
    eyebrow: "YOUR COLOR STORY",
    title: "What catches your eye?",
    description:
      "Select the palette you would most enjoy wearing.",
    options: [
      {
        id: "neutrals",
        name: "Earth & Neutrals",
        description: "Cream, brown, charcoal.",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80",
        profile: "Earth & Neutrals",
        advice:
          "Start with cream, beige, brown, black, and charcoal for easy color coordination.",
      },
      {
        id: "monochrome",
        name: "Monochrome",
        description: "Black, white, grey.",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
        profile: "Monochrome",
        advice:
          "Create contrast with light and dark tones, then introduce interest through texture.",
      },
      {
        id: "color",
        name: "Color Forward",
        description: "Expressive, vibrant tones.",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80",
        profile: "Color Forward",
        advice:
          "Try one standout color with complementary neutrals before experimenting with color blocking.",
      },
      {
        id: "nature",
        name: "Nature Inspired",
        description: "Olive, moss, muted green.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
        profile: "Nature Inspired",
        advice:
          "Pair greens with cream, warm brown, denim, and natural textures.",
      },
    ],
  },
  {
    eyebrow: "YOUR DAILY ENERGY",
    title: "How do you want to feel?",
    description:
      "Think about the feeling you want your outfits to communicate.",
    options: [
      {
        id: "confident",
        name: "Confident",
        description: "Present and powerful.",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=80",
        profile: "Confident",
        advice:
          "Try defined silhouettes, intentional proportions, and one strong focal point in each look.",
      },
      {
        id: "effortless",
        name: "Effortless",
        description: "Relaxed and natural.",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
        profile: "Effortless",
        advice:
          "Prioritize comfortable fits, wearable layers, and versatile pieces you can style repeatedly.",
      },
      {
        id: "creative",
        name: "Creative",
        description: "Curious and expressive.",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
        profile: "Creative",
        advice:
          "Make space for personal details, unusual combinations, and pieces that tell a story.",
      },
      {
        id: "polished",
        name: "Polished",
        description: "Intentional and refined.",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
        profile: "Polished",
        advice:
          "Pay attention to fit, fabric, finishing details, and the balance between your outfit's pieces.",
      },
    ],
  },
];

export default function PersonalStyleIntelligence() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const question = questions[step];
  const currentAnswer = answers[step];

  const selectedOptions = answers.map((answer, index) =>
    questions[index].options.find((option) => option.id === answer)
  );

  const primaryStyle = selectedOptions[0];
  const colorStory = selectedOptions[1];
  const dailyEnergy = selectedOptions[2];

  const progress = finished
    ? 100
    : ((step + 1) / questions.length) * 100;

  function chooseOption(id: string) {
    setAnswers((previous) => {
      const next = previous.slice(0, step);
      next[step] = id;
      return next;
    });
  }

  function nextStep() {
    if (!currentAnswer) return;

    if (step < questions.length - 1) {
      setStep((previous) => previous + 1);
    } else {
      setFinished(true);
    }
  }

  function previousStep() {
    if (finished) {
      setFinished(false);
      return;
    }

    if (step > 0) {
      setStep((previous) => previous - 1);
    }
  }

  function restartQuiz() {
    setStep(0);
    setAnswers([]);
    setFinished(false);
  }

  return (
    <section
      className="psi-section"
      id="personal-style-intelligence"
    >
      <div className="psi-container">
        <div className="psi-topline">
          <div className="psi-eyebrow">
            <Sparkles size={15} />
            PERSONAL STYLE INTELLIGENCE
          </div>

          <span className="psi-index">03 / THE DISCOVERY</span>
        </div>

        <div className="psi-intro">
          <h2>
            Your style.
            <br />
            <span>Your signature.</span>
          </h2>

          <p>
            Great style starts with knowing yourself.
            Answer three quick questions and explore a
            style direction inspired by your choices.
          </p>
        </div>

        <div className="psi-card">
          <div className="psi-card-header">
            <div className="psi-progress-label">
              <span>
                {finished
                  ? "YOUR STYLE PROFILE"
                  : `CHAPTER 0${step + 1}`}
              </span>

              <span>
                {finished
                  ? "COMPLETE"
                  : `${step + 1} OF ${questions.length}`}
              </span>
            </div>

            <div
              className="psi-progress-track"
              role="progressbar"
              aria-label="Style quiz progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <motion.div
                className="psi-progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={`question-${step}`}
                className="psi-question"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28 }}
              >
                <div className="psi-question-heading">
                  <span>{question.eyebrow}</span>

                  <h3>{question.title}</h3>

                  <p>{question.description}</p>
                </div>

                <div className="psi-options">
                  {question.options.map((option, index) => {
                    const selected =
                      currentAnswer === option.id;

                    return (
                      <button
                        type="button"
                        key={option.id}
                        className={`psi-option ${
                          selected ? "is-selected" : ""
                        }`}
                        onClick={() =>
                          chooseOption(option.id)
                        }
                        aria-pressed={selected}
                      >
                        <div className="psi-option-image">
                          <img
                            src={option.image}
                            alt=""
                            loading="lazy"
                          />

                          <span className="psi-option-number">
                            0{index + 1}
                          </span>

                          <span className="psi-option-check">
                            <Check size={15} />
                          </span>
                        </div>

                        <div className="psi-option-copy">
                          <strong>{option.name}</strong>

                          <span>{option.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="style-result"
                className="psi-result"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div className="psi-result-visual">
                  <img
                    src={primaryStyle?.image}
                    alt="Your selected style inspiration"
                  />

                  <div className="psi-result-overlay" />

                  <div className="psi-result-badge">
                    <Sparkles size={14} />
                    YOUR STYLE DIRECTION
                  </div>

                  <div className="psi-result-title">
                    <span>YOUR SIGNATURE</span>

                    <h3>
                      {primaryStyle?.profile ??
                        "Your Personal Style"}
                    </h3>
                  </div>
                </div>

                <div className="psi-result-details">
                  <span className="psi-result-kicker">
                    A PROFILE INSPIRED BY YOUR CHOICES
                  </span>

                  <h4>
                    A little more you.
                    <br />
                    A lot more intentional.
                  </h4>

                  <p>
                    {primaryStyle?.advice}
                  </p>

                  <div className="psi-result-tags">
                    {[
                      colorStory?.profile,
                      dailyEnergy?.profile,
                    ]
                      .filter(Boolean)
                      .map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                  </div>

                  <div className="psi-result-actions">
                    <a href="#virtual-try-on" className="psi-action-cta">
                      <span>Try pieces in Studio</span>
                      <ArrowRight size={15} />
                    </a>
                    <a href="#personal-stylist" className="psi-action-secondary">
                      <span>Curate in Stylist</span>
                      <Sparkles size={14} />
                    </a>
                    <button
                      type="button"
                      className="psi-restart"
                      onClick={restartQuiz}
                    >
                      <RotateCcw size={14} />
                      Discover another direction
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!finished && (
            <div className="psi-navigation">
              <button
                type="button"
                className="psi-back"
                onClick={previousStep}
                disabled={step === 0}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="button"
                className="psi-next"
                onClick={nextStep}
                disabled={!currentAnswer}
              >
                {step === questions.length - 1
                  ? "Reveal my style"
                  : "Continue"}

                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>

        <div className="psi-bottomline">
          <span>THREE QUESTIONS. A NEW PERSPECTIVE.</span>
          <span>CREATED AROUND YOU.</span>
        </div>
      </div>
    </section>
  );
}