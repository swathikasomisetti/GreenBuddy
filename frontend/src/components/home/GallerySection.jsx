import "./GallerySection.css";
import { motion } from "framer-motion";

// ------------------------------------------------------------------
// Save 4 DIFFERENT plant photos here: src/assets/home/gallery/
// Each should actually be a photo of the plant it's labeled as —
// reusing one photo for all four reads as fake/broken data.
//
// monstera.jpg     -> Monstera Deliciosa, square-ish crop
// aloe-vera.jpg     -> Aloe Vera, square-ish crop
// snake-plant.jpg   -> Snake Plant, square-ish crop
// hibiscus.jpg      -> Hibiscus, square-ish crop
// ------------------------------------------------------------------
import monsteraImg from "../../assets/home/gallery/monstera.png";
import aloeVeraImg from "../../assets/home/gallery/aloe-vera.png";
import snakePlantImg from "../../assets/home/gallery/snake-plant.png";
import hibiscusImg from "../../assets/home/gallery/hibiscus.png";

const gallery = [
  {
    img: monsteraImg,
    title: "Monstera Deliciosa",
    tag: "Thriving",
    alt: "Monstera deliciosa with split leaves catching afternoon light on a side table",
  },
  {
    img: aloeVeraImg,
    title: "Aloe Vera",
    tag: "Needs Water",
    alt: "Cluster of aloe vera with spiky blue-green leaves in full sun",
  },
  {
    img: snakePlantImg,
    title: "Snake Plant",
    tag: "Excellent",
    alt: "Variegated snake plant with yellow-edged leaves in a ribbed white pot",
  },
  {
    img: hibiscusImg,
    title: "Hibiscus",
    tag: "Blooming",
    alt: "Vivid red hibiscus flower open against dark green foliage",
  },
];

export default function GallerySection() {
  return (
    <section className="gallery">
      <div className="gallery-inner">
        <motion.div
          className="gallery-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="gallery-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="gallery-tag">Community Gardens</span>
          <h2>
            Grown by
            <span>our gardeners.</span>
          </h2>
          <p>
            Real plants, real progress — tended and tracked by the
            GreenBuddy community, one leaf at a time.
          </p>
        </motion.div>

        <div className="gallery-cascade">
          {gallery.map((g, i) => (
            <motion.div
              className={`gallery-card card-${i % 2 === 0 ? "up" : "down"}`}
              key={g.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
            >
              <div className="gallery-circle">
                <img src={g.img} alt={g.alt} />
              </div>
              <span className="gallery-pill">{g.tag}</span>
              <h3>{g.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}