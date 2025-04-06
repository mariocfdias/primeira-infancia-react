import apiClient from './apiClient';

/**
 * Service for handling desempenhos-related API requests
 */
const desempenhosService = {
  /**
   * Get all desempenhos
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getAllDesempenhos: async (params = {}) => {
    return await apiClient.get('/desempenhos', { params });
  },

  /**
   * Get a specific desempenho by ID
   * @param {number} id - The ID of the desempenho
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhoById: async (id, params = {}) => {
    return await apiClient.get(`/desempenhos/${id}`, { params });
  },

  /**
   * Get all desempenhos for a specific municipality
   * @param {string} codIbge - The IBGE code of the municipality
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhosByMunicipio: async (codIbge, params = {}) => {
    return await apiClient.get(`/desempenhos/municipio/${codIbge}`, { params });
  },

  /**
   * Get all desempenhos for a specific mission
   * @param {string} missaoId - The ID of the mission
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhosByMissao: async (missaoId, params = {}) => {
    return await apiClient.get(`/desempenhos/missao/${missaoId}`, { params });
  },

  /**
   * Get a specific desempenho by municipality and mission
   * @param {string} codIbge - The IBGE code of the municipality
   * @param {string} missaoId - The ID of the mission
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhoByMunicipioAndMissao: async (codIbge, missaoId, params = {}) => {
    return await apiClient.get(`/desempenhos/municipio/${codIbge}/missao/${missaoId}`, { params });
  },
};

export default desempenhosService; 