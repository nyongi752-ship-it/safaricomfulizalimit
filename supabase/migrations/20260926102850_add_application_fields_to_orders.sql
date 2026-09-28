/*
# Add application fields to orders table

## Purpose
The checkout form now collects additional verification details (full name,
current Fuliza limit, and occupation) alongside the existing email and phone.
These fields are passed through the edge function and stored on the order row
so each application has a complete record.

## Changes
- `orders` table gains three new nullable columns:
  - `full_name` (text) — the applicant's full name
  - `current_limit` (text) — the applicant's current Fuliza limit, as entered
  - `occupation` (text) — the applicant's occupation category

## Security
- No RLS policy changes. The existing anon INSERT + SELECT policies still apply.
- The new columns are nullable so existing rows are unaffected.
- No destructive operations.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE orders ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'current_limit'
  ) THEN
    ALTER TABLE orders ADD COLUMN current_limit text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'occupation'
  ) THEN
    ALTER TABLE orders ADD COLUMN occupation text;
  END IF;
END $$;
