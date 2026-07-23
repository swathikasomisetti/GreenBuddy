import "./JournalPreview.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ------------------------------------------------------------------
// Save 3 DIFFERENT photos here: src/assets/home/journal/
// Each should match its post's actual topic — reusing one photo
// for all three reads as fake/broken data.
//
// repotting-aloe.jpg     -> aloe vera being repotted / roots visible
// leaf-diagnosis.jpg     -> a leaf showing yellowing or discoloration
// windowsill-garden.jpg  -> plants on a low-light windowsill/shelf
//
// Good free sources: unsplash.com, pexels.com
// ------------------------------------------------------------------
import repottingImg from "../../assets/home/journal/repotting-aloe.png";
import leafImg from "../../assets/home/journal/leaf-diagnosis.png";
import windowsillImg from "../../assets/home/journal/windowsill-garden.png";

const posts = [
  {
    img: repottingImg,
    kicker: "Repotting",
    date: "MAY 12, 2025",
    readTime: "4 min read",
    title: "5 Signs Your Aloe Vera Needs Repotting",
    excerpt:
      "Roots peeking through drainage holes are only the beginning — here's what else to watch for.",
  },
  {
    img: leafImg,
    kicker: "Diagnosis",
    date: "APR 28, 2025",
    readTime: "5 min read",
    title: "Reading Leaf Color Like a Pro",
    excerpt:
      "Yellowing, browning, or pale new growth all tell a different story about your plant's health.",
  },
  {
    img: windowsillImg,
    kicker: "Low-Light Setup",
    date: "APR 09, 2025",
    readTime: "6 min read",
    title: "Building a Low-Light Windowsill Garden",
    excerpt:
      "No south-facing window? These species will still thrive with just a few hours of light.",
  },
];

export default function JournalPreview() {
  return (
    <section className="journal">
      <div className="journal-accent" aria-hidden="true" />

      <Link to="/journal" className="journal-link">
        View all articles <span>→</span>
      </Link>

      <motion.div
        className="journal-head"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="journal-kicker">From the</span>
        <h2>Notes on growing well.</h2>
        <svg
          className="journal-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21c-4-1-8-5-8-11 4 0 8 2 8 6 0-4 4-6 8-6 0 6-4 10-8 11Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M12 21V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </motion.div>

      <div className="journal-grid">
        {posts.map((p, i) => (
          <motion.article
            className="journal-card"
            key={p.title}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
          >
            <span className="journal-kicker-label">{p.kicker}</span>

            <div className="journal-img">
              <img src={p.img} alt={p.title} />
              <div className="journal-img-fade" />
              <h3>{p.title}</h3>
            </div>

            <div className="journal-meta">
              <span>{p.date}</span>
              <span className="meta-dot" />
              <span>{p.readTime}</span>
            </div>
            <p>{p.excerpt}</p>
          </motion.article>
        ))}
      </div>

      <div className="journal-footer">
        <span>Written with care by the GreenBuddy team</span>
        <span className="journal-hashtags">
          #PlantJournal &nbsp; #GrowWithGreenBuddy
        </span>
      </div>
    </section>
  );
}