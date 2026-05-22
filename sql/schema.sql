-- =============================== --
-- CHOIRLIB DATABASE SCHEMA        --
-- Paste this into Supabase SQL    --
-- Editor and click RUN            --
-- =============================== --




-- =============================== --
-- TABLE 1: USERS                  --
-- =============================== --
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY
                   REFERENCES auth.users(id),
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  phone            TEXT,
  display_name     TEXT,
  voice_part       TEXT,
  role             TEXT DEFAULT 'member',
  profile_photo    TEXT,
  is_premium       BOOLEAN DEFAULT FALSE,
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 2: CHOIRS                 --
-- =============================== --
CREATE TABLE IF NOT EXISTS choirs (
  id           UUID PRIMARY KEY
               DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  location     TEXT,
  denomination TEXT,
  description  TEXT,
  photo        TEXT,
  invite_code  TEXT UNIQUE NOT NULL,
  admin_id     UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 3: CHOIR MEMBERS          --
-- =============================== --
CREATE TABLE IF NOT EXISTS choir_members (
  id         UUID PRIMARY KEY
             DEFAULT gen_random_uuid(),
  choir_id   UUID REFERENCES choirs(id)
             ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id)
             ON DELETE CASCADE,
  status     TEXT DEFAULT 'member',
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(choir_id, user_id)
);


-- =============================== --
-- TABLE 4: SONGS                  --
-- =============================== --
CREATE TABLE IF NOT EXISTS songs (
  id          UUID PRIMARY KEY
              DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  composer    TEXT,
  arranger    TEXT,
  language    TEXT,
  genre       TEXT,
  voice_parts TEXT,
  lyrics      TEXT,
  access_type TEXT DEFAULT 'free',
  price       DECIMAL(10,2) DEFAULT 0.00,
  uploaded_by UUID REFERENCES users(id),
  choir_id    UUID REFERENCES choirs(id),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 5: SONG FILES             --
-- =============================== --
CREATE TABLE IF NOT EXISTS song_files (
  id            UUID PRIMARY KEY
                DEFAULT gen_random_uuid(),
  song_id       UUID REFERENCES songs(id)
                ON DELETE CASCADE,
  file_type     TEXT NOT NULL,
  notation_type TEXT,
  file_url      TEXT NOT NULL,
  is_protected  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 6: COMMUNITIES            --
-- =============================== --
CREATE TABLE IF NOT EXISTS communities (
  id          UUID PRIMARY KEY
              DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_by  UUID REFERENCES users(id),
  is_private  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 7: COMMUNITY MEMBERS      --
-- =============================== --
CREATE TABLE IF NOT EXISTS community_members (
  id           UUID PRIMARY KEY
               DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id)
               ON DELETE CASCADE,
  user_id      UUID REFERENCES users(id)
               ON DELETE CASCADE,
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);


-- =============================== --
-- TABLE 8: POSTS                  --
-- =============================== --
CREATE TABLE IF NOT EXISTS posts (
  id             UUID PRIMARY KEY
                 DEFAULT gen_random_uuid(),
  community_id   UUID REFERENCES communities(id)
                 ON DELETE CASCADE,
  author_id      UUID REFERENCES users(id),
  content        TEXT NOT NULL,
  attachment_url TEXT,
  likes_count    INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 9: PURCHASES              --
-- =============================== --
CREATE TABLE IF NOT EXISTS purchases (
  id             UUID PRIMARY KEY
                 DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES users(id),
  song_id        UUID REFERENCES songs(id),
  amount         DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status         TEXT DEFAULT 'pending',
  delivered_via  TEXT DEFAULT 'email',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 10: NOTIFICATIONS         --
-- =============================== --
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY
             DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id)
             ON DELETE CASCADE,
  message    TEXT NOT NULL,
  type       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 11: SOCIAL LINKS          --
-- =============================== --
CREATE TABLE IF NOT EXISTS social_links (
  id         UUID PRIMARY KEY
             DEFAULT gen_random_uuid(),
  song_id    UUID REFERENCES songs(id)
             ON DELETE CASCADE,
  platform   TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================== --
-- TABLE 12: DOWNLOADS             --
-- =============================== --
CREATE TABLE IF NOT EXISTS downloads (
  id         UUID PRIMARY KEY
             DEFAULT gen_random_uuid(),
  song_id    UUID REFERENCES songs(id),
  user_id    UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);




-- =============================== --
-- ROW LEVEL SECURITY (RLS)        --
-- Protects your data!             --
-- =============================== --


-- Enable RLS on all tables
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE choirs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE choir_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_files        ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links      ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads         ENABLE ROW LEVEL SECURITY;




-- =============================== --
-- SECURITY POLICIES               --
-- =============================== --


-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);


-- Users can update their own data
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);


-- Anyone can view approved songs
CREATE POLICY "Anyone can view approved songs"
ON songs FOR SELECT
USING (is_approved = TRUE);


-- Logged in users can suggest songs
CREATE POLICY "Users can insert songs"
ON songs FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);


-- Anyone can view song files
CREATE POLICY "Anyone can view song files"
ON song_files FOR SELECT
USING (TRUE);


-- Anyone can view communities
CREATE POLICY "Anyone can view communities"
ON communities FOR SELECT
USING (TRUE);


-- Logged in users can create communities
CREATE POLICY "Users can create communities"
ON communities FOR INSERT
WITH CHECK (auth.uid() = created_by);


-- Anyone can view posts
CREATE POLICY "Anyone can view posts"
ON posts FOR SELECT
USING (TRUE);


-- Logged in users can create posts
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = author_id);


-- Users can only see own purchases
CREATE POLICY "Users see own purchases"
ON purchases FOR SELECT
USING (auth.uid() = user_id);


-- Users can create purchases
CREATE POLICY "Users can purchase"
ON purchases FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- Users see own notifications
CREATE POLICY "Users see own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);


-- Users can mark notifications as read
CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);




-- =============================== --
-- SAMPLE DATA                     --
-- Adds test songs to the database --
-- =============================== --


-- Note: Run this AFTER creating your
-- first admin user account


-- INSERT INTO songs (
--   title, composer, genre, language,
--   voice_parts, access_type, is_approved
-- ) VALUES
-- ('Ave Maria', 'Franz Schubert',
--  'classical', 'Latin', 'SATB', 'free', TRUE),
-- ('Hallelujah Chorus', 'G.F. Handel',
--  'gospel', 'English', 'SATB', 'free', TRUE),
-- ('Amazing Grace', 'John Newton',
--  'gospel', 'English', 'Unison', 'free', TRUE);


-- =============================== --
-- END OF SCHEMA                   --
-- =============================== –