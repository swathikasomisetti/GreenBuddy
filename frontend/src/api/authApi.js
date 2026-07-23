import axios from "axios";

const AUTH_URL =
  "http://localhost:8082/api/auth";

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