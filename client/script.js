// Получаем параметр config из URL
const urlParams = new URLSearchParams(window.location.search);
const configJson = urlParams.get('config');

// Декодируем и парсим JSON
const config = JSON.parse(decodeURIComponent(configJson));

console.log(config);

const walletData = {
  walletAddress: config.wallet_address,
  balance: config.balance
};

// Отображаем адрес кошелька и баланс
function formatWalletAddress(walletAddress) {
  const start = walletAddress.slice(0, 4);
  const end = walletAddress.slice(-4);
  return `${start}...${end}`;
}

const formattedWallet = formatWalletAddress(walletData.walletAddress);
document.getElementById('wallet-address').textContent = formattedWallet;
document.getElementById('balance-amount').textContent = walletData.balance.toFixed(2);

// Данные токенов
const tokensData = config.tokens;
const transactionsData = config.transaction;

// Функция для создания панели токена
function createTokenPanel(token) {
  const tokenPanel = document.createElement("div");
  tokenPanel.classList.add("token-panel");

  tokenPanel.innerHTML = `
    <div class="token-info">
        <img src="${token.logo}" alt="${token.name}" class="token-logo">
        <div class="token-details">
            <div class="token-name-symbol">
                <span class="token-symbol">${token.symbol}</span>
                <span class="token-name">${token.name}</span>
            </div>
            <span class="token-price">$${token.price.toFixed(2)}</span>
        </div>
    </div>
    <div class="token-right">
        <span class="token-quantity">${token.amount}</span>
        <span class="token-total">~$${(token.price * token.amount).toFixed(2)}</span>
    </div>`;

  document.getElementById("coins-tab").appendChild(tokenPanel);
}

// Функция для создания панели транзакции
function createTransactionPanel(transaction) {
    const transactionPanel = document.createElement('div');
    transactionPanel.classList.add('transaction-panel');

    transactionPanel.innerHTML = `
        <div class="transaction-info">
            <img src="${transaction.logo}" alt="${transaction.symbol}" class="transaction-logo">
            <div class="transaction-details">
                <span class="transaction-symbol">${transaction.symbol}</span>
                <span class="transaction-amount">${transaction.amount}</span>
            </div>
        </div>
        <div class="transaction-level">Level ${transaction.level}</div>
    `;

    document.getElementById('transactions-tab').appendChild(transactionPanel);
}

// Генерация контента для вкладки "Coins" и "Transactions"
tokensData.forEach(createTokenPanel);
transactionsData.forEach(createTransactionPanel);

// Функция для обновления общего баланса
function updateTotalBalance() {
  let totalBalance = 0;

  tokensData.forEach((token) => {
    totalBalance += token.price * token.amount;
  });

  document.querySelector(".balance").textContent = `$${totalBalance.toFixed(2)}`;
}

// Обновляем общий баланс
updateTotalBalance();
