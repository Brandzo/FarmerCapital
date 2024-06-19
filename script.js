let airdropData;

document.addEventListener('DOMContentLoaded', function() {
    fetch('airdropData.json')
        .then(response => response.json())
        .then(data => {
            airdropData = data;
        })
        .catch(error => console.error('Error fetching the airdrop data:', error));
});

document.getElementById('checkButton').addEventListener('click', function() {
    checkWalletAddresses();
});

function checkWalletAddresses() {
    const walletAddressInput = document.getElementById('walletAddressInput').value.trim();
    const resultsContainer = document.getElementById('resultsContainer');
    const summaryContainer = document.getElementById('summaryContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (!walletAddressInput) {
        alert('Please enter wallet addresses.');
        return;
    }

    loadingIndicator.style.display = 'block';

    setTimeout(() => {
        const walletAddresses = walletAddressInput.split(/\s+/);
        resultsContainer.innerHTML = '';
        summaryContainer.innerHTML = '';
        let totalTokens = 0;

        walletAddresses.forEach(address => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            if (isValidEvmAddress(address)) {
                const tokenAmount = airdropData[address.toLowerCase()] || 0;
                totalTokens += tokenAmount;

                resultItem.innerHTML = `
                    <span class="wallet-address">${address}</span>
                    <span class="token-amount">${tokenAmount} Tokens</span>
                `;
                resultItem.style.color = tokenAmount > 0 ? 'green' : 'gray';
            } else {
                resultItem.innerHTML = `
                    <span class="wallet-address">${address}</span>
                    <span class="error-message">Invalid EVM Address</span>
                `;
                resultItem.style.color = 'red';
            }

            resultsContainer.appendChild(resultItem);
        });

        summaryContainer.innerHTML = `
            <p>Total Tokens: <span class="total-tokens">${totalTokens}</span></p>
            <p>Congratulations! After 2 years of farming, you have earned a total of <span class="total-tokens">${totalTokens}</span> tokens.</p>
            <button id="tweetButton" class="tweet-button" onclick="shareOnTwitter(${totalTokens})">Share on Twitter</button>
        `;

        loadingIndicator.style.display = 'none';

        if (totalTokens > 0) {
            playCelebrationEffects();
            document.getElementById('tweetButton').style.display = 'block';
        }

        
        document.getElementById('copyButton').style.display = 'block';
    }, 1000);
}

function isValidEvmAddress(address) {
    const re = /^0x[a-fA-F0-9]{40}$/;
    return re.test(address);
}

function shareOnTwitter(totalTokens) {
    const tweetText = `I just received ${totalTokens} tokens from @LayerZero_Labs Airdrop! Check your allocation here https://farmercapital.xyz `;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
}

function playCelebrationEffects() {
    const audio = document.getElementById('cashRegisterAudio');
    audio.play();

    const duration = 15 * 1000;
    const end = Date.now() + duration;

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

document.getElementById('copyButton').addEventListener('click', function() {
    const summaryContainer = document.getElementById('summaryContainer');
    html2canvas(summaryContainer).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                alert('Summary image copied to clipboard!');
            }).catch(err => {
                console.error('Error copying image to clipboard:', err);
                alert('Failed to copy image to clipboard.');
            });
        });
    });
});
