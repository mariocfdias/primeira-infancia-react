import apiClient from './apiClient';

/**
 * Service for handling municipios-related API requests
 */
const municipiosService = {
  /**
   * Get all municipios
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getAllMunicipios: async (params = {}) => {
    return await apiClient.get('/municipios', { params });
  },

  /**
   * Get a specific municipio by IBGE code with its desempenhos and missões
   * @param {string} ibgeCode - The IBGE code of the municipio
   * @param {Object} params - Query parameters
   * @param {string} [params.orgao] - Optional organization filter
   * @returns {Promise} Promise object representing the API call
   */
  getMunicipioByIbge: async (ibgeCode, params = {}) => {
    return await apiClient.get(`/municipios/${ibgeCode}`, { params });
  },
};

export default municipiosService; 