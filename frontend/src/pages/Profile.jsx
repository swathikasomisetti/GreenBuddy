import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getProfileStats,
  getPlants,
  resolvePhotoUrl,
} from "../api/plantApi";
import Navbar from "../components/Navbar";
import {
  FiEdit2,
  FiCamera,
  FiLock,
  FiBell,
  FiMoon,
  FiArrowRight,
  FiDroplet,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "./Profile.css";

import heroTeaTerraces from "../assets/dashboard/1.jpg";
import mountainMist from "../assets/profile/mountain-mist.png";
import gardenDoor from "../assets/profile/garden-door.png";
import seedlingPots from "../assets/profile/seedling-pots.png";
import teaPickers from "../assets/profile/tea-pickers.png";
import handsPlanting from "../assets/dashboard/14.jpg";

function formatDate(dateStr, opts = { month: "long", year: "numeric" }) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString(undefined, opts);
  } catch {
    return null;
  }
}

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
}

// count-up animation for editorial numerals
function useCountUp(target = 0, duration = 1100, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    let raf;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(Math.round(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

// fade-up / stagger-in wrapper used across every section
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); io.unobserve(el); } }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`gb-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function RingStat({ value, max, label, visible }) {
  const R = 40;
  const CIRC = 2 * Math.PI * R;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const count = useCountUp(value, 1000, visible);
  return (
    <div className="gb-ring-stat">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(248,245,238,0.1)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={R} fill="none" stroke="#D8B36A" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={visible ? CIRC - pct * CIRC : CIRC}
          transform="rotate(-90 48 48)" className="gb-ring-stat__arc"
        />
        <text x="48" y="54" textAnchor="middle" className="gb-ring-stat__num">{count}</text>
      </svg>
      <span className="gb-ring-stat__label">{label}</span>
    </div>
  );
}

const HEALTH_TONE = { healthy: "good", good: "good", "needs water": "warn", warning: "warn", critical: "bad" };
const FALLBACK_IMAGES = [seedlingPots, teaPickers, handsPlanting, gardenDoor];

export default function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const carouselRef = useRef();
  const heroRef = useRef();
  const pwRef = useRef();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [plants, setPlants] = useState([]);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [showPw, setShowPw] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });

  const [notifPrefs, setNotifPrefs] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    loadProfile();
    loadStats();
    loadPlants();
    const onFocus = () => loadStats();
    const onScroll = () => setParallaxY(window.scrollY);
    window.addEventListener("focus", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // whenever the password panel opens, bring it into view automatically
  useEffect(() => {
    if (showPw && pwRef.current) {
      pwRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showPw]);

  const loadProfile = () => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({ name: res.data.name || "", bio: res.data.bio || "", city: res.data.city || "" });
      })
      .catch(() => notify("Could not load profile", "error"));
  };
  const loadStats = () => {
    getProfileStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats({ plantCount: 0, journalCount: 0, healthyPlants: 0, favoritePlants: 0 }));
  };
  const loadPlants = () => {
    getPlants().then((res) => setPlants(res.data || [])).catch(() => setPlants([]));
  };

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (avatarFile) {
        const res = await uploadAvatar(avatarFile);
        setProfile((p) => ({ ...p, avatarUrl: res.data.avatarUrl }));
        setAvatarFile(null);
      }
      const updated = await updateProfile(form);
      setProfile(updated.data);
      setEditing(false);
      notify("Profile saved");
    } catch {
      notify("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (pwForm.next !== pwForm.confirm) { notify("Passwords do not match", "error"); return; }
    if (pwForm.next.length < 6) { notify("Minimum 6 characters", "error"); return; }
    setSaving(true);
    try {
      await changePassword(pwForm.current, pwForm.next);
      setPwForm({ current: "", next: "", confirm: "" });
      setShowPw(false);
      notify("Password updated");
    } catch {
      notify("Incorrect current password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const scrollCarousel = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  // account-section actions that jump to where the change actually happens
  const goEditProfile = () => {
    setEditing(true);
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goChangePassword = () => {
    setShowPw((v) => !v);
  };

  // ── derived data ─────────────────────────────────────────────────────
  const sortedPlants = useMemo(
    () => [...plants].sort((a, b) => new Date(a.createdAt || a.dateAdded || 0) - new Date(b.createdAt || b.dateAdded || 0)),
    [plants]
  );

  const plantCount = stats?.plantCount ?? plants.length ?? 0;
  const healthyPlants = stats?.healthyPlants ?? 0;
  const favoritePlants = stats?.favoritePlants ?? 0;
  const journalCount = stats?.journalCount ?? 0;
  const addedThisMonth = stats?.plantsAddedThisMonth ?? 0;
  const healthScore = plantCount > 0 ? Math.round((healthyPlants / plantCount) * 100) : 0;
  const totalCareDays = daysSince(profile?.createdAt);

  const favoritePlant = useMemo(() => plants.find((p) => p.isFavorite) || sortedPlants[0], [plants, sortedPlants]);
  const spotlightSrc = favoritePlant
    ? (favoritePlant.imageUrl || favoritePlant.photoUrl || favoritePlant.image || FALLBACK_IMAGES[0])
    : null;
  const spotlightStatus = (favoritePlant?.healthStatus || favoritePlant?.status || "Healthy");
  const spotlightTone = HEALTH_TONE[spotlightStatus.toLowerCase()] || "good";
  const spotlightWatered = favoritePlant?.lastWatered ? formatDate(favoritePlant.lastWatered, { month: "short", day: "numeric" }) : "—";

  const aiInsights = useMemo(() => {
    const lines = [];
    const healthy = plants.find((p) => (p.healthStatus || p.status || "").toLowerCase().includes("healthy"));
    if (healthy) lines.push(`Your ${healthy.plantName} is thriving.`);
    const thirsty = plants.find((p) => {
      const s = (p.healthStatus || p.status || "").toLowerCase();
      return s.includes("water") || s === "warning" || s === "critical";
    });
    if (thirsty) lines.push(`Water ${thirsty.plantName} soon.`);
    lines.push(healthScore >= 80 ? "Overall garden conditions are excellent." : "A little more attention will lift your garden health.");
    if (lines.length === 1 && plantCount === 0) return ["Add your first plant to receive personalized care insights."];
    return lines;
  }, [plants, healthScore, plantCount]);

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="gb-loading">
          <div className="gb-spinner" />
          <p>Growing your profile…</p>
        </div>
      </>
    );
  }

  const avatarSrc = avatarPreview || resolvePhotoUrl(profile.avatarUrl);
  const initials = profile.name?.slice(0, 2).toUpperCase() || "GB";
  const memberSince = formatDate(profile.createdAt);

  return (
    <>
      <Navbar />

      {toast && (
        <div className={`gb-toast ${toast.type === "error" ? "gb-toast--err" : "gb-toast--ok"}`}>{toast.msg}</div>
      )}

      <div className="gb-page">
        {/* ══════════════ SECTION 1 — WELCOME ══════════════ */}
        <header className="gb-hero" ref={heroRef}>
          <div
            className="gb-hero__bg"
            style={{ backgroundImage: `url(${heroTeaTerraces})`, transform: `translateY(${parallaxY * 0.15}px) scale(1.08)` }}
          />
          <div className="gb-hero__rays" />
          <div className="gb-hero__veil" />

          <div className="gb-hero__content gb-hero__content--split">
            <div className="gb-hero__text">
              <span className="gb-eyebrow">Welcome back to your greenhouse</span>
              {editing ? (
                <input className="gb-hero__name-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              ) : (
                <h1 className="gb-hero__title">{profile.name}</h1>
              )}
              <span className="gb-hero__role">Plant Parent</span>
              <p className="gb-hero__tagline">Growing beautiful gardens, one leaf at a time.</p>

              <div className="gb-hero__actions">
                {editing ? (
                  <>
                    <button className="gb-btn gb-btn--solid" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button className="gb-btn gb-btn--ghost" onClick={() => { setEditing(false); setAvatarPreview(null); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="gb-btn gb-btn--solid" onClick={() => setEditing(true)}><FiEdit2 /> Edit Profile</button>
                    <button className="gb-btn gb-btn--ghost" onClick={() => { setEditing(true); setTimeout(() => fileRef.current.click(), 100); }}>
                      <FiCamera /> Change Photo
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="gb-hero__frame-wrap">
              <div className="gb-hero__bloom" style={{ backgroundImage: `url(${teaPickers})` }} />
              <svg className="gb-hero__scribble" viewBox="0 0 260 260" aria-hidden="true">
                <path d="M14 130 C 14 60, 60 14, 130 14 C 200 14, 246 60, 246 130 C 246 200, 200 246, 130 246 C 74 246, 30 212, 16 160"
                  fill="none" stroke="#D8B36A" strokeWidth="1.1" strokeDasharray="2 7" strokeLinecap="round" />
              </svg>
              <div className="gb-hero__frame" onClick={() => editing && fileRef.current.click()}>
                {avatarSrc ? <img src={avatarSrc} alt={profile.name} /> : <span>{initials}</span>}
                {editing && (
                  <div className="gb-hero__frame-overlay"><FiCamera /></div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarPick} />
            </div>
          </div>

          <div className="gb-scroll-cue">Scroll to explore your garden</div>
        </header>

        {/* ══════════════ SECTION 2 — MY GARDEN STORY ══════════════ */}
        <section className="gb-section">
          <div className="gb-story">
            <Reveal className="gb-story__text">
              <span className="gb-eyebrow">About</span>
              <h2 className="gb-display">My Garden Story</h2>
              {editing ? (
                <textarea className="gb-story__bio-input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about your garden" />
              ) : (
                <p className="gb-story__bio">{profile.bio || "Every plant here has a story — some thriving, some still learning to trust the light."}</p>
              )}

              <div className="gb-story__facts">
                <div><label>Member Since</label><p>{memberSince || "—"}</p></div>
                <div>
                  <label>City</label>
                  {editing ? (
                    <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                  ) : (
                    <p>{profile.city || <span className="gb-empty">Not added yet</span>}</p>
                  )}
                </div>
                <div><label>Favorite Plant</label><p>{favoritePlant?.plantName || <span className="gb-empty">None yet</span>}</p></div>
                <div><label>Total Care Days</label><p>{totalCareDays}</p></div>
              </div>
            </Reveal>

            <Reveal delay={150} className="gb-story__visual">
              <div className="gb-story__circle" style={{ backgroundImage: `url(${mountainMist})` }} />
              <div className="gb-story__main" style={{ backgroundImage: `url(${gardenDoor})` }} />
            </Reveal>
          </div>
        </section>

        {/* ══════════════ SECTION 3 — GARDEN SPOTLIGHT ══════════════ */}
        <section className="gb-section">
          <Reveal className="gb-section__head">
            <span className="gb-eyebrow">Today's Spotlight</span>
            <h2 className="gb-display">Garden Spotlight</h2>
          </Reveal>

          {!favoritePlant ? (
            <Reveal className="gb-empty-card"><img src={seedlingPots} alt="" /><p>No plants yet — add your first to see it featured here.</p></Reveal>
          ) : (
            <Reveal className="gb-spotlight">
              <div className="gb-spotlight__media" style={{ backgroundImage: `url(${spotlightSrc})` }} onClick={() => navigate(`/plant/${favoritePlant.id}`)} />
              <div className="gb-spotlight__body">
                <span className={`gb-collage__status gb-collage__status--${spotlightTone}`}>{spotlightStatus}</span>
                <h3>{favoritePlant.plantName}</h3>
                <p>{favoritePlant.plantName} has earned its place as your favorite — watered {spotlightWatered}, and doing well in your care.</p>
                <div className="gb-spotlight__stats">
                  <div><strong>{plantCount}</strong><span>Total Plants</span></div>
                  <div><strong>{totalCareDays}</strong><span>Care Days</span></div>
                  <div><strong>{journalCount}</strong><span>Journal Entries</span></div>
                </div>
                <button className="gb-link" onClick={() => navigate(`/plant/${favoritePlant.id}`)}>View Plant <FiArrowRight /></button>
              </div>
            </Reveal>
          )}
        </section>

        {/* ══════════════ SECTION 4 — GARDEN JOURNAL ══════════════ */}
        <section className="gb-section">
          <Reveal className="gb-section__head">
            <span className="gb-eyebrow">Pages From the Notebook</span>
            <h2 className="gb-display">Garden Journal</h2>
          </Reveal>

          {/* No journal-entries endpoint is wired yet — showing one
              illustrative notebook page so the section reads as intended.
              Swap this for the real latest entry once the API exists. */}
          <Reveal className="gb-journal__page gb-journal__page--single">
            <div className="gb-journal__photo"><img src={handsPlanting} alt="" /></div>
            <div className="gb-journal__body">
              <span className="gb-journal__date">{journalCount > 0 ? `${journalCount} entries logged` : "No entries yet"}</span>
              <h3>New Beginnings</h3>
              <p>Every entry starts with getting your hands in the soil. Your notes on watering, light, and growth all live here.</p>
              <button className="gb-link" onClick={() => navigate("/journal")}>Read More <FiArrowRight /></button>
            </div>
          </Reveal>
        </section>

        {/* ══════════════ SECTION 5 — AI GARDEN REPORT ══════════════ */}
        <section className="gb-section">
          <Reveal>
            <div className="gb-ai" style={{ backgroundImage: `url(${mountainMist})` }}>
              <div className="gb-ai__veil" />

              <div className="gb-ai__panel">
                <span className="gb-eyebrow">AI Garden Report</span>
                <div className="gb-ai__row">
                  <div className="gb-ai__score">
                    <svg width="150" height="150" viewBox="0 0 150 150">
                      <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(248,245,238,0.12)" strokeWidth="9" />
                      <circle cx="75" cy="75" r="62" fill="none" stroke="#D8B36A" strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 62} strokeDashoffset={2 * Math.PI * 62 * (1 - healthScore / 100)}
                        transform="rotate(-90 75 75)" />
                      <text x="75" y="72" textAnchor="middle" className="gb-ai__score-num">{healthScore}%</text>
                      <text x="75" y="94" textAnchor="middle" className="gb-ai__score-label">GARDEN HEALTH</text>
                    </svg>
                  </div>
                  <div className="gb-ai__summary">
                    <h3>AI Summary</h3>
                    <ul>
                      {aiInsights.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ══════════════ SECTION 6 — MY PLANTS CAROUSEL ══════════════ */}
        <section className="gb-section">
          <Reveal className="gb-section__head gb-section__head--row">
            <div>
              <span className="gb-eyebrow">Browse</span>
              <h2 className="gb-display">My Plants</h2>
            </div>
            <div className="gb-carousel-nav">
              <button onClick={() => scrollCarousel(-1)}><FiChevronLeft /></button>
              <button onClick={() => scrollCarousel(1)}><FiChevronRight /></button>
            </div>
          </Reveal>

          {plants.length === 0 ? (
            <Reveal className="gb-empty-card"><img src={teaPickers} alt="" /><p>Your plants will appear here once added.</p></Reveal>
          ) : (
            <div className="gb-carousel" ref={carouselRef}>
              {plants.map((p, i) => {
                const src = p.imageUrl || p.photoUrl || p.image || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                return (
                  <div className="gb-carousel__card" key={p.id}>
                    <div className="gb-carousel__photo"><img src={src} alt={p.plantName} /></div>
                    <div className="gb-carousel__body">
                      <h4>{p.plantName}</h4>
                      <span className="gb-carousel__species">{p.species || "Species not set"}</span>
                      <span className="gb-carousel__health">{p.healthStatus || p.status || "Healthy"}</span>
                      <span className="gb-carousel__schedule"><FiDroplet /> {p.wateringSchedule || "Every 7 days"}</span>
                      <button className="gb-link" onClick={() => navigate(`/plant/${p.id}`)}>View Details <FiArrowRight /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ══════════════ SECTION 7 — MONTHLY GARDEN ACTIVITY ══════════════ */}
        <section className="gb-section">
          <ActivitySection
            addedThisMonth={addedThisMonth}
            journalCount={journalCount}
            healthScore={healthScore}
            favoritePlants={favoritePlants}
          />
        </section>

        {/* ══════════════ SECTION 8 — ACCOUNT ══════════════ */}
        <section className="gb-section gb-section--account">
          <Reveal className="gb-section__head">
            <span className="gb-eyebrow">Settings</span>
            <h2 className="gb-display">Account</h2>
          </Reveal>

          <Reveal className="gb-account">
            <button className="gb-account__row" onClick={goEditProfile}>
              <span><FiEdit2 /> Edit Profile</span><FiArrowRight />
            </button>
            <button className="gb-account__row" onClick={goChangePassword}>
              <span><FiLock /> Change Password</span><FiArrowRight />
            </button>
            {showPw && (
              <div className="gb-pw" ref={pwRef}>
                <input type="password" placeholder="Current password" value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} />
                <input type="password" placeholder="New password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} />
                <input type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
                <button className="gb-btn gb-btn--solid gb-btn--sm" onClick={handleChangePassword} disabled={saving}>{saving ? "Updating…" : "Update password"}</button>
              </div>
            )}
            <button className="gb-account__row" onClick={() => setNotifPrefs((v) => !v)}>
              <span><FiBell /> Notification Settings</span>
              <span className={`gb-switch ${notifPrefs ? "gb-switch--on" : ""}`}><span className="gb-switch__thumb" /></span>
            </button>
            <button className="gb-account__row" onClick={() => setDarkMode((v) => !v)}>
              <span><FiMoon /> Theme</span>
              <span className={`gb-switch ${darkMode ? "gb-switch--on" : ""}`}><span className="gb-switch__thumb" /></span>
            </button>
            <button className="gb-account__row gb-account__row--danger" onClick={handleLogout}>
              <span><FiLogOut /> Logout</span><FiArrowRight />
            </button>
          </Reveal>
        </section>
      </div>
    </>
  );
}

function ActivitySection({ addedThisMonth, journalCount, healthScore, favoritePlants }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); io.unobserve(el); } }), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="gb-activity">
      <span className="gb-eyebrow">This Month</span>
      <h2 className="gb-display">Garden Activity</h2>
      <div className="gb-activity__row">
        <RingStat value={addedThisMonth} max={10} label="Plants Added" visible={visible} />
        <RingStat value={journalCount} max={20} label="Journal Entries" visible={visible} />
        <RingStat value={healthScore} max={100} label="Watering Score" visible={visible} />
        <RingStat value={favoritePlants} max={10} label="Favorite Plants" visible={visible} />
      </div>
    </div>
  );
}