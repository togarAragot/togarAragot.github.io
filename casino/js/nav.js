function getDepositAmount() {
    const activeAmountBtn = document.querySelector('.amount-option.active');

    if (activeAmountBtn) {
        return Number(activeAmountBtn.dataset.amount);
    }

    const customInput = document.getElementById('customAmount');
    if (customInput && customInput.value) {
        return Number(customInput.value);
    }

    return 0;
}

document.addEventListener('DOMContentLoaded', () => {
    const balanceButton = document.getElementById('balanceButton');
    const dropdown = document.getElementById('balanceDropdown');
    const openDepositModal = document.getElementById('openDepositModal');
    const depositModal = document.getElementById('depositModal');
    const closeDepositModal = document.getElementById('closeDepositModal');
    const cancelDeposit = document.getElementById('cancelDeposit');
    const confirmBtn = document.getElementById('confirmBtn');

    balanceButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!balanceButton.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    const showModal = () => {
        dropdown.classList.add('hidden');
        depositModal.classList.remove('hidden');
    };
    const hideModal = () => depositModal.classList.add('hidden');

    openDepositModal?.addEventListener('click', showModal);
    closeDepositModal?.addEventListener('click', hideModal);
    cancelDeposit?.addEventListener('click', hideModal);
    
    depositModal?.addEventListener('click', (e) => {
        if (e.target === depositModal) {
            hideModal();
        }
    });

    const cryptoButtons = document.querySelectorAll('.crypto-option');
    cryptoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cryptoButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const amountButtons = document.querySelectorAll('.amount-option');
    const customInput = document.getElementById('customAmount');

    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            amountButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (customInput) {
                customInput.value = '';
            }
        });
    });

    customInput?.addEventListener('input', () => {
        amountButtons.forEach(b => b.classList.remove('active'));
    });

    confirmBtn?.addEventListener('click', () => {
        window.balanceManager.addBalance(getDepositAmount());
        hideModal();
    });
});