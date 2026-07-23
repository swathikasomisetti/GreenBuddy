import "./FeaturesSection.css";
import { motion } from "framer-motion";
import { Leaf, Droplets, CloudSun, BrainCircuit } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Plant Diagnosis",
    text: "Snap a photo and let our model spot disease, pests, or stress before they spread.",
  },
  {
    icon: Droplets,
    title: "Smart Watering",
    text: "Personalized watering schedules based on species, soil, and season.",
  },
  {
    icon: CloudSun,
    title: "Weather-Aware Care",
    text: "Reminders that adjust automatically to real-time local weather conditions.",
  },
  {
    icon: Leaf,
    title: "Growth Tracking",
    text: "Log every leaf and bloom to build a visual timeline of your garden's progress.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="features">
      <div className="features-glow" aria-hidden="true" />
      <div className="features-grain" aria-hidden="true" />

      <motion.div
        className="features-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="features-tag">Why GreenBuddy</span>
        <h2>
          Everything your garden
          <span>needs to thrive.</span>
        </h2>
      </motion.div>

      <div className="features-grid">
        {features.map((f, i) => (
          <motion.div
            className="feature-card"
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
          >
            <div className="feature-icon">
              <f.icon size={22} strokeWidth={1.6} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}