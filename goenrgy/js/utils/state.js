window.StateUtil = {
    loadGameData() {
        window.clickCount = Number(localStorage.getItem('clickCount')) ?? 0;
        window.rebirthCount = Number(localStorage.getItem('rebirthCount')) ?? 0;
        window.trackingStats = JSON.parse(localStorage.getItem('trackingStats')) ?? {
            totalGoensGenerated: 0,
            totalGoensGeneratedByClicks: 0,
            totalRebirth: 0,
        };
        window.userUpgrades = JSON.parse(localStorage.getItem('upgrades')) ?? {};
        window.rebirthUpgrades = JSON.parse(localStorage.getItem('rebirthUpgrades')) ?? {};
    },

    save() {
        localStorage.setItem('clickCount', window.clickCount);
        localStorage.setItem('rebirthCount', window.rebirthCount);
        localStorage.setItem('upgrades', JSON.stringify(window.userUpgrades));
        localStorage.setItem('rebirthUpgrades', JSON.stringify(window.rebirthUpgrades));
        localStorage.setItem('trackingStats', JSON.stringify(window.trackingStats));
        localStorage.setItem('lastOnline', Math.floor(Date.now() / 1000));
    },
}