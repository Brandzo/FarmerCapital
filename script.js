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

    const summaryMessage = sybilCount === 0
        ? `${totalAddresses}/${totalAddresses} of your wallets are all not Sybil. Congrats!`
        : `${nonSybilCount}/${totalAddresses} of your wallets are not Sybil.`;

    summaryContainer.textContent = summaryMessage;
}
