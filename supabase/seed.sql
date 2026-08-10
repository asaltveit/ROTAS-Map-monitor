-- Sample locations for overlap and data-quality tests (auth users seeded via test helpers)
INSERT INTO locations (
  latitude,
  longitude,
  original_latitude,
  original_longitude,
  location_type,
  created_year_start,
  created_year_end,
  place,
  location
) VALUES
  (41.9028, 12.4964, 41.9028, 12.4964, 'inscription', 100, 200, 'Rome', 'Forum'),
  (41.9029500, 12.4965500, 41.9028, 12.4964, 'graffito', 150, 250, 'Rome', 'Forum overlap'),
  (48.8566, 2.3522, 48.8566, 2.3522, 'amulet', 300, 400, 'Paris', 'Seine'),
  (51.5074, -0.1278, 51.5074, -0.1278, 'dipinto', 500, 600, 'London', 'Westminster'),
  (41.9030, 12.4970, 41.9030, 12.4970, NULL, 100, 200, 'Rome', 'Missing type');

UPDATE locations
SET original_latitude = latitude,
    original_longitude = longitude
WHERE original_latitude IS NULL OR original_longitude IS NULL;
