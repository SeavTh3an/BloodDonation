import { Client } from 'pg';

export const client = new Client({
    host: 'centerbeam.proxy.rlwy.net',
    port: '43047',
    user: 'postgres',
    password: 'maViAbEfuXfjxAOcgxGTRWnsmZCxCdan',
    database: 'blood_donation_system',
});

