import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getPlantById,
  updatePlant,
  uploadPlantImage,
  resolvePhotoUrl
} from "../api/plantApi";
import { toast } from "react-toastify";
import "./EditPlant.css";

function EditPlant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [plant, setPlant] = useState({
    plantName: "",
    location: "",
    healthStatus: "Healthy",
    wateringFrequency: "",
    sunlight: "",
    lastWateredDate: "",
    scientificName: "",
    species: "",
    temperature: "",
    description: "",
    category: "Indoor",
    imageUrl: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadPlant(); }, []);

  const loadPlant = async () => {
    try {
      const response = await getPlantById(id);
      setPlant(response.data);
      if (response.data.imageUrl) {
        setImagePreview(resolvePhotoUrl(response.data.imageUrl));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load plant");
    }
  };

  const handleChange = (e) => setPlant({ ...plant, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setPlant({ ...plant, imageUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = plant.imageUrl;
      if (imageFile) {
        const uploadRes = await uploadPlantImage(imageFile);
        imageUrl = uploadRes.data.imageUrl;
      }
      await updatePlant(id, { ...plant, imageUrl });
      toast.success("Plant updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const healthColor =
    plant.healthStatus === "Healthy" ? "#22c55e"
    : plant.healthStatus === "Critical" ? "#ef4444"
    : "#f59e0b";

  return (
    <div className="ep-page">
      <div className="ep-layout">

        {/* LEFT SIDEBAR */}
        <aside className="ep-sidebar">
          <div className="ep-sidebar-inner">

            <div className="ep-brand">GreenBuddy</div>

            {/* Live preview card */}
            <div className="ep-preview-card">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="ep-preview-card-img" />
              ) : (
                <div className="ep-preview-card-empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>No photo yet</span>
                </div>
              )}
              <div
                className="ep-preview-status"
                style={{ background: healthColor }}
              >
                {plant.healthStatus || "Healthy"}
              </div>
            </div>

            {/* Live meta */}
            <div className="ep-sidebar-meta">
              <p className="ep-sidebar-plant-name">
                {plant.plantName || "Plant Name"}
              </p>
              {plant.location && (
                <div className="ep-sidebar-row">
                  <span className="ep-sidebar-key">Location</span>
                  <span className="ep-sidebar-val">{plant.location}</span>
                </div>
              )}
              {plant.wateringFrequency && (
                <div className="ep-sidebar-row">
                  <span className="ep-sidebar-key">Watering</span>
                  <span className="ep-sidebar-val">Every {plant.wateringFrequency} day{plant.wateringFrequency !== "1" ? "s" : ""}</span>
                </div>
              )}
              {plant.sunlight && (
                <div className="ep-sidebar-row">
                  <span className="ep-sidebar-key">Sunlight</span>
                  <span className="ep-sidebar-val">{plant.sunlight}</span>
                </div>
              )}
              {plant.category && (
                <div className="ep-sidebar-row">
                  <span className="ep-sidebar-key">Category</span>
                  <span className="ep-sidebar-val">{plant.category}</span>
                </div>
              )}
            </div>

            <p className="ep-sidebar-hint">Updates as you type</p>
          </div>
        </aside>

        {/* RIGHT FORM */}
        <main className="ep-main">
          <div className="ep-main-header">
            <h1>Edit Plant</h1>
            <p>Update your plant's details below</p>
          </div>

          <form onSubmit={handleSubmit} className="ep-form">

            {/* PHOTO */}
            <section className="ep-section">
              <h3 className="ep-section-label">Photo</h3>
              <div className="ep-upload-area">
                {imagePreview ? (
                  <div className="ep-img-preview-wrap">
                    <img src={imagePreview} alt="preview" className="ep-img-preview" />
                    <button type="button" className="ep-remove-btn" onClick={clearImage}>&times;</button>
                    <label className="ep-replace-btn">
                      Replace photo
                      <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                  </div>
                ) : (
                  <label className="ep-upload-label">
                    <div className="ep-upload-icon-wrap">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <span className="ep-upload-text">Click to upload a photo</span>
                    <span className="ep-upload-hint">JPG, PNG, WEBP up to 10MB</span>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />
                  </label>
                )}
              </div>
            </section>

            {/* REQUIRED */}
            <section className="ep-section">
              <h3 className="ep-section-label">Required Information</h3>
              <div className="ep-field-grid">

                <div className="ep-field">
                  <label>Plant Name <span className="ep-req">*</span></label>
                  <input type="text" name="plantName" value={plant.plantName} onChange={handleChange} placeholder="e.g. Money Plant" required />
                </div>

                <div className="ep-field">
                  <label>Location <span className="ep-req">*</span></label>
                  <input type="text" name="location" value={plant.location} onChange={handleChange} placeholder="e.g. Living Room" required />
                </div>

                <div className="ep-field">
                  <label>Health Status <span className="ep-req">*</span></label>
                  <select name="healthStatus" value={plant.healthStatus} onChange={handleChange}>
                    <option>Healthy</option>
                    <option>Needs Attention</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="ep-field">
                  <label>Category <span className="ep-req">*</span></label>
                  <select name="category" value={plant.category || "Indoor"} onChange={handleChange}>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                  </select>
                </div>

                <div className="ep-field">
                  <label>Watering Frequency (Days) <span className="ep-req">*</span></label>
                  <input type="number" min="1" name="wateringFrequency" value={plant.wateringFrequency} onChange={handleChange} placeholder="e.g. 3" required />
                </div>

                <div className="ep-field">
                  <label>Last Watered Date</label>
                  <input type="date" name="lastWateredDate" value={plant.lastWateredDate || ""} onChange={handleChange} />
                </div>

                <div className="ep-field ep-field--full">
                  <label>Sunlight Requirement <span className="ep-req">*</span></label>
                  <input type="text" name="sunlight" value={plant.sunlight} onChange={handleChange} placeholder="e.g. Bright Indirect Light" required />
                </div>

              </div>
            </section>

            {/* ADVANCED */}
            <section className="ep-section">
              <h3 className="ep-section-label">
                Advanced Information
                <span className="ep-optional">Optional</span>
              </h3>
              <div className="ep-field-grid">

                <div className="ep-field">
                  <label>Scientific Name</label>
                  <input type="text" name="scientificName" value={plant.scientificName || ""} onChange={handleChange} placeholder="e.g. Epipremnum aureum" />
                </div>

                <div className="ep-field">
                  <label>Species</label>
                  <input type="text" name="species" value={plant.species || ""} onChange={handleChange} placeholder="e.g. Pothos" />
                </div>

                <div className="ep-field ep-field--full">
                  <label>Ideal Temperature</label>
                  <input type="text" name="temperature" value={plant.temperature || ""} onChange={handleChange} placeholder="e.g. 18–27°C" />
                </div>

                <div className="ep-field ep-field--full">
                  <label>Description</label>
                  <textarea rows="4" name="description" value={plant.description || ""} onChange={handleChange} placeholder="Notes about this plant..." />
                </div>

              </div>
            </section>

            <div className="ep-actions">
              <button type="button" className="ep-cancel-btn" onClick={() => navigate("/dashboard")}>Cancel</button>
              <button type="submit" className="ep-save-btn" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </main>

      </div>
    </div>
  );
}

export default EditPlant;
