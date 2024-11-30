// function updateWalletInfo(walletAddress, balance) {
//   document.getElementById('wallet-address').textContent = walletAddress;
//   document.querySelector(".balance").textContent = `$${balance.toFixed(2)}`;
// }
//
// function createTokenPanel(token) {
//   const tokenPanel = document.createElement("div");
//   tokenPanel.classList.add("token-panel");
//
//   tokenPanel.innerHTML = `
//     <div class="token-info">
//         <img src="${token.logo}" alt="${token.name}" class="token-logo">
//         <div class="token-details">
//             <div class="token-name-symbol">
//                 <span class="token-symbol">${token.symbol}</span>
//                 <span class="token-name">${token.name}</span>
//             </div>
//             <span class="token-price">$${token.price.toFixed(2)}</span>
//         </div>
//     </div>
//     <div class="token-right">
//         <span class="token-quantity">${token.amount}</span>
//         <span class="token-total">~$${(token.price * token.amount).toFixed(2)}</span>
//     </div>`;
//
//   document.getElementById("coins-tab").appendChild(tokenPanel);
// }
//
// function updateTotalBalance(tokens) {
//   let totalBalance = 0;
//
//   tokens.forEach((token) => {
//     totalBalance += token.price * token.amount;
//   });
//
//   document.querySelector(".balance").textContent = `$${totalBalance.toFixed(2)}`;
// }
//
// function createRewardsPanel(transaction) {
//   const transactionPanel = document.createElement('div');
//   transactionPanel.classList.add('transaction-panel');
//
//   transactionPanel.innerHTML = `
//       <div class="rewards-info">
//           <img src="${transaction.logo}" alt="${transaction.symbol}" class="rewards-logo">
//           <div class="rewards-details">
//               <span class="rewards-symbol">${transaction.symbol}</span>
//               <span class="rewards-amount">+${transaction.amount}</span>
//           </div>
//       </div>
//       <div class="rewards-level">Level ${transaction.level}</div>
//   `;
//
//   document.getElementById('rewards-tab').appendChild(transactionPanel);
// }
//
// const tabButtons = document.querySelectorAll(".tab-button");
// const tabContents = document.querySelectorAll(".tab-content");
//
// tabButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     tabButtons.forEach((btn) => btn.classList.remove("active"));
//     tabContents.forEach((content) => content.classList.remove("active"));
//
//     button.classList.add("active");
//     document.querySelector(`#${button.dataset.tab}`).classList.add("active");
//   });
// });
//
// function getConfigFromURL() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const encodedConfig = urlParams.get('config');
//
//   if (encodedConfig) {
//     try {
//       const decodedConfig = decodeURIComponent(encodedConfig);
//       return JSON.parse(decodedConfig);
//     } catch (error) {
//       console.error('Error decoding config:', error);
//       return null;
//     }
//   } else {
//     console.error('No config parameter found in URL');
//     return null;
//   }
// }
//
// function fillPageWithData(config) {
//   if (config) {
//     updateWalletInfo(config.wallet_address, config.tokens[0].amount);
//
//     config.tokens.forEach(createTokenPanel);
//
//     updateTotalBalance(config.tokens);
//
//     config.transaction.forEach(createRewardsPanel);
//   } else {
//     console.error('Config is invalid or not available');
//   }
// }
//
// const config = getConfigFromURL();
// fillPageWithData(config);
//
// function showPopup() {
//     const popup = document.getElementById("popup");
//     popup.classList.add("visible");
// }
//
// function hidePopup() {
//     const popup = document.getElementById("popup");
//     popup.classList.remove("visible");
// }
//
// document.getElementById("withdraw-button").addEventListener("click", showPopup);
// document.getElementById("close-popup").addEventListener("click", hidePopup);
const config = {
  wallet_address: 'GBT7GBQLQLIICGUFYE7F7WXEQIH3OT42ZEUX3ORM6TIBIACFO7WVHLUB',
  tokens: [
    {
      name: 'USD Coin',
      symbol: 'USDC',
      amount: 10000,
      price: 1,
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      amount: 0.5,
      price: 30000,
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    }
  ],
  reward: [
    {
      symbol: 'USDC',
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      level: 1,
      amount: 5000
    },
    {
      symbol: 'BTC',
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      level: 2,
      amount: 0.1
    }
  ]
};

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

function createRewardsPanel(reward) {
  const rewardPanel = document.createElement('div');
  rewardPanel.classList.add('rewards-panel');

  rewardPanel.innerHTML = `
    <div class="rewards-info">
        <img src="${reward.logo}" alt="${reward.symbol}" class="rewards-logo">
        <div class="rewards-details">
            <span class="rewards-symbol">${reward.symbol}</span>
            <span class="rewards-amount">+$${reward.amount}</span>
        </div>
    </div>
    <div class="rewards-level">Level ${reward.level}</div>
  `;

  document.getElementById('rewards-tab').appendChild(rewardPanel);
}

const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.querySelector(`#${button.dataset.tab}`).classList.add("active");

    // Показываем кнопку Withdraw только в вкладке Rewards
    if (button.dataset.tab === 'rewards-tab') {
      document.getElementById("withdraw-button").style.display = 'block';
    } else {
      document.getElementById("withdraw-button").style.display = 'none';
    }
  });
});

function fillPageWithData(config) {
  if (config) {
    updateWalletInfo(config.wallet_address, config.tokens[0].amount);

    config.tokens.forEach(createTokenPanel);

    updateTotalBalance(config.tokens);

    config.reward.forEach(createRewardsPanel);  // Привязка к правильному свойству `reward`
  } else {
    console.error('Config is invalid or not available');
  }
}

// Заполняем страницу локальными данными
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

// Изначально кнопка должна быть скрыта, она будет отображаться только в вкладке Rewards
document.getElementById("withdraw-button").style.display = 'none';

