import axios from "axios";
import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;


export const askAI = async (message) => {

    const response = await axios.post(
        `${BASE_URL}/api/ai/chat`,
        {
            message
        }
    );

    return response.data.reply;
};
export const askMyPlantsAI = async (message) => {

    const response = await axios.post(
        `${BASE_URL}/api/ai/my-plants-chat`,
        {
            message
        }
    );

    return response.data.reply;
};