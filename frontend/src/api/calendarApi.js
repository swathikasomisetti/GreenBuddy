import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});


export const getCalendarEvents = () =>
    API.get("/calendar/events");