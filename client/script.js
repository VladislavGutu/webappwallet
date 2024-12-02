const localConfig = {
    wallet_address: "GDUZAK42IY56CH6RD5F4ONG7DH53K5GZIMKNWQ6RU2WYCNVVSKIY34G3",
    tokens: [
        {
            symbol: "BTC",
            name: "Bitcoin",
            logo: "https://example.com/btc-logo.png",
            price: 45000,
            amount: 1.23
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            logo: "https://example.com/eth-logo.png",
            price: 3000,
            amount: 5.45
        }
    ],
    transaction: [
        {
            logo: "https://example.com/btc-logo.png",
            symbol: "BTC",
            amount: 150,
            level: 3
        },
        {
            logo: "https://example.com/eth-logo.png",
            symbol: "ETH",
            amount: 200,
            level: 5
        }
    ]
};

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

function getConfig() {
    return localConfig || getConfigFromURL();
}


function updateWalletInfo(walletAddress, tokens) {
    document.getElementById('wallet-address').textContent = `Wallet Address: ${walletAddress}`;

    let totalBalance = 0;
    tokens.forEach(token => {
        totalBalance += token.price * token.amount;
    });

    document.getElementById("balance").textContent = `$${totalBalance.toFixed(2)}`;
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

    return tokenPanel;
}

function createRewardsPanel(transaction) {
    const rewardPanel = document.createElement('div');
    rewardPanel.classList.add('rewards-panel');

    rewardPanel.innerHTML = `
      <div class="rewards-info">
          <img src="${transaction.logo}" alt="${transaction.symbol}" class="rewards-logo">
          <div class="rewards-details">
              <span class="rewards-symbol">${transaction.symbol}</span>
              <span class="rewards-amount">+$${transaction.amount}</span>
          </div>
      </div>
      <div class="rewards-level">Level ${transaction.level}</div>
  `;

    return rewardPanel;
}

const tabButtons = document.querySelectorAll(".tab-button");
const withdrawButton = document.getElementById("withdraw-button");

function toggleTab(activeTab) {
    const tabs = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.classList.remove("active", "left", "right");
    });

    const activeTabContent = document.querySelector(`#${activeTab}`);
    activeTabContent.classList.add("active");

    if (activeTab === "rewards-tab") {
        config.transaction.forEach(transaction => {
            activeTabContent.appendChild(createRewardsPanel(transaction));
        });
    } else if (activeTab === "coins-tab") {
        config.tokens.forEach(token => {
            activeTabContent.appendChild(createTokenPanel(token));
        });
    }
}

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const activeTabButton = document.querySelector(".tab-button.active");
        const activeTabContent = document.querySelector(".tab-content.active");

        if (activeTabButton !== button) {
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const nextTab = button.dataset.tab;
            const currentTabContent = document.querySelector(`#${activeTabContent.id}`);

            if (nextTab === "rewards-tab") {
                currentTabContent.classList.add("left");
                withdrawButton.style.display = "none";

                setTimeout(() => {
                    currentTabContent.innerHTML = "";
                    toggleTab("rewards-tab");

                }, 350);
            } else if (nextTab === "coins-tab") {

                currentTabContent.classList.add("right");

                const nextTabContent = document.querySelector(`#${nextTab}`);
                nextTabContent.classList.add("left");

                setTimeout(() => {
                    currentTabContent.innerHTML = "";
                    currentTabContent.classList.remove("active", "right");

                    nextTabContent.classList.remove("left");
                    nextTabContent.classList.add("active");
                    withdrawButton.style.display = "block";

                    toggleTab(nextTab);
                }, 350);
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const withdrawButton = document.getElementById("withdraw-button");
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("close-popup");

    withdrawButton.addEventListener("click", () => {
        popup.style.display = "block";
    });

    closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});

const config = getConfig();
toggleTab('coins-tab');
updateWalletInfo(config.wallet_address, config.tokens);