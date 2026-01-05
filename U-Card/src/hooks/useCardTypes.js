// This file is no longer needed as we're using localStorage instead of Supabase
// Keeping it for compatibility with existing imports, but it's now empty
export const useCardTypes = () => {
  return {
    cardTypes: [],
    loading: false,
    error: null,
    fetchCardTypes: () => {},
    createCardType: () => {}
  };
};