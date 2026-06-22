create table products (
  id bigint generated always as identity primary key,
  name text,
  category text,
  price int,
  created_at timestamp,
  updated_at timestamp
);
