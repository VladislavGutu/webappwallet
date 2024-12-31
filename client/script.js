import {getAccountBalance} from "./stellar_helper.js";
import {create_config} from "./config_builder.js";
import {getTokenData} from "./config_builder.js";
import {web_app_version} from "./Config.js";
import {get_config} from "../datacontoller.js";


const check_token = "CZI:GAATAURKW525OLU4LE27QB5FSM4PQXDSTJ6YEG7E7E6GA2FCWORUSA6Y"

const wallet_test_config = {'wallet': 'GBQCR3L7H2QBCJNEI3CLBRCGQFSTGPEPRW3U2NPQRUJ66ZVQ7SECSUHQ',
    'levels_config': {
        1: [0, 99],
        2: [100, 999],
        3: [1000, 4999],
        4: [5000, 9999],
        5: [10000, 24999],
        6: [25000, 49999],
        7: [50000, 99999],
        8: [100000, 250000]
    },
    'version': 2
}

function getConfigFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedConfig = urlParams.get('config');

    console.log("encodedConfig: ", encodedConfig);

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
        showPopup("Please close your wallet app and open it up again to get the your information UpToDate. 🛠", false);
        return null;
    }
}


async function getConfig() {
    let remoteConfig = await get_config(getConfigFromURL());
    // let remoteConfig = wallet_test_config;

    if(!remoteConfig.wallet || remoteConfig.wallet === "") {
        showPopup(`You don't have active wallet. ⚠️`, false);
        return null;
    }

    let all_balances = await getAccountBalance(remoteConfig.wallet);

    let balance = all_balances[check_token];
    if (balance === undefined) {
        console.error('No balance found for check_token');
        showPopup("Please add trusline your wallet to the CZI token. 🛠", false);
        return null;
    }

    console.log("remoteConfig: ", remoteConfig);
    console.log("balance: ", balance);

    if (!remoteConfig.levels_config || Object.keys(remoteConfig.levels_config).length === 0) {
        showPopup("Please close your wallet app and open it up again to get the your information UpToDate. 🛠", false);
        return null;
    }

    if (!remoteConfig.version){
        showPopup("Please close your wallet app and open it up again to get the your information UpToDate. 🛠", false);
        return null;
    }

    if (remoteConfig.version === web_app_version) {
        console.log('Config is up to date');
        return create_config(remoteConfig.wallet, balance, remoteConfig.levels_config, remoteConfig.version);
    } else if (remoteConfig.version < web_app_version) {
        showPopup("Please close your wallet app and open it up again to get the your information UpToDate. 🛠", false);
        return null;
    } else if (remoteConfig.version > web_app_version) {
        showPopup("Please close your wallet app and open it up again to get the your information UpToDate. 🛠", false);
        return null;
    } else {
        showPopup("Please close your wallet app and open it up again to get the your information UpToDate. 🛠", false);
        return null;
    }

}

function showPopup(message, bool) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("pop-message");
    const closePopupButton = document.getElementById("close-popup");

    popupMessage.textContent = message;
    popup.style.display = "block";

    closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
    if (!bool) {
        closePopupButton.style.display = "none";
    }
}

window.addEventListener("load", () => {
    document.body.classList.add("page-loaded");

    window.scrollTo(0, 0);
});

function updateWalletInfo(walletAddress, tokens) {
    document.getElementById('wallet-address').textContent = `${walletAddress}`;

    let totalBalance = 0;
    tokens.forEach(token => {
        totalBalance += token.price * token.amount;
    });

    document.getElementById("balance").textContent = `${round(totalBalance, 2)} USD`;
}

export function updateTokenPriceAndArrow(token) {
    const { token_price, previous_price } = getTokenData();

    const priceElement = document.getElementById(`price-${token.symbol}`);
    const arrowElement = document.getElementById(`arrow-${token.symbol}`);

    if (priceElement && arrowElement) {
        priceElement.innerHTML = `$${round(token_price[token.symbol], 2)}`;

        let arrowClass = '';
        let arrow = '';

        if (previous_price[token.symbol] === '▲') {
            arrowClass = 'green';
            arrow = '▲';
        } else if (previous_price[token.symbol] === '▼') {
            arrowClass = 'red';
            arrow = '▼';
        } else {
            arrowClass = 'black';
            arrow = '→';
        }

        arrowElement.textContent = arrow;
        arrowElement.className = `price-arrow ${arrowClass}`;
    }
}

function createTokenPanel(token) {
    const tokenPanel = document.createElement("div");

    const { previous_price } = getTokenData();

    tokenPanel.classList.add("token-panel");

    tokenPanel.innerHTML = `
    <div class="token-info">
        <img src="${token.logo}" alt="${token.name}" class="token-logo">
        <div class="token-details">
            <div class="token-name-symbol">
                <span class="token-symbol">${token.symbol}</span>
                <span class="token-name">${token.name}</span>
            </div>
            <span class="token-price">$${round(token.price,2)}
            <span class="price-arrow" id="arrow-${token.symbol}" data-symbol="${token.symbol}"> ${''} </span>
            </span>
        </div>
    </div>
    <div class="token-right">
        <span class="token-quantity">${round(token.amount, 7)}</span>
        <span class="token-total">~$${round((token.price * token.amount), 2)}</span>
    </div>`;

    return tokenPanel;
}


function createRewardsPanel(transaction) {
    const rewardPanel = document.createElement('div');
    rewardPanel.classList.add('rewards-panel');

    rewardPanel.innerHTML = `
  <div class="rewards-info">
      <div class="rewards-left">
          <img src="${transaction.logo}" alt="${transaction.symbol}" class="rewards-logo">
          <div class="rewards-details">
              <div class="rewards-name-symbol">
                  <span class="rewards-symbol">${transaction.symbol}</span>
                  <span class="rewards-name">${transaction.name}</span>
              </div>
              <span class="rewards-amount">+$${transaction.amount}</span>
              <span class="rewards-text">Crypto account given for being a level ${transaction.level} investor.</span>
          </div>
      </div>
      <div class="rewards-right">
          <span class="rewards-level">Level ${transaction.level}</span>
      </div>
  </div>
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
    activeTabContent.innerHTML = "";

    if (activeTab === "rewards-tab") {

        const sortedTransactions = config.transaction.sort((a, b) => b.level - a.level);

        sortedTransactions.forEach(transaction => {
            activeTabContent.appendChild(createRewardsPanel(transaction));
        });
    } else if (activeTab === "coins-tab") {
        for (const token of config.tokens) {
            activeTabContent.appendChild(createTokenPanel(token));
        }
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
                    window.scrollTo(0, 0);

                    currentTabContent.innerHTML = "";
                    toggleTab("rewards-tab");

                }, 175);
            } else if (nextTab === "coins-tab") {

                window.scrollTo(0, 0);
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
                }, 175);
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


function round(number, precision, minDecimals = 2) {
    const factor = 10 ** precision;
    const rounded = Math.round(number * factor) / factor;

    const decimals = rounded.toString().split('.')[1]?.length || 0;

    return decimals < minDecimals
        ? rounded.toFixed(minDecimals)
        : rounded.toString();
}


let config = null;

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
    const walletContainer = document.querySelector(".wallet-container");

    config = await getConfig();

    toggleTab("coins-tab");
    updateWalletInfo(config.wallet_address, config.tokens);

    walletContainer.style.opacity = "0";
    walletContainer.style.transition = "opacity .5s ease-in";

    setTimeout(() => {
        walletContainer.style.opacity = "1";
    }, 50);
}
