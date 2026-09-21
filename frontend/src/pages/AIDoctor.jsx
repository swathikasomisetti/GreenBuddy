import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { getPlants } from "../api/plantApi";
import { diagnosePlant, predictCustomHealth } from "../api/aiApi";
import { toast } from "react-toastify";
import {
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiCpu,
  FiDroplet,
  FiInfo,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiSun,
  FiUploadCloud,
  FiX
} from "react-icons/fi";
import "./AIDoctor.css";

const COMMON_SYMPTOMS = [
  { id: "yellow_leaves", label: "🍂 Yellowing Leaves", desc: "Lower or whole leaf turn yellow" },
  { id: "brown_tips", label: "🟤 Brown Crisp Edges", desc: "Dry, brittle leaf margins" },
  { id: "powdery_mildew", label: "⚪ White Powdery Dust", desc: "Chalky film on leaf surface" },
  { id: "black_spots", label: "🖤 Black Spots / Blight", desc: "Dark spots with yellow halos" },
  { id: "drooping", label: "🥀 Drooping / Wilting", desc: "Limp stems despite moist soil" },
  { id: "spider_mites", label: "🕸️ Webbing / Tiny Pests", desc: "Fine silk webs under leaves" },
  { id: "mushy_stem", label: "💧 Soft Mushy Stem", desc: "Dark, waterlogged base" },
  { id: "sunburn", label: "☀️ Bleached Sun Scorch", desc: "Faded, burned white patches" },
  { id: "pale_foliage", label: "🌱 Pale Light Green", desc: "Slow growth & nutrient loss" },
  { id: "leaf_curl", label: "🍃 Curling / Inward Fold", desc: "Leaves curling to retain moisture" }
];

