export async function getActiveWallet(wallet_address) {
    try {
        const response = await fetch(`http://localhost:3000/api/wallet/${wallet_address}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error getting wallets:', error.message);
        throw error;
    }
}

