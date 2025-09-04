window.Rebirths = {
    stats: {
        'agatha': {
            displayName: 'Agatha',
            description: 'Increases max offline time by 2 hours per level',
            cost: 1,
        },
    },

    getLevel(type) {
        return window.rebirthUpgrades[type] ?? 0;
    },

    getBaseCost(type) {
        return this.stats[type].cost ?? 0;
    },

    getCost(type) {
        return this.getBaseCost(type) * (1 + this.getLevel(type));
    },

    getLimit(type) {
        return this.stats[type].limit ?? 0;
    },

    updateElement(type) {
        const buttonElement = document.querySelector(`[data-rebirth-type="${type}"]`);
        const levelElement = document.getElementById(`${type}-level`);
        const costElement = document.getElementById(`${type}-cost`);
        const limit = this.getLimit(type);
        const cost = this.getCost(type);
        const isMax = (limit !== 0 && limit === window.rebirthUpgrades[type]);

        buttonElement.disabled = isMax ? true : window.rebirthCount < cost;
        levelElement.innerHTML = isMax ? 'MAX' : (window.rebirthUpgrades[type] ?? 0);
        costElement.innerHTML = isMax ? 'Infinite' : window.FormatUtil.numberFormat.format(cost);
    },

    initializeRebirthElements() {
        const rebirthContainer = document.querySelector('.rebirth-list');

        rebirthContainer.innerHTML = Object.entries(this.stats).map(([type, rebirthDetails], index) => `
            <button class="rebirth" data-rebirth-type="${type}" title="${rebirthDetails.description}">
                ${rebirthDetails.displayName}: <span id="${type}-level"></span> LVL <br>
                Cost: <span id="${type}-cost"></span>
                <span class="keyboard-controls">${index + 1}</span>
            </button>
        `).join('');
    },

    onRebirthClicked(e) {
        const rebirthType = e.currentTarget.dataset.rebirthType;
        window.Rebirths.upgradeRebirth(rebirthType);
    },

    upgradeRebirth(rebirthType) {
        const upgradeCost = this.getCost(rebirthType);
        const upgradeLevel = this.getLevel(rebirthType);
        const upgradeLimit = this.getLimit(rebirthType);

        if (!isRebirthUpgradePurchasable(upgradeCost, upgradeLevel, upgradeLimit)) {
            return;
        }

        window.rebirthUpgrades[rebirthType] = upgradeLevel + 1;
        rebirthCount -= upgradeCost;
        window.StateUtil.save();

        // updateRebirthCountElement();

        // Update rebirth Elements here
    }
};
