import axios from "axios";
import { API_BASE_URL } from "./config";

const AUTH_URL = `${API_BASE_URL}/api/auth`;


export const registerUser = (data) =>
  axios.post(
    `${AUTH_URL}/register`,
    data
  );

export const loginUser = (data) =>
  axios.post(
    `${AUTH_URL}/login`,
    data
  );