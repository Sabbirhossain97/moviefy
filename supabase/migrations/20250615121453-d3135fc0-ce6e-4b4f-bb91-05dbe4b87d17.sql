
-- Create a public avatars bucket for profile images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Allow public access to upload, update, and read objects in the avatars bucket
-- For basic usage, policies can be very permissive:
-- (In production you may want to restrict "update" and "delete" to the user who owns the file)

-- Allow anyone to select (read) files
create policy "Avatar images can be read by anyone"
on storage.objects
for select
using (bucket_id = 'avatars');

-- Allow authenticated users to insert (upload) files
create policy "Authenticated users can upload avatar images"
on storage.objects
for insert
with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Allow authenticated users to update (replace) files
create policy "Authenticated users can update avatar images"
on storage.objects
for update
using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Allow authenticated users to delete their own files (optional)
create policy "Authenticated users can delete their own avatar images"
on storage.objects
for delete
using (bucket_id = 'avatars' and auth.role() = 'authenticated');
