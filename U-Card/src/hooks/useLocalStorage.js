import { useState, useEffect } from 'react';

// Helper function to generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to get current timestamp
const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Custom hook for localStorage management
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

// Hook for managing cards in localStorage
export const useCardsLocalStorage = () => {
  const [cards, setCards] = useLocalStorage('cards_60959', []);

  const createCard = (cardData) => {
    const newCard = {
      id: generateUUID(),
      type_id: cardData.type_id,
      name: cardData.name,
      description: cardData.description,
      image_url: cardData.image_url,
      back_image_url: cardData.back_image_url,
      attributes: cardData.attributes || {},
      tags: cardData.tags || [],
      group_id: cardData.group_id || null,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };

    setCards(prev => [...prev, newCard]);
    return newCard;
  };

  const updateCard = (cardId, updates) => {
    const updatedCards = cards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          ...updates,
          updated_at: getCurrentTimestamp()
        };
      }
      return card;
    });

    setCards(updatedCards);
    return updatedCards.find(card => card.id === cardId);
  };

  const deleteCard = (cardId) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const exportCards = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cards-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importCards = (importedCards) => {
    // Validate imported data
    if (!Array.isArray(importedCards)) {
      throw new Error('导入数据格式错误');
    }
    
    // Add imported cards to existing cards
    const validatedCards = importedCards.map(card => ({
      id: card.id || generateUUID(),
      type_id: card.type_id,
      name: card.name,
      description: card.description,
      image_url: card.image_url,
      back_image_url: card.back_image_url,
      attributes: card.attributes || {},
      tags: card.tags || [],
      group_id: card.group_id || null,
      created_at: card.created_at || getCurrentTimestamp(),
      updated_at: card.updated_at || getCurrentTimestamp()
    }));
    
    setCards(prev => [...prev, ...validatedCards]);
    return validatedCards;
  };

  return {
    cards,
    createCard,
    updateCard,
    deleteCard,
    exportCards,
    importCards
  };
};

// Hook for managing card groups in localStorage
export const useCardGroupsLocalStorage = () => {
  const [groups, setGroups] = useLocalStorage('card_groups_60959', []);

  const createGroup = (groupData) => {
    const newGroup = {
      id: generateUUID(),
      name: groupData.name,
      description: groupData.description,
      is_public: groupData.is_public || false,
      cover_image_url: groupData.cover_image_url || null,
      created_at: getCurrentTimestamp(),
      updated_at: getCurrentTimestamp()
    };

    setGroups(prev => [...prev, newGroup]);
    return newGroup;
  };

  const updateGroup = (groupId, updates) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          ...updates,
          updated_at: getCurrentTimestamp()
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    return updatedGroups.find(group => group.id === groupId);
  };

  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const exportGroups = () => {
    const dataStr = JSON.stringify(groups, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `groups-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importGroups = (importedGroups) => {
    // Validate imported data
    if (!Array.isArray(importedGroups)) {
      throw new Error('导入数据格式错误');
    }
    
    // Add imported groups to existing groups
    const validatedGroups = importedGroups.map(group => ({
      id: group.id || generateUUID(),
      name: group.name,
      description: group.description,
      is_public: group.is_public || false,
      cover_image_url: group.cover_image_url || null,
      created_at: group.created_at || getCurrentTimestamp(),
      updated_at: group.updated_at || getCurrentTimestamp()
    }));
    
    setGroups(prev => [...prev, ...validatedGroups]);
    return validatedGroups;
  };

  return {
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    exportGroups,
    importGroups
  };
};

// Hook for managing card types in localStorage
export const useCardTypesLocalStorage = () => {
  // Default card types
  const defaultCardTypes = [
    { id: '1', name: '游戏卡牌', description: '用于游戏的卡牌' },
    { id: '2', name: '收藏卡牌', description: '用于收藏的卡牌' },
    { id: '3', name: '身份卡牌', description: '代表身份或角色的卡牌' },
    { id: '4', name: '技能卡牌', description: '代表技能或能力的卡牌' },
    { id: '5', name: '道具卡牌', description: '代表道具或物品的卡牌' }
  ];
  
  const [cardTypes, setCardTypes] = useLocalStorage('card_types_60959', defaultCardTypes);

  const createCardType = (name, description) => {
    const newType = {
      id: generateUUID(),
      name,
      description
    };

    setCardTypes(prev => [...prev, newType]);
    return newType;
  };

  return {
    cardTypes,
    createCardType
  };
};