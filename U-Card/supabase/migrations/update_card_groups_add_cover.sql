/*
  # Update card groups table to add cover field

  This migration adds a cover_image_url field to the card_groups_60959 table
  to allow users to set a cover image for their card groups.

  1. Changes
    - Added cover_image_url column to card_groups_60959 table
*/

-- Add cover_image_url column to card_groups_60959 table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'card_groups_60959' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE card_groups_60959 ADD COLUMN cover_image_url text;
  END IF;
END $$;