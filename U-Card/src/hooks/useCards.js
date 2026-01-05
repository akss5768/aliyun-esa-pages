import { useState, useEffect, useCallback } from 'react';
import { supabase, handleResponse, formatCardData, ensureUserExists } from '../lib/supabase';

export const useCards = (userId) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        setCards([]);
        return;
      }
      
      // Ensure user exists before fetching cards
      await ensureUserExists(userId);
      
      const { data, error } = await supabase
        .from('cards_60959')
        .select(`
          *,
          card_types_60959 (name),
          card_tag_assignments_60959 (
            card_tags_60959 (id, name, color)
          ),
          card_groups_60959 (id, name)  -- Direct group relationship
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const formattedCards = data.map(card => {
        return formatCardData({
          ...card,
          tags: card.card_tag_assignments_60959.map(t => t.card_tags_60959),
          group: card.card_groups_60959 || null  // Direct group relationship
        });
      });
      
      setCards(formattedCards);
    } catch (err) {
      setError('获取卡牌失败: ' + err.message);
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createCard = async (cardData) => {
    try {
      if (!userId) {
        throw new Error('用户未登录');
      }
      
      // Ensure user exists before creating card
      await ensureUserExists(userId);
      
      // Prepare card data including direct group association
      const newCard = {
        user_id: userId,
        type_id: cardData.type_id,
        name: cardData.name,
        description: cardData.description,
        image_url: cardData.image_url,
        back_image_url: cardData.back_image_url,
        attributes: cardData.attributes || {},
        group_id: cardData.group_id || null  // Direct group association
      };

      // Insert the card
      const { data: cardResult, error: cardError } = await supabase
        .from('cards_60959')
        .insert(newCard)
        .select();
      
      if (cardError) throw cardError;
      
      const createdCard = cardResult[0];
      
      const formattedCard = formatCardData({
        ...createdCard,
        card_types_60959: { name: cardData.type_name },
        tags: [],
        group: null
      });
      
      setCards(prev => [...prev, formattedCard]);
      return formattedCard;
    } catch (err) {
      setError('创建卡牌失败: ' + err.message);
      throw err;
    }
  };

  const updateCard = async (cardId, updates) => {
    try {
      // Handle group association in updates
      const updateData = { ...updates };
      
      // If group_id is in updates, handle it directly
      if ('group_id' in updates) {
        updateData.group_id = updates.group_id || null;
        // Remove from update object to avoid conflicts
        delete updateData.group_id;
      }
      
      // Update card
      const { data, error } = await supabase
        .from('cards_60959')
        .update(updateData)
        .eq('id', cardId)
        .select();
      
      if (error) throw error;
      
      const updatedCard = formatCardData({
        ...data[0],
        tags: cards.find(c => c.id === cardId)?.tags || [],
        group: cards.find(c => c.id === cardId)?.group || null
      });
      
      setCards(prev => prev.map(card => card.id === cardId ? updatedCard : card));
      return updatedCard;
    } catch (err) {
      setError('更新卡牌失败: ' + err.message);
      throw err;
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const { error } = await supabase
        .from('cards_60959')
        .delete()
        .eq('id', cardId);
      
      if (error) throw error;
      
      setCards(prev => prev.filter(card => card.id !== cardId));
    } catch (err) {
      setError('删除卡牌失败: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCards();
    }
  }, [userId, fetchCards]);

  return {
    cards,
    loading,
    error,
    fetchCards,
    createCard,
    updateCard,
    deleteCard
  };
};