/*
  # Create card management tables

  This migration creates the core tables for the card collection management system.

  1. New Tables
    - `users_60959`: Stores user information and subscription status
    - `card_types_60959`: Defines different types of cards available in the system
    - `cards_60959`: Main table storing individual card information
    - `card_tags_60959`: Tags that can be assigned to cards
    - `card_tag_assignments_60959`: Junction table linking cards to tags
    - `card_groups_60959`: Groups/Collections of cards created by users
    - `card_group_memberships_60959`: Junction table linking cards to groups

  2. Changes
    - Added default card types
    - Added default tags
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users_60959 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  storage_limit integer DEFAULT 50, -- Default storage limit for free users
  is_premium boolean DEFAULT false, -- Lifetime buyout status
  premium_expires_at timestamptz -- Expiration date for premium features
);

-- Create card types table
CREATE TABLE IF NOT EXISTS card_types_60959 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards_60959 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users_60959(id) NOT NULL,
  type_id uuid REFERENCES card_types_60959(id) NOT NULL,
  name text NOT NULL,
  description text,
  image_url text, -- URL to card front image
  back_image_url text, -- URL to card back image
  attributes jsonb, -- Flexible attributes storage
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create card tags table
CREATE TABLE IF NOT EXISTS card_tags_60959 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text, -- For UI display
  created_at timestamptz DEFAULT now()
);

-- Create card tag assignments table
CREATE TABLE IF NOT EXISTS card_tag_assignments_60959 (
  card_id uuid REFERENCES cards_60959(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES card_tags_60959(id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, tag_id)
);

-- Create card groups table
CREATE TABLE IF NOT EXISTS card_groups_60959 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users_60959(id) NOT NULL,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false, -- Whether the group can be shared
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create card group memberships table
CREATE TABLE IF NOT EXISTS card_group_memberships_60959 (
  card_id uuid REFERENCES cards_60959(id) ON DELETE CASCADE,
  group_id uuid REFERENCES card_groups_60959(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (card_id, group_id)
);

-- Insert default card types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM card_types_60959 WHERE name = '游戏卡牌') THEN
    INSERT INTO card_types_60959 (name, description) VALUES 
    ('游戏卡牌', '用于桌游或TCG的卡牌'),
    ('收藏卡牌', '具有收藏价值的实体卡牌'),
    ('身份卡牌', '代表角色身份或职业的卡牌'),
    ('技能卡牌', '代表特殊技能或能力的卡牌'),
    ('道具卡牌', '代表物品或装备的卡牌'),
    ('自定义卡牌', '用户自定义类型的卡牌');
  END IF;
END $$;

-- Insert default tags
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM card_tags_60959 WHERE name = '稀有') THEN
    INSERT INTO card_tags_60959 (name, color) VALUES 
    ('稀有', '#f59e0b'),
    ('传说', '#ef4444'),
    ('普通', '#94a3b8'),
    ('闪卡', '#10b981'),
    ('限定', '#8b5cf6'),
    ('收藏', '#1e3a8a');
  END IF;
END $$;