export default function AIDoctor() {
  const [activeTab, setActiveTab] = useState("diagnose"); // "diagnose" | "predictor"
  const [userPlants, setUserPlants] = useState([]);
  const [selectedPlantName, setSelectedPlantName] = useState("");
  const [customPlantName, setCustomPlantName] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  // ML Health Predictor tab states
  const [predictCategory, setPredictCategory] = useState("Indoor");
  const [predictWateringFreq, setPredictWateringFreq] = useState(7);
  const [predictDaysSince, setPredictDaysSince] = useState(8);
  const [predictHealthStatus, setPredictHealthStatus] = useState("Healthy");
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserPlants();
  }, []);

  const loadUserPlants = async () => {
    try {
      const res = await getPlants();
      if (res.data && Array.isArray(res.data)) {
        setUserPlants(res.data);
      }
    } catch (e) {
      console.log("Could not load user plants:", e);
    }
  };

  const toggleSymptom = (label) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectPlant = (e) => {
    const name = e.target.value;
    setSelectedPlantName(name);
    if (name) {
      setCustomPlantName(name);
    }
  };

  const handleRunDiagnosis = async () => {
    const effectivePlantName = customPlantName.trim() || selectedPlantName.trim() || "Houseplant";

    if (selectedSymptoms.length === 0 && !notes.trim() && !imagePreview) {
      toast.warn("Please select at least one symptom, upload a photo, or enter notes.");
      return;
    }

    setIsScanning(true);
    setDiagnosisResult(null);

    try {
      const data = {
        plantName: effectivePlantName,
        symptoms: selectedSymptoms,
        notes: notes,
        imageBase64: imagePreview ? imagePreview.split(",")[1] : null
      };

      // Minimum scan animation delay for satisfying visual scanner UX
      const [result] = await Promise.all([
        diagnosePlant(data),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);

      setDiagnosisResult(result);
      toast.success("Diagnosis complete!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to complete diagnosis. Try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRunPrediction = async () => {
    setIsPredicting(true);
    try {
      const payload = {
        plantName: customPlantName.trim() || "Selected Plant",
        category: predictCategory,
        wateringFrequency: parseInt(predictWateringFreq, 10),
        daysSinceWatered: parseInt(predictDaysSince, 10),
        healthStatus: predictHealthStatus
      };

      const result = await predictCustomHealth(payload);
      setPredictionResult(result);
      toast.success("Health vitality prediction updated!");
    } catch (e) {
      toast.error("Prediction calculation failed.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="ai-doctor-page">
      <Navbar />

      <main className="ai-doctor-container">
        {/* Header Hero Banner */}
        <header className="ai-doctor-hero">
          <div className="hero-badge">
            <FiCpu className="badge-icon" /> AI Botanical Specialist
          </div>
          <h1>Plant Health Doctor & ML Vitality Engine</h1>
          <p>
            Diagnose diseases from leaf symptoms, detect pathogens, and calculate
            precision hydration risks with our botanical machine learning engine.
          </p>

          <div className="ai-tab-switcher">
            <button
              className={`tab-btn ${activeTab === "diagnose" ? "is-active" : ""}`}
              onClick={() => setActiveTab("diagnose")}
            >
              🩺 Leaf & Disease Diagnostic Studio
            </button>
            <button
              className={`tab-btn ${activeTab === "predictor" ? "is-active" : ""}`}
              onClick={() => {
                setActiveTab("predictor");
                if (!predictionResult) handleRunPrediction();
              }}
            >
              📊 Smart Vitality & Hydration Predictor
            </button>
          </div>
        </header>

        {activeTab === "diagnose" ? (
          <div className="ai-diagnostic-grid">
            {/* Left Panel: Symptoms & Input */}
            <section className="diagnostic-input-panel">
              <div className="panel-card">
                <div className="card-header">
                  <h3>1. Identify Target Plant</h3>
                  <span className="step-num">Step 1</span>
                </div>

                {userPlants.length > 0 && (
                  <div className="form-group">
                    <label>Pick from your saved garden:</label>
                    <select
                      value={selectedPlantName}
                      onChange={handleSelectPlant}
                      className="plant-select"
                    >
                      <option value="">-- Or enter name manually below --</option>
                      {userPlants.map((p) => (
                        <option key={p.id} value={p.plantName}>
                          {p.plantName} ({p.category || "Indoor"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Plant Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Monstera Deliciosa, Snake Plant, Peace Lily..."
                    value={customPlantName}
                    onChange={(e) => setCustomPlantName(e.target.value)}
                    className="plant-input"
                  />
                </div>
              </div>

              {/* Photo Upload & Scanner Box */}
              <div className="panel-card">
                <div className="card-header">
                  <h3>2. Photo Inspection (Optional)</h3>
                  <span className="step-num">Step 2</span>
                </div>

                <div
                  className={`image-drop-zone ${imagePreview ? "has-image" : ""}`}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />

                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Leaf Preview" className="preview-img" />
                      {isScanning && (
                        <div className="scanner-laser-overlay">
                          <div className="laser-line"></div>
                          <div className="scanner-text">ANALYZING LEAF TISSUE...</div>
                        </div>
                      )}
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <FiX /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="drop-zone-placeholder">
                      <FiUploadCloud className="upload-icon" />
                      <p className="upload-title">Drop or click to upload leaf photo</p>
                      <span className="upload-subtitle">Supports JPG, PNG, WEBP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Common Symptoms Selector */}
              <div className="panel-card">
                <div className="card-header">
                  <h3>3. Select Visible Symptoms</h3>
                  <span className="step-num">Step 3</span>
                </div>

                <div className="symptoms-grid">
                  {COMMON_SYMPTOMS.map((s) => {
                    const isSelected = selectedSymptoms.includes(s.label);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`symptom-chip ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleSymptom(s.label)}
                      >
                        <span className="chip-label">{s.label}</span>
                        <span className="chip-desc">{s.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="form-group notes-group">
                  <label>Additional Observations (Optional):</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Recently moved near window, soil smells damp, spots appeared after misting..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="notes-textarea"
                  />
                </div>

                <button
                  type="button"
                  className={`run-scan-btn ${isScanning ? "scanning" : ""}`}
                  onClick={handleRunDiagnosis}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <FiRefreshCw className="spin-icon" /> AI Doctor Analyzing Plant...
                    </>
                  ) : (
                    <>
                      <FiActivity /> Run AI Diagnostic Scan
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Right Panel: Diagnosis Results Card */}
            <section className="diagnostic-result-panel">
              {isScanning ? (
                <div className="diagnosis-loading-state">
                  <div className="scanning-radar">
                    <div className="radar-circle"></div>
                    <div className="radar-sweep"></div>
                  </div>
                  <h3>Botanical Pathology Analysis in Progress</h3>
                  <p>Comparing symptom vectors against botanical disease database...</p>
                </div>
              ) : diagnosisResult ? (
                <div className="diagnosis-report-card">
                  <div className="report-header">
                    <div className="report-badge-row">
                      <span className={`severity-tag severity-${diagnosisResult.severity?.toLowerCase()}`}>
                        {diagnosisResult.severity} Severity
                      </span>
                      <span className="confidence-tag">
                        🎯 {diagnosisResult.confidenceScore || 92}% Match Confidence
                      </span>
                    </div>

                    <h2 className="disease-title">{diagnosisResult.diseaseName}</h2>
                    {diagnosisResult.scientificClassification && (
                      <p className="scientific-sub">
                        Pathogen / Classification: <em>{diagnosisResult.scientificClassification}</em>
                      </p>
                    )}
                  </div>

                  <div className="summary-alert">
                    <FiInfo className="alert-icon" />
                    <p>{diagnosisResult.summary}</p>
                  </div>

                  {/* Primary Cause */}
                  <div className="report-section">
                    <h4>🔍 Primary Cause</h4>
                    <p className="cause-text">{diagnosisResult.primaryCause}</p>
                  </div>

                  {/* Environment Adjustments */}
                  <div className="adjustments-grid">
                    <div className="adj-card">
                      <div className="adj-title">
                        <FiDroplet className="adj-icon water-color" /> Hydration Adjustment
                      </div>
                      <p>{diagnosisResult.wateringAdjustment || "Water only when topsoil dries."}</p>
                    </div>

                    <div className="adj-card">
                      <div className="adj-title">
                        <FiSun className="adj-icon sun-color" /> Sunlight Adjustment
                      </div>
                      <p>{diagnosisResult.sunlightAdjustment || "Provide filtered indirect sunlight."}</p>
                    </div>
                  </div>

                  {/* Immediate Action Steps */}
                  {diagnosisResult.treatmentSteps && diagnosisResult.treatmentSteps.length > 0 && (
                    <div className="report-section">
                      <h4>
                        <FiCheckCircle className="sec-icon" /> Immediate Treatment Steps
                      </h4>
                      <ol className="treatment-list">
                        {diagnosisResult.treatmentSteps.map((step, idx) => (
                          <li key={idx}>
                            <strong>Step {idx + 1}:</strong> {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Organic Remedies */}
                  {diagnosisResult.organicRemedies && diagnosisResult.organicRemedies.length > 0 && (
                    <div className="report-section organic-box">
                      <h4>
                        <FiShield className="sec-icon" /> 🌿 Safe Organic Home Remedies
                      </h4>
                      <ul className="remedy-list">
                        {diagnosisResult.organicRemedies.map((remedy, idx) => (
                          <li key={idx}>{remedy}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prevention Tips */}
                  {diagnosisResult.preventionTips && diagnosisResult.preventionTips.length > 0 && (
                    <div className="report-section">
                      <h4>🛡️ Long-term Prevention</h4>
                      <ul className="prevention-list">
                        {diagnosisResult.preventionTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="report-footer">
                    <button
                      className="reset-btn"
                      onClick={() => {
                        setDiagnosisResult(null);
                        setSelectedSymptoms([]);
                        setNotes("");
                        removeImage();
                      }}
                    >
                      <FiRefreshCw /> Diagnose Another Plant
                    </button>
                  </div>
                </div>
              ) : (
                <div className="diagnosis-empty-placeholder">
                  <div className="placeholder-icon-wrap">
                    <FiSearch />
                  </div>
                  <h3>No Diagnosis Run Yet</h3>
                  <p>
                    Select visible symptoms on the left, upload a photo, or choose one
                    of your garden plants to generate an instant pathology diagnosis
                    with organic home treatments.
                  </p>
                  <div className="quick-test-box">
                    <span>💡 Quick Test Scenarios:</span>
                    <button
                      type="button"
                      className="quick-scenario-btn"
                      onClick={() => {
                        setCustomPlantName("Monstera Deliciosa");
                        setSelectedSymptoms(["🍂 Yellowing Leaves", "💧 Soft Mushy Stem"]);
                      }}
                    >
                      Overwatering & Root Rot
                    </button>
                    <button
                      type="button"
                      className="quick-scenario-btn"
                      onClick={() => {
                        setCustomPlantName("Calathea");
                        setSelectedSymptoms(["🟤 Brown Crisp Edges", "🍃 Curling / Inward Fold"]);
                      }}
                    >
                      Dehydration & Crisp Tips
                    </button>
                    <button
                      type="button"
                      className="quick-scenario-btn"
                      onClick={() => {
                        setCustomPlantName("Rose Plant");
                        setSelectedSymptoms(["⚪ White Powdery Dust"]);
                      }}
                    >
                      Powdery Mildew Fungal
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* ML Plant Health Vitality Predictor Tab */
          <div className="ai-predictor-layout">
            <div className="predictor-controls-card">
              <h3>Hydration & Vitality Simulator</h3>
              <p className="controls-desc">
                Adjust the environmental variables to test our predictive plant health model.
              </p>

              <div className="predictor-form">
                <div className="form-group">
                  <label>Plant Category:</label>
                  <select
                    value={predictCategory}
                    onChange={(e) => setPredictCategory(e.target.value)}
                    className="plant-select"
                  >
                    <option value="Indoor">Indoor Houseplant (Moderate water tolerance)</option>
                    <option value="Succulent">Succulent / Cactus (High drought tolerance)</option>
                    <option value="Outdoor">Outdoor Garden Plant (High evaporation)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Target Watering Cadence: <strong>Every {predictWateringFreq} days</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="21"
                    value={predictWateringFreq}
                    onChange={(e) => setPredictWateringFreq(e.target.value)}
                    className="range-slider"
                  />
                  <div className="range-labels">
                    <span>1 day</span>
                    <span>7 days</span>
                    <span>14 days</span>
                    <span>21 days</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Days Elapsed Since Last Watered: <strong>{predictDaysSince} days ago</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    value={predictDaysSince}
                    onChange={(e) => setPredictDaysSince(e.target.value)}
                    className="range-slider"
                  />
                  <div className="range-labels">
                    <span>Today (0)</span>
                    <span>1 week (7)</span>
                    <span>2 weeks (14)</span>
                    <span>4 weeks (28)</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Observed Condition:</label>
                  <select
                    value={predictHealthStatus}
                    onChange={(e) => setPredictHealthStatus(e.target.value)}
                    className="plant-select"
                  >
                    <option value="Healthy">Flourishing & Healthy</option>
                    <option value="Needs water">Slightly drooping / Needs water</option>
                    <option value="Needs attention">Stressed / Discolored leaves</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="recalculate-btn"
                  onClick={handleRunPrediction}
                  disabled={isPredicting}
                >
                  <FiActivity /> Compute Vitality Index
                </button>
              </div>
            </div>

            {/* Prediction Output Card */}
            {predictionResult && (
              <div className="predictor-result-card">
                <div className="metric-score-row">
                  <div className="radial-score-box">
                    <span className="score-number">{predictionResult.healthScore}</span>
                    <span className="score-max">/100</span>
                    <span className="score-label">AI Health Index</span>
                  </div>

                  <div className="vitality-meta">
                    <span className={`vitality-pill badge-${predictionResult.statusBadgeColor}`}>
                      {predictionResult.vitalityLevel} Vitality
                    </span>
                    <h4>
                      Watering Urgency:{" "}
                      <span className={`urgency-text urgency-${predictionResult.wateringUrgency?.toLowerCase()}`}>
                        {predictionResult.wateringUrgency}
                      </span>
                    </h4>
                    <p className="urgency-sub">
                      {predictionResult.daysUntilNextWater === 0
                        ? "⚠️ Overdue for hydration!"
                        : `Next hydration in approx. ${predictionResult.daysUntilNextWater} days.`}
                    </p>
                  </div>
                </div>

                {/* Risk Meters */}
                <div className="risk-meters">
                  <div className="risk-meter-item">
                    <div className="meter-header">
                      <span>🌵 Dehydration Risk</span>
                      <strong>{predictionResult.dehydrationRiskPercent}%</strong>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill dehydration-fill"
                        style={{ width: `${predictionResult.dehydrationRiskPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="risk-meter-item">
                    <div className="meter-header">
                      <span>💧 Overwatering Risk</span>
                      <strong>{predictionResult.overwateringRiskPercent}%</strong>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill overwater-fill"
                        style={{ width: `${predictionResult.overwateringRiskPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* AI Care Recommendation */}
                <div className="prediction-recommendation">
                  <h4>💡 Botanist Recommendation</h4>
                  <p className="rec-text">{predictionResult.recommendedAction}</p>
                </div>

                {/* Action Checklist */}
                {predictionResult.actionChecklist && (
                  <div className="prediction-checklist">
                    <h5>Action Checklist:</h5>
                    <ul>
                      {predictionResult.actionChecklist.map((item, idx) => (
                        <li key={idx}>
                          <FiCheckCircle className="check-bullet" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
