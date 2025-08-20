
-- Add foreign key constraint between posts and profiles tables
ALTER TABLE posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id);
