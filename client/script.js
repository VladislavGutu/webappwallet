// Локальный конфиг для дебага
const localConfig = {
    wallet_address: "0x1234567890abcdef",
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

// Функция для получения конфигурации из URL
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

// Получение конфигурации: если есть локальный конфиг для дебага, используем его, иначе — конфиг из URL
function getConfig() {
    return localConfig || getConfigFromURL();
}

// Функция для обновления информации о кошельке
function updateWalletInfo(walletAddress, balance) {
    document.getElementById('wallet-address').textContent = walletAddress;
    document.querySelector(".balance").textContent = `$${balance.toFixed(2)}`;
}

// Функция для создания панели токенов
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

// Функция для создания панели вознаграждений
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

// Функция для генерации контента для вкладок
function generateTabsContent(config) {
    const coinsTab = document.getElementById("coins-tab");
    const rewardsTab = document.getElementById("rewards-tab");

    // Генерация контента для вкладки Coins
    config.tokens.forEach(token => {
        coinsTab.appendChild(createTokenPanel(token));
    });

    // Генерация контента для вкладки Rewards
    config.transaction.forEach(transaction => {
        rewardsTab.appendChild(createRewardsPanel(transaction));
    });
}


const tabButtons = document.querySelectorAll(".tab-button");

// Функция для обновления контента вкладки
function toggleTab(activeTab) {
    const tabs = document.querySelectorAll(".tab-content");

    // Удаляем все активные классы
    tabs.forEach(tab => {
        tab.classList.remove("active", "left", "right");
    });

    const activeTabContent = document.querySelector(`#${activeTab}`);
    activeTabContent.classList.add("active");

    // Генерация контента для активной вкладки
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

// Обработчик для переключения вкладок
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const activeTabButton = document.querySelector(".tab-button.active");
        const activeTabContent = document.querySelector(".tab-content.active");

        // Если текущая кнопка не активная
        if (activeTabButton !== button) {
            // Сброс активного состояния кнопок
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            // Очищаем текущий контент перед загрузкой нового
            const nextTab = button.dataset.tab;
            const currentTabContent = document.querySelector(`#${activeTabContent.id}`);

            // Переход на вкладку "Rewards" (сдвигаем контент влево)
            if (nextTab === "rewards-tab") {
                currentTabContent.classList.add("left");  // Сдвигаем контент влево
                setTimeout(() => {
                    // Очищаем текущий контент
                    currentTabContent.innerHTML = "";
                    toggleTab("rewards-tab");  // Загружаем новый контент
                }, 500);  // Пауза для завершения анимации

                // Переход на вкладку "Coins" (сдвигаем контент вправо)
            } else if (nextTab === "coins-tab") {
                // Текущая вкладка ("Rewards") сдвигается вправо
                currentTabContent.classList.add("right");

                // Новая вкладка ("Coins") приходит слева
                const nextTabContent = document.querySelector(`#${nextTab}`);
                nextTabContent.classList.add("left");

                setTimeout(() => {
                    // Удаляем старый контент из текущей вкладки
                    currentTabContent.innerHTML = "";
                    currentTabContent.classList.remove("active", "right");

                    // Подготавливаем новую вкладку
                    nextTabContent.classList.remove("left");
                    nextTabContent.classList.add("active");

                    // Обновляем контент новой вкладки
                    toggleTab(nextTab);
                }, 500); // Ждем завершения анимации
            }

        }
    });
});

// Изначально показываем вкладку "coins-tab"
const config = getConfig();
toggleTab('coins-tab'); // Изначально показываем вкладку "coins-tab"
updateWalletInfo(config.wallet_address, config.balance);