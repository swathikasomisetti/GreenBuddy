import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { getPlants, getJournalEntries } from "../api/plantApi";
import "./JournalHome.css";
import { getPlantImage } from "../utils/imageUtils";
import journalHeroBg from "../assets/backgrounds/journal-hero.jpg";


const HERO_BG = journalHeroBg;


function getLatestEntry(plant, fetchedEntries) {
  if (Array.isArray(fetchedEntries) && fetchedEntries.length > 0) {
    return fetchedEntries[0];
  }
  return (
    plant.latestJournalEntry ||
    plant.latestEntry ||
    (Array.isArray(plant.journalEntries) ? plant.journalEntries[0] : null)
  );
}

function getSummary(plant, fetchedEntries) {
  const entry = getLatestEntry(plant, fetchedEntries);
  return (
    entry?.excerpt ||
    entry?.summary ||
    entry?.note?.slice(0, 90) ||
    entry?.content?.slice(0, 90) ||
    plant.summary ||
    "No entries yet — this page is still blank, waiting on you."
  );
}

function getMood(plant, fetchedEntries) {
  const entry = getLatestEntry(plant, fetchedEntries);
  return entry?.mood || plant.mood || "🌱 Growing steady";
}

function getWateringStatus(plant) {
  return (
    plant.wateringStatus ||
    (plant.lastWatered ? `Last watered ${plant.lastWatered}` : "Watered recently")
  );
}

function getHealthLabel(plant) {
  return plant.healthStatus || plant.status || "Healthy";
}

function getEntryCount(plant, fetchedEntries) {
  if (Array.isArray(fetchedEntries)) return fetchedEntries.length;
  if (Array.isArray(plant.journalEntries)) return plant.journalEntries.length;
  if (typeof plant.entryCount === "number") return plant.entryCount;
  return getLatestEntry(plant) ? 1 : 0;
}

function getAllEntryDates(plants, entriesByPlant) {
  const dates = new Set();
  plants.forEach((p) => {
    const fetched = entriesByPlant[p.id];
    if (Array.isArray(fetched) && fetched.length > 0) {
      fetched.forEach((e) => {
        const d = e?.entryDate || e?.date;
        if (d) dates.add(d);
      });
      return;
    }
    if (Array.isArray(p.journalEntries)) {
      p.journalEntries.forEach((e) => {
        const d = e?.entryDate || e?.date;
        if (d) dates.add(d);
      });
    }
  });
  return dates;
}

