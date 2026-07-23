import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PlantCard from "../components/PlantCard";
import PlantAnalytics from "../components/PlantAnalytics";
import WeatherCard from "../components/WeatherCard";
import { getPlants, getProfile } from "../api/plantApi";
import "./Dashboard.css";

// ── Garden photography used across the dashboard ──
import heroImg from "../assets/dashboard/18.jpg";
import promoImg from "../assets/dashboard/4.png";
import alertAccentImg from "../assets/dashboard/5.png";

// weatherBgImg + scheduleBgImg now crossfade into ONE continuous photo
// backdrop behind the merged "Today in your garden" panel (Weather +
// Insights + Care calendar), instead of only sitting behind Weather.
// cactusBg is still the backdrop for the full plant collection below.
//   porch-doorway.jpg  -> leafy porch/doorway shot (top half of the panel)
//   garden-patio.jpg   -> wooden chairs + autumn leaves (bottom half)
//   potted-cacti.jpg   -> three potted cacti against a terracotta wall
import weatherBgImg from "../assets/dashboard/1.jpg";
import scheduleBgImg from "../assets/dashboard/13.jpg";
import cactusBg from "../assets/dashboard/4.png";

const CATEGORIES = ["All categories", "Indoor", "Outdoor", "Succulent"];
const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "healthy", label: "Healthy" },
  { key: "water", label: "Needs water" },
  { key: "attention", label: "Needs attention" },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ── Minimal line icons ──
const IconLeaf = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M4 20c8 0 15-6 16-16C10 5 4 11 4 20Z" />
    <path d="M4 20c3-6 7-10 13-13" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.5" />
  </svg>
);
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z" />
  </svg>
);
const IconSeed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M12 21c-4.5-1-8-4.8-8-10 5.2 0 9 3.5 10 8" />
    <path d="M12 21c4.5-1 8-4.8 8-10-5.2 0-9 3.5-10 8" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 10" width="20" height="10" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M0 5h22M17 1l5 4-5 4" />
  </svg>
);
const IconDrop = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

