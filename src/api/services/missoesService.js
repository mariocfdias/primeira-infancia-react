import apiClient from './apiClient';

/**
 * Service for handling missoes-related API requests
 */
const missoesService = {
  /**
   * Get all missoes
   * @returns {Promise} Promise object representing the API call
   */
  getAllMissoes: async () => {
    return await apiClient.get('/missoes');
  },

  /**
   * Get a specific missao by ID
   * @param {string} missaoId - The ID of the missao
   * @returns {Promise} Promise object representing the API call
   */
  getMissaoById: async (missaoId) => {
    return await apiClient.get(`/missoes/${missaoId}`);
  },
};

export default missoesService; 