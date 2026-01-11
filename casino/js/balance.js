window.balanceManager = {
    BALANCE_STORAGE_KEY: 'CASINO_BALANCE',
    currentBalance: 0,

    addBalance(amount) {
        this.currentBalance += amount;
        this.saveBalance();
        this.updateBalanceDisplay();
    },

    removeBalance(amount) {
        this.currentBalance = this.currentBalance - amount < 0 ? 0 : this.currentBalance - amount;
        this.saveBalance();
        this.updateBalanceDisplay();
    },

    updateBalanceDisplay() {
        const balanceElements = document.querySelectorAll('.current-balance');
        balanceElements.forEach(el => {
            el.textContent = `$${this.currentBalance.toFixed(2)}`;
        });
    },

    hasSufficientBalance(neededBalance) {
        return this.currentBalance >= neededBalance;
    },

    loadBalance() {
        const balanceString = localStorage.getItem(this.BALANCE_STORAGE_KEY);
        let balance = null;

        if (balanceString !== null) {
            balance = Number(balanceString);
        }

        if (balance !== null && !isNaN(balance) && balance > 0) {
            this.currentBalance = balance;
        }

        this.updateBalanceDisplay();
    },

    saveBalance() {
        localStorage.setItem(this.BALANCE_STORAGE_KEY, this.currentBalance);
    },  
};

window.balanceManager.loadBalance();