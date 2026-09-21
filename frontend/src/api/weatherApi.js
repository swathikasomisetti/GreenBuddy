import axios from "axios";
import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;


export const getWeather = (city) =>
    axios.get(`${BASE_URL}/api/weather/${city}`);