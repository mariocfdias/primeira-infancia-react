import apiClient from './apiClient';

/**
 * Service for handling missoes-related API requests
 */
const missoesService = {
  /**
   * Get all missoes
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getAllMissoes: async (params = {}) => {
    return await apiClient.get('/missoes', { params });
  },

  /**
   * Get a specific missao by ID
   * @param {string} missaoId - The ID of the missao
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getMissaoById: async (missaoId, params = {}) => {
    return await apiClient.get(`/missoes/${missaoId}`, { params });
  },
};

export default missoesService; 