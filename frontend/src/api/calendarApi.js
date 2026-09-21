import axios from "axios";
import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});


export const getCalendarEvents = () =>
    API.get("/calendar/events");