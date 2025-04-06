import apiClient from './apiClient';

/**
 * Service for handling dashboard-related API requests
 */
const dashboardService = {
  /**
   * Get mission panorama overview
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getMissionPanorama: async (params = {}) => {
    return await apiClient.get('/dashboard/mission-panorama', { params });
  },

  /**
   * Get detailed mission panorama by mission ID
   * @param {string} missaoId - The ID of the mission
   * @returns {Promise} Promise object representing the API call
   */
  getMissionPanoramaById: async (missaoId) => {
    return await apiClient.get(`/dashboard/mission-panorama/${missaoId}`);
  },

  /**
   * Get map panorama with municipality performance distribution
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getMapPanorama: async (params = {}) => {
    return await apiClient.get('/dashboard/map-panorama', { params });
  },

  /**
   * Get map panorama for a specific municipality
   * @param {string} codIbge - The IBGE code of the municipality
   * @returns {Promise} Promise object representing the API call
   */
  getMapPanoramaByIbge: async (codIbge) => {
    return await apiClient.get(`/dashboard/map-panorama/${codIbge}`);
  },
};

export default dashboardService; 