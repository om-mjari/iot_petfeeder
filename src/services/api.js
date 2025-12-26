// API service for backend communication
// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make authenticated requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// Schedule API
export const scheduleAPI = {
  createSchedule: (scheduleData) => apiRequest('/schedule/create', {
    method: 'POST',
    body: JSON.stringify(scheduleData),
  }),
  
  getSchedules: () => apiRequest('/schedule/list'),
  
  updateSchedule: (id, updateData) => apiRequest(`/schedule/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  }),
  
  deleteSchedule: (id) => apiRequest(`/schedule/delete/${id}`, {
    method: 'DELETE',
  }),
};

// Feeding API
export const feedingAPI = {
  activateFeeding: (feedingData) => apiRequest('/feeding/activate', {
    method: 'POST',
    body: JSON.stringify(feedingData),
  }),
  
  stopFeeding: () => apiRequest('/feeding/stop', {
    method: 'POST',
  }),
  
  getFeedingLogs: () => apiRequest('/feeding/logs'),
  
  getFeedingStatus: () => apiRequest('/feeding/status'),
};

export default {
  authAPI,
  scheduleAPI,
  feedingAPI,
};