import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPlant,
  uploadPlantImage,
  generatePlantDetails
} from "../api/plantApi";
import "./AddPlant.css";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function AddPlant() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [plant, setPlant] = useState({
    plantName: "",
    location: "",
    imageUrl: "",
    healthStatus: "Healthy",
    category: "Indoor",

    wateringFrequency: "",
    fertilizerFrequency: "",

    scientificName: "",

    sunlight: "",
    temperature: "",
    humidity: "",
    soil: "",

    petSafety: "",
    indoorOutdoor: "",

    commonProblems: "",
    careTips: "",

    description: "",
    wikipediaLink: "",

    lastWateredDate: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = (e) => setPlant({ ...plant, [e.target.name]: e.target.value });

  const handleGenerateAI = async () => {
    if (!plant.plantName.trim()) {
      toast.error("Enter a plant name first.");
      return;
    }

    try {
      setGenerating(true);

      const response = await generatePlantDetails(plant.plantName);
      const ai = response.data;

      setPlant(prev => ({
        ...prev,
        scientificName: ai.scientificName || "",
        category: ai.category || "Indoor",
        wateringFrequency: ai.wateringFrequency || "",
        fertilizerFrequency: ai.fertilizerFrequency || "",
        sunlight: ai.sunlight || "",
        temperature: ai.temperature || "",
        humidity: ai.humidity || "",
        soil: ai.soil || "",
        description: ai.description || "",
        wikipediaLink: ai.wikipediaLink || "",
        petSafety: ai.petSafety || "",
        indoorOutdoor: ai.indoorOutdoor || "",
        commonProblems: ai.commonProblems || "",
        careTips: ai.careTips || ""
      }));

      toast.success("AI details generated!");
    } catch (error) {
      console.log(error);
      toast.error("Unable to generate AI details.");
    } finally {
      setGenerating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadRes = await uploadPlantImage(imageFile);
        imageUrl = uploadRes.data.imageUrl;
      }
      const payload = {
        ...plant,
        imageUrl
      };

      console.log("Sending payload:", payload);

      await createPlant(payload);
      toast.success("Plant added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add plant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="ap-page">
        <div className="ap-layout">

          {/* LEFT PANEL */}
          <aside className="ap-left">
            {/* Decorative only — the matted window photo + pane cross
                live entirely in CSS (.ap-left-photo). */}
            <div className="ap-left-photo" aria-hidden="true" />

            <div className="ap-left-inner">
              <span className="ap-left-badge">🌿 New Plant</span>

              <div className="ap-brand">GreenBuddy</div>

              <div className="ap-left-copy">
                <h2 className="ap-tagline">
                  Grow Smarter,<br />Grow Better
                </h2>
                <p className="ap-desc">
                  Track plant health, watering schedules, and care
                  information all in one place.
                </p>
              </div>

              <div className="ap-features">
                <div className="ap-feature">
                  <div className="ap-feature-dot" />
                  <span>Watering reminders</span>
                </div>
                <div className="ap-feature">
                  <div className="ap-feature-dot" />
                  <span>Sunlight tracking</span>
                </div>
                <div className="ap-feature">
                  <div className="ap-feature-dot" />
                  <span>Health monitoring</span>
                </div>
                <div className="ap-feature">
                  <div className="ap-feature-dot" />
                  <span>Growth journal</span>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT FORM PANEL */}
          <main className="ap-right">

            <div className="ap-right-header">
              <h1>Add New Plant</h1>
              <p>Fill in your plant's details to start tracking</p>
            </div>

            <form onSubmit={handleSubmit} className="ap-form">

              {/* PHOTO */}
              <section className="ap-section">
                <h3 className="ap-section-label">Photo</h3>
                <div className="ap-upload-area">
                  {imagePreview ? (
                    <div className="ap-preview-wrap">
                      <img src={imagePreview} alt="preview" className="ap-preview-img" />
                      <button type="button" className="ap-remove-btn" onClick={clearImage}>
                        &times;
                      </button>
                      <label className="ap-replace-btn">
                        Replace photo
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                      </label>
                    </div>
                  ) : (
                    <label className="ap-upload-label">
                      <div className="ap-upload-icon-wrap">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <span className="ap-upload-text">Click to upload a photo</span>
                      <span className="ap-upload-hint">Optional — a stock photo will be used if you skip this</span>
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />
                    </label>
                  )}
                </div>
              </section>

              {/* REQUIRED */}
              <section className="ap-section">
                <h3 className="ap-section-label">Required Information</h3>
                <div className="ap-field-grid">

                  <div className="ap-field">
                    <label>Plant Name <span className="ap-req">*</span></label>
                    <input type="text" name="plantName" value={plant.plantName} onChange={handleChange} placeholder="e.g. Money Plant" required />
                    <button
                      type="button"
                      className="ai-btn"
                      onClick={handleGenerateAI}
                      disabled={generating}
                    >
                      {generating ? "Generating Botanical Specs..." : "✨ Auto-Fill with AI"}
                    </button>
                    <div className="ap-quick-suggestions">
                      <span>Quick picks:</span>
                      {["Monstera Deliciosa", "Snake Plant", "Golden Pothos", "Peace Lily", "Aloe Vera"].map((name) => (
                        <button
                          key={name}
                          type="button"
                          className="ap-chip-btn"
                          onClick={() => {
                            setPlant((prev) => ({ ...prev, plantName: name }));
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ap-field">
                    <label>Location <span className="ap-req">*</span></label>
                    <input type="text" name="location" value={plant.location} onChange={handleChange} placeholder="e.g. Living Room" required />
                  </div>

                  <div className="ap-field">
                    <label>Health Status <span className="ap-req">*</span></label>
                    <select name="healthStatus" value={plant.healthStatus} onChange={handleChange}>
                      <option>Healthy</option>
                      <option>Needs Attention</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div className="ap-field">
                    <label>Watering Frequency (Days) <span className="ap-req">*</span></label>
                    <input type="number" name="wateringFrequency" value={plant.wateringFrequency} onChange={handleChange} placeholder="e.g. 3" required />
                  </div>

                  <div className="ap-field">
                    <label>Sunlight Requirement <span className="ap-req">*</span></label>
                    <input type="text" name="sunlight" value={plant.sunlight} onChange={handleChange} placeholder="e.g. Bright Indirect Light" required />
                  </div>

                  <div className="ap-field">
                    <label>Last Watered Date <span className="ap-req">*</span></label>
                    <input type="date" name="lastWateredDate" value={plant.lastWateredDate || ""} onChange={handleChange} required />
                  </div>

                  <div className="ap-field">
                    <label>Category <span className="ap-req">*</span></label>
                    <select
                      name="category"
                      value={plant.category}
                      onChange={handleChange}
                    >
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ADVANCED */}
              <section className="ap-section">
                <h3 className="ap-section-label">
                  Advanced Information
                  <span className="ap-optional">Optional</span>
                </h3>
                <div className="ap-field-grid">

                  <div className="ap-field">
                    <label>Scientific Name</label>
                    <input type="text" name="scientificName" value={plant.scientificName} onChange={handleChange} placeholder="e.g. Epipremnum aureum" />
                  </div>

                  <div className="ap-field ap-field--full">
                    <label>Ideal Temperature</label>
                    <input type="text" name="temperature" value={plant.temperature} onChange={handleChange} placeholder="e.g. 18–27°C" />
                  </div>

                  <div className="ap-field">
                    <label>Humidity</label>
                    <input
                      name="humidity"
                      value={plant.humidity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field">
                    <label>Soil</label>
                    <input
                      name="soil"
                      value={plant.soil}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field">
                    <label>Pet Safety</label>
                    <input
                      name="petSafety"
                      value={plant.petSafety}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field">
                    <label>Indoor / Outdoor</label>
                    <input
                      name="indoorOutdoor"
                      value={plant.indoorOutdoor}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field ap-field--full">
                    <label>Common Problems</label>
                    <textarea
                      rows="3"
                      name="commonProblems"
                      value={plant.commonProblems}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field ap-field--full">
                    <label>Care Tips</label>
                    <textarea
                      rows="3"
                      name="careTips"
                      value={plant.careTips}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field ap-field--full">
                    <label>Wikipedia Link</label>
                    <input
                      name="wikipediaLink"
                      value={plant.wikipediaLink}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="ap-field ap-field--full">
                    <label>Description</label>
                    <textarea rows="3" name="description" value={plant.description} onChange={handleChange} placeholder="Notes about this plant..." />
                  </div>

                </div>
              </section>

              <div className="ap-actions">
                <button type="button" className="ap-cancel-btn" onClick={() => navigate("/dashboard")}>
                  Cancel
                </button>
                <button type="submit" className="ap-submit-btn" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Plant"}
                </button>
              </div>

            </form>
          </main>

        </div>
      </div>
    </>
  );
}

export default AddPlant;