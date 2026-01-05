import { useState, useEffect, useCallback } from 'react';
import { supabase, handleResponse } from '../lib/supabase';

export const useCardTypes = () => {
  const [cardTypes, setCardTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCardTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('card_types_60959')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setCardTypes(data);
    } catch (err) {
      setError('获取卡牌类型失败: ' + err.message);
      console.error('Error fetching card types:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCardType = async (name, description) => {
    try {
      const { data, error } = await supabase
        .from('card_types_60959')
        .insert({ name, description })
        .select();
      
      if (error) throw error;
      
      setCardTypes(prev => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError('创建卡牌类型失败: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchCardTypes();
  }, [fetchCardTypes]);

  return {
    cardTypes,
    loading,
    error,
    fetchCardTypes,
    createCardType
  };
};