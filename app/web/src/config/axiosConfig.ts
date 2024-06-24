import axios from 'axios';

const instance = axios.create(
    {
        baseURL: "http://localhost:8081/api/v1/alumni-fil",
        headers: {
            'Content-Type': 'application/json',
        }
    }
);

export default instance;