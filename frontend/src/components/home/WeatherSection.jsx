import "./WeatherSection.css";
import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, Sun } from "lucide-react";

const forecast = [
  { day: "Mon", icon: Sun, temp: "29°", today: true },
  { day: "Tue", icon: CloudSun, temp: "27°" },
  { day: "Wed", icon: CloudSun, temp: "26°" },
  { day: "Thu", icon: Sun, temp: "30°" },
  { day: "Fri", icon: CloudSun, temp: "28°" },
];

export default function WeatherSection() {
  return (
    <section className="weather">
      <div className="weather-glow" aria-hidden="true" />

      <motion.div
        className="weather-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="weather-main">
          <span className="weather-tag">Local Forecast</span>
          <h2>
            Weather-smart
            <span> plant care.</span>
          </h2>
          <p>
            GreenBuddy reads live local conditions and adjusts your
            watering and care reminders automatically — no guesswork.
          </p>

          <div className="weather-now">
            <div className="weather-now-icon">
              <CloudSun size={38} strokeWidth={1.3} />
            </div>
            <div>
              <h3>
                28<span>°C</span>
              </h3>
              <span className="weather-loc">
                Partly Cloudy · Visakhapatnam
              </span>
            </div>
          </div>

          <div className="weather-meta">
            <div>
              <Droplets size={16} strokeWidth={1.6} />
              <span>
                <b>62%</b> Humidity
              </span>
            </div>
            <div>
              <Wind size={16} strokeWidth={1.6} />
              <span>
                <b>12</b> km/h Wind
              </span>
            </div>
          </div>
        </div>

        <div className="weather-divider" aria-hidden="true" />

        <div className="weather-forecast">
          <span className="weather-forecast-label">5-Day Outlook</span>
          <div className="weather-forecast-row">
            {forecast.map((f) => (
              <motion.div
                className={`forecast-day${f.today ? " is-today" : ""}`}
                key={f.day}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="forecast-label">
                  {f.today ? "Today" : f.day}
                </span>
                <f.icon size={20} strokeWidth={1.6} />
                <span className="forecast-temp">{f.temp}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}