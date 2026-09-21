import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";


export const getWeather = (city) =>
    axios.get(`${BASE_URL}/api/weather/${city}`);