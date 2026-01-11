const slotItemTemplate = `
<div class="slot-item" data-item="">
    <img class="slot-item-img">
</div>
`;
const slotRows = 3;
const slotColumns = 5;
const assetsFolder = './assets/';
let isSpinning = false;

// weight is percentage chance of appearance
const slotItems = {
    python: {
        img: assetsFolder + 'python.svg',
        multiplier: 0.5,
        weight: 25
    },
    php: {
        img: assetsFolder + 'php.svg',
        multiplier: 1,
        weight: 20
    },
    java: {
        img: assetsFolder + 'java.svg',
        multiplier: 1.5,
        weight: 15
    },
    assembly: {
        img: assetsFolder + 'assembly.svg',
        multiplier: 0.75,
        weight: 35
    },
    kotlin: {
        img: assetsFolder + 'kotlin.svg',
        multiplier: 2,
        weight: 5
    }
};

// Paylines: each payline is an array of row positions (0, 1, 2) for each column
const paylines = [
    [1, 1, 1, 1, 1], // Line 1: middle row
    [0, 0, 0, 0, 0], // Line 2: top row
    [2, 2, 2, 2, 2], // Line 3: bottom row
    [0, 1, 2, 1, 0], // Line 4: zigzag down
    [2, 1, 0, 1, 2], // Line 5: zigzag up
    [0, 0, 1, 2, 2], // Line 6: top-top-middle-bottom-bottom
    [2, 2, 1, 0, 0], // Line 7: bottom-bottom-middle-top-top
    [1, 0, 0, 0, 1], // Line 8: middle-top-top-top-middle
    [1, 2, 2, 2, 1], // Line 9: middle-bottom-bottom-bottom-middle
    [1, 1, 0, 1, 1], // Line 10: middle-middle-top-middle-middle
    [1, 1, 2, 1, 1], // Line 11: middle-middle-bottom-middle-middle
    [0, 1, 1, 1, 0], // Line 12: top-middle-middle-middle-top
    [2, 1, 1, 1, 2], // Line 13: bottom-middle-middle-middle-bottom
    [0, 0, 0, 1, 2], // Line 14: top-top-top-middle-bottom
    [2, 2, 2, 1, 0], // Line 15: bottom-bottom-bottom-middle-top
];

function startSpin(slotColumnElement, iteration = 0, onComplete = null) {
    const overdueElements = slotColumnElement.querySelectorAll('.after-active');
    overdueElements.forEach(element => {
        element.remove();
    });

    if (iteration >= 4) {
        if (onComplete) onComplete();
        return;
    }

    const newActiveElements = [];
    const oldElements = [];

    for (let i = 0; i < slotRows; i++) {
        let slotItem = document.createElement('div');
        slotItem.innerHTML = slotItemTemplate.trim();
        slotItem = slotItem.firstChild;

        // Create weighted pool from predefined weights
        const weightedPool = [];
        Object.entries(slotItems).forEach(([name, data]) => {
            for (let j = 0; j < data.weight; j++) {
                weightedPool.push([name, data]);
            }
        });

        const randomItem = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        const itemName = randomItem[0];
        const itemData = randomItem[1];

        slotItem.querySelector('img').src = itemData.img;
        slotItem.dataset.item = itemName;
        slotItem.dataset.multiplier = itemData.multiplier;
        slotItem.dataset.pos = i + 1;
        slotItem.classList.add('before-active');
        slotColumnElement.insertBefore(slotItem, slotColumnElement.firstChild);

        newActiveElements.push(slotItem);
    }

    const allItems = slotColumnElement.querySelectorAll('.active');
    oldElements.push(...allItems);

    // Don't fucking ask me why but doubling this actually fixes the animation on firefox...
    requestAnimationFrame(() => {
        requestAnimationFrame(() =>
            animateSpin(oldElements, newActiveElements, () =>
                startSpin(slotColumnElement, iteration + 1, onComplete)
            )
        );
    });
}

function animateSpin(oldElements, newElements, callback) {
    oldElements.forEach((element) => {
        element.classList.add('after-active');
        element.classList.remove('active');
    });

    newElements.forEach((element) => {
        element.classList.add('active');
        element.classList.remove('before-active');
    });

    setTimeout(callback, 400);
}

