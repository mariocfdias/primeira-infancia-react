import apiClient from './apiClient';

/**
 * Service for handling eventos-related API requests
 */
const eventosService = {
  /**
   * Get all eventos with pagination and filtering
   * @param {Object} params - Query parameters for filtering and pagination
   * @param {number} [params.page=0] - Page number (starting from 0)
   * @param {number} [params.limit=10] - Number of records per page
   * @param {string} [params.event] - Filter by event name
   * @param {string} [params.municipioSearch] - Filter by municipality name
   * @param {string} [params.sortDirection=DESC] - Sort direction (ASC or DESC)
   * @returns {Promise} Promise object representing the API call
   */
  getEventos: async (params = {}) => {
    return await apiClient.get('/eventos', { params });
  },

  /**
   * Get a specific evento by ID
   * @param {number} id - The ID of the evento
   * @returns {Promise} Promise object representing the API call
   */
  getEventoById: async (id) => {
    return await apiClient.get(`/eventos/${id}`);
  },

  /**
   * Get all eventos for a specific municipality with pagination and filtering
   * @param {string} codIbge - The IBGE code of the municipality
   * @param {Object} params - Query parameters for filtering and pagination
   * @param {number} [params.page=0] - Page number (starting from 0)
   * @param {number} [params.limit=10] - Number of records per page
   * @param {string} [params.event] - Filter by event name
   * @param {string} [params.sortDirection=DESC] - Sort direction (ASC or DESC)
   * @returns {Promise} Promise object representing the API call
   */
  getEventosByMunicipio: async (codIbge, params = {}) => {
    return await apiClient.get(`/eventos/municipio/${codIbge}`, { params });
  },

  /**
   * Search municipalities by name (for autocomplete)
   * @param {string} query - Search term for municipality name
   * @param {number} [limit=10] - Maximum number of results
   * @returns {Promise} Promise object representing the API call
   */
  searchMunicipios: async (query, limit = 10) => {
    return await apiClient.get('/eventos/municipios/search', { 
      params: { q: query, limit } 
    });
  },
};

export default eventosService; 