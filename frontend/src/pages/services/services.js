import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response; // Return full response to catch errors
    },
    register: async (name, email, password, role) => {
        const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
        return response;
    }
};

export const eventService = {
    getAllEvents: async () => {
        const response = await axios.get(`${API_URL}/events`);
        return response;
    },
    getEventsByOrganizer: async (organizerId) => {
        const response = await axios.get(`${API_URL}/events/organizer/${organizerId}`);
        return response;
    },
    createEvent: async (eventData) => {
        const response = await axios.post(`${API_URL}/events`, eventData);
        return response;
    }
};

export const registrationService = {
    registerForEvent: async (eventId) => {
        const response = await axios.post(`${API_URL}/registrations`, { eventId });
        return response;
    },
    getUserRegistrations: async (userId) => {
        const response = await axios.get(`${API_URL}/registrations/user/${userId}`);
        return response;
    }
};
