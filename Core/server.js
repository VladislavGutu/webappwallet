import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js'; // Импортируем knex из db.js
import cors from 'cors';
import fs from 'fs';
import https from 'https';

export const app = express();

app.use(cors());
app.use(bodyParser.json());



function get_servers() {
    return JSON.parse(fs.readFileSync('servers.json'));
}

app.get('/', (req, res) => {
    res.send('Hello, Secure World!');
});


app.get('/api/servers/data', async (req, res) => {
    // Получаем данные серверов из фаила servers.json
    try {
        const servers = get_servers();
        res.json(servers);
    } catch (err) {
        console.error('Error reading servers.json:', err);
        res.status(500).json({error: 'Server error'});
    }
});

app.get('/api/servers/income', async (req, res) => {
    // Получаем данные серверов из фаила servers.json и делаем dict[кошелек] = доход
    try {
        const servers = get_servers();
        let income = {};
        for (let key in servers) {
            income[key] = servers[key].btc_mine;
        }
        res.json(income);
    } catch (err) {
        console.error('Error reading servers.json:', err);
        res.status(500).json({error: 'Server error'});
    }
});

app.get('/api/servers/prices', async (req, res) => {
    // Получаем данные серверов из фаила servers.json и делаем dict[кошелек] = цена

    try {
        const servers = get_servers();
        let prices = {};
        for (let key in servers) {
            prices[key] = servers[key].price;
        }
        res.json(prices);
    } catch (err) {
        console.error('Error reading servers.json:', err);
        res.status(500).json({error: 'Server error'});
    }
});


// Обработчик для получения активного кошелька по user_id
app.get('/api/wallets/active/:user_id', async (req, res) => {
    const {user_id} = req.params;
    console.log('Getting active wallet for user', user_id);
    try {
        const activeWallet = await db('wallets')
            .where({'wallets.user_id': user_id, 'wallets.active': true})
            .select(
                'wallets.user_id',
                'wallets.address',
                db.raw(`
                COALESCE((
            SELECT JSON_OBJECT_AGG(
                TO_CHAR(btc_bonus.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
                btc_bonus.amount
            )
            FROM btc_bonus
            WHERE btc_bonus.wallet = wallets.address
        ), '{}') AS history
        `),
                db.raw(`
            COALESCE(
                (SELECT TO_CHAR(value::TIME, 'HH24:MI:SS') 
                 FROM constants 
                 WHERE key = 'btc_get_time'),
                ''
            ) AS btc_get_time
        `),
                db.raw(`
            COALESCE((
                SELECT JSON_AGG(wallets_servers.server)
                FROM wallets_servers
                WHERE wallets_servers.address = wallets.address
            ), '[]') AS servers
        `)
            )
            .first();


        console.log(activeWallet);

        if (!activeWallet) {
            return res.status(404).json({error: 'Active wallet not found'});
        }

        res.json(activeWallet);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Server error'});
    }
});

app.get('/api/wallets/data/:wallet_address', async (req, res) => {
    const {wallet_address} = req.params;
    console.log('Getting active wallet for wallet', wallet_address);
    try {
        const activeWallet = await db('wallets')
            .where({'wallets.address': wallet_address})
            .select(
                'wallets.address',
                db.raw(`
                COALESCE((
            SELECT JSON_OBJECT_AGG(
                TO_CHAR(btc_bonus.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
                btc_bonus.amount
            )
            FROM btc_bonus
            WHERE btc_bonus.wallet = wallets.address
        ), '{}') AS history
        `),
                db.raw(`
            COALESCE(
                (SELECT TO_CHAR(value::TIME, 'HH24:MI:SS') 
                 FROM constants 
                 WHERE key = 'btc_get_time'),
                ''
            ) AS btc_get_time
        `)
            )
            .first();

        console.log(activeWallet);

        if (!activeWallet) {
            return res.status(404).json({error: 'Wallet not found'});
        }

        res.json(activeWallet);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({error: 'Server error'});
    }
});

// Загрузка SSL сертификатов
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/miniappserv.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/miniappserv.com/fullchain.pem'),
};

// Запуск HTTPS сервера
https.createServer(options, app).listen(443, () => {
    console.log('HTTPS server running on port 443');
});