function spinSlots() {
    // Prevent double-spinning
    if (isSpinning) {
        return;
    }

    const winningsDisplay = document.getElementById('winningsDisplay');
    winningsDisplay.style.display = 'none';
    
    const existingOverlay = document.querySelector('.winning-lines-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    const bet = parseFloat(document.querySelector('.bet-input')?.value || 1);
    
    // Check if player has sufficient balance
    if (!window.balanceManager.hasSufficientBalance(bet)) {
        alert('Insufficient balance! You need $' + bet.toFixed(2) + ' to spin.');
        return;
    }
    
    // Deduct bet from balance
    window.balanceManager.removeBalance(bet);
    isSpinning = true;
    const spinButton = document.getElementById('spin-button');
    spinButton.disabled = true;

    const slotColumnsElements = document.querySelectorAll('.slot-column');
    if (slotColumnsElements.length == 0) {
        isSpinning = false;
        spinButton.disabled = false;
        return;
    }
    
    let completedSpins = 0;
    const totalColumns = slotColumnsElements.length;

    slotColumnsElements.forEach((element) => {
        setTimeout(() => {
            startSpin(element, 0, () => {
                completedSpins++;
                if (completedSpins === totalColumns) {
                    // All spins completed, check winnings and draw lines
                    const result = checkWinnings(bet);
                    console.log('Winnings:', result);
                    if (result.winAmount > 0) {
                        window.balanceManager.addBalance(result.winAmount);
                        // Display winnings and hide bet counter
                        const betCounter = document.querySelector('.bet-counter');
                        const winningsDisplay = document.getElementById('winningsDisplay');
                        const winningsAmount = winningsDisplay.querySelector('.winnings-amount');
                        winningsAmount.textContent = result.winAmount.toFixed(2);
                        winningsDisplay.style.display = 'block';
                        // Hide after 3 seconds
                        setTimeout(() => {
                            winningsDisplay.style.display = 'none';
                        }, 3000);
                    }
                    if (result.winningLines.length > 0) {
                        drawWinningLines(result.winningLines);
                    }
                    // Re-enable spinning
                    isSpinning = false;
                    spinButton.disabled = false;
                }
            });
        }, Math.floor(Math.random() * 200));
    })
}

document.getElementById('spin-button')?.addEventListener('click', spinSlots);

function checkWinnings(betAmount) {
    const slotColumnsElements = document.querySelectorAll('.slot-column');
    if (slotColumnsElements.length === 0) return { winAmount: 0, winningLines: [] };

    let totalWinAmount = 0;
    const winningLines = [];

    // Check each payline
    paylines.forEach((line, lineIndex) => {
        const lineItems = [];
        let multiplier = 0;
        
        // Get items for this payline
        for (let col = 0; col < slotColumns; col++) {
            const rowPos = line[col];
            const column = slotColumnsElements[col];
            const item = column.querySelector(`.slot-item.active[data-pos="${rowPos + 1}"]`);
            
            if (item) {
                const itemName = item.dataset.item;
                const itemMultiplier = parseFloat(item.dataset.multiplier) || 0;
                lineItems.push(itemName);
                multiplier = itemMultiplier;
            }
        }

        let matchCount = 0;
        for (let i = 0; i < lineItems.length; i++) {
            if (lineItems[i] === lineItems[0]) {
                matchCount++;
            } else {
                break;
            }
        }

        if (matchCount >= 3) {
            const matchMultiplier = matchCount === 3 ? 1 : matchCount === 4 ? 2 : 4;
            const lineWinAmount = betAmount * multiplier * matchMultiplier;
            
            totalWinAmount += lineWinAmount;
            winningLines.push({
                lineNumber: lineIndex + 1,
                symbol: lineItems[0],
                amount: lineWinAmount,
                multiplier: multiplier,
                matchCount: matchCount
            });
        }
    });

    return { winAmount: totalWinAmount, winningLines };
}

function drawWinningLines(winningLines) {
    const gameElement = document.querySelector('.game');
    if (!gameElement) return;

    const colors = [
        '#FFD700',
        '#FF1493',
        '#00CED1',
        '#32CD32', 
        '#FF6347',
        '#9370DB',
        '#FF8C00',
        '#20B2AA',
        '#FF69B4'
    ];

    const slotColumnsElements = document.querySelectorAll('.slot-column');
    
    const styles = window.getComputedStyle(gameElement);
    const paddingTop = parseFloat(styles.paddingTop);
    const paddingLeft = parseFloat(styles.paddingLeft);
    
    const contentWidth = gameElement.offsetWidth - (paddingLeft * 2);
    const contentHeight = gameElement.offsetHeight - (paddingTop * 2);
    
    console.log('Content dimensions:', contentWidth, contentHeight);
    console.log('Padding:', paddingLeft, paddingTop);
    
    const columnWidth = contentWidth / slotColumnsElements.length;
    const rowHeight = contentHeight / slotRows;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'winning-lines-overlay');
    svg.setAttribute('width', contentWidth);
    svg.setAttribute('height', contentHeight);
    svg.setAttribute('viewBox', `0 0 ${contentWidth} ${contentHeight}`);
    svg.setAttribute('style', `position: absolute; top: ${paddingTop}px; left: ${paddingLeft}px; pointer-events: none; display: block; z-index: 100;`);
    
    winningLines.forEach((win, winIndex) => {
        const lineIndex = win.lineNumber - 1;
        const line = paylines[lineIndex];
        if (!line) return;
        
        const lineColor = colors[winIndex % colors.length];
        
        const points = line.map((rowPos, colIndex) => {
            const x = colIndex * columnWidth + columnWidth / 2;
            const y = rowPos * rowHeight + rowHeight / 2;
            return `${x},${y}`;
        }).join(' ');

        console.log('Points:', points);

        const polylineElement = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polylineElement.setAttribute('points', points);
        polylineElement.setAttribute('stroke', lineColor);
        polylineElement.setAttribute('stroke-width', '4');
        polylineElement.setAttribute('fill', 'none');
        polylineElement.setAttribute('class', 'winning-line-flash');
        polylineElement.setAttribute('stroke-linecap', 'round');
        polylineElement.setAttribute('stroke-linejoin', 'round');
        
        polylineElement.dataset.lineNumber = win.lineNumber;
        polylineElement.dataset.symbol = win.symbol;
        polylineElement.dataset.amount = win.amount;
        polylineElement.dataset.multiplier = win.multiplier;

        svg.appendChild(polylineElement);
    });

    gameElement.appendChild(svg);
    console.log('SVG appended with border for visibility');
}

window.addEventListener('resize', () => {
    const existingOverlay = document.querySelector('.winning-lines-overlay');
    if (existingOverlay) {
        const winningLines = Array.from(existingOverlay.querySelectorAll('polyline')).map((polyline) => ({
            lineNumber: parseInt(polyline.dataset.lineNumber),
            symbol: polyline.dataset.symbol,
            amount: parseFloat(polyline.dataset.amount),
            multiplier: parseFloat(polyline.dataset.multiplier)
        }));
        existingOverlay.remove();
        if (winningLines.length > 0) {
            drawWinningLines(winningLines);
        }
    }
});