import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";


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