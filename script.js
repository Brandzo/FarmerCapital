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
    checkWalletAddress();
});

function checkWalletAddress() {
    const walletAddressInput = document.getElementById('walletAddressInput').value;
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modalMessage');

    if (!walletAddressInput) {
        alert('Please enter a wallet address.');
        return;
    }

    modal.style.display = "block";

    if (Array.isArray(sybilWalletAddresses) && sybilWalletAddresses.includes(walletAddressInput)) {
        modalMessage.textContent = "SER, u sybil! I am sorry...";
    } else {
        modalMessage.textContent = "you know de wayzzzzz ser, you no sybil";
    }


    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }


    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}