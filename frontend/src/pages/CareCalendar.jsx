import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getPlantImage } from "../utils/imageUtils";
import {
  FiDroplet,
  FiFeather,
  FiCamera,
  FiSun,
  FiWind,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import { getPlants } from "../api/plantApi";
import { getCalendarEvents } from "../api/calendarApi";

import "./CareCalendar.css";

// ─── 12 monthly photos ───────────────────────────────────────────────────────
// Place all images inside  src/assets/calendar/
import janImg from "../assets/calendar/first.jpg";
import febImg from "../assets/calendar/second.jpg";
import marImg from "../assets/calendar/third.jpg";
import aprImg from "../assets/calendar/fourth.jpg";
import mayImg from "../assets/calendar/fifth.jpg";
import junImg from "../assets/calendar/sixth.jpg";
import julImg from "../assets/calendar/seventh.jpg";
import augImg from "../assets/calendar/eighth.jpg";
import sepImg from "../assets/calendar/ninth.jpg";
import octImg from "../assets/calendar/tenth.jpg";
import novImg from "../assets/calendar/eleventh.jpg";
import decImg from "../assets/calendar/twelth.jpg";

const MONTH_DATA = [
  { name: "January", flower: "Cherry Blossom", img: janImg },
  { name: "February", flower: "Water Lily", img: febImg },
  { name: "March", flower: "Lavender", img: marImg },
  { name: "April", flower: "Tulip", img: aprImg },
  { name: "May", flower: "Rose", img: mayImg },
  { name: "June", flower: "White Lily", img: junImg },
  { name: "July", flower: "Cosmos", img: julImg },
  { name: "August", flower: "Monstera", img: augImg },
  { name: "September", flower: "Daisy", img: sepImg },
  { name: "October", flower: "Sunflower", img: octImg },
  { name: "November", flower: "White Tulip", img: novImg },
  { name: "December", flower: "White Poppy", img: decImg },
];

const SEASON_BY_MONTH = [
  "Winter", "Winter", "Spring", "Spring", "Spring", "Summer",
  "Summer", "Summer", "Autumn", "Autumn", "Autumn", "Winter",
];

const SEASONAL_INSIGHTS = [
  "January stays slow — cut back watering and let plants rest through the cold.",
  "February's longer light wakes early growers. Watch for the first new leaves.",
  "March swings unpredictably. Ease plants back into a fuller watering rhythm.",
  "April showers outdoors, but indoor pots still need a manual hand.",
  "May's warmth accelerates growth — this is peak feeding season.",
  "June heat means faster soil drying. Check moisture more often.",
  "High temperatures increase evaporation. Water outdoor plants early morning, before the sun peaks.",
  "August sun is intense — give leafy plants some afternoon shade.",
  "September's cooling means growth slows. Start easing off fertilizer.",
  "October light fades fast. Move sun-lovers closer to windows.",
  "November calls for less water and more patience — dormancy is near.",
  "December is for rest. Keep soil just barely moist and let your garden sleep.",
];


// ─── tiny icons ──────────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <polyline
        points="1.5,5 4,7.5 8.5,2"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function eventKind(title = "") {
  const t = title.toLowerCase();
  if (t.includes("fertiliz")) return { icon: <FiFeather />, label: "Fertilize" };
  if (t.includes("repot")) return { icon: <FiRefreshCw />, label: "Repot" };
  if (t.includes("bloom")) return { icon: <FiSun />, label: "Bloom" };
  if (t.includes("photo") || t.includes("journal")) return { icon: <FiCamera />, label: "Journal" };
  return { icon: <FiDroplet />, label: "Water" };
}

// ─── Task row ────────────────────────────────────────────────────────────────
function TaskRow({ event, variant, done, onToggle }) {
  const kind = eventKind(event.title);
  return (
    <div className={`cc-task cc-task--${variant}${done ? " cc-task--done" : ""}`}>
      <div className={`cc-task__icon cc-task__icon--${variant}`}>{kind.icon}</div>
      <div className="cc-task__body">
        <span className="cc-task__name">{event.title}</span>
        <span className="cc-task__sub">
          {variant === "overdue" ? "Needs attention now" : `${kind.label} today`}
        </span>
      </div>
      <button
        className={`cc-task__check${done ? " cc-task__check--done" : ""}`}
        onClick={() => onToggle(event.plantId)}
        aria-label={done ? "Mark undone" : "Mark done"}
      >
        {done && <CheckIcon />}
      </button>
    </div>
  );
}

// ─── Health ring ─────────────────────────────────────────────────────────────
function HealthRing({ healthy, total }) {
  const pct = total > 0 ? Math.round((healthy / total) * 100) : 0;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (pct / 100) * circ;
  return (
    <div className="cc-ring">
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="#2a3d1e" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="#d3a55b"
          strokeWidth="8"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="cc-ring__label">{pct}%</div>
    </div>
  );
}

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────
function Skeleton({ lines = 3 }) {
  return (
    <div className="cc-skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="cc-skeleton__line" style={{ width: i % 2 === 0 ? "80%" : "60%" }} />
      ))}
    </div>
  );
}

