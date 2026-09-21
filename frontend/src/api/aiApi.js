import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";
const AI_URL = `${BASE_URL}/api/ai`;


export const diagnosePlant = async (data) => {
  const response = await axios.post(`${AI_URL}/diagnose`, data);
  return response.data;
};

export const identifyPlant = async (data) => {
  const response = await axios.post(`${AI_URL}/identify`, data);
  return response.data;
};

export const predictPlantHealth = async (plantId) => {
  const response = await axios.get(`${AI_URL}/predict/${plantId}`);
  return response.data;
};

export const predictCustomHealth = async (data) => {
  const response = await axios.post(`${AI_URL}/predict-custom`, data);
  return response.data;
};

export const askGeneralAI = async (message) => {
  const response = await axios.post(`${AI_URL}/chat`, { message });
  return response.data.reply;
};

export const askGardenAI = async (message) => {
  const response = await axios.post(`${AI_URL}/my-plants-chat`, { message });
  return response.data.reply;
};
