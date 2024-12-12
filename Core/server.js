import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js'; // Импортируем knex из db.js


export const app = express();

app.use(bodyParser.json());

// Обработчик для получения активного кошелька по user_id
app.get('api/wallet/:wallet_address', async (req, res) => {
    const {wallet_address} = req.params;

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});