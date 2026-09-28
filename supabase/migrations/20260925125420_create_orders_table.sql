/*
# Create orders table for Paystack payments

## Purpose
Stores payment orders created when a user selects a limit-boost package.
The edge function creates a row here, initializes a Paystack transaction,
and later updates the row when payment is verified.

## New Tables
- `orders`
  - `id` (uuid, primary key)
  - `package_id` (text, not null) — which limit package was selected
  - `limit_label` (text, not null) — human-readable limit, e.g. "KSh 10,000"
  - `fee_label` (text, not null) — human-readable fee, e.g. "KSh 140"
  - `fee_kobo` (integer, not null) — fee amount in kobo (100 kobo = 1 KSh), used by Paystack
  - `email` (text, not null) — payer email required by Paystack
  - `phone` (text) — optional payer phone
  - `paystack_reference` (text) — Paystack transaction reference returned on initialization
  - `status` (text, not null, default 'pending') — pending | paid | failed
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

## Security
- RLS enabled on `orders`.
- This is a no-auth (single-tenant) demo app, so anon + authenticated can insert and read.
- Updates are restricted to the service role (edge function) — no anon UPDATE policy.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id text NOT NULL,
  limit_label text NOT NULL,
  fee_label text NOT NULL,
  fee_kobo integer NOT NULL,
  email text NOT NULL,
  phone text,
  paystack_reference text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anon + authenticated to insert new orders (the checkout flow)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Allow anon + authenticated to read orders (so the UI can check status)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- No UPDATE or DELETE policies for anon — only the service role (edge function) can update.
