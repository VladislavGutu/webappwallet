// Данные о коинах
const tokensData = [
  { name: "Bitcoin", symbol: "BTC", price: 67813.48, amount: 0.1584, logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  { name: "Binance Coin", symbol: "BNB", price: 643.23, amount: 33, logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png" },
  { name: "Ethereum", symbol: "ETH", price: 4809.91, amount: 1, logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { name: "Litecoin", symbol: "LTC", price: 40, amount: 4, logo: "https://cryptologos.cc/logos/litecoin-ltc-logo.png" },
  { name: "XRP", symbol: "XRP", price: 1.24, amount: 1000, logo: "https://cryptologos.cc/logos/xrp-xrp-logo.png" }
];

// Функция для создания панели с коином
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
        <span class="token-total">$${(token.price * token.amount).toFixed(2)}</span>
    </div>`;

  document.getElementById("coins-tab").appendChild(tokenPanel);
}

// Функция для обновления баланса
function updateTotalBalance() {
  let totalBalance = 0;

  tokensData.forEach((token) => {
    totalBalance += token.price * token.amount;
  });

  document.querySelector(".balance").textContent = `$${totalBalance.toFixed(2)}`;
}

// Данные о транзакциях
const transactionsData = [
    { logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", symbol: "BTC", amount: "+10000$", level: 1 },
    { logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png", symbol: "ETH", amount: "+5000$", level: 2 },
    { logo: "https://cryptologos.cc/logos/litecoin-ltc-logo.png", symbol: "LTC", amount: "+2000$", level: 3 }
];

// Функция для создания панели с транзакцией
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

// Функция для переключения между вкладками
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.querySelector(`#${button.dataset.tab}`).classList.add("active");
  });
});

// Генерация контента для вкладки "Coins" и "Transactions"
tokensData.forEach(createTokenPanel);
transactionsData.forEach(createTransactionPanel);

// Обновляем общий баланс
updateTotalBalance();

// Информация о кошельке
const walletData = {
  "walletAddress": "GBT7GBQLQLIICGUFYE7F7WXEQIH3OT42ZEUX3ORM6TIBIACFO7WVHLUB",
  "balance": 10000
};

// Функция для форматирования адреса кошелька
function formatWalletAddress(walletAddress) {
  const start = walletAddress.slice(0, 4);  // первые 4 символа
  const end = walletAddress.slice(-4);  // последние 4 символа
  return `${start}...${end}`;  // возвращаем отформатированный адрес
}

// Отображаем отформатированный адрес кошелька
const formattedWallet = formatWalletAddress(walletData.walletAddress);
document.getElementById('wallet-address').textContent = formattedWallet;

// Отображаем баланс кошелька
document.getElementById('balance-amount').textContent = walletData.balance.toFixed(2);
