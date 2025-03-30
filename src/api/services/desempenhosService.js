import apiClient from './apiClient';

/**
 * Service for handling desempenhos-related API requests
 */
const desempenhosService = {
  /**
   * Get all desempenhos
   * @returns {Promise} Promise object representing the API call
   */
  getAllDesempenhos: async () => {
    return await apiClient.get('/desempenhos');
  },

  /**
   * Get a specific desempenho by ID
   * @param {number} id - The ID of the desempenho
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhoById: async (id) => {
    return await apiClient.get(`/desempenhos/${id}`);
  },

  /**
   * Get all desempenhos for a specific municipality
   * @param {string} codIbge - The IBGE code of the municipality
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhosByMunicipio: async (codIbge) => {
    return await apiClient.get(`/desempenhos/municipio/${codIbge}`);
  },

  /**
   * Get all desempenhos for a specific mission
   * @param {string} missaoId - The ID of the mission
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhosByMissao: async (missaoId) => {
    return await apiClient.get(`/desempenhos/missao/${missaoId}`);
  },

  /**
   * Get a specific desempenho by municipality and mission
   * @param {string} codIbge - The IBGE code of the municipality
   * @param {string} missaoId - The ID of the mission
   * @returns {Promise} Promise object representing the API call
   */
  getDesempenhoByMunicipioAndMissao: async (codIbge, missaoId) => {
    return await apiClient.get(`/desempenhos/municipio/${codIbge}/missao/${missaoId}`);
  },
};

export default desempenhosService; 