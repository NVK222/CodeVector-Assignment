create policy "Enable read access for all users" on "public"."products" as PERMISSIVE for
select
  to public using (true);
