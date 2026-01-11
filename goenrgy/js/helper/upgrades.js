const multiplierValueDescriptionKey = '$multiplierValue';
const genericPassiveMultiplierDescription = 'Passive Multiplier of $multiplierValue: An additive multiplier to the auto clicked Gönrgies (Auto Clicked Gönrgies = Single Click Value * Auto Click Level * (other passive Multiplier + $multiplierValue^ Level ))';
window.Upgrades = {
    details: {
        'click-multiplier': {
            'displayName': 'Click Multiplier',
            'description': 'Increases the amount of Gönrgies earned per click (Goenrgies = 1 + (1 * Click Multiplier))',
            'assetPath': './assets/icons/upgrades/click-multiplier.svg',
            'cost': 5,
            'upgradeCostPerLevel': 1.45,
        },
        'auto-click': {
            'displayName': 'Auto Click',
            'description': 'Automatically clicks for you once per second per level',
            'assetPath': './assets/icons/upgrades/auto-click.svg',
            'cost': 40,
            'upgradeCostPerLevel': 1.35,
        },
        'coffein-kick': {
            'displayName': 'Coffein Kick',
            'description': genericPassiveMultiplierDescription.replaceAll(multiplierValueDescriptionKey, 1.1),
            'assetPath': './assets/icons/upgrades/coffein-kick.svg',
            'cost': 250,
            'upgradeCostPerLevel': 1.2,
            'passiveGoenPerLevel': 1.1,
            'passiveGoen': true,
        },
        'energy-tower': {
            'displayName': 'Energy Tower',
            'description': genericPassiveMultiplierDescription.replaceAll(multiplierValueDescriptionKey, 1.15),
            'assetPath': './assets/icons/upgrades/energy-tower.svg',
            'cost': 1000,
            'upgradeCostPerLevel': 1.3,
            'passiveGoenPerLevel': 1.15,
            'passiveGoen': true,
        },
        'can-tapping': {
            'displayName': 'Can Tapping',
            'description': 'Before you open it, you usually tap the can to release the gases. Here this adds a multiplier of 1.35 per level to the click value!',
            'assetPath': './assets/icons/upgrades/can-tapping.svg',
            'cost': 2500,
            'upgradeCostPerLevel': 1.4,
            'multiplier': 1.35,
        },
        'goenrgy-factory': {
            'displayName': 'Goenrgy Factory',
            'description': genericPassiveMultiplierDescription.replaceAll(multiplierValueDescriptionKey, 1.25),
            'assetPath': './assets/icons/upgrades/goenrgy-factory.svg',
            'cost': 7500,
            'upgradeCostPerLevel': 1.45,
            'passiveGoenPerLevel': 1.25,
            'passiveGoen': true,
        },
        'gti-driver': {
            'displayName': 'GTI Driver',
            'description': genericPassiveMultiplierDescription.replaceAll(multiplierValueDescriptionKey, 1.65),
            'assetPath': './assets/icons/upgrades/gti-driver.svg',
            'cost': 50000,
            'limit': 5,
            'upgradeCostPerLevel': 1.6,
            'passiveGoenPerLevel': 1.65,
            'passiveGoen': true,
        }
    },

    getLevel(type) {
        return window.userUpgrades[type] ?? 0;
    },

    getMultiplier(type) {
        return this.details[type].multiplier;
    },

    getCostPerLevel(type) {
        return this.details[type].upgradeCostPerLevel;
    },

    getCost(type) {
        const level = this.getLevel(type);
        return this.details[type].cost * (this.getCostPerLevel(type) ** level);
    },

    getLimit(type) {
        return this.details[type].limit ?? 0;
    },

    isPassive(type) {
        return this.details[type].passiveGoen;
    },

    getPassivePerLevel(type) {
        return this.details[type].passiveGoenPerLevel;
    },

    updateElement(type) {
        const buttonElement = document.querySelector(`[data-upgrade-type="${type}"]`);
        const levelElement = document.getElementById(`${type}-level`);
        const costElement = document.getElementById(`${type}-cost`);
        const limit = this.getLimit(type);
        const cost = this.getCost(type);
        const isMax = limit !== 0 && limit === window.userUpgrades[type];

        buttonElement.disabled = isMax ? true : window.clickCount < cost;
        levelElement.innerHTML = isMax ? 'MAX' : (window.userUpgrades[type] ?? 0);
        costElement.innerHTML = isMax ? 'Infinite' : window.FormatUtil.numberFormat.format(cost);
    },

    isUpgradePurchasable(upgradeCost, upgradeLevel, upgradeLimit) {
        return window.clickCount >= upgradeCost && (upgradeLevel < upgradeLimit || upgradeLimit === 0);
    },

    onUpgradeClicked(e) {
        const upgradeType = e.currentTarget.dataset.upgradeType;
        window.Upgrades.upgrade(upgradeType);
    },

    upgrade(upgradeType) {
        const upgradeCost = this.getCost(upgradeType);
        const upgradeLevel = this.getLevel(upgradeType);
        const upgradeLimit = this.getLimit(upgradeType);

        if (!this.isUpgradePurchasable(upgradeCost, upgradeLevel, upgradeLimit)) {
            return;
        }

        window.userUpgrades[upgradeType] = upgradeLevel + 1;
        clickCount -= upgradeCost;

        window.StateUtil.save();
        window.DomUtil.updateClickCountElement();

        Object.keys(this.details).forEach(updateType => this.updateElement(updateType));
    },

    initializeUpgradeElements() {
        const upgradesContainer = document.querySelector('.upgrades-list');

        upgradesContainer.innerHTML = Object.entries(this.details).map(([type, upgradeDetails], index) => `
            <button class="upgrade" data-upgrade-type="${type}" title="${upgradeDetails.description}">
                <img class="upgrade-icon" src="${upgradeDetails.assetPath}" alt="upgrade icon">
                ${upgradeDetails.displayName}: <span id="${type}-level"></span> LVL <br>
                Cost: <span id="${type}-cost"></span>
                <span class="keyboard-controls">${index + 1}</span>
            </button>
        `).join('');
    },
};