// ─── Scroll-to-bottom FAB ─────────────────────────────────────────────────────
function ScrollFab() {
  const scrollDown = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  return (
    <button className="cc-fab" onClick={scrollDown} aria-label="Scroll down">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <polyline points="4,7 9,12 14,7" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function CareCalendar() {
  const navigate = useNavigate();
  const calRef = useRef(null);

  const [plants, setPlants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [completed, setCompleted] = useState(() => new Set());

  // track which month photo is "active" for the fade / page-flip animation
  const [activeImg, setActiveImg] = useState(MONTH_DATA[new Date().getMonth()]);
  const [imgFading, setImgFading] = useState(false);
  const [flipDir, setFlipDir] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pr, er] = await Promise.all([getPlants(), getCalendarEvents()]);
      setPlants(pr.data);
      setEvents(er.data);
    } catch (err) {
      console.error("CareCalendar:", err);
    } finally {
      setLoading(false);
    }
  };

  // smooth page-flip when month changes
  const changeMonthImg = (newMonth) => {
    if (newMonth === calMonth) return;
    const forward = newMonth > calMonth || (calMonth === 11 && newMonth === 0);
    setFlipDir(forward ? 1 : -1);
    setImgFading(true);
    setTimeout(() => {
      setActiveImg(MONTH_DATA[newMonth]);
      setCalMonth(newMonth);
      setImgFading(false);
    }, 300);
  };

  const toggleDone = (plantId) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(plantId)) next.delete(plantId);
      else next.add(plantId);
      return next;
    });
  };

  // ── derived ──────────────────────────────────────────────────────────────
  const overdueEvents = useMemo(() => events.filter((e) => e.status === "OVERDUE"), [events]);
  const todayEvents = useMemo(() => events.filter((e) => e.status === "TODAY"), [events]);
  const upcomingEvents = useMemo(() => events.filter((e) => e.status === "UPCOMING"), [events]);

  const calendarEvents = useMemo(
    () =>
      events.map((e) => ({
        id: String(e.plantId),
        title: e.title,
        start: e.start,
        backgroundColor: e.color,
        borderColor: e.color,
        textColor: "#fff",
      })),
    [events]
  );

  const totalPlants = plants.length;
  const overdueCount = overdueEvents.length;
  const todayCount = todayEvents.length;
  const healthyCount = totalPlants - overdueCount;
  const needsWaterCount = overdueCount + todayCount;
  const completedCount = completed.size;

  const featuredPlant = plants[0];
