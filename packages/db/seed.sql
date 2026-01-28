-- Seed data for local development

INSERT INTO users (id, email, display_name)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'dev@killtonyindex.com', 'KT Dev');

INSERT INTO episodes (id, youtube_id, title, published_at, duration_seconds, youtube_url)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'yt-episode-001', 'Kill Tony #650', '2024-01-01', 7200, 'https://www.youtube.com/watch?v=yt-episode-001'),
  ('33333333-3333-3333-3333-333333333333', 'yt-episode-002', 'Kill Tony #651', '2024-01-08', 7100, 'https://www.youtube.com/watch?v=yt-episode-002');

INSERT INTO guests (id, name)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'Guest One'),
  ('55555555-5555-5555-5555-555555555555', 'Guest Two');

INSERT INTO episode_guests (episode_id, guest_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444'),
  ('33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555');

INSERT INTO contestants (id, display_name, instagram_url, youtube_url, website_url, ticket_url)
VALUES
  ('66666666-6666-6666-6666-666666666666', 'Contestant One', 'https://instagram.com/contestantone', NULL, NULL, NULL),
  ('77777777-7777-7777-7777-777777777777', 'Contestant Two', NULL, 'https://youtube.com/@contestanttwo', NULL, NULL);

INSERT INTO contestant_aliases (id, contestant_id, alias)
VALUES
  ('88888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', 'C-One');

INSERT INTO performances (id, episode_id, contestant_id, start_seconds, end_seconds, confidence, intro_snippet)
VALUES
  ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 120, 420, 0.923, 'Opening minute set with crowd work.'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 300, 540, 0.881, 'High-energy set with audience riffing.');

INSERT INTO votes (id, performance_id, user_id, rating)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 8);

INSERT INTO comments (id, performance_id, user_id, body, is_flagged)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Great opener with a strong finish.', FALSE);
