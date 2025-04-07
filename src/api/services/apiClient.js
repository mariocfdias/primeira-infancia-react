import axios from 'axios';

// Determine the base URL based on the environment
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction
  ? 'https://primeira-infancia-backend.onrender.com/api'
  : "https://primeira-infancia-backend.onrender.com/api"//'http://localhost:3001/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for any request preprocessing
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for any response preprocessing
apiClient.interceptors.response.use(
  (response) => {
    // Return the actual data from the response
    return response.data;
  },
  (error) => {
    // Handle and standardize errors
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      data: error.response?.data || {},
    };
    return Promise.reject(customError);
  }
);

export default apiClient;