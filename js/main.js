// Utils and Helper
const FormatUtil = window.FormatUtil;
const StateUtil = window.StateUtil;
const DomUtil = window.DomUtil;
const Upgrades = window.Upgrades;
const Rebirths = window.Rebirths;
const Game = window.Game;

const tickDuration = 50;

function click(event) {
    const generatedGoens = Game.getClickValue();

    window.clickCount += generatedGoens;
    window.trackingStats.totalGoensGeneratedByClicks += generatedGoens;

    DomUtil.updateClickCountElement();
    DomUtil.spawnClickNumber(event.clientX, event.clientY, generatedGoens);
}

function onTick() {
    const ticksPerSecond = 1000 / tickDuration; 
    const gps = Game.getGoenPerSecond() / ticksPerSecond;

    if (!isNaN(gps)) {
        window.clickCount += gps;
        window.trackingStats.totalGoensGenerated += gps;

        DomUtil.updateClickCountElement();
        DomUtil.updateGPSElement(gps);

        Object.keys(Upgrades.details).forEach(type => {
            Upgrades.updateElement(type);
        });
    }
    
    StateUtil.save();
}

function gainOfflineEarnings(secondsPassed) {
    const maxSeconds = Game.getMaximumOfflineTimeInSeconds();
    const gps = Game.getGoenPerSecond();
    const earned = gps * (secondsPassed > maxSeconds ? maxSeconds : secondsPassed);

    window.clickCount += earned;
    DomUtil.showOfflineNotification(secondsPassed, maxSeconds, earned, gps);
}

function onKeyReleased(event) {
    if (event.code === 'Escape' && !DomUtil.isOfflineNotificationhidden()) {
        DomUtil.hideOfflineNotification();
        return;
    }

    const num = Number(event.code.replace('Digit', '').replace('Numpad', ''));
    if (isNaN(num) || num == 0) {
        return;
    }

    // TODO: Check what tab is visible here
    const upgradeTypes = Object.keys(Upgrades.details);
    if (num > upgradeTypes.length) {
        return;
    }

    const upgradeType = upgradeTypes[num - 1];
    const upgradeCost = Upgrades.getCost(upgradeType);
    const upgradeLevel = Upgrades.getLevel(upgradeType);
    const upgradeLimit = Upgrades.getLimit(upgradeType);

    if (!Upgrades.isUpgradePurchasable(upgradeCost, upgradeLevel, upgradeLimit)) {
        return;
    }

    window.userUpgrades[upgradeType] = upgradeLevel + 1;
    window.clickCount -= upgradeCost;

    StateUtil.save();
    DomUtil.updateClickCountElement();

    Object.keys(Upgrades.details).forEach(type => Upgrades.updateElement(type));
}

function init() {
    if (window.InteractionsMenu) {
        window.InteractionsMenu.init();
    }
    
    StateUtil.loadGameData();
    DomUtil.clickElement.addEventListener('click', click);

    Upgrades.initializeUpgradeElements();
    Rebirths.initializeRebirthElements();

    document.querySelectorAll('.upgrade').forEach(element => {
        element.addEventListener('click', Upgrades.onUpgradeClicked);

        Upgrades.updateElement(element.dataset.upgradeType);
    });

    document.querySelectorAll('.rebirth').forEach(element => {
        element.addEventListener('click', Rebirths.onRebirthClicked);

        Rebirths.updateElement(element.dataset.rebirthType);
    });

    document.querySelectorAll('.close-offline-notification, .offline-notification-container')
        .forEach(el => el.addEventListener('click', DomUtil.hideOfflineNotification));

    document.addEventListener('keyup', onKeyReleased);

    const secondsPassed = Game.getTimePassedSinceLastOnlineInSeconds();
    if (secondsPassed > 15) {
        gainOfflineEarnings(secondsPassed);
    }

    DomUtil.updateGPSElement(Game.getGoenPerSecond());
    DomUtil.updateClickCountElement();
    setInterval(onTick, tickDuration);
}

init();
