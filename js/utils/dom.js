window.DomUtil = {
    clickElement: document.getElementById('clicker'),
    clickCountElement: document.getElementById('clickCount'),
    gPerSecondElement: document.getElementById('gps'),

    spawnClickNumber(mouseX, mouseY, generatedGoens) {
        const element = document.createElement('span');
        element.classList.add('fat', 'text-green');
        element.style.position = 'fixed';
        element.style.left = `${mouseX}px`;
        element.style.top = `${mouseY - 20}px`;
        element.style.transition = 'all 600ms ease-in-out';
        element.style.pointerEvents = 'none';
        element.innerHTML = window.FormatUtil.numberFormat.format(generatedGoens);

        document.body.appendChild(element);
        this.fadeClickNumber(element);
    },

    async fadeClickNumber(element) {
        await new Promise(r => setTimeout(r, 10));

        const posY = Number(element.style.top.replace('px', ''));
        if (!isNaN(posY)) {
            element.style.top = `${posY - 50}px`;
        }
        element.style.opacity = '0.2';

        await new Promise(r => setTimeout(r, 600));
        element.remove();
    },

    updateClickCountElement() {
        this.clickCountElement.innerHTML = window.FormatUtil.numberFormat.format(window.clickCount);
    },

    updateGPSElement(gps) {
        this.gPerSecondElement.innerHTML = FormatUtil.numberFormat.format(gps);
    },

    showOfflineNotification(secondsPassed, maxSeconds, earned, gps) {
        const earningsElement = document.querySelector('.offline-earnings');
        const timeElement = document.querySelector('.offline-time');
        const rateElement = document.querySelector('.offline-time-rate');

        earningsElement.innerHTML = earningsElement.innerHTML.replace('$gainedAmount', FormatUtil.numberFormat.format(earned));
        timeElement.innerHTML = timeElement.innerHTML
            .replace('$maximumOfflineTime', FormatUtil.formatTimePassed(maxSeconds))
            .replace('$timePassed', FormatUtil.formatTimePassed(secondsPassed));
        rateElement.innerHTML = rateElement.innerHTML.replace('$gpsRate', FormatUtil.numberFormat.format(gps));

        document.querySelector('.offline-notification-container').classList.remove('hidden');
    },

    hideOfflineNotification(e) {
        const container = document.querySelector('.offline-notification-container');
        if (container.classList.contains('hidden') || (e && e.target !== e.currentTarget)){
            return;
        }

        container.classList.add('hidden');
    },

    isOfflineNotificationhidden() {
        return document.querySelector('.offline-notification-container.hidden') !== null;
    },
}

