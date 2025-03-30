import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

// Initial state for the API context
const initialState = {
  loading: false,
  error: null,
  data: null,
};

// Action types
const API_ACTIONS = {
  API_REQUEST: 'API_REQUEST',
  API_SUCCESS: 'API_SUCCESS',
  API_FAILURE: 'API_FAILURE',
  API_RESET: 'API_RESET',
};

// Reducer to handle API state changes
const apiReducer = (state, action) => {
  switch (action.type) {
    case API_ACTIONS.API_REQUEST:
      return { ...state, loading: true, error: null };
    case API_ACTIONS.API_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
    case API_ACTIONS.API_FAILURE:
      return { ...state, loading: false, error: action.payload, data: null };
    case API_ACTIONS.API_RESET:
      return initialState;
    default:
      return state;
  }
};

// Create context
const ApiContext = createContext();

// API context provider component
export const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // API action dispatcher functions - memoized to prevent recreation on each render
  const apiRequest = useCallback(() => {
    dispatch({ type: API_ACTIONS.API_REQUEST });
  }, []);

  const apiSuccess = useCallback((data) => {
    dispatch({ type: API_ACTIONS.API_SUCCESS, payload: data });
  }, []);

  const apiFailure = useCallback((error) => {
    dispatch({ type: API_ACTIONS.API_FAILURE, payload: error });
  }, []);

  const apiReset = useCallback(() => {
    dispatch({ type: API_ACTIONS.API_RESET });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...state,
    apiRequest,
    apiSuccess,
    apiFailure,
    apiReset,
  }), [state, apiRequest, apiSuccess, apiFailure, apiReset]);

  return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};

// Custom hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext; 