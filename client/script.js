// Функция для обновления информации о кошельке
function updateWalletInfo(walletAddress, balance) {
  document.getElementById('wallet-address').textContent = walletAddress;
  document.querySelector(".balance").textContent = `$${balance.toFixed(2)}`;
}

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

// Функция для обновления общего баланса
function updateTotalBalance(tokens) {
  let totalBalance = 0;

  tokens.forEach((token) => {
    totalBalance += token.price * token.amount;
  });

  document.querySelector(".balance").textContent = `$${totalBalance.toFixed(2)}`;
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
              <span class="transaction-amount">+${transaction.amount}</span>
          </div>
      </div>
      <div class="transaction-level">Level ${transaction.level}</div>
  `;

  document.getElementById('transactions-tab').appendChild(transactionPanel);
}

// Функция для переключения вкладок
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

// Функция для получения данных от бота и заполнения страницы
async function fetchAndFillData() {
  try {
    // Здесь вы можете заменить URL на ваш сервер
    const response = await fetch('/api/getConfig'); // предполагаем, что сервер возвращает конфиг
    const config = await response.json();

    // Обновляем информацию о кошельке
    updateWalletInfo(config.wallet_address, config.tokens[0].amount);

    // Создаем панели для токенов
    config.tokens.forEach(createTokenPanel);

    // Обновляем общий баланс
    updateTotalBalance(config.tokens);

    // Создаем панели для транзакций
    config.transaction.forEach(createTransactionPanel);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Заполнение страницы данными из API
fetchAndFillData();
