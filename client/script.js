// Моковые данные о токенах
const tokensData = [
  {
    "name": "Ethereum",
    "symbol": "ETH",
    "price": 2450.50,
    "amount": 5.24,
    "logo": "https://cryptologos.cc/logos/ethereum-eth-logo.png"
  },
  {
    "name": "Binance Coin",
    "symbol": "BNB",
    "price": 420.30,
    "amount": 12.14,
    "logo": "https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
  },
  {
    "name": "Cardano",
    "symbol": "ADA",
    "price": 1.45,
    "amount": 2000.50,
    "logo": "https://cryptologos.cc/logos/cardano-ada-logo.png"
  }
];

function createTokenPanel(token) {
  const tokenPanel = document.createElement('div');
  tokenPanel.classList.add('token-panel');

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
    </div>
  `;

  document.getElementById('tokens-tab').appendChild(tokenPanel);
}

function updateTotalBalance() {
  let totalBalance = 0;

  tokensData.forEach(token => {
    totalBalance += token.price * token.amount;
  });

  document.getElementById('total-balance').textContent = `$${totalBalance.toFixed(2)}`;
}

tokensData.forEach(createTokenPanel);

updateTotalBalance();

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    document.querySelector(`.tab-content#${button.dataset.tab}`).classList.add('active');
  });
});
