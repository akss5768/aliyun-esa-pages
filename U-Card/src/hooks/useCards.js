// This file is no longer needed as we're using localStorage instead of Supabase
// Keeping it for compatibility with existing imports, but it's now empty
export const useCards = () => {
  return {
    cards: [],
    loading: false,
    error: null,
    fetchCards: () => {},
    createCard: () => {},
    updateCard: () => {},
    deleteCard: () => {}
  };
};