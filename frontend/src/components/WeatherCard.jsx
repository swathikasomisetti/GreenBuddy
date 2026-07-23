import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WiHumidity, WiStrongWind, WiThermometer } from "react-icons/wi";

import { getWeather } from "../api/weatherApi";

// Drop these two files into src/assets/dashboard/ — the arched-window shot
// grounds the hero photo, the patio shot backs the care note.
import patioPhoto from "../assets/dashboard/arch-window-succulents.png";
import archPhoto from "../assets/dashboard/13.jpg";

import "./WeatherCard.css";

// Separates "do something today" advice from "you're fine" advice, so the
// card can group plants by what they actually need instead of just flagging
// them as a generic alarm.
const URGENT_KEYWORDS = [
  "protect", "move indoors", "bring indoors", "shade", "wilt",
  "frost", "extra water", "avoid direct", "cover", "mist",
  "increase watering", "reduce watering", "stress", "scorch", "drooping",
];

function needsAttention(advice) {
  if (!advice) return false;
  const lower = advice.toLowerCase();
  return URGENT_KEYWORDS.some((k) => lower.includes(k));
}

// Trims a plant's advice down to one short, readable clause so the care
// list stays scannable instead of reprinting the full sentence.
function shortAdvice(advice) {
  if (!advice) return "";
  const clause = advice.split(/[.;]/)[0].trim();
  return clause.length > 64 ? `${clause.slice(0, 61)}…` : clause;
}

export default function WeatherCard({ city = "Hyderabad" }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    loadWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  async function loadWeather() {
    try {
      const res = await getWeather(city || "Hyderabad");
      setWeather(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!weather) {
    return <div className="weatherCard weatherCard--loading">Loading weather…</div>;
  }

  const plantAdvice = weather.plantAdvice || [];
  const attentionNeeded = plantAdvice.filter((p) => needsAttention(p.advice));
  const doingFine = plantAdvice.filter((p) => !needsAttention(p.advice));

  return (
    <motion.section
      className="weatherCard"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="weatherCard__photo">
        <img src={archPhoto} alt="" />
        <span className="weatherCard__badge">Garden Weather</span>
      </div>

      <div className="weatherCard__body">
        <span className="weatherCard__eyebrow">Current conditions</span>

        <div className="weatherCard__head">
          <div>
            <h2>{weather.city}</h2>
            <p className="weatherCard__condition">{weather.condition}</p>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt=""
            className="weatherCard__icon"
          />
        </div>

        <div className="weatherCard__stats">
          <div className="weatherStat">
            <WiThermometer />
            <div>
              <span>Temp</span>
              <strong>{weather.temperature}°C</strong>
            </div>
          </div>
          <div className="weatherStat">
            <WiHumidity />
            <div>
              <span>Humidity</span>
              <strong>{weather.humidity}%</strong>
            </div>
          </div>
          <div className="weatherStat">
            <WiStrongWind />
            <div>
              <span>Wind</span>
              <strong>{weather.windSpeed} km/h</strong>
            </div>
          </div>
        </div>

        <div className="weatherCard__note">
          <img src={patioPhoto} alt="" className="weatherCard__notePhoto" />
          <div>
            <h4>Today's care note</h4>
            <p>{weather.advice}</p>
          </div>
        </div>

        {attentionNeeded.length > 0 && (
          <ul className="weatherCard__careGroup">
            <span className="weatherCard__careLabel">
              What to do today · {attentionNeeded.length} plant
              {attentionNeeded.length !== 1 ? "s" : ""}
            </span>
            {attentionNeeded.map((p) => (
              <li className="weatherCard__careItem" key={p.plantName}>
                <b>{p.plantName}</b> — <span>{shortAdvice(p.advice)}</span>
              </li>
            ))}
          </ul>
        )}

        {doingFine.length > 0 && (
          <ul className="weatherCard__careGroup">
            <span className="weatherCard__careLabel">Thriving as-is</span>
            <li className="weatherCard__careItem weatherCard__careItem--fine">
              <span>
                {doingFine.map((p) => p.plantName).join(", ")}{" "}
                {doingFine.length !== 1 ? "need" : "needs"} nothing extra today.
              </span>
            </li>
          </ul>
        )}

        {plantAdvice.length === 0 && (
          <p className="weatherCard__fine">Nothing urgent — your garden's happy today.</p>
        )}
      </div>
    </motion.section>
  );
}