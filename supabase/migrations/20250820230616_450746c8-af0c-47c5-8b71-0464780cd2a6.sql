
-- Remove as tabelas relacionadas aos posts na ordem correta (devido às foreign keys)
DROP TABLE IF EXISTS public.post_comments CASCADE;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;

-- Remove os buckets de storage relacionados aos posts
DELETE FROM storage.buckets WHERE id IN ('post-images', 'post-videos');
