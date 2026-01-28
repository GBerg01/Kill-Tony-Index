-- Core schema for Kill Tony Index

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE episodes (
  id UUID PRIMARY KEY,
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  published_at DATE,
  duration_seconds INTEGER,
  youtube_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE guests (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE episode_guests (
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  PRIMARY KEY (episode_id, guest_id)
);

CREATE TABLE contestants (
  id UUID PRIMARY KEY,
  display_name TEXT NOT NULL,
  instagram_url TEXT,
  youtube_url TEXT,
  website_url TEXT,
  ticket_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE contestant_aliases (
  id UUID PRIMARY KEY,
  contestant_id UUID REFERENCES contestants(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE performances (
  id UUID PRIMARY KEY,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  contestant_id UUID REFERENCES contestants(id) ON DELETE CASCADE,
  start_seconds INTEGER NOT NULL,
  end_seconds INTEGER,
  confidence NUMERIC(4, 3) NOT NULL,
  intro_snippet TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE votes (
  id UUID PRIMARY KEY,
  performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (performance_id, user_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY,
  performance_id UUID REFERENCES performances(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX performances_episode_id_idx ON performances(episode_id);
CREATE INDEX performances_contestant_id_idx ON performances(contestant_id);
CREATE INDEX votes_performance_id_idx ON votes(performance_id);
CREATE INDEX comments_performance_id_idx ON comments(performance_id);
