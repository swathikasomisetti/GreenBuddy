import React, { useMemo, useState } from 'react';
import './PlantAnalytics.css';

// Drop this into src/assets/profile/ — hands-in-the-soil shot used to
// ground the card in "this is a real garden," not a spreadsheet.
import handsPhoto from '../assets/dashboard/19.jpg';

// ── Minimal line icons, same stroke language as the dashboard's other
//    icons — no emoji. ──
const IconSeed = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <ellipse cx="12" cy="14" rx="5" ry="7" />
    <path d="M12 7v14" />
  </svg>
);
const IconLeaf = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 20c8 0 15-6 16-16C10 5 4 11 4 20Z" />
    <path d="M4 20c3-6 7-10 13-13" />
  </svg>
);
const IconBloom = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="2.4" />
    <path d="M12 9.6c-1.6-2-1.6-4.4 0-6 1.6 1.6 1.6 4 0 6Z" />
    <path d="M12 14.4c1.6 2 1.6 4.4 0 6-1.6-1.6-1.6-4 0-6Z" />
    <path d="M14.4 12c2-1.6 4.4-1.6 6 0-1.6 1.6-4 1.6-6 0Z" />
    <path d="M9.6 12c-2 1.6-4.4 1.6-6 0 1.6-1.6 4-1.6 6 0Z" />
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10" />
  </svg>
);
const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 3v2.4M12 18.6V21M4.4 12H2M22 12h-2.4M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
  </svg>
);
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12Z" />
  </svg>
);
const IconGauge = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 15a8 8 0 0 1 16 0" />
    <path d="M12 15l3.5-4.5" />
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);
const IconCollection = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

export default function PlantAnalytics({ plants = [] }) {
  const [hovered, setHovered] = useState(null);

  const data = useMemo(() => {
    const total = plants.length;

    const healthy = plants.filter((p) => p.healthStatus?.toLowerCase() === 'healthy').length;
    const attention = plants.filter((p) => p.healthStatus?.toLowerCase() === 'needs attention').length;
    const critical = plants.filter((p) => p.healthStatus?.toLowerCase() === 'critical').length;

    const categoryCounts = plants.reduce((acc, p) => {
      const key = p.category || 'Other';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

    const needsWaterSoon = plants.filter((p) => Number(p.wateringFrequency) <= 3).length;

    const totalHealthScore = plants.reduce((sum, p) => {
      let score = 100;
      if (p.healthStatus === 'Needs Attention') score = 75;
      if (p.healthStatus === 'Critical') score = 50;
      return sum + score;
    }, 0);
    const healthScore = total > 0 ? Math.round(totalHealthScore / total) : 0;

    return { total, healthy, attention, critical, categoryCounts, topCategory, needsWaterSoon, healthScore };
  }, [plants]);

  const { total, healthy, attention, critical, categoryCounts, topCategory, needsWaterSoon, healthScore } = data;

  const healthTiles = [
    { key: 'healthy', Icon: IconBloom, value: healthy, label: 'Healthy' },
    { key: 'attention', Icon: IconLeaf, value: attention, label: 'Needs attention' },
    { key: 'critical', Icon: IconSeed, value: critical, label: 'Critical' },
  ];

  const categoryIcons = { Indoor: IconHome, Outdoor: IconSun, Succulent: IconDroplet };
  const categoryTiles = ['Indoor', 'Outdoor', 'Succulent']
    .filter((cat) => categoryCounts[cat])
    .map((cat) => ({
      key: cat,
      Icon: categoryIcons[cat] || IconLeaf,
      value: categoryCounts[cat],
      label: cat,
    }));

  const tiles = [...healthTiles, ...categoryTiles];
  const maxHealthValue = Math.max(healthy, attention, critical);

  return (
    <section className="analytics">
      <div className="analytics__body">
        <span className="analytics__eyebrow">Garden analytics</span>
        <h2 className="analytics__heading">
          Your garden,
          <br />
          <em>by the numbers.</em>
        </h2>
        <p className="analytics__intro">
          A quick read on how your {total} plant{total !== 1 ? 's are' : ' is'} doing right
          now — health status, where they live, and who needs water first.
        </p>

        <div className="analytics__stats">
          <div className="analytics__stat">
            <span className="analytics__statIcon"><IconCollection /></span>
            <div>
              <strong>{total}</strong>
              <span>Plants tracked</span>
            </div>
          </div>
          <div className="analytics__stat">
            <span className="analytics__statIcon"><IconGauge /></span>
            <div>
              <strong>{healthScore}%</strong>
              <span>Health score</span>
            </div>
          </div>
          <div className="analytics__stat analytics__stat--gold">
            <span className="analytics__statIcon"><IconClock /></span>
            <div>
              <strong>{needsWaterSoon}</strong>
              <span>Need water soon</span>
            </div>
          </div>
        </div>

        {total > 0 ? (
          <ul className="analytics__stages" role="list">
            {tiles.map((tile) => {
              const isTopCategory = topCategory && tile.key === topCategory[0];
              const isTopHealth = healthTiles.some((h) => h.key === tile.key) && tile.value === maxHealthValue && maxHealthValue > 0;
              const isHighlight = isTopCategory || (tile.key === 'healthy' && isTopHealth);
              return (
                <li
                  key={tile.key}
                  className={`analytics__stageCard ${isHighlight ? 'analytics__stageCard--peak' : ''}`}
                  onMouseEnter={() => setHovered(tile.key)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(tile.key)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                >
                  {isHighlight && (
                    <span className="analytics__peakBadge">
                      {isTopCategory ? 'Most common' : 'Doing best'}
                    </span>
                  )}
                  <span className="analytics__stageIcon"><tile.Icon /></span>
                  <span className="analytics__stageMonth">{tile.value}</span>
                  <span className="analytics__stageLabel">{tile.label}</span>
                  {hovered === tile.key && (
                    <span className="analytics__stageTooltip">
                      {tile.value} plant{tile.value !== 1 ? 's' : ''}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="analytics__empty">
            Add your first plant to start seeing your garden's analytics here.
          </p>
        )}
      </div>

      <div className="analytics__photo">
        <img src={handsPhoto} alt="" />
        <span className="analytics__badge">In the garden today</span>
      </div>
    </section>
  );
}