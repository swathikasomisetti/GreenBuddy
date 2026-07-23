import "./EncyclopediaSection.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const species = [
  "Monstera",
  "Aloe Vera",
  "Snake Plant",
  "Pothos",
  "Fiddle Leaf Fig",
  "Peace Lily",
  "ZZ Plant",
  "Succulents",
];

export default function EncyclopediaSection() {
  return (
    <section className="encyclopedia">
      <motion.div
        className="encyclopedia-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className="encyclopedia-tag">PLANT ENCYCLOPEDIA</span>
        <h2>
          Over 3,000 species,
          <span> one search away.</span>
        </h2>
        <p>
          Look up care guides, toxicity warnings, ideal light, and common
          issues for thousands of plant species — all backed by AI.
        </p>

        <div className="encyclopedia-search">
          <Search size={18} />
          <input type="text" placeholder="Search a plant species..." />
        </div>

        <div className="encyclopedia-chips">
          {species.map((s) => (
            <Link to="/encyclopedia" key={s} className="chip">
              {s}
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}