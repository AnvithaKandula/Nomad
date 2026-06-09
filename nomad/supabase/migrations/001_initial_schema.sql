-- Nomad initial schema
-- Run this in Supabase SQL Editor or via: supabase db push

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  lat_long JSONB DEFAULT '{}',
  image_url TEXT,
  country_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Master Closet
CREATE TABLE IF NOT EXISTS master_closet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'tech', 'toiletry', 'accessory', 'footwear', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trip Items (packing list per trip)
CREATE TABLE IF NOT EXISTS trip_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  is_packed BOOLEAN DEFAULT false,
  is_suggested BOOLEAN DEFAULT false,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Itinerary
CREATE TABLE IF NOT EXISTS itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  booking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User settings (banner theme preference)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  banner_theme TEXT DEFAULT 'landmark' CHECK (banner_theme IN ('flag', 'landmark', 'national_flower')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_master_closet_user_id ON master_closet(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_items_trip_id ON trip_items(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_trip_id ON itinerary(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_date ON itinerary(date);

-- RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_closet ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Trips policies
CREATE POLICY "Users can view own trips" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trips" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON trips FOR DELETE USING (auth.uid() = user_id);

-- Master closet policies
CREATE POLICY "Users can view own closet" ON master_closet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own closet items" ON master_closet FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own closet items" ON master_closet FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own closet items" ON master_closet FOR DELETE USING (auth.uid() = user_id);

-- Trip items policies (via trip ownership)
CREATE POLICY "Users can view own trip items" ON trip_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_items.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can insert own trip items" ON trip_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_items.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can update own trip items" ON trip_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_items.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can delete own trip items" ON trip_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_items.trip_id AND trips.user_id = auth.uid()));

-- Itinerary policies
CREATE POLICY "Users can view own itinerary" ON itinerary FOR SELECT
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can insert own itinerary" ON itinerary FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can update own itinerary" ON itinerary FOR UPDATE
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can delete own itinerary" ON itinerary FOR DELETE
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary.trip_id AND trips.user_id = auth.uid()));

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Smart packing trigger: auto-suggest items when itinerary entry is created
CREATE OR REPLACE FUNCTION suggest_packing_items()
RETURNS TRIGGER AS $$
DECLARE
  item TEXT;
  items TEXT[];
BEGIN
  items := CASE NEW.category
    WHEN 'hiking' THEN ARRAY['Hiking boots', 'Water bottle', 'Sunscreen', 'Trail snacks', 'Rain jacket']
    WHEN 'formal' THEN ARRAY['Dress shoes', 'Formal outfit', 'Belt', 'Watch']
    WHEN 'swimming' THEN ARRAY['Swimsuit', 'Towel', 'Flip flops', 'Goggles', 'Sunscreen']
    WHEN 'beach' THEN ARRAY['Swimsuit', 'Beach towel', 'Sandals', 'Sun hat', 'Sunglasses']
    WHEN 'skiing' THEN ARRAY['Ski jacket', 'Thermal layers', 'Gloves', 'Goggles', 'Hand warmers']
    WHEN 'business' THEN ARRAY['Laptop', 'Charger', 'Business cards', 'Formal outfit', 'Notebook']
    WHEN 'dining' THEN ARRAY['Nice outfit', 'Reservation confirmation']
    WHEN 'sightseeing' THEN ARRAY['Comfortable shoes', 'Camera', 'Portable charger', 'Water bottle']
    WHEN 'nightlife' THEN ARRAY['Nice outfit', 'ID', 'Portable charger']
    WHEN 'camping' THEN ARRAY['Tent', 'Sleeping bag', 'Flashlight', 'Insect repellent', 'Camp stove']
    ELSE ARRAY[]::TEXT[]
  END;

  FOREACH item IN ARRAY items LOOP
    INSERT INTO trip_items (trip_id, item_name, is_suggested, category)
    SELECT NEW.trip_id, item, true, NEW.category
    WHERE NOT EXISTS (
      SELECT 1 FROM trip_items
      WHERE trip_id = NEW.trip_id AND LOWER(item_name) = LOWER(item)
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_itinerary_insert_suggest_packing
  AFTER INSERT ON itinerary
  FOR EACH ROW
  EXECUTE FUNCTION suggest_packing_items();

-- Updated_at trigger for trips
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