const gallery = useMemo(
  () => plants.filter((p) => p.imageUrl || p.photoUrl || p.image).slice(0, 6),
  [plants]
);

  const handleEventClick = (info) => navigate(`/plant/${info.event.id}`);
  const handleDatesSet = (info) => changeMonthImg(info.view.currentStart.getMonth());

  const firstOverdue = overdueEvents[0];
  const waterNow = () => {
    if (firstOverdue) navigate(`/plant/${firstOverdue.plantId}`);
  };

  const aiMessage =
    overdueCount > 0
      ? `${overdueCount} plant${overdueCount > 1 ? "s are" : " is"} overdue for water — take care of ${
          overdueCount > 1 ? "those first" : "that first"
        }, everything else can wait.`
      : todayCount > 0
      ? `Nothing overdue. ${todayCount} plant${todayCount > 1 ? "s" : ""} on today's list — a calm day in the garden.`
      : "Every plant is on schedule. A perfect day to just enjoy the garden.";

  const monthLabel = `${activeImg.name} ${new Date().getFullYear()}`;
  const seasonLabel = SEASON_BY_MONTH[calMonth];
  const insightText = SEASONAL_INSIGHTS[calMonth];

  return (
    <>
      <Navbar />

      <div className="cal-page">
        <div className="cal-bg" style={{ backgroundImage: `url(${activeImg.img})` }} aria-hidden="true" />
        <div className="cal-scrim" aria-hidden="true" />
        <div className="cal-grain" aria-hidden="true" />

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="cal-hero">
          <p className="cal-eyebrow">
            <span className="eyebrow-rule" aria-hidden="true" />
            Botanical planner
          </p>
          <h1 className="cal-hero-title">{monthLabel}</h1>
          <p className="cal-hero-quote">“The best time to water a plant is before it asks.”</p>

          <div className="cal-hero-chips">
            <span className="cal-chip">
              <FiSun /> {seasonLabel}
            </span>
            <span className="cal-chip cal-chip--weather">
              <FiWind /> Mild &amp; breezy
            </span>
            {featuredPlant && (
              <span className="cal-chip cal-chip--featured">🌿 Featured: {featuredPlant.plantName}</span>
            )}
          </div>
        </section>

        <div className="cal-body">
          {/* ══════════════════════ MAIN COLUMN ══════════════════════ */}
          <div className="cal-main">
            {/* ── Clipped month card ── */}
            <div className="cal-month-card">
              <span className="cal-clip" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg.name}
                  className="cal-month-card__inner"
                  initial={{ rotateX: flipDir * -85, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: flipDir * 85, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "top center" }}
                >
                  <img
                    src={activeImg.img}
                    alt={activeImg.flower}
                    className={`cal-month-card__img${imgFading ? " cal-month-card__img--fade" : ""}`}
                  />
                  <div className="cal-month-card__scrim" />
                  <span className="cal-month-card__month-pill">{activeImg.name}</span>
                  <span className="cal-month-card__flower-pill">{activeImg.flower}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Calendar grid ── */}
            <div className="cal-grid-card">
              {loading ? (
                <div className="cc-cal-loading">
                  <span className="cc-spinner" />
                  <p>Loading your garden…</p>
                </div>
              ) : (
                <FullCalendar
                  ref={calRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  height="auto"
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  datesSet={handleDatesSet}
                  dayMaxEvents={2}
                  fixedWeekCount={false}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                  }}
                />
              )}

              <div className="cc-legend">
                <span className="cc-legend__item">
                  <span className="cc-dot cc-dot--upcoming" /> Upcoming
                </span>
                <span className="cc-legend__item">
                  <span className="cc-dot cc-dot--today" /> Today
                </span>
                <span className="cc-legend__item">
                  <span className="cc-dot cc-dot--overdue" /> Overdue
                </span>
              </div>
            </div>

            {/* ── Plant timeline ── */}
            <div className="cal-card cal-timeline-card">
              <h3 className="cal-card__head">Plant timeline</h3>
              {loading ? (
                <Skeleton lines={4} />
              ) : overdueEvents.length + todayEvents.length + upcomingEvents.length === 0 ? (
                <div className="cc-empty">
                  <span>🌤️</span>
                  <p>No upcoming tasks — enjoy the calm.</p>
                </div>
              ) : (
                <div className="cal-timeline">
                  {[...overdueEvents, ...todayEvents, ...upcomingEvents].map((e) => {
                    const kind = eventKind(e.title);
                    const statusKey = e.status.toLowerCase();
                    return (
                      <div className="cal-timeline__row" key={`${e.plantId}-${e.start}`}>
                        <span className={`cal-timeline__dot cal-timeline__dot--${statusKey}`}>{kind.icon}</span>
                        <div className="cal-timeline__body">
                          <span className="cal-timeline__title">{e.title}</span>
                          <span className="cal-timeline__date">
                            {new Date(e.start).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <span className={`cal-timeline__status cal-timeline__status--${statusKey}`}>
                          {e.status === "OVERDUE" ? "Overdue" : e.status === "TODAY" ? "Today" : "Upcoming"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Monthly gallery ── */}
            <div className="cal-card cal-gallery-card">
              <h3 className="cal-card__head">Monthly gallery</h3>
              {gallery.length === 0 ? (
                <p className="cal-gallery-empty">
                  Your gallery fills up as you add photos to each plant's journal.
                </p>
              ) : (
                <div className="cal-gallery-grid">
                  {gallery.map((p) => {
                    const src = getPlantImage(p);
                    return (
                      <motion.div
                        className="cal-gallery-item"
                        key={p.id}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate(`/journal/${p.id}`)}
                      >
                        <img src={src} alt={p.plantName} />
                        <span className="cal-gallery-label">{p.plantName}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════ SIDEBAR ══════════════════════ */}
          <aside className="cal-sidebar">
            {/* Monthly overview */}
            <div className="cal-card cal-overview-card">
              <h3 className="cal-card__head">Botanical monthly overview</h3>
              {loading ? (
                <Skeleton lines={3} />
              ) : (
                <div className="cal-overview-grid">
                  <div className="cal-overview-stat">
                    <span className="cal-overview-value">{totalPlants}</span>
                    <span className="cal-overview-label">Total plants</span>
                  </div>
                  <div className="cal-overview-stat">
                    <span className="cal-overview-value">{needsWaterCount}</span>
                    <span className="cal-overview-label">Need water</span>
                  </div>
                  <div className="cal-overview-stat">
                    <span className="cal-overview-value">{completedCount}</span>
                    <span className="cal-overview-label">Completed</span>
                  </div>
                  <div className="cal-overview-stat">
                    <span className="cal-overview-value">{upcomingEvents.length}</span>
                    <span className="cal-overview-label">Reminders</span>
                  </div>
                </div>
              )}
              <div className="cal-overview-health">
                <HealthRing healthy={healthyCount} total={totalPlants} />
                <span className="cal-overview-health-label">Garden health score</span>
              </div>
            </div>

            {/* Today's garden */}
            <div className="cal-card">
              <h3 className="cal-card__head">Today's garden</h3>
              <div className="cal-today-weather">
                <FiWind /> <span>Mild &amp; breezy — a good watering day</span>
              </div>

              {loading ? (
                <Skeleton lines={3} />
              ) : todayEvents.length === 0 && overdueEvents.length === 0 ? (
                <div className="cc-empty">
                  <span>🌤️</span>
                  <p>Nothing needs attention today!</p>
                </div>
              ) : (
                <>
                  {overdueEvents.map((e) => (
                    <TaskRow
                      key={e.plantId}
                      event={e}
                      variant="overdue"
                      done={completed.has(e.plantId)}
                      onToggle={toggleDone}
                    />
                  ))}
                  {todayEvents.map((e) => (
                    <TaskRow
                      key={e.plantId}
                      event={e}
                      variant="today"
                      done={completed.has(e.plantId)}
                      onToggle={toggleDone}
                    />
                  ))}
                </>
              )}

              <p className="cal-ai-line">
                <FiFeather /> {aiMessage}
              </p>

              {firstOverdue && (
                <button className="cal-water-btn" onClick={waterNow}>
                  <FiDroplet /> Water now <FiArrowRight />
                </button>
              )}
            </div>

            {/* Seasonal insights */}
            <div className="cal-card cal-insight-card">
              <h3 className="cal-card__head">Seasonal insights · {activeImg.name}</h3>
              <p className="cal-insight-text">{insightText}</p>
            </div>
          </aside>
        </div>

        {/* ── AI planner floating card ── */}
        <motion.div
          className="cal-ai-float"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="cal-ai-float__badge">AI Planner</span>
          <p>{aiMessage}</p>
        </motion.div>

        {/* scroll FAB */}
        <ScrollFab />
      </div>
    </>
  );
}

export default CareCalendar;