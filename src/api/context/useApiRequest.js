import { useCallback } from 'react';
import { useApi } from './ApiContext';

/**
 * Custom hook to make API requests with loading, error and data state management
 * @returns {Object} Object with makeRequest function and state from API context
 */
const useApiRequest = () => {
  const { apiRequest, apiSuccess, apiFailure, loading, error, data, apiReset } = useApi();

  /**
   * Make an API request with proper state management
   * @param {Function} apiMethod - The API method to call (from a service)
   * @param {Array} args - Arguments to pass to the API method
   * @returns {Promise} Promise that resolves with the API response data
   */
  const makeRequest = useCallback(
    async (apiMethod, ...args) => {
      try {
        apiRequest();
        const response = await apiMethod(...args);
        apiSuccess(response);
        return response;
      } catch (err) {
        apiFailure(err);
        throw err;
      }
    },
    [apiRequest, apiSuccess, apiFailure]
  );

  return {
    makeRequest,
    loading,
    error,
    data,
    resetApi: apiReset,
  };
};

export default useApiRequest; 