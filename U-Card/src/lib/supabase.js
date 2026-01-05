// This file is no longer needed as we're using localStorage instead of Supabase
// Keeping it for compatibility with existing imports, but it's now empty
export const supabase = null;
export const formatCardData = (card) => card;
export const formatGroupData = (group) => group;
export const handleResponse = (response) => response;
export const getCurrentUserId = async () => 'local-user';
export const ensureUserExists = async () => {};