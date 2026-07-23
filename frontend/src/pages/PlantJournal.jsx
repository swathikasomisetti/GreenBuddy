import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCamera, FiX, FiTrash2, FiDroplet, FiSun, FiHeart } from "react-icons/fi";
import Navbar from "../components/Navbar";
import {
  getPlantById,
  getJournalEntries,
  addJournalEntryWithPhoto,
  deleteJournalEntry,
  resolvePhotoUrl,
} from "../api/plantApi";
import { toast } from "react-toastify";
import "./PlantJournal.css";
import { getPlantImage } from "../utils/imageUtils";
import peaceLily from "../assets/stickers/peace-lily.jpg";



function getHealthLabel(plant) {
  return plant?.healthStatus || plant?.status || "Healthy";
}

function getWateringStatus(plant) {
  return (
    plant?.wateringStatus ||
    (plant?.lastWatered ? `Last watered ${plant.lastWatered}` : "Watered recently")
  );
}

function getMood(plant, entries) {
  return entries?.[0]?.mood || plant?.mood || "🌱 Thriving";
}

function splitMood(moodString) {
  const parts = moodString.trim().split(" ");
  if (parts.length > 1 && /\p{Emoji}/u.test(parts[0])) {
    return { icon: parts[0], label: parts.slice(1).join(" ") };
  }
  return { icon: "🌱", label: moodString };
}


const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function PlantJournal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [plant, setPlant] = useState(null);
  const [entries, setEntries] = useState([]);
  const [note, setNote] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAll = async () => {
    try {
      const plantRes = await getPlantById(id);
      setPlant(plantRes.data);
      const journalRes = await getJournalEntries(id);
      console.log("Journal entries:", journalRes.data);
      setEntries(journalRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddEntry = async () => {
    if (!note.trim() && !photoFile) return;
    setSaving(true);
    try {
     await addJournalEntryWithPhoto(plant.id, note, photoFile);

setNote("");
clearPhoto();

await loadAll();

toast.success("Entry added");
    } catch (err) {
      console.error(err);
      const serverMessage =
        err?.response?.data?.message || err?.response?.data || err?.message;
      toast.error(`Couldn't save entry: ${serverMessage || "check backend logs"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await deleteJournalEntry(entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err) {
      console.error(err);
      toast.error("Couldn't delete entry");
    }
  };

  if (!plant) {
    return (
      <>
        <Navbar />
        <div className="notebook-loading">
          <span className="notebook-loading-leaf">🌿</span>
          Loading your notebook…
        </div>
      </>
    );
  }
const heroPhoto = getPlantImage(plant);
const bgPhoto = getPlantImage(plant);

  const mood = splitMood(getMood(plant, entries));

  return (
    <>
      <Navbar />

      <div className="notebook-page-wrap">
        <div
          className="notebook-bg"
          style={{ backgroundImage: `url(${bgPhoto})` }}
          aria-hidden="true"
        />
        <div className="notebook-scrim" aria-hidden="true" />

        <div className="notebook-wrapper">
          <motion.button
            className="back-link"
            onClick={() => navigate("/journal")}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiArrowLeft /> All journals
          </motion.button>

          <motion.div
            className="notebook-page"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="notebook-header">
              <span className="notebook-eyebrow">
                <span className="eyebrow-rule" aria-hidden="true" />
                Plant journal
              </span>
              <h1>
                {plant.plantName}
                <span className="notebook-subtitle">'s notebook</span>
              </h1>
              <p className="notebook-meta">
                {plant.species && <em>{plant.species}</em>}
                {plant.species && plant.location ? " · " : ""}
                {plant.location || (!plant.species ? "—" : "")}
              </p>
            </div>

            <div className="notebook-hero-photo">
              <img src={heroPhoto} alt={plant.plantName} />
            </div>

            <div className="notebook-stat-row">
              <div className="notebook-stat">
                <span className="notebook-stat-icon">
                  <FiHeart />
                </span>
                <div className="notebook-stat-text">
                  <span className="notebook-stat-label">Health</span>
                  <span className="notebook-stat-value">{getHealthLabel(plant)}</span>
                </div>
              </div>

              <div className="notebook-stat">
                <span className="notebook-stat-icon">
                  <FiDroplet />
                </span>
                <div className="notebook-stat-text">
                  <span className="notebook-stat-label">Watering</span>
                  <span className="notebook-stat-value">{getWateringStatus(plant)}</span>
                </div>
              </div>

              <div className="notebook-stat">
                <span className="notebook-stat-icon notebook-stat-icon--emoji">{mood.icon}</span>
                <div className="notebook-stat-text">
                  <span className="notebook-stat-label">Mood</span>
                  <span className="notebook-stat-value">{mood.label}</span>
                </div>
              </div>

              {plant.nextWatering && (
                <div className="notebook-stat">
                  <span className="notebook-stat-icon">
                    <FiSun />
                  </span>
                  <div className="notebook-stat-text">
                    <span className="notebook-stat-label">Next watering</span>
                    <span className="notebook-stat-value">{plant.nextWatering}</span>
                  </div>
                </div>
              )}

              <div className="notebook-stat notebook-stat--date">
                <div className="notebook-stat-text">
                  <span className="notebook-stat-label">Today</span>
                  <span className="notebook-stat-value">{todayLabel}</span>
                </div>
              </div>
            </div>

            <div className="entry-composer">
              <span className="composer-label">New page</span>
              <textarea
                placeholder="What's new with this plant today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />

              {photoPreview && (
                <div className="photo-preview washi-frame">
                  <img src={photoPreview} alt="preview" />
                  <button className="remove-photo-btn" onClick={clearPhoto}>
                    <FiX />
                  </button>
                </div>
              )}

              <div className="composer-actions">
                <label className="attach-photo-btn">
                  <FiCamera /> Attach photo
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>

                <button className="add-entry-btn" onClick={handleAddEntry} disabled={saving}>
                  {saving ? "Saving…" : "Add entry"}
                </button>
              </div>
            </div>

            <div className="entries-timeline">
              {entries.length === 0 ? (
                <p className="empty-journal">
                  No entries yet — this notebook is waiting for its first page.
                </p>
              ) : (
                entries.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    className="notebook-entry"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (idx % 5) * 0.05 }}
                  >
                    <div className="entry-date-rail">
                      <span className="entry-date">{entry.entryDate}</span>

                      {(entry.mood || entry.weather || entry.wateringStatus) && (
                        <span className="entry-chip-row">
                          {entry.mood && <span className="entry-chip">{entry.mood}</span>}
                          {entry.weather && <span className="entry-chip">{entry.weather}</span>}
                          {entry.wateringStatus && (
                            <span className="entry-chip">{entry.wateringStatus}</span>
                          )}
                        </span>
                      )}

                      <button
                        className="entry-delete-btn"
                        onClick={() => handleDelete(entry.id)}
                        title="Delete entry"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="entry-body">
                      {entry.title && <h4 className="entry-title">{entry.title}</h4>}
                      {entry.note && <p className="entry-note">{entry.note}</p>}
                      {entry.photoUrl && (
                        <div className="washi-frame entry-photo-wrap">
                          <img
                            className="entry-photo"
                            src={resolvePhotoUrl(entry.photoUrl)}
                            alt="journal entry"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <img src={peaceLily} alt="" className="margin-sticker" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default PlantJournal;