import "./GreenHouseSection.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import greenhouseImg from "../../assets/home/hero/greenhouse.png";

const points = [
  "Build a virtual replica of your real garden or greenhouse",
  "Arrange plants freely and track their exact position",
  "Get per-plant AI insights, not generic advice",
];

export default function GreenHouseSection() {
  return (
    <section className="ghs">
      <motion.div
        className="ghs-image"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img src={greenhouseImg} alt="Digital Greenhouse" />
        <div className="ghs-image-glow" />
      </motion.div>

      <motion.div
        className="ghs-text"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="ghs-tag">YOUR DIGITAL GREENHOUSE</span>
        <h2>
          A living map of
          <span> every plant you own.</span>
        </h2>
        <p>
          GreenBuddy turns your real garden into an interactive digital
          twin. Place each plant where it actually lives, and let the
          system track light, water, and health individually.
        </p>

        <ul className="ghs-points">
          {points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>

        <Link to="/register">
          <button className="primary-btn">Build My Greenhouse</button>
        </Link>
      </motion.div>
    </section>
  );
}
