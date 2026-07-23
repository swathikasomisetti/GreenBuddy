import "./CTASection.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="cta">
      <motion.div
        className="cta-inner"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="cta-tag">START GROWING TODAY</span>
        <h2>
          Your garden deserves
          <span> a digital brain.</span>
        </h2>
        <p>
          Join thousands of gardeners already using GreenBuddy to keep
          every plant healthy, hydrated, and thriving.
        </p>

        <div className="cta-buttons">
          <Link to="/register">
            <button className="primary-btn">Get Started Free</button>
          </Link>
          <Link to="/login">
            <button className="secondary-btn">Explore Garden</button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}