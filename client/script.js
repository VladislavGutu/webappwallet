const tokensData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 67813.48,
    amount: 0.1584,
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    price: 643.23,
    amount: 33,
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 4809.91,
    amount: 1,
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    price: 40,
    amount: 4,
    logo: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 1.24,
    amount: 1000,
    logo: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
  },
];

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
    </div>
  `;

  document.getElementById("coins-tab").appendChild(tokenPanel);
}

function updateTotalBalance() {
  let totalBalance = 0;

  tokensData.forEach((token) => {
    totalBalance += token.price * token.amount;
  });

  document.querySelector(".balance").textContent = `$${totalBalance.toFixed(2)}`;
}

function updateProgress(level, percentage, earnings) {
  document.querySelector(".level").textContent = `Level ${level}`;
  document.querySelector(".progress-fill").style.width = `${percentage}%`;
  document.querySelector(".progress-earnings").textContent = `+${earnings}$`;
}

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.querySelector(`.tab-content#${button.dataset.tab}`).classList.add("active");

    if (button.dataset.tab === "history-tab") {
      setTimeout(() => updateProgress(1, 50, 10000), 500);
    }
  });
});

tokensData.forEach(createTokenPanel);
updateTotalBalance();

const walletData = {
  "walletAddress": "GBT7GBQLQLIICGUFYE7F7WXEQIH3OT42ZEUX3ORM6TIBIACFO7WVHLUB",
  "balance": 10000
};

function formatWalletAddress(walletAddress) {
  const start = walletAddress.slice(0, 4);
  const end = walletAddress.slice(-4);
  return `${start}...${end}`;
}

const formattedWallet = formatWalletAddress(walletData.walletAddress);
document.getElementById('wallet-address').textContent = formattedWallet;

document.getElementById('balance-amount').textContent = walletData.balance.toFixed(2);
