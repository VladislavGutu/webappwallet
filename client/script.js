let config = null;

function getConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get('config');
    if (!encodedConfig) {
        return null;
    }
    return encodedConfig;
}

async function fetchData(userId) {
    try {
        const response = await fetch(`http://localhost:8000/miniapp/data/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
        }

        const data = await response.json();
        const decodedConfig = decodeURIComponent(data);
        return JSON.parse(decodedConfig);

    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        return null;
    }
}

function ShowContent() {
    document.body.classList.add("page-loaded");
}

function updateWalletInfo(walletAddress, tokens) {
    document.getElementById('wallet-address').textContent = `${walletAddress}`;

    let totalBalance = 0;
    tokens.forEach(token => {
        totalBalance += token.price * token.amount;
    });

    document.getElementById("balance").textContent = `${totalBalance.toFixed(2)} USD`;
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
              <div class="rewards-name-symbol">
                  <span class="rewards-symbol">${transaction.symbol}</span>
                  <span class="rewards-name">${transaction.name}</span>
              </div>
              <span class="rewards-amount">+$${transaction.amount}</span>
          </div>
      </div>
      <div class="rewards-level">Level ${transaction.level}</div>
  `;

    return rewardPanel;
}

const tabButtons = document.querySelectorAll(".tab-button");
const withdrawButton = document.getElementById("withdraw-button");

function toggleTab(activeTab, config) {
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
                    toggleTab("rewards-tab", config);
                }, 175);
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

                    toggleTab(nextTab, config);
                }, 175);
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    let user_id = getConfigFromURL();
    if (!user_id) {
        user_id = 350104566;
    }
    config = await fetchData(user_id);

    if (config) {
        console.log("config:", config);
        toggleTab('coins-tab', config);
        updateWalletInfo(config.wallet_address, config.tokens);
        ShowContent();
    } else {
        console.error("Не удалось загрузить конфигурацию.");
    }
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

document.addEventListener("DOMContentLoaded", function () {
    const walletAddressElement = document.getElementById("wallet-address");

    walletAddressElement.addEventListener("click", function () {
        const walletAddress = walletAddressElement.textContent;

        const textarea = document.createElement("textarea");
        textarea.value = walletAddress;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        alert("Wallet Address copied to clipboard!");
    });
});
