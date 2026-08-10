-- Extend locations with original coordinates and audit metadata
ALTER TABLE locations
  ADD COLUMN IF NOT EXISTS original_latitude numeric,
  ADD COLUMN IF NOT EXISTS original_longitude numeric,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE locations
SET original_latitude = latitude,
    original_longitude = longitude
WHERE original_latitude IS NULL OR original_longitude IS NULL;
