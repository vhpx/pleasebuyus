-- This database creation script is used to create/delete the database and tables for the ISYS3414_DB_4 project.
-- It has been fully tested and works correctly using a PostgreSQL (v14) database provided by Supabase (https://app.supabase.io/).
--
-- To test this script, you should create a project in Supabase,
-- Then, visit https://app.supabase.io/project/[project-id]/sql and run the following query:
-- NOTE: By default, the database is created in the `public` schema.
--
CREATE TABLE public.users (
    id UUID,
    name TEXT,
    email TEXT,
    phone_number TEXT,
    birthday DATE,
    gender TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id)
);

CREATE TABLE public.addresses (
    id UUID,
    user_id UUID,
    name TEXT,
    country TEXT,
    province TEXT,
    city TEXT,
    street_info TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.admins (
    user_id UUID,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.banks (
    code TEXT,
    name TEXT,
    short_name TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(code)
);

CREATE TABLE public.bank_cards (
    bank_code TEXT,
    card_number TEXT,
    owner_id UUID,
    created_at TIMESTAMPTZ(6),
    PIN TEXT,
    PRIMARY KEY(bank_code, card_number),
    FOREIGN KEY(bank_code) REFERENCES banks(code) ON DELETE CASCADE
);

CREATE TABLE public.saved_cards (
    id UUID,
    user_id UUID,
    bank_code TEXT,
    card_number TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(bank_code) REFERENCES banks(code) ON DELETE CASCADE
);

CREATE TABLE public.outlets (
    id UUID,
    owner_id UUID,
    name TEXT,
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id),
    FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.coupons (
    id UUID,
    code TEXT,
    name TEXT,
    value FLOAT4,
    use_ratio BOOL,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id)
);

CREATE TABLE public.bills (
    id UUID,
    customer_id UUID,
    card_id UUID,
    address_id UUID,
    outlet_id UUID,
    coupon_id UUID,
    total FLOAT8,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id),
    FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(address_id) REFERENCES addresses(id) ON DELETE
    SET
        NULL,
        FOREIGN KEY(outlet_id) REFERENCES outlets(id) ON DELETE
    SET
        NULL,
        FOREIGN KEY(card_id) REFERENCES saved_cards(id) ON DELETE
    SET
        NULL,
        FOREIGN KEY(coupon_id) REFERENCES coupons(id) ON DELETE
    SET
        NULL
);

CREATE TABLE public.outlet_categories (
    id UUID,
    outlet_id UUID,
    name TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id),
    FOREIGN KEY(outlet_id) REFERENCES outlets(id) ON DELETE CASCADE
);

CREATE TABLE public.products (
    id UUID,
    outlet_id UUID,
    category_id UUID,
    name TEXT,
    description TEXT,
    price FLOAT8,
    avatar_url TEXT,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(id),
    FOREIGN KEY(outlet_id) REFERENCES outlets(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES outlet_categories(id) ON DELETE
    SET
        NULL
);

CREATE TABLE public.bill_products (
    bill_id UUID,
    product_id UUID,
    amount INT2,
    PRIMARY KEY(bill_id, product_id),
    FOREIGN KEY(bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE public.memberships (
    user_id UUID,
    redeemable_pts INT4,
    progress_pts INT4,
    PRIMARY KEY(user_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE public.wishlisted_products (
    user_id UUID,
    product_id UUID,
    created_at TIMESTAMPTZ(6),
    PRIMARY KEY(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- To delete all existing tables in Supabase, run the following query:
DROP TABLE IF EXISTS bill_products;

DROP TABLE IF EXISTS bills;

DROP TABLE IF EXISTS coupons;

DROP TABLE IF EXISTS memberships;

DROP TABLE IF EXISTS bank_cards;

DROP TABLE IF EXISTS saved_cards;

DROP TABLE IF EXISTS admins;

DROP TABLE IF EXISTS addresses;

DROP TABLE IF EXISTS banks;

DROP TABLE IF EXISTS wishlisted_products;

ALTER TABLE
    products DROP COLUMN outlet_id;

ALTER TABLE
    products DROP COLUMN category_id;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS outlet_categories;

DROP TABLE IF EXISTS outlets;

DROP TABLE IF EXISTS users;