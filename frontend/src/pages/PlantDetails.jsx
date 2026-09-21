import "./PlantDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiDroplet,
  FiBookOpen,
  FiEdit3,
  FiExternalLink,
  FiSun,
  FiThermometer,
  FiWind,
  FiMapPin,
  FiHeart,
  FiCloud,
  FiHome,
  FiCpu,
  FiActivity,
  FiSend,
  FiShield,
  FiAlertCircle
} from "react-icons/fi";
import { getPlantById, waterPlant } from "../api/plantApi";
import { predictPlantHealth, askGeneralAI } from "../api/aiApi";
import Navbar from "../components/Navbar";
import { getPlantImage } from "../utils/imageUtils";
// Cute stickers — rotate based on plant ID so each plant feels unique
import sticker1 from "../assets/Sticker1.jpg"; // you grow girl (pothos)
import sticker2 from "../assets/Sticker2.jpg"; // little plant big love (watering can)
import sticker3 from "../assets/Sticker3.jpg"; // hello green (monstera)
import sticker4 from "../assets/Sticker4.jpg"; // reading plant (journal)


// Reused from the dashboard so the whole app sits on the same atmosphere —
// same file as `bgAtmosphereImg` in Dashboard.jsx, not a new asset.
import atmosphereImg from "../assets/dashboard/garden-bokeh.png";

const STICKERS = [sticker1, sticker2, sticker3, sticker4];

// Fallback hero images (used only when plant has no imageUrl)


