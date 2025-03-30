import apiClient from './apiClient';

/**
 * Service for handling dashboard-related API requests
 */
const dashboardService = {
  /**
   * Get mission panorama overview
   * @returns {Promise} Promise object representing the API call
   */
  getMissionPanorama: async () => {
    return await apiClient.get('/dashboard/mission-panorama');
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
   * @returns {Promise} Promise object representing the API call
   */
  getMapPanorama: async () => {
    return await apiClient.get('/dashboard/map-panorama');
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