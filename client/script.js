document.addEventListener("DOMContentLoaded", () => {
  const linearProgress = document.getElementById("linearProgress");
  const linearProgressPercentage = document.getElementById("linearProgressPercentage");
  const circle = document.querySelector(".circle");
  const circlePercentage = document.querySelector(".circle-percentage");

  const linearTargetPercentage = Math.floor(Math.random() * 100) + 1;
  const circleTargetPercentage = Math.floor(Math.random() * 100) + 1;

  const animationDuration = 1000;
  const fps = 60;

  const steps = Math.floor(animationDuration * fps / 1000);
  const linearIncrement = linearTargetPercentage / steps;
  const circleIncrement = circleTargetPercentage / steps;

  let currentLinearPercentage = 0;
  let currentCirclePercentage = 0;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  const animateProgress = () => {
    if (currentLinearPercentage < linearTargetPercentage || currentCirclePercentage < circleTargetPercentage) {
      if (currentLinearPercentage < linearTargetPercentage) {
        currentLinearPercentage += linearIncrement;
        if (currentLinearPercentage > linearTargetPercentage) currentLinearPercentage = linearTargetPercentage;
        linearProgress.style.width = `${currentLinearPercentage}%`;
        linearProgressPercentage.textContent = `${Math.floor(currentLinearPercentage)}%`;
      }

      if (currentCirclePercentage < circleTargetPercentage) {
        currentCirclePercentage += circleIncrement;
        if (currentCirclePercentage > circleTargetPercentage) currentCirclePercentage = circleTargetPercentage;

        const progressValue = (currentCirclePercentage / 100) * circumference;
        circle.style.strokeDasharray = `${progressValue} ${circumference}`;
        circlePercentage.textContent = `${Math.floor(currentCirclePercentage)}%`;
      }

      requestAnimationFrame(animateProgress);
    }
  };

  animateProgress();
});

document.addEventListener('DOMContentLoaded', function () {
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const counterOne = document.querySelector('.raised');
    const counterTwo = document.querySelector('.transactions-sum');
    const counterThree = document.querySelector('.liquidity-count');

    const targetValueOne = getRandomNumber(1853816440225, 9853816440225);
    const targetValueThree = getRandomNumber(10000000000000, 99999999999999);

    counterOne.setAttribute('data-target', targetValueOne);
    counterTwo.setAttribute('data-target', targetValueOne);
    counterThree.setAttribute('data-target', targetValueThree);

    const updateIntervalOne = 10;
    const incrementOne = targetValueOne / 200;
    const incrementTwo = targetValueOne / 200;
    const incrementThree = targetValueThree / 200;

    function updateCounter(counter, increment, targetValue, updateInterval, text) {
        let currentValue = 0;
        const counterInterval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counterInterval);
            }
            counter.innerText = formatNumber(Math.floor(currentValue)) + text;
        }, updateInterval);
    }

    updateCounter(counterOne, incrementOne, targetValueOne, updateIntervalOne, "$ raised");
    updateCounter(counterTwo, incrementTwo, targetValueOne, updateIntervalOne, "$");
    updateCounter(counterThree, incrementThree, targetValueThree, updateIntervalOne, "$");

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const config = urlParams.get("config");

    if (config) {
        try {
            const data = JSON.parse(decodeURIComponent(config));

            document.getElementById("level").textContent =
                `Congratulations, you unlocked your crypto investment account for level "${ХУЙЛА}}"`;

            const walletAddress = data.wallet_address || "N/A";
            const walletBalance = data.tokens?.[0]?.balance || "N/A";

            document.getElementById("walletAddress").textContent = `Wallet Address: ${walletAddress}`;
            document.getElementById("walletBalance").textContent = `Balance: ${walletBalance}$`;

            const tokens = data.tokens || [];
            tokens.forEach(token => {
                console.log(`Token: ${token.name}, Balance: ${token.balance}, Price: ${token.price_to_usd}`);
            });
        } catch (e) {
            console.error("Invalid JSON:", e);
        }
    } else {
        console.log("No config found in URL");
    }
});
