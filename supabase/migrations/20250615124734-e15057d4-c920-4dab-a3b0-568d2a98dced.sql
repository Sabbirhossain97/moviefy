
-- Drop existing avatar policies if they exist
do $$
begin
  if exists (
    select 1 from pg_policies
    where policyname = 'Avatar images can be read by anyone'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    execute 'drop policy "Avatar images can be read by anyone" on storage.objects;';
  end if;

  if exists (
    select 1 from pg_policies
    where policyname = 'Authenticated users can upload avatar images'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    execute 'drop policy "Authenticated users can upload avatar images" on storage.objects;';
  end if;

  if exists (
    select 1 from pg_policies
    where policyname = 'Authenticated users can update avatar images'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    execute 'drop policy "Authenticated users can update avatar images" on storage.objects;';
  end if;

  if exists (
    select 1 from pg_policies
    where policyname = 'Authenticated users can delete their own avatar images'
      and tablename = 'objects'
      and schemaname = 'storage'
  ) then
    execute 'drop policy "Authenticated users can delete their own avatar images" on storage.objects;';
  end if;
end $$;

-- 1. Create avatars bucket if not exists
insert into storage.buckets (id, name, public)
select 'avatars', 'avatars', true
where not exists (select 1 from storage.buckets where id = 'avatars');

-- 2. (Re-)Create policy: Anyone can select avatar images
create policy "Avatar images can be read by anyone"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- 3. (Re-)Create policy: Authenticated users can upload avatar images
create policy "Authenticated users can upload avatar images"
  on storage.objects
  for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- 4. (Re-)Create policy: Authenticated users can update avatar images
create policy "Authenticated users can update avatar images"
  on storage.objects
  for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- 5. (Re-)Create policy: Authenticated users can delete their own avatar images
create policy "Authenticated users can delete their own avatar images"
  on storage.objects
  for delete
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');