function getCurrentStreak(plants, entriesByPlant) {
  const dateSet = getAllEntryDates(plants, entriesByPlant);
  if (dateSet.size === 0) return 0;
  const parsed = Array.from(dateSet)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (parsed.length === 0) return 0;

  const dayKey = (d) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const daySet = new Set(parsed.map(dayKey));

  let streak = 0;
  const cursor = new Date();
  while (daySet.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const QUOTES = [
  "Adopt the pace of nature: her secret is patience.",
  "A garden is a grand teacher — it teaches patience above all.",
  "Slow down, breathe, and let the roots do their quiet work.",
  "Growth is quiet. Check in often, and rush nothing.",
  "Every leaf unfurling is a small, patient act of faith.",
  "Water, light, time — the only recipe that never fails.",
];

function getDailyQuote() {
  const day = new Date().getDate();
  return QUOTES[day % QUOTES.length];
}

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function JournalHome() {
  const [plants, setPlants] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [entriesByPlant, setEntriesByPlant] = useState({});
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  useEffect(() => {
    getPlants()
      .then(async (res) => {
        const list = res.data || [];
        setPlants(list);
        setLoaded(true);

        // The plant list endpoint doesn't embed journal entries, so pull
        // each plant's real entries the same way the notebook page does.
        try {
          const pairs = await Promise.all(
            list.map((p) =>
              getJournalEntries(p.id)
                .then((r) => [p.id, r.data || []])
                .catch(() => [p.id, []])
            )
          );
          setEntriesByPlant(Object.fromEntries(pairs));
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoaded(true);
      });
  }, []);

  const cardLeft = plants[0];
  const cardRight = plants[1];
  const restOfGarden = useMemo(() => plants.slice(0), [plants]);
  const totalEntries = useMemo(
    () => plants.reduce((sum, p) => sum + getEntryCount(p, entriesByPlant[p.id]), 0),
    [plants, entriesByPlant]
  );
  const streak = useMemo(
    () => getCurrentStreak(plants, entriesByPlant),
    [plants, entriesByPlant]
  );
  const quote = useMemo(() => getDailyQuote(), []);

  const openJournal = (id) => navigate(`/journal/${id}`);

  return (
    <>
      <Navbar />

      <div className="journal-page">
        <section className="journal-hero" ref={heroRef}>
          <motion.div
            className="journal-hero-bg"
            style={{ backgroundImage: `url(${HERO_BG})`, y: bgY }}
            aria-hidden="true"
          />
          <div className="journal-hero-scrim" aria-hidden="true" />
          <div className="journal-hero-grain" aria-hidden="true" />

          <div className="journal-hero-inner">
            <motion.div
              className="journal-hero-content"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="journal-hero-eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                Field log
              </p>
              <h1 className="journal-hero-title">
                My Journal<span className="journal-hero-period">.</span>
              </h1>
              <p className="journal-hero-sub">
                Pick a plant to open its notebook — write an update, attach a
                photo, watch the story build over time.
              </p>

              {loaded && plants.length === 0 && (
                <div className="journal-empty journal-empty--hero">
                  <p>No plants yet. Add one to start your first journal page.</p>
                </div>
              )}
            </motion.div>

            {loaded && plants.length > 0 && (
              <motion.div className="journal-card-stack" style={{ y: cardsY }}>
                {cardLeft && (
                  <motion.article
                    className="tag-card tag-card--left"
                    initial={{ opacity: 0, x: -30, rotate: -4 }}
                    animate={{ opacity: 1, x: 0, rotate: -4 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -10, rotate: -1, transition: { duration: 0.3 } }}
                    onClick={() => openJournal(cardLeft.id)}
                  >
                    <span className="tag-card-notch" aria-hidden="true" />
                    <div className="tag-card-photo">
                    <img src={getPlantImage(cardLeft)} alt={cardLeft.plantName} />
                      <span className="tag-card-badge">{getHealthLabel(cardLeft)}</span>
                    </div>
                    <div className="tag-card-info">
                      <span className="tag-card-eyebrow">Latest page</span>
                      <h3>{cardLeft.plantName}</h3>
                      <p>{getSummary(cardLeft, entriesByPlant[cardLeft.id])}</p>
                      <span className="tag-card-cta">
                        Open journal <FiArrowUpRight />
                      </span>
                    </div>
                  </motion.article>
                )}

                <motion.article
                  className="tag-card tag-card--center"
                  initial={{ opacity: 0, y: 26, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -12, transition: { duration: 0.35 } }}
                >
                  <span className="tag-card-notch tag-card-notch--gold" aria-hidden="true" />
                  <span className="tag-card-seal" aria-hidden="true">
                    🌿
                  </span>
                  <span className="tag-card-eyebrow">Today · {todayLabel}</span>
                  <h2 className="tag-card-title">My Journal</h2>

                  <div className="tag-card-stats">
                    <div className="tag-card-stat">
                      <span className="stat-value">{plants.length}</span>
                      <span className="stat-label">Plants</span>
                    </div>
                    <div className="tag-card-stat">
                      <span className="stat-value">{totalEntries}</span>
                      <span className="stat-label">Entries</span>
                    </div>
                    <div className="tag-card-stat">
                      <span className="stat-value">{streak}</span>
                      <span className="stat-label">Day streak</span>
                    </div>
                  </div>

                  <p className="tag-card-quote">“{quote}”</p>
                </motion.article>

                {cardRight && (
                  <motion.article
                    className="tag-card tag-card--right"
                    initial={{ opacity: 0, x: 30, rotate: 4 }}
                    animate={{ opacity: 1, x: 0, rotate: 4 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -10, rotate: 1, transition: { duration: 0.3 } }}
                    onClick={() => openJournal(cardRight.id)}
                  >
                    <span className="tag-card-notch" aria-hidden="true" />
                    <div className="tag-card-photo">
                     <img src={getPlantImage(cardRight)} alt={cardRight.plantName} />
                      <span className="tag-card-badge">{getHealthLabel(cardRight)}</span>
                    </div>
                    <div className="tag-card-info">
                      <span className="tag-card-eyebrow">Latest page</span>
                      <h3>{cardRight.plantName}</h3>
                      <p>{getSummary(cardRight, entriesByPlant[cardRight.id])}</p>
                      <span className="tag-card-cta">
                        Open journal <FiArrowUpRight />
                      </span>
                    </div>
                  </motion.article>
                )}
              </motion.div>
            )}
          </div>
        </section>

        <main className="journal-home-main">
          {plants.length > 0 && (
            <>
              <div className="journal-section-heading">
                <span className="journal-hero-eyebrow">
                  <span className="eyebrow-rule" aria-hidden="true" />
                  Growth timeline
                </span>
                <h2>Every plant has a page.</h2>
              </div>

              <div className="journal-plant-grid">
                {restOfGarden.map((plant, i) => (
                  <motion.div
                    key={plant.id}
                    className="journal-plant-tile"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: (i % 6) * 0.06, ease: "easeOut" }}
                    whileHover={{ y: -6 }}
                    onClick={() => openJournal(plant.id)}
                  >
                    <div className="journal-plant-tile-media">
                       <img
    src={getPlantImage(plant)}
    alt={plant.plantName}
/>
                    </div>
                    <div className="journal-plant-tile-overlay">
                      <span className="journal-plant-tile-badge">{getHealthLabel(plant)}</span>
                      <h3>{plant.plantName}</h3>
                      <p>{getSummary(plant, entriesByPlant[plant.id])}</p>
                      <span className="journal-plant-tile-cta">
                        Open notebook <FiArrowUpRight />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default JournalHome;