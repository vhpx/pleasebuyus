import { useEffect, useState } from 'react';
import Divider from '../components/common/Divider';
import Title from '../components/common/Title';
import { StoreLayout } from '../components/layout/layout';
import { tableNames, tables } from '../data/tables';
import { supabase } from '../utils/supabase-client';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import { useUser } from '../hooks/useUser';
import { Prism } from '@mantine/prism';

QueryPage.getLayout = (page) => {
    return <StoreLayout>{page}</StoreLayout>;
};

const defaultQueries = `
-- Query to create all tables

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

CREATE TABLE public.user_cards (
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
        FOREIGN KEY(card_id) REFERENCES user_cards(id) ON DELETE
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

-- Query to delete all tables

DROP TABLE IF EXISTS bill_products;

DROP TABLE IF EXISTS bills;

DROP TABLE IF EXISTS coupons;

DROP TABLE IF EXISTS memberships;

DROP TABLE IF EXISTS bank_cards;

DROP TABLE IF EXISTS user_cards;

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
`;

export default function QueryPage() {
    const { userData } = useUser();

    const [tablesData, setTablesData] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        try {
            if (!userData) return;
            if (!userData.isAdmin) {
                toast.error('You are not authorized to access this page.');
                return;
            }

            // for each table name, fetch the data
            const tablePromises = tableNames.map(async (tableName) => {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*');

                if (error) throw error;

                return {
                    name: tableName,
                    data,
                };
            });

            Promise.all(tablePromises).then((results) => {
                setTablesData(results);
            });
        } catch (err) {
            toast.error(err);
        }
    }, [userData]);

    useEffect(() => {
        if (!tablesData || !tablesData.length) return;

        let response =
            '-- By default, Supabase uses the `public` database.\n\n';

        for (let i = 0; i < tablesData.length; i++) {
            const table = tablesData[i];
            const tableColumns = tables.find(
                (t) => t.name === table.name
            ).columns;

            const tableName = table.name;
            const tableData = table.data;

            response += `-- Populate data for the ${tableName} table.\n`;
            response += `INSERT INTO\n\tpublic.${tableName}(${tableColumns.join(
                ', '
            )}) VALUES\n`;

            for (let j = 0; j < tableData.length; j++) {
                const row = tableData[j];

                response += `\t\t(${tableColumns
                    .map((c) =>
                        row[c] === 'null' || row[c] === null || row[c] === ''
                            ? 'NULL'
                            : typeof row[c] === 'string'
                            ? `'${row[c].replace(/'/g, "''")}'`
                            : row[c]
                    )
                    .join(', ')})`;

                if (j < tableData.length - 1) response += ',\n';
            }

            response += ';';
            if (i < tablesData.length - 1) response += '\n\n';
        }

        console.log(response);
        setQuery(response);
    }, [tablesData]);

    return (
        <div className="p-4 md:p-8 lg:p-16 space-y-8">
            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Database Creation Queries" />
                <Divider />

                <Prism language="sql">{defaultQueries}</Prism>
            </div>

            <div className="bg-white dark:bg-zinc-800/50 p-8 rounded-lg">
                <Title label="Database Insert Queries" />
                <Divider />

                {query ? (
                    <Prism language="sql">{query}</Prism>
                ) : (
                    <div className="w-full text-center">
                        <LoadingIndicator svgClassName="w-8 h-8" />
                    </div>
                )}
            </div>
        </div>
    );
}
