let sybilWalletAddresses;

document.addEventListener('DOMContentLoaded', function() {
    fetch('sybilWallets.json')
        .then(response => response.json())
        .then(data => {
            sybilWalletAddresses = data;
        })
        .catch(error => console.error('Error fetching the Sybil wallet addresses:', error));
});

document.getElementById('checkButton').addEventListener('click', function() {
    checkWalletAddresses();
});

function checkWalletAddresses() {
    const walletAddressInput = document.getElementById('walletAddressInput').value.trim();
    const resultsContainer = document.getElementById('resultsContainer');
    const summaryContainer = document.getElementById('summaryContainer');

    if (!walletAddressInput) {
        alert('Please enter wallet addresses.');
        return;
    }

    const walletAddresses = walletAddressInput.split(/\s+/);
    resultsContainer.innerHTML = '';
    summaryContainer.innerHTML = '';
    let sybilCount = 0;

    walletAddresses.forEach(address => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        const icon = document.createElement('img');

        if (sybilWalletAddresses.includes(address)) {
            resultItem.classList.add('sybil');
            resultItem.textContent = `${address}: Sybil Wallet Found`;
            icon.src = 'red_x_icon.jpg'; 
            sybilCount++;
        } else {
            resultItem.textContent = `${address}: Not Sybil`;
            icon.src = 'green_checkmark_icon.jpg'; 
        }

        resultItem.prepend(icon);
        resultsContainer.appendChild(resultItem);
    });

    const totalAddresses = walletAddresses.length;
    const nonSybilCount = totalAddresses - sybilCount;

    let summaryMessage;

    if (totalAddresses === 1) {
        summaryMessage = sybilCount === 0
            ? `Your wallet is not Sybil. Congrats!`
            : `Your wallet is a Sybil wallet. Unfortunately.`;
        if (sybilCount === 0) {
            triggerConfetti();
        }
    } else {
        if (sybilCount === 0) {
            summaryMessage = `${totalAddresses}/${totalAddresses} of your wallets are all not Sybil. Congrats!`;
            triggerConfetti();
        } else if (sybilCount === totalAddresses) {
            summaryMessage = `All ${totalAddresses} of your wallets have been found as Sybil. Unluckily :(`;
        } else {
            summaryMessage = `${nonSybilCount}/${totalAddresses} of your wallets are not Sybil.`;
            if (nonSybilCount > sybilCount) {
                triggerConfetti();
            }
        }
    }

    summaryContainer.textContent = summaryMessage;
}

function triggerConfetti() {
    const duration = 10 * 1000;
    const end = Date.now() + duration;

    const audio = document.getElementById('celebrationAudio');
    audio.play();

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
