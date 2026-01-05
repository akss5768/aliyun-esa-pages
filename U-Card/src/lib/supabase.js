import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://www.weavefox.cn/api/open/v1/supabase_proxy/1039';
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzYzMzYyNTc1LCJleHAiOjEzMjc0MDAyNTc1fQ.5xIvuHmVZhAIQDz_ad7_rfkC4FC5w1Phdq3mFTTNTrQ';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Format card data for consistent structure
export const formatCardData = (card) => {
  return {
    id: card.id,
    user_id: card.user_id,
    type_id: card.type_id,
    type_name: card.card_types_60959?.name || '未知类型',
    name: card.name,
    description: card.description,
    image_url: card.image_url,
    back_image_url: card.back_image_url,
    attributes: card.attributes || {},
    tags: card.tags || [],
    group: card.group || null,
    group_id: card.group?.id || card.group_id || null,  // Handle both direct and nested group_id
    created_at: card.created_at,
    updated_at: card.updated_at
  };
};

// Format group data for consistent structure
export const formatGroupData = (group) => {
  return {
    id: group.id,
    user_id: group.user_id,
    name: group.name,
    description: group.description,
    is_public: group.is_public,
    cover_image_url: group.cover_image_url,
    cards: group.cards || [],
    card_count: group.cards?.length || 0,
    created_at: group.created_at,
    updated_at: group.updated_at
  };
};

// Handle Supabase response errors
export const handleResponse = (response) => {
  if (response.error) throw response.error;
  return response.data;
};

// Generate a valid UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get current user ID (in a real app, this would come from authentication)
let currentUserId = null;

export const getCurrentUserId = async () => {
  // In a real app, this would retrieve the authenticated user's ID
  // For this demo, we'll generate a consistent ID based on localStorage
  if (!currentUserId) {
    const storedId = localStorage.getItem('demo_user_id');
    if (storedId) {
      currentUserId = storedId;
    } else {
      // Generate a valid UUID for demo purposes
      currentUserId = generateUUID();
      localStorage.setItem('demo_user_id', currentUserId);
    }
  }
  return currentUserId;
};

// Ensure user exists in database
export const ensureUserExists = async (userId) => {
  if (!userId) return;
  
  try {
    // Check if user already exists
    const { data, error } = await supabase
      .from('users_60959')
      .select('id')
      .eq('id', userId)
      .single();
    
    // If user doesn't exist, create them
    if (error || !data) {
      const { error: insertError } = await supabase
        .from('users_60959')
        .insert({
          id: userId,
          email: `${userId}@cardcollector.demo`,
          username: `user_${userId.substring(0, 8)}`
        });
      
      if (insertError) throw insertError;
    }
  } catch (err) {
    console.error('Error ensuring user exists:', err);
    // Don't throw error as this is a demo app
  }
};