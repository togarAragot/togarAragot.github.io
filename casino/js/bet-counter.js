// Bet counter functionality
const betInput = document.querySelector('.bet-input');
const decreaseBetButtons = document.querySelectorAll('.decrease-bet');
const increaseBetButtons = document.querySelectorAll('.increase-bet');

function getMaxBet() {
    return window.balanceManager.currentBalance;
}

function updateBetInput(newBet) {
    const maxBet = getMaxBet();
    const clampedBet = Math.max(0.1, Math.min(newBet, maxBet));
    betInput.value = clampedBet.toFixed(2);
}

decreaseBetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const amount = parseFloat(button.value);
        const currentBet = parseFloat(betInput.value) || 1;
        const newBet = currentBet - amount;
        updateBetInput(newBet);
    });
});

increaseBetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const amount = parseFloat(button.value);
        const currentBet = parseFloat(betInput.value) || 1;
        const newBet = currentBet + amount;
        updateBetInput(newBet);
    });
});

// Allow direct input in the bet field
betInput.addEventListener('input', () => {
    const inputBet = parseFloat(betInput.value) || 0;
    updateBetInput(inputBet);
});