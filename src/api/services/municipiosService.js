import apiClient from './apiClient';

/**
 * Service for handling municipios-related API requests
 */
const municipiosService = {
  /**
   * Get all municipios
   * @returns {Promise} Promise object representing the API call
   */
  getAllMunicipios: async () => {
    return await apiClient.get('/municipios');
  },

  /**
   * Get a specific municipio by IBGE code with its desempenhos and missões
   * @param {string} ibgeCode - The IBGE code of the municipio
   * @returns {Promise} Promise object representing the API call
   */
  getMunicipioByIbge: async (ibgeCode) => {
    return await apiClient.get(`/municipios/${ibgeCode}`);
  },
};

export default municipiosService; 