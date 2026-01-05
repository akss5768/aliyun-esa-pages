import { useState, useEffect, useCallback } from 'react';
import { supabase, handleResponse, formatGroupData, ensureUserExists } from '../lib/supabase';

export const useCardGroups = (userId) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        setGroups([]);
        return;
      }
      
      // Ensure user exists before fetching groups
      await ensureUserExists(userId);
      
      const { data, error } = await supabase
        .from('card_groups_60959')
        .select(`
          *,
          card_group_memberships_60959 (
            cards_60959 (id, name, image_url)
          )
        `)
        .eq('user_id', userId)
        .order('name');
      
      if (error) throw error;
      
      const formattedGroups = data.map(group => {
        return formatGroupData({
          ...group,
          cards: group.card_group_memberships_60959.map(m => m.cards_60959)
        });
      });
      
      setGroups(formattedGroups);
    } catch (err) {
      setError('获取卡牌组失败: ' + err.message);
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createGroup = async (groupData) => {
    try {
      if (!userId) {
        throw new Error('用户未登录');
      }
      
      // Ensure user exists before creating group
      await ensureUserExists(userId);
      
      const newGroup = {
        user_id: userId,
        name: groupData.name,
        description: groupData.description,
        is_public: groupData.is_public || false,
        cover_image_url: groupData.cover_image_url || null
      };

      const { data, error } = await supabase
        .from('card_groups_60959')
        .insert(newGroup)
        .select();
      
      if (error) throw error;
      
      const formattedGroup = formatGroupData({
        ...data[0],
        cards: []
      });
      
      setGroups(prev => [...prev, formattedGroup]);
      return formattedGroup;
    } catch (err) {
      setError('创建卡牌组失败: ' + err.message);
      throw err;
    }
  };

  const updateGroup = async (groupId, updates) => {
    try {
      const { data, error } = await supabase
        .from('card_groups_60959')
        .update(updates)
        .eq('id', groupId)
        .select();
      
      if (error) throw error;
      
      const updatedGroup = formatGroupData({
        ...data[0],
        cards: groups.find(g => g.id === groupId)?.cards || []
      });
      
      setGroups(prev => prev.map(group => group.id === groupId ? updatedGroup : group));
      return updatedGroup;
    } catch (err) {
      setError('更新卡牌组失败: ' + err.message);
      throw err;
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const { error } = await supabase
        .from('card_groups_60959')
        .delete()
        .eq('id', groupId);
      
      if (error) throw error;
      
      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (err) {
      setError('删除卡牌组失败: ' + err.message);
      throw err;
    }
  };

  const addCardToGroup = async (cardId, groupId) => {
    try {
      const { error } = await supabase
        .from('card_group_memberships_60959')
        .insert({ card_id: cardId, group_id: groupId });
      
      if (error) throw error;
      
      // Update local state
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          const cardToAdd = null; // In a real app, we'd fetch the card details
          return {
            ...group,
            cards: [...group.cards, { id: cardId }]
          };
        }
        return group;
      }));
    } catch (err) {
      setError('添加卡牌到组失败: ' + err.message);
      throw err;
    }
  };

  const removeCardFromGroup = async (cardId, groupId) => {
    try {
      const { error } = await supabase
        .from('card_group_memberships_60959')
        .delete()
        .eq('card_id', cardId)
        .eq('group_id', groupId);
      
      if (error) throw error;
      
      // Update local state
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            cards: group.cards.filter(card => card.id !== cardId)
          };
        }
        return group;
      }));
    } catch (err) {
      setError('从组中移除卡牌失败: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId, fetchGroups]);

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    addCardToGroup,
    removeCardFromGroup
  };
};