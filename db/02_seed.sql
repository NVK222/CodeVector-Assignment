insert into
  products (name, category, price, created_at, updated_at)
with
  random_numbers as (
    select
      *
    from
      generate_series(1, 200000)
  ),
  categories as (
    select
      array[
        'Groceries',
        'Kitchen Appliances',
        'Electronics',
        'Food',
        'Pets',
        'Fashion'
      ] as cat_list
  ),
  random_data as (
    select
      chr((floor(random() * (89 - 65) + 65))::int) || chr((floor(random() * (89 - 65) + 65))::int) || chr((floor(random() * (89 - 65) + 65))::int) || chr((floor(random() * (89 - 65) + 65))::int) || chr((floor(random() * (89 - 65) + 65))::int) as name,
      categories.cat_list[
        floor(random() * cardinality(categories.cat_list)) + 1
      ] as category,
      (random() * (10000 - 100) + 100)::int as price,
      '2025-01-01 00:00:00'::timestamp + ((random() * 365)::int) * interval '1 day' + ((random() * 24 * 60 * 60)::int) * interval '1 second' as created_at
    from
      random_numbers
      cross join categories
  ),
  completed_data as (
    select
      name,
      category,
      price,
      created_at,
      created_at + ((random() * 365)::int) * interval '1 day' + ((random() * 24 * 60 * 60)::int) * interval '1 second' as updated_at
    from
      random_data
  )
select
  name,
  category,
  price,
  created_at,
  updated_at
from
  completed_data;
