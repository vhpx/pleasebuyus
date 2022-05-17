const tableNames = [
    'users',
    'memberships',
    'admins',
    'addresses',
    'banks',
    'bank_cards',
    'user_cards',
    'outlets',
    'outlet_categories',
    'products',
    'wishlisted_products',
    'coupons',
    'bills',
    'bill_products',
];

const tables = [
    {
        name: 'users',
        columns: [
            'id',
            'name',
            'email',
            'phone_number',
            'birthday',
            'gender',
            'avatar_url',
            'created_at',
        ],
    },
    {
        name: 'memberships',
        columns: ['user_id', 'redeemable_pts', 'progress_pts'],
    },
    {
        name: 'admins',
        columns: ['user_id', 'created_at'],
    },
    {
        name: 'addresses',
        columns: [
            'id',
            'user_id',
            'name',
            'country',
            'province',
            'city',
            'street_info',
            'created_at',
        ],
    },
    {
        name: 'banks',
        columns: ['code', 'name', 'short_name', 'created_at'],
    },
    {
        name: 'bank_cards',
        columns: ['bank_code', 'card_number', 'PIN', 'owner_id', 'created_at'],
    },
    {
        name: 'user_cards',
        columns: ['id', 'user_id', 'bank_code', 'card_number', 'created_at'],
    },
    {
        name: 'outlets',
        columns: [
            'id',
            'owner_id',
            'name',
            'address',
            'avatar_url',
            'created_at',
        ],
    },
    {
        name: 'outlet_categories',
        columns: ['id', 'outlet_id', 'name', 'created_at'],
    },
    {
        name: 'products',
        columns: [
            'id',
            'outlet_id',
            'name',
            'description',
            'price',
            'avatar_url',
            'category_id',
            'created_at',
        ],
    },
    {
        name: 'wishlisted_products',
        columns: ['user_id', 'product_id', 'created_at'],
    },
    {
        name: 'coupons',
        columns: ['id', 'code', 'name', 'value', 'use_ratio', 'created_at'],
    },
    {
        name: 'bills',
        columns: [
            'id',
            'customer_id',
            'card_id',
            'address_id',
            'outlet_id',
            'coupon_id',
            'total',
            'created_at',
        ],
    },
    {
        name: 'bill_products',
        columns: ['bill_id', 'product_id', 'amount'],
    },
];

export { tableNames, tables };
