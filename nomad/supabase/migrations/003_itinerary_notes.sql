-- Add notes field to itinerary entries
ALTER TABLE itinerary ADD COLUMN IF NOT EXISTS notes TEXT;
