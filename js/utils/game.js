window.Game = {
    baseMaximumOfflineTimeInSeconds: 2 * 60 * 60,

    getGoenPerSecond() {
        return window.Upgrades.getLevel('auto-click') *  this.getPassiveMultiplier();
    },
    
    getClickValue() {
        return 1 + 
        (
            1 *
            window.Upgrades.getLevel('click-multiplier') *
            (window.Upgrades.getMultiplier('can-tapping') ** window.Upgrades.getLevel('can-tapping'))
        );
    },

    getPassiveMultiplier() {
        let multiplier = 1;
        
        for (const type of Object.keys(window.Upgrades.details)) {
            if (!window.Upgrades.isPassive(type)){
                continue;
            }

            const level = window.Upgrades.getLevel(type);
            multiplier = level > 0 ? multiplier + (window.Upgrades.getPassivePerLevel(type) ** level) : multiplier;
        }

        return multiplier;
    },

    getMaximumOfflineTimeInSeconds() {
        return this.baseMaximumOfflineTimeInSeconds + (window.Rebirths.getLevel('agatha') * this.baseMaximumOfflineTimeInSeconds);
    },

    getTimePassedSinceLastOnlineInSeconds() {
        const now = Math.floor(Date.now() / 1000);
        const lastOnline = Number(localStorage.getItem('lastOnline')) ?? now;

        return now - lastOnline;
    },
}