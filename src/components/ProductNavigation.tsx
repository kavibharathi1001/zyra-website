import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import "./ProductNavigation.css";

const navigationItems = [
  { id: "style-discovery", label: "Discover" },
  { id: "infinite-outfit-lab", label: "Outfit Lab" },
  { id: "personal-style-intelligence", label: "Style Intelligence" },
  { id: "virtual-try-on", label: "Virtual Try-On" },
  { id: "fashion-universe", label: "Fashion Universe" },
  { id: "style-multiverse", label: "Style Multiverse" },
  { id: "weekly-style", label: "Weekly Planner" },
  { id: "personal-stylist", label: "Personal Stylist" },
];

export default function ProductNavigation() {
  const [activeId, setActiveId] = useState(navigationItems[0].id);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveId(visibleSection.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -52% 0px",
        threshold: [0.1, 0.3, 0.5, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const activeItem = itemRefs.current[activeId];
    const container = navRef.current;

    if (!activeItem || !container) {
      return;
    }

    const itemLeft = activeItem.offsetLeft;
    const itemWidth = activeItem.offsetWidth;
    const targetLeft = itemLeft - (container.clientWidth - itemWidth) / 2;
    const maxScroll = container.scrollWidth - container.clientWidth;

    container.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScroll)),
      behavior: "smooth",
    });
  }, [activeId]);

  return (
    <nav
      className="product-navigation"
      aria-label="ZYRA product experiences"
    >
      <div className="product-navigation-track" ref={navRef}>
        {navigationItems.map((item, index) => {
          const isActive = activeId === item.id;

          return (
            <a
              key={item.id}
              ref={(node) => {
                itemRefs.current[item.id] = node;
              }}
              href={`#${item.id}`}
              className={`product-nav-item ${isActive ? "is-active" : ""}`}
              aria-current={isActive ? "location" : undefined}
            >
              <span className="product-nav-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="product-nav-label">{item.label}</span>
              {isActive && (
                <motion.span
                  className="product-nav-glow"
                  layoutId="product-nav-glow"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
