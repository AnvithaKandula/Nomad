-- Expand banner themes and add color mode preference
ALTER TABLE user_settings DROP CONSTRAINT IF EXISTS user_settings_banner_theme_check;

ALTER TABLE user_settings
  ADD CONSTRAINT user_settings_banner_theme_check
  CHECK (banner_theme IN ('flag', 'landmark', 'national_flower', 'local_food', 'cityscape'));

ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS color_mode TEXT NOT NULL DEFAULT 'light';

ALTER TABLE user_settings DROP CONSTRAINT IF EXISTS user_settings_color_mode_check;

ALTER TABLE user_settings
  ADD CONSTRAINT user_settings_color_mode_check
  CHECK (color_mode IN ('light', 'dark'));
