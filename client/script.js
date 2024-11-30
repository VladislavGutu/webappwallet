function updateWalletInfo(walletAddress, balance) {
  document.getElementById('wallet-address').textContent = walletAddress;
  document.querySelector(".balance").textContent = `$${balance.toFixed(2)}`;
}

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

function updateTotalBalance(tokens) {
  let totalBalance = 0;

  tokens.forEach((token) => {
    totalBalance += token.price * token.amount;
  });

  document.querySelector(".balance").textContent = `$${totalBalance.toFixed(2)}`;
}

function createTransactionPanel(transaction) {
  const transactionPanel = document.createElement('div');
  transactionPanel.classList.add('transaction-panel');

  transactionPanel.innerHTML = `
      <div class="rewards-info">
          <img src="${transaction.logo}" alt="${transaction.symbol}" class="rewards-logo">
          <div class="rewards-details">
              <span class="rewards-symbol">${transaction.symbol}</span>
              <span class="rewards-amount">+${transaction.amount}</span>
          </div>
      </div>
      <div class="rewards-level">Level ${transaction.level}</div>
  `;

  document.getElementById('rewards-tab').appendChild(transactionPanel);
}

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

function getConfigFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedConfig = urlParams.get('config');

  if (encodedConfig) {
    try {
      const decodedConfig = decodeURIComponent(encodedConfig);
      return JSON.parse(decodedConfig);
    } catch (error) {
      console.error('Error decoding config:', error);
      return null;
    }
  } else {
    console.error('No config parameter found in URL');
    return null;
  }
}

function fillPageWithData(config) {
  if (config) {
    updateWalletInfo(config.wallet_address, config.tokens[0].amount);

    config.tokens.forEach(createTokenPanel);

    updateTotalBalance(config.tokens);

    config.transaction.forEach(createTransactionPanel);
  } else {
    console.error('Config is invalid or not available');
  }
}

const config = getConfigFromURL();
fillPageWithData(config);

function showPopup() {
    const popup = document.getElementById("popup");
    popup.classList.add("visible");
}

function hidePopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("visible");
}

document.getElementById("withdraw-button").addEventListener("click", showPopup);
document.getElementById("close-popup").addEventListener("click", hidePopup);
