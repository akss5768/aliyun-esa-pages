/*
  # Add group_id column to cards table

  This migration adds a direct group_id column to the cards_60959 table to simplify card-group relationships.
  This will allow us to directly associate cards with groups without requiring the junction table for simple cases.

  1. New Columns
    - `cards_60959.group_id`: Foreign key referencing card_groups_60959(id)

  2. Changes
    - Added foreign key constraint to maintain referential integrity
    - Added index on group_id for better query performance
*/

-- Add group_id column to cards table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards_60959' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE cards_60959 ADD COLUMN group_id uuid REFERENCES card_groups_60959(id);
  END IF;
END $$;

-- Create index on group_id for better query performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'cards_60959' AND indexname = 'idx_cards_group_id'
  ) THEN
    CREATE INDEX idx_cards_group_id ON cards_60959(group_id);
  END IF;
END $$;