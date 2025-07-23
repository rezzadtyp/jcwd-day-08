import axios from "axios";

export const api = axios.create({
    baseURL: `https://clearweight-us.backendless.app/api/data`,
    headers: {
        'Content-Type': 'application/json'
    }
})