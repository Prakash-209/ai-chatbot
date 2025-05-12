/*
  # Create transcriptions table

  1. New Tables
    - `transcriptions`
      - `id` (uuid, primary key)
      - `content` (text, stores the transcription)
      - `file_name` (text)
      - `file_type` (text)
      - `file_size` (bigint)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `transcriptions` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS transcriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transcriptions"
  ON transcriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);