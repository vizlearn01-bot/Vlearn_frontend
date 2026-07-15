import axios from 'axios';
import BASE_URL from '../config';

/**
 * Centralized Axios instance.
 *
 * - Automatically attaches the Bearer token from localStorage to every request.
 * - Ensures all requests use the correct base URL.
 * - Handles 401 responses by clearing the stale token from storage.
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach auth token before every request
apiClient.interceptors.request.use(
    (config) => {
        try {
            const stored = localStorage.getItem('token');
            if (stored) {
                const token = JSON.parse(stored);
                if (token?.access) {
                    config.headers.Authorization = `Bearer ${token.access}`;
                }
            }
        } catch {
            // Malformed token in storage — ignore, the request will be unauthenticated
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Clear stale token on 401 so the user is prompted to log in again
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Avoid hard redirect here — let components handle the auth state
        }
        return Promise.reject(error);
    },
);

export default apiClient;