const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function PlantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [watered, setWatered] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.45]);

  const [aiPrediction, setAiPrediction] = useState(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadPlant();
    loadAiPrediction();
  }, [id]);

  const loadAiPrediction = async () => {
    try {
      const pred = await predictPlantHealth(id);
      setAiPrediction(pred);
    } catch (e) {
      console.log("Prediction unavailable:", e);
    }
  };

  const handleAskAi = async (customQ) => {
    const q = customQ || aiQuestion;
    if (!q || !q.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    try {
      const prompt = `Plant Name: ${plant?.plantName || "Plant"}\nScientific Name: ${plant?.scientificName || "N/A"}\nCategory: ${plant?.category || "Indoor"}\nSunlight: ${plant?.sunlight || "N/A"}\nQuestion: ${q}`;
      const reply = await askGeneralAI(prompt);
      setAiAnswer(reply);
    } catch (e) {
      setAiAnswer("GreenBuddy AI is currently resting. Please ensure backend server is active.");
    } finally {
      setAiLoading(false);
    }
  };

  const loadPlant = async () => {
    try {
      const res = await getPlantById(id);
      setPlant(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWaterToday = async () => {
    try {
      await waterPlant(id);
      setWatered(true);
      loadPlant();
    } catch (e) {
      console.error(e);
    }
  };

  if (!plant) {
    return (
      <>
        <Navbar />
        <div
          className="pd-atmosphere"
          style={{ backgroundImage: `url(${atmosphereImg})` }}
          aria-hidden="true"
        />
        <div className="pd-page">
          <div className="pd-loading-card">
            <div className="pd-loading-spinner" />
            <p>Loading your plant…</p>
          </div>
        </div>
      </>
    );
  }

  // Hero image: prefer uploaded photo, fall back to Unsplash


const heroImage = getPlantImage(plant);

  // Sticker rotates per plant
  const sticker = STICKERS[plant.id % STICKERS.length];
  const cornerSticker = STICKERS[(plant.id + 2) % STICKERS.length];

  // Watering
  let nextWaterDate = null;
  let daysUntilWater = null;
  if (plant.lastWateredDate && plant.wateringFrequency) {
    const d = new Date(plant.lastWateredDate);
    d.setDate(d.getDate() + Number(plant.wateringFrequency));
    nextWaterDate = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const today = new Date(); today.setHours(0, 0, 0, 0); d.setHours(0, 0, 0, 0);
    daysUntilWater = Math.round((d - today) / 86400000);
  }

  // Status
  const statusKey = plant.healthStatus?.toLowerCase();
  const statusClass = statusKey === "healthy" ? "pd-status-healthy"
    : statusKey === "critical" ? "pd-status-critical"
    : "pd-status-attention";

  // Health score
  let healthScore = 100;
  if (statusKey === "needs attention") healthScore = 75;
  if (statusKey === "critical") healthScore = 40;
  if (daysUntilWater !== null && daysUntilWater < 0) healthScore = Math.max(healthScore - 20, 0);

  const healthColor = healthScore >= 80 ? "var(--gb-healthy)" : healthScore >= 50 ? "var(--gb-warning)" : "var(--gb-critical)";

  // Personal note based on status
  const note = statusKey === "healthy"
    ? `${plant.plantName} is doing wonderfully! Keep up your care routine and it'll keep thriving.`
    : statusKey === "needs attention"
    ? `${plant.plantName} needs a little extra love right now. Check the soil and light conditions.`
    : `${plant.plantName} needs urgent care. Consider repotting or checking for pests.`;

  // A short poetic line for the hero, tied to the plant's real status
  const heroQuip = statusKey === "healthy"
    ? "thriving under your care"
    : statusKey === "critical"
    ? "needs you, right now"
    : "asking a little more from you";

  // Days owned
  const daysOwned = plant.createdAt
    ? Math.max(0, Math.round((new Date() - new Date(plant.createdAt)) / 86400000))
    : null;

  const loggedSince = plant.createdAt
    ? new Date(plant.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const detailFields = [
    { label: "Category", value: plant.category, icon: <FiHeart /> },
    { label: "Temperature", value: plant.temperature, icon: <FiThermometer /> },
    { label: "Humidity", value: plant.humidity, icon: <FiWind /> },
    { label: "Sunlight", value: plant.sunlight, icon: <FiSun /> },
    { label: "Soil", value: plant.soil, icon: <FiHome /> },
    { label: "Indoor / Outdoor", value: plant.indoorOutdoor, icon: <FiMapPin /> },
    { label: "Pet Safety", value: plant.petSafety, icon: <FiHeart /> },
  ].filter((f) => f.value);

  const hasAiGuide = plant.commonProblems || plant.careTips || plant.description;

  const wikiHref = plant.wikipediaLink
    || `https://en.wikipedia.org/wiki/${encodeURIComponent(plant.plantName)}`;

  const hasJournalPreview = Boolean(
    plant.latestJournalEntry?.note || plant.latestJournalEntry?.content
  );
  const journalPreviewText = plant.latestJournalEntry?.note || plant.latestJournalEntry?.content;
  const journalPreviewDate = plant.latestJournalEntry?.date
    ? new Date(plant.latestJournalEntry.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <>
      <Navbar />

      {/* Fixed atmosphere layer — the same photographic wash runs behind
          the entire page, exactly like the reference: hero, shelf and the
          sections beneath all sit on one continuous backdrop. */}
      <div
        className="pd-atmosphere"
        style={{ backgroundImage: `url(${atmosphereImg})` }}
        aria-hidden="true"
      />
      <div className="pd-atmosphere-veil" aria-hidden="true" />

      <div className="pd-page">

        {/* ───────────────────────── HERO ───────────────────────── */}
        <section className="pd-hero" ref={heroRef}>
          <motion.p
            className="pd-hero-eyebrow"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <i className="pd-eyebrow-rule" />
            GreenBuddy · Plant Record
          </motion.p>

          <div className="pd-hero-top">
            <motion.div
              className="pd-hero-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
            >
              <h1 className="pd-hero-title">{plant.plantName}</h1>
              {plant.scientificName && (
                <p className="pd-hero-scientific">{plant.scientificName}</p>
              )}
              <div className="pd-badges">
                <span className={`pd-badge ${statusClass}`}>{plant.healthStatus}</span>
                {plant.favorite && <span className="pd-badge pd-badge-fav"><FiHeart /> Favorite</span>}
              </div>
            </motion.div>

            <motion.div
              className="pd-hero-quip"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.25 }}
            >
              <p className="pd-hero-quip-line">— {heroQuip} —</p>
              {daysOwned !== null && (
                <p className="pd-hero-quip-sub">{daysOwned} day{daysOwned === 1 ? "" : "s"} in your care</p>
              )}
            </motion.div>
          </div>

          <motion.p
            className="pd-hero-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            {plant.description || note}
          </motion.p>

          <motion.p
            className="pd-hero-credit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Logged by <strong>GreenBuddy</strong><br />
            {loggedSince ? <>since <strong>{loggedSince}</strong></> : "recently added to your garden"}
          </motion.p>

          {/* Shelf: a single, medium-sized photo with a rounded, scooped
              base — the same silhouette the reference uses to melt the
              hero into the section below. Only one copy of the plant
              photo, not the image repeated across two panels. */}
          <motion.div
            className="pd-shelf"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <motion.div className="pd-shelf-media" style={{ y: heroParallax, opacity: heroFade }}>
              <img src={heroImage} alt={plant.plantName} className="pd-shelf-img" />
              <img src={sticker} alt="" className="pd-shelf-tag" />
              <div className="pd-shelf-scrim" />
              <div className="pd-shelf-caption">
                <FiMapPin /> {plant.location || "Indoor"} · {plant.sunlight || "Sunlight unset"}
              </div>
            </motion.div>

            {/* Floating glass action rail, mirroring the reference's
                right-edge social pill — here it drives real actions. */}
            <div className="pd-rail">
              <button
                className={`pd-rail-btn ${watered ? "pd-rail-btn--done" : ""}`}
                onClick={handleWaterToday}
                disabled={watered}
                title={watered ? "Watered today" : "Mark as watered"}
              >
                <FiDroplet />
              </button>
              <button
                className="pd-rail-btn"
                onClick={() => navigate(`/journal/${plant.id}`)}
                title="Open growth journal"
              >
                <FiBookOpen />
              </button>
              <button
                className="pd-rail-btn"
                onClick={() => navigate(`/edit/${plant.id}`)}
                title="Edit plant"
              >
                <FiEdit3 />
              </button>
              <a
                className="pd-rail-btn"
                href={wikiHref}
                target="_blank"
                rel="noreferrer"
                title="Read on Wikipedia"
              >
                <FiExternalLink />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── CREAM CONTENT SHEET ──────────────────────────────────────
            Everything below the hero photo lives on warm cream paper
            instead of the dark glass panels, so the page reads as two
            deliberate zones — a moody photographic hero, then a bright,
            botanical-postcard record underneath — instead of one long
            wash of the same dark green. */}
        <div className="pd-content-sheet">
          <span className="pd-sheet-notch" aria-hidden="true" />

        {/* ─────────────────── VITALS / STAT STRIP ─────────────────── */}
        <motion.section
          className="pd-panel pd-vitals"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="pd-stat-block pd-stat-block--health">
            <span className="pd-stat-label">Health Score</span>
            <span className="pd-stat-value" style={{ color: healthColor }}>
              {healthScore}<small>/100</small>
            </span>
            <div className="pd-health-bar-mini">
              <div style={{ width: `${healthScore}%`, background: healthColor }} />
            </div>
          </div>

          <div className="pd-stat-block pd-stat-block--water">
            <span className="pd-stat-label">Next Watering</span>
            {nextWaterDate ? (
              <>
                <span className="pd-stat-value pd-stat-value--sm">{nextWaterDate}</span>
                <span className={`pd-water-countdown ${daysUntilWater <= 0 ? "pd-overdue" : ""}`}>
                  {daysUntilWater > 0
                    ? `in ${daysUntilWater} day${daysUntilWater === 1 ? "" : "s"}`
                    : daysUntilWater === 0
                    ? "Today!"
                    : `${Math.abs(daysUntilWater)} day${Math.abs(daysUntilWater) === 1 ? "" : "s"} overdue`}
                </span>
              </>
            ) : (
              <span className="pd-stat-value pd-stat-value--sm">—</span>
            )}
          </div>

          <div className="pd-stat-block">
            <span className="pd-stat-label">Last Watered</span>
            <span className="pd-stat-value pd-stat-value--sm">{plant.lastWateredDate || "Never"}</span>
          </div>

          <div className="pd-stat-block">
            <span className="pd-stat-label">Watering Frequency</span>
            <span className="pd-stat-value pd-stat-value--sm">
              Every {plant.wateringFrequency} {plant.wateringFrequency === 1 ? "day" : "days"}
            </span>
          </div>

          <button
            className={`pd-water-btn ${watered ? "pd-water-btn--done" : ""}`}
            onClick={handleWaterToday}
            disabled={watered}
          >
            {watered ? "Watered today!" : "Mark as Watered"}
          </button>
        </motion.section>

        {/* ─────────────────────── ENVIRONMENT ─────────────────────── */}
        {detailFields.length > 0 && (
          <motion.section
            className="pd-panel"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="pd-section-eyebrow">Environment &amp; Details</p>
            <div className="pd-info-grid">
              {detailFields.map(({ label, value, icon }, i) => (
                <div className={`pd-info-item pd-info-item--${i % 4}`} key={label}>
                  <span className="pd-info-icon">{icon}</span>
                  <span className="pd-info-label">{label}</span>
                  <span className="pd-info-value">{value}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ─────────── AI HEALTH VITALITY & BOTANIST ASSISTANT ─────────── */}
        <motion.section
          className="pd-panel pd-ai-panel"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="pd-ai-panel-header">
            <div>
              <span className="pd-ai-tag">
                <FiCpu /> Machine Learning Vitality Radar
              </span>
              <h3 className="pd-ai-title">Precision Health &amp; Diagnostic Intelligence</h3>
            </div>
            <button
              className="pd-ai-scan-btn"
              onClick={() => navigate("/ai-doctor")}
            >
              🩺 Open AI Leaf Doctor
            </button>
          </div>

          {aiPrediction ? (
            <div className="pd-ai-prediction-grid">
              <div className="pd-ai-score-card">
                <div className="pd-ai-score-ring">
                  <span className="pd-ai-score-num">{aiPrediction.healthScore}</span>
                  <span className="pd-ai-score-label">Health Index</span>
                </div>
                <div className="pd-ai-score-details">
                  <span className={`pd-ai-status-pill status-${aiPrediction.statusBadgeColor}`}>
                    {aiPrediction.vitalityLevel} Vitality
                  </span>
                  <h4>Watering Urgency: {aiPrediction.wateringUrgency}</h4>
                  <p>{aiPrediction.aiRecommendation}</p>
                </div>
              </div>

              <div className="pd-ai-risks-card">
                <div className="pd-risk-row">
                  <div className="pd-risk-label">
                    <span>Dehydration Risk</span>
                    <strong>{aiPrediction.dehydrationRiskPercent}%</strong>
                  </div>
                  <div className="pd-risk-bar">
                    <div
                      className="pd-risk-fill pd-risk-dehydration"
                      style={{ width: `${aiPrediction.dehydrationRiskPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pd-risk-row">
                  <div className="pd-risk-label">
                    <span>Overwatering Risk</span>
                    <strong>{aiPrediction.overwateringRiskPercent}%</strong>
                  </div>
                  <div className="pd-risk-bar">
                    <div
                      className="pd-risk-fill pd-risk-overwater"
                      style={{ width: `${aiPrediction.overwateringRiskPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pd-ai-action-tip">
                  <strong>Recommended Action:</strong> {aiPrediction.recommendedAction}
                </div>
              </div>
            </div>
          ) : (
            <div className="pd-ai-loading">
              <FiActivity className="spin-icon" /> Calculating real-time hydration curves...
            </div>
          )}

          {/* Interactive In-Context AI Care Companion */}
          <div className="pd-ai-ask-box">
            <h4 className="pd-ask-title">🌿 Ask GreenBuddy AI About {plant.plantName}</h4>
            <div className="pd-prompt-chips">
              <button
                type="button"
                onClick={() => handleAskAi("Why are the leaf tips turning brown or crispy?")}
              >
                🍂 Brown or crisp leaf tips?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("Is this plant toxic or safe for cats and dogs?")}
              >
                🐾 Safe for pets?
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("How do I propagate and prune this plant safely?")}
              >
                ✂️ Pruning & propagation guide
              </button>
              <button
                type="button"
                onClick={() => handleAskAi("What is the best fertilizer and repotting schedule?")}
              >
                🌱 Fertilizer & repotting schedule
              </button>
            </div>

            <div className="pd-ask-input-row">
              <input
                type="text"
                placeholder={`Ask any specific question about caring for your ${plant.plantName}...`}
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
              />
              <button
                type="button"
                onClick={() => handleAskAi()}
                disabled={aiLoading}
              >
                {aiLoading ? "Consulting..." : <><FiSend /> Ask AI</>}
              </button>
            </div>

            {aiAnswer && (
              <div className="pd-ai-answer-card">
                <div className="pd-ai-answer-header">
                  <span>🤖 GreenBuddy Botanist Response:</span>
                </div>
                <div className="pd-ai-answer-content">
                  {aiAnswer}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* ────────────────────── AI CARE ADVICE ────────────────────── */}
        {hasAiGuide && (
          <motion.section
            className="pd-panel"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <p className="pd-section-eyebrow">AI Care Advice</p>
            <div className="pd-care-guide">
              {plant.commonProblems && (
                <div className="pd-guide-item pd-guide-item--clay">
                  <h4>Common Problems</h4>
                  <p>{plant.commonProblems}</p>
                </div>
              )}
              {plant.careTips && (
                <div className="pd-guide-item pd-guide-item--moss">
                  <h4>Care Tips</h4>
                  <p>{plant.careTips}</p>
                </div>
              )}
              {plant.description && (
                <div className="pd-guide-item pd-guide-item--gold">
                  <h4>About this Plant</h4>
                  <p>{plant.description}</p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* ───────────── FERTILIZER SCHEDULE + WEATHER REC ───────────── */}
        <motion.section
          className="pd-dual-grid"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="pd-panel pd-dual-card pd-dual-card--moss">
            <p className="pd-section-eyebrow"><FiDroplet /> Fertilizer Schedule</p>
            <p className="pd-dual-body">
              {plant.fertilizerSchedule
                || "No fertilizer schedule set yet — add one from the edit screen to keep this plant on a steady feeding rhythm."}
            </p>
          </div>

          <div className="pd-panel pd-dual-card pd-dual-card--sky">
            <p className="pd-section-eyebrow"><FiCloud /> Weather Recommendation</p>
            <p className="pd-dual-body">
              {plant.weatherRecommendation
                || `No live weather guidance yet. In the meantime, keep ${plant.plantName} out of direct temperature swings and drafts.`}
            </p>
          </div>
        </motion.section>

        {/* ───────────────────── GROWTH JOURNAL PREVIEW ───────────────────── */}
        <motion.section
          className="pd-panel pd-journal-card"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <p className="pd-section-eyebrow"><FiBookOpen /> Growth Journal</p>
          {hasJournalPreview ? (
            <>
              {journalPreviewDate && <p className="pd-journal-date">{journalPreviewDate}</p>}
              <p className="pd-journal-preview-text">{journalPreviewText}</p>
            </>
          ) : (
            <p className="pd-journal-empty">
              No journal entries yet. Start logging {plant.plantName}'s growth, milestones and photos.
            </p>
          )}
          <button className="pd-action-btn pd-btn-journal" onClick={() => navigate(`/journal/${plant.id}`)}>
            Open Growth Journal
          </button>
        </motion.section>

        {/* ─────────────────────────── ACTIONS ─────────────────────────── */}
        <motion.div
          className="pd-action-row"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <a
            href={wikiHref}
            target="_blank"
            rel="noreferrer"
            className="pd-action-btn pd-btn-wiki"
          >
            <FiExternalLink /> Read on Wikipedia
          </a>
          <button className="pd-action-btn pd-btn-journal" onClick={() => navigate(`/journal/${plant.id}`)}>
            <FiBookOpen /> Open Growth Journal
          </button>
          <button className="pd-action-btn pd-btn-edit" onClick={() => navigate(`/edit/${plant.id}`)}>
            <FiEdit3 /> Edit Plant
          </button>
        </motion.div>

        <img src={cornerSticker} alt="" className="pd-corner-sticker" />
        </div>
      </div>
    </>
  );
}

export default PlantDetails;