
-- Add foreign key relationship between posts and profiles tables
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_profiles 
FOREIGN KEY (user_id) REFERENCES profiles(id);