/**
 * Counts a number up from 0 to `target` on mount / whenever target changes.
 * The stat numbers are the first thing the eye lands on in the overview
 * row, so a quick eased count-up makes that first read feel alive instead
 * of the page just "appearing" with numbers already in it.
 */
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const to = Number(target) || 0;
    if (to === 0) {
      setValue(0);
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

/**
 * One overview card: icon, animated count, label, description, and a
 * progress bar showing that stat's real share of the total collection
 * (not an invented "+12% this week" — we don't have historical data to
 * back that up, so it isn't shown).
 */
function StatCard({ stat, index }) {
  const count = useCountUp(stat.value);
  return (
    <div
      className={`overview-card ${stat.flagged ? "overview-flagged" : ""}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="overview-icon">{stat.icon}</span>
      <h3>{count}</h3>
      <span className="overview-card-label">{stat.label}</span>
      <p className="overview-card-desc">{stat.desc}</p>
      <div className="overview-bar" aria-hidden="true">
        <div className="overview-bar-fill" style={{ width: `${stat.pct}%` }} />
      </div>
    </div>
  );
}

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadPlants();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadPlants = async () => {
    try {
      const response = await getPlants();
      setPlants(response.data);
    } catch (error) {
      console.error("Error loading plants:", error);
    }
  };

  const healthyPlants = plants.filter(
    (p) => p.healthStatus?.toLowerCase() === "healthy"
  ).length;

  const needsWater = plants.filter(
    (p) => Number(p.wateringFrequency) <= 3
  ).length;

  const today = new Date();
  const todayLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const withNextWater = plants
    .filter((p) => p.lastWateredDate && p.wateringFrequency)
    .map((plant) => {
      const wateredDate = new Date(plant.lastWateredDate);
      const daysSince = Math.floor((today - wateredDate) / (1000 * 60 * 60 * 24));
      const daysUntilDue = Number(plant.wateringFrequency) - daysSince;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + Math.max(daysUntilDue, 0));
      return { plant, daysUntilDue, nextDate };
    });

  const overduePlants = withNextWater
    .filter((p) => p.daysUntilDue <= 0)
    .map((p) => p.plant);

  const upcomingSchedule = [...withNextWater]
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .slice(0, 5);

  const filteredPlants = plants.filter((plant) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      search === "" ||
      plant.plantName?.toLowerCase().includes(search) ||
      plant.scientificName?.toLowerCase().includes(search) ||
      plant.location?.toLowerCase().includes(search) ||
      plant.healthStatus?.toLowerCase().includes(search);

    let matchesFilter = true;
    let matchesCategory = true;

    if (categoryFilter !== "All categories") {
      matchesCategory =
        plant.category?.toLowerCase() === categoryFilter.toLowerCase();
    }
    if (filter === "healthy") {
      matchesFilter = plant.healthStatus?.toLowerCase() === "healthy";
    }
    if (filter === "water") {
      matchesFilter = Number(plant.wateringFrequency) <= 3;
    }
    if (filter === "attention") {
      matchesFilter = plant.healthStatus?.toLowerCase() !== "healthy";
    }

    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Every value here is real, derived straight from `plants` — `pct` is
  // each stat's actual share of the collection, used for the mini
  // progress bar on the card (guarded against divide-by-zero pre-load).
  const totalForPct = plants.length || 1;
  const stats = [
    {
      label: "Total Plants",
      desc: "Every plant you're currently growing and tracking.",
      value: plants.length,
      icon: <IconLeaf />,
      pct: plants.length ? 100 : 0,
    },
    {
      label: "Healthy",
      desc: "Plants showing no signs of stress or disease.",
      value: healthyPlants,
      icon: <IconCheck />,
      pct: Math.round((healthyPlants / totalForPct) * 100),
    },
    {
      label: "Need Watering",
      desc: "On a watering cycle of 3 days or less.",
      value: needsWater,
      icon: <IconDroplet />,
      pct: Math.round((needsWater / totalForPct) * 100),
    },
    {
      label: "Need Attention",
      desc: "Flagged as needing care beyond routine watering.",
      value: plants.length - healthyPlants,
      icon: <IconSeed />,
      pct: Math.round(((plants.length - healthyPlants) / totalForPct) * 100),
    },
    {
      label: "Water Due",
      desc: "Overdue for their next watering, right now.",
      value: overduePlants.length,
      icon: <IconClock />,
      flagged: overduePlants.length > 0,
      pct: Math.round((overduePlants.length / totalForPct) * 100),
    },
  ];

  return (
    <>
      {/* Single navbar — the app-wide one. */}
      <Navbar />

      <div className="dashboard-wrapper">

        {/* ── HERO ── */}
        <section className="hero-wrap">
          <div className="hero-masthead">
            <img src={heroImg} alt="" className="hero-photo" />
            <div className="hero-scrim" />

            <div className="hero-plate">
              <h1 className="hero-title">Plant Dashboard</h1>
              <p className="hero-sub">
                Manage your plants, track watering schedules, and monitor
                health — all in one record.
              </p>
            </div>

            <div className="hero-figure">
              <span className="hero-figure-name">
                Welcome back{profile?.name ? `, ${profile.name}` : ""}
              </span>
              <span className="hero-figure-date">{todayLabel}</span>
            </div>

            <div className="hero-tear" />
          </div>
        </section>

        {/* ── PROMO PANEL — "your digital greenhouse" ── */}
        <section className="promo-panel">
          <div className="promo-photo-frame">
            <img src={promoImg} alt="" />
          </div>
          <div className="promo-copy">
            <p className="promo-eyebrow">
              <i className="promo-dots">•••</i> Your digital greenhouse
            </p>
            <h2 className="promo-title">Every leaf, one record.</h2>
            <p className="promo-text">
              GreenBuddy reads your care history and turns it into simple,
              per-plant guidance — so nothing gets forgotten between waterings.
            </p>
            <ul className="promo-list">
              <li>Track watering, health, and location for every plant</li>
              <li>See who's due for water before it becomes urgent</li>
              <li>Get weather-aware care advice, not generic tips</li>
            </ul>
            <a
              className="promo-cta"
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View your collection <IconArrow />
            </a>
          </div>
        </section>

        {/* ── OVERVIEW STATS — dark forest panel, gold badge cards, each
            with an animated count and a real proportion bar. ── */}
        <section className="overview-section">
          <div className="overview-inner">
            <span className="overview-badge">Overview</span>
            <h2 className="overview-title">
              Everything about
              <br />
              <em>your garden, at a glance.</em>
            </h2>

            <div className="overview-grid">
              {stats.map((s, i) => (
                <StatCard stat={s} index={i} key={s.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ── TODAY IN YOUR GARDEN — Weather, Insights, and the watering
            calendar now live in ONE continuous panel instead of three
            separate boxes. Two garden photos crossfade top-to-bottom
            (porch light easing into golden-hour greenhouse light) so
            every section here sits on the same backdrop, at the same
            width as the rest of the page. ── */}
        <section className="atmosphere-panel" id="today">
          <div
            className="atmosphere-bg atmosphere-bg-a"
            style={{ backgroundImage: `url(${weatherBgImg})` }}
          />
          <div
            className="atmosphere-bg atmosphere-bg-b"
            style={{ backgroundImage: `url(${scheduleBgImg})` }}
          />
          <div className="atmosphere-scrim" />

          <div className="atmosphere-inner">
            <div className="atmosphere-header">
              <span className="schedule-wide-kicker">Today in your garden</span>
              <h2 className="atmosphere-title">Weather, insights, and what's due</h2>
            </div>

            <div className="atmosphere-grid">
              <div className="atmosphere-card atmosphere-weather">
                <WeatherCard city={profile?.city} />
              </div>
              <div className="atmosphere-card atmosphere-insights">
                <PlantAnalytics plants={plants} />
              </div>
            </div>

            <div className="atmosphere-schedule">
              <div className="schedule-wide-header">
                <span className="schedule-wide-kicker">Care calendar</span>
                <h3 className="schedule-wide-title">Upcoming watering</h3>
              </div>

              <div className="schedule-wide-list">
                {upcomingSchedule.length > 0 ? (
                  upcomingSchedule.map(({ plant, nextDate, daysUntilDue }, i) => (
                    <div
                      className={`schedule-pill ${daysUntilDue <= 0 ? "is-overdue" : ""}`}
                      key={plant.id}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="schedule-pill-day">
                        <span className="pill-day-num">
                          {String(nextDate.getDate()).padStart(2, "0")}
                        </span>
                        <span className="pill-day-month">{MONTHS[nextDate.getMonth()]}</span>
                      </div>
                      <span className="schedule-pill-name">{plant.plantName}</span>
                      <span className="schedule-pill-status">
                        <IconDrop />
                        {daysUntilDue <= 0
                          ? "Overdue"
                          : `In ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="schedule-wide-empty">Nothing scheduled yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── SEARCH — the single filter/search surface for the whole
            collection, sticky under the navbar while scrolling. ── */}
        <section className="search-toolbar">
          <div className="search-toolbar-card">
            <div className="search-row">
              <div className="search-wrap">
                <span className="search-icon"><IconSearch /></span>
                <input
                  type="text"
                  placeholder="Search by name, species, or location…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-btn"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <IconX />
                  </button>
                )}
              </div>

              <select
                className="category-select"
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="status-filter" role="group" aria-label="Filter by status">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={filter === f.key ? "active-filter" : ""}
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {overduePlants.length > 0 && (
          <div
            className="watering-alert"
            style={{ "--alert-img": `url(${alertAccentImg})` }}
          >
            <h3>Plants needing water</h3>
            {overduePlants.map((plant) => (
              <div key={plant.id} className="alert-item">
                <span>{plant.plantName}</span>
                <span className="alert-tag">Water now</span>
              </div>
            ))}
          </div>
        )}

        {/* ── FULL PLANT COLLECTION — backed by the potted-cacti photo.
            #collection has scroll-margin-top (in CSS) so the "View your
            collection" smooth-scroll link doesn't land the heading
            under the sticky navbar / sticky search toolbar. ── */}
        <section
          className="collection-band"
          id="collection"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(11,19,12,0.5) 0%, rgba(11,19,12,0.78) 55%, rgba(11,19,12,0.92) 100%), url(${cactusBg})`,
          }}
        >
          <div className="collection-band-inner">
            <div className="section-header">
              <h2>Full collection</h2>
              <span className="plant-count">
                {filteredPlants.length} plant
                {filteredPlants.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredPlants.length > 0 ? (
              <div className="plants-scroll" role="list">
                {filteredPlants.map((plant, i) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    loadPlants={loadPlants}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state-inline">
                <h3>No plants found</h3>
                <p>Try a different search term or filter.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                    setCategoryFilter("All categories");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}

export default Dashboard;