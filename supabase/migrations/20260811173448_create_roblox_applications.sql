/*
# Lufthansa Roblox Airline — Verification & Applications

## Overview
Creates the data model for a Roblox airline recruitment site. Users sign up
with email/password, verify their Roblox identity via a bio-code challenge,
then submit a job application tied to their verified Roblox account.

## 1. New Tables

### `roblox_verifications`
Tracks the Roblox bio-verification flow for each authenticated user.
- `id` — uuid primary key
- `user_id` — Supabase auth user who owns this verification (FK to auth.users, cascade)
- `roblox_username` — the Roblox username the user claims to own
- `roblox_user_id` — numeric Roblox user id, populated once the Roblox API resolves it
- `verification_code` — short random code the user must place in their Roblox bio
- `status` — `pending` or `verified`
- `created_at` — row creation timestamp
- `verified_at` — timestamp set when the bio check succeeds
One verification row per user (unique on user_id).

### `applications`
Stores a single job application per user, allowed only after Roblox verification.
- `id` — uuid primary key
- `user_id` — Supabase auth user (FK to auth.users, cascade)
- `roblox_username` — snapshot of the verified Roblox username
- `roblox_user_id` — snapshot of the verified Roblox user id
- `full_name` — applicant display name as entered
- `discord_username` — optional contact handle
- `position` — the role being applied for
- `experience` — free-text prior experience
- `why_join` — free-text motivation
- `age_group` — age bracket (13-15, 16-17, 18+)
- `status` — application status (submitted, reviewing, accepted, rejected)
- `created_at` — submission timestamp
One application per user (unique on user_id).

## 2. Security (RLS)
Both tables enable RLS and are owner-scoped via auth.uid() = user_id.
Owner column defaults to auth.uid() so inserts omitting user_id still pass WITH CHECK.
Four separate CRUD policies per table, scoped TO authenticated.
*/

CREATE TABLE IF NOT EXISTS roblox_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  roblox_username text NOT NULL,
  roblox_user_id text,
  verification_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','verified')),
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  UNIQUE (user_id)
);

ALTER TABLE roblox_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_roblox_verification" ON roblox_verifications;
CREATE POLICY "select_own_roblox_verification"
  ON roblox_verifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_roblox_verification" ON roblox_verifications;
CREATE POLICY "insert_own_roblox_verification"
  ON roblox_verifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_roblox_verification" ON roblox_verifications;
CREATE POLICY "update_own_roblox_verification"
  ON roblox_verifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_roblox_verification" ON roblox_verifications;
CREATE POLICY "delete_own_roblox_verification"
  ON roblox_verifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  roblox_username text NOT NULL,
  roblox_user_id text,
  full_name text NOT NULL,
  discord_username text,
  position text NOT NULL,
  experience text NOT NULL DEFAULT '',
  why_join text NOT NULL DEFAULT '',
  age_group text NOT NULL CHECK (age_group IN ('13-15','16-17','18+')),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','reviewing','accepted','rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_application" ON applications;
CREATE POLICY "select_own_application"
  ON applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_application" ON applications;
CREATE POLICY "insert_own_application"
  ON applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_application" ON applications;
CREATE POLICY "update_own_application"
  ON applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_application" ON applications;
CREATE POLICY "delete_own_application"
  ON applications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);