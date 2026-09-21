import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

const API_URL = `${BASE_URL}/api/plants`;
const JOURNAL_URL = `${BASE_URL}/api/journal`;
const PROFILE_URL = `${BASE_URL}/api/profile`;

// ── Plants ─────────────────────────────────────────────────────
export const getPlants        = ()        => axios.get(API_URL);
export const getPlantById     = (id)      => axios.get(`${API_URL}/${id}`);
export const createPlant      = (plant)   => axios.post(API_URL, plant);
export const updatePlant      = (id, p)   => axios.put(`${API_URL}/${id}`, p);
export const toggleFavorite   = (id)      => axios.patch(`${API_URL}/${id}/favorite`);
export const deletePlant      = (id)      => axios.delete(`${API_URL}/${id}`);
export const getOverduePlants = ()        => axios.get(`${API_URL}/overdue`);
export const waterPlant       = (id)      => axios.patch(`${API_URL}/${id}/water`);

export const uploadPlantImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return axios.post(`${API_URL}/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ── Journal ────────────────────────────────────────────────────
export const getJournalEntries     = (plantId)              => axios.get(`${JOURNAL_URL}/${plantId}`);
export const addJournalEntry       = (data)                  => axios.post(JOURNAL_URL, data);
export const deleteJournalEntry    = (entryId)               => axios.delete(`${JOURNAL_URL}/${entryId}`);

export const addJournalEntryWithPhoto = (plantId, note, photoFile) => {
  const formData = new FormData();
  formData.append("plantId", plantId);
  formData.append("note", note);
  if (photoFile) formData.append("photo", photoFile);
  return axios.post(`${JOURNAL_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ── Profile ────────────────────────────────────────────────────
export const getProfile    = ()    => axios.get(PROFILE_URL);
export const updateProfile = (data) => axios.put(PROFILE_URL, data);
export const getProfileStats = ()  => axios.get(`${PROFILE_URL}/stats`);

export const changePassword = (currentPassword, newPassword) =>
  axios.put(`${PROFILE_URL}/change-password`, { currentPassword, newPassword });

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return axios.post(`${PROFILE_URL}/upload-avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const generatePlantDetails = (plantName) =>
  axios.post(`${BASE_URL}/api/ai/generate-plant`, {
    plantName,
  });

// ── Utilities ──────────────────────────────────────────────────
export const resolvePhotoUrl = (relativeUrl) =>
  relativeUrl ? `${BASE_URL}${relativeUrl}` : null;
