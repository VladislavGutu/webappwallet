import {getActiveWallet} from './Core/database.js';

//user-id 350104566
export async function get_config(user_id) {
    const wallet_data = await getActiveWallet(user_id);

    return {
        'wallet': wallet_data.address,
        'levels_config': wallet_data.levels_config,
        'version': wallet_data.version
    };
}