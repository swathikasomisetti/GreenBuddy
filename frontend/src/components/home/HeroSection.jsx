import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import "./HeroSection.css";

// ------------------------------------------------------------------
// Save your images inside: src/assets/home/hero/
//
// image1.jpg  -> full-bleed blurred greenhouse background photo
//                (warm sunlight through glass, dark olive tones)
// image2.jpg  -> macro close-up of a leaf / plant branch
//                (fills the large circular photograph in the panel)
// ------------------------------------------------------------------
import bgPhoto from "../../assets/home/hero/image1.png";
import leafPhoto from "../../assets/home/hero/image2.png";

const navItems = ["Home", "Plants", "Journal"];

export default function HeroSection() {
  const heroRef = useRef(null);

  // Global mouse-parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 50, damping: 20 });
  const springY = useSpring(my, { stiffness: 50, damping: 20 });

  const bgX = useTransform(springX, [-1, 1], ["-2%", "2%"]);
  const bgY = useTransform(springY, [-1, 1], ["-2%", "2%"]);
  const circleX = useTransform(springX, [-1, 1], ["-10px", "10px"]);
  const circleY = useTransform(springY, [-1, 1], ["-8px", "8px"]);

  function handleMouseMove(e) {
    const rect = heroRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(nx);
    my.set(ny);
  }

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dayLabel = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <section className="ghero" ref={heroRef} onMouseMove={handleMouseMove}>
      {/* ============ BACKGROUND ============ */}
      <motion.div
        className="ghero-bg"
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      >
        <img src={bgPhoto} alt="" aria-hidden="true" />
      </motion.div>
      <div className="ghero-vignette" />
      <div className="ghero-grain" />
      <div className="ghero-streak streak-a" />
      <div className="ghero-streak streak-b" />

      <div className="ghero-particles">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${12 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* ============ TOP BAR ============ */}
      <motion.div
        className="ghero-topbar"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
      >
        <div className="ghero-toplabel">
          <span>Daily</span>
          <span>AI plant journal</span>
        </div>

        <nav className="ghero-pill-nav" aria-label="Primary">
          {navItems.map((item, i) => (
            <Link to="/" key={item} className="pill-nav-item">
              {item}
              {i < navItems.length - 1 && <i className="pill-nav-dot" />}
            </Link>
          ))}
        </nav>

        <div className="ghero-brand">
          <span className="brand-badge">G</span>
          <div className="brand-text">
            <span>Special</span>
            <span>collaboration</span>
          </div>
        </div>
      </motion.div>

      {/* ============ CENTER SASH PANEL ============ */}
      <motion.div
        className="ghero-panel"
        initial={{ opacity: 0, scaleY: 0.85 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
      >
        <span className="panel-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <div className="panel-left">
          <motion.span
            className="signature-script"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            GreenBuddy
          </motion.span>
          <motion.span
            className="signature-date"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
          >
            {dateLabel}
          </motion.span>
          <motion.div
            className="panel-stat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
          >
            <svg
              className="panel-stat-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21c-4-1-8-5-8-11 4 0 8 2 8 6 0-4 4-6 8-6 0 6-4 10-8 11Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M12 21V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span>
              <b>1,204</b> plants cared for
            </span>
          </motion.div>
        </div>

        <motion.div
          className="panel-circle"
          style={{ x: circleX, y: circleY }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="circle-frame"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <img src={leafPhoto} alt="Macro photograph of a monstera leaf" />
            <div className="circle-glow" />
            <div className="circle-glass" />
          </motion.div>
        </motion.div>

        <div className="panel-right">
          <motion.h1
            className="panel-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            Your Digital
            <br />
            Greenhouse.
          </motion.h1>

          <motion.p
            className="panel-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
          >
            An intelligent greenhouse that reads every leaf — care
            recommendations, health scoring, and growth tracking, tuned to
            each plant you own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
          >
            <Link to="/register" className="panel-cta">
              Get Started
              <span className="panel-cta-arrow">→</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* ============ BOTTOM ROW ============ */}
      <motion.div
        className="ghero-bottomrow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <div className="bottomrow-side bottomrow-left">
          <span className="bottomrow-line" />
          <span>Made with GreenBuddy</span>
        </div>
        <div className="bottomrow-side bottomrow-right">
          <span className="bottomrow-line" />
          <span>GreenBuddy &mdash; {dayLabel}</span>
        </div>
      </motion.div>
    </section>
  );
}