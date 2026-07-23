import { useState } from "react";
import "./PlantCard.css";
import { FaTint, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deletePlant, toggleFavorite, waterPlant } from "../api/plantApi";
import { toast } from "react-toastify";
import { getPlantImage } from "../utils/imageUtils";

// index: position in the list — staggers the entrance animation so cards
// settle in one after another instead of popping in all at once.
// Card art always comes from getPlantImage(plant): the plant's own uploaded
// photo if it has one, otherwise a fixed fallback keyed off the plant's id,
// so the same plant always shows the same picture everywhere in the app.
//
// Layout mirrors a real postcard laid flat: the photo sits up top like the
// picture side, and postcard-content below reads like the written side —
// eyebrow label, name, divider, address-style details, a handwritten-style
// note, then the care actions.
function PlantCard({ plant, loadPlants, onDelete, index = 0 }) {
  const navigate = useNavigate();
  const [justWatered, setJustWatered] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 400);
    try {
      await toggleFavorite(plant.id);
      if (loadPlants) loadPlants();
      if (onDelete) onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  const handleWaterToday = async (e) => {
    e.stopPropagation();
    try {
      await waterPlant(plant.id);
      setJustWatered(true);
      setTimeout(() => setJustWatered(false), 1500);
      if (loadPlants) loadPlants();
      if (onDelete) onDelete();
      toast.success("Plant watered 💧");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${plant.plantName}?`)) return;
    try {
      await deletePlant(plant.id);
      toast.success("Plant deleted");
      if (loadPlants) loadPlants();
      if (onDelete) onDelete();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete plant");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${plant.id}`);
  };

  const handleViewDetails = () => navigate(`/plant/${plant.id}`);

  const image = getPlantImage(plant);

  // overdue check
  let isOverdue = false;
  if (plant.lastWateredDate && plant.wateringFrequency) {
    const diff = Math.floor(
      (new Date() - new Date(plant.lastWateredDate)) / (1000 * 60 * 60 * 24)
    );
    isOverdue = diff >= plant.wateringFrequency;
  }

  const statusClass =
    plant.healthStatus?.toLowerCase() === "healthy"
      ? "healthy"
      : plant.healthStatus === "Critical"
      ? "critical"
      : "warning";

  const noteText = isOverdue
    ? "Getting thirsty — water me soon."
    : statusClass === "healthy"
    ? "Growing beautifully."
    : "Needs a little extra care.";

  return (
    <article
      className="postcard"
      onClick={handleViewDetails}
      style={{ "--pc-order": index }}
    >
      {/* Photo — the "picture side" of the postcard */}
      <div className="postcard-photo">
        <img
          src={image}
          alt={plant.plantName}
          onError={(e) => {
            e.target.src = getPlantImage({ id: plant.id });
          }}
        />
        <div className="postcard-tape postcard-tape--left" aria-hidden="true" />
        <div className="postcard-tape postcard-tape--right" aria-hidden="true" />

        <div className={`botanical-stamp botanical-stamp--${statusClass}`} aria-hidden="true">
          <span className="botanical-stamp-mono">GB</span>
        </div>

        <button
          className={`favorite ${heartPulse ? "favorite--pulse" : ""} ${plant.favorite ? "active" : ""}`}
          onClick={handleFavorite}
          aria-label="Toggle favourite"
        >
          ♥
        </button>

        {isOverdue && !justWatered && (
          <span className="postcard-badge postcard-badge--due">Water due</span>
        )}
        {justWatered && (
          <span className="postcard-badge postcard-badge--done">Watered!</span>
        )}
      </div>

      {/* Content — the "written side" of the postcard */}
      <div className="postcard-content">
        <span className="collection-id">
          Botanical Collection{plant.category ? ` · ${plant.category}` : ""}
        </span>

        <h2>{plant.plantName}</h2>

        {plant.scientificName && (
          <p className="scientific">{plant.scientificName}</p>
        )}

        <div className="divider" />

        <div className="details">
          <div>
            <span><FaMapMarkerAlt aria-hidden="true" /> LOCATION</span>
            <p>{plant.location || "Unknown"}</p>
          </div>

          <div>
            <span><FaTint aria-hidden="true" /> WATER EVERY</span>
            <p>{plant.wateringFrequency} Days</p>
          </div>

          <div>
            <span>LAST WATERED</span>
            <p>{plant.lastWateredDate || "Never"}</p>
          </div>

          <div>
            <span>HEALTH</span>
            <p className={`health-value health-value--${statusClass}`}>
              {plant.healthStatus}
            </p>
          </div>
        </div>

        <div className="divider" />

        <p className="note">"{noteText}"</p>

        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleWaterToday}>Water</button>
          <button onClick={handleEdit}>Edit</button>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>

        <span className="specimen-footer">
          Specimen No. {String(index + 1).padStart(2, "0")} · GreenBuddy Archive
        </span>
      </div>
    </article>
  );
}

export default PlantCard;