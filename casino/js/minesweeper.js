let minesCount = 3;
let betAmount = 0;
let gameActive = false;
let minePositions = [];
let revealedTiles = 0;
let currentMultiplier = 1.00;

const gridElement = document.getElementById('grid');
const statusBox = document.getElementById('status-box');
const mainButton = document.getElementById('main-button');
const buttonText = document.getElementById('button-text');
const buttonIcon = document.getElementById('button-icon');

const DIAMOND_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>`;
const BUG_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;

function initGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = i;
        tile.onclick = () => handleTileClick(i);
        gridElement.appendChild(tile);
    }
}

function setBugs(count) {
    if (gameActive) {
        return;
    }

    minesCount = count;
    updateSelectionButtons('bug-btn', count);
    updateStats();
}

function updateSelectionButtons(className, value) {
    document.querySelectorAll('.' + className).forEach(btn => {
        const btnValue = btn.innerText.replace(' 🐛', '').replace('$', '');
        if (btnValue == value) btn.classList.add('btn-active');
        else btn.classList.remove('btn-active');
    });
}

function calculateMultiplier(n, m) {
    if (n === 0) {
        return 1.00;
    }
    let multiplier = 1.0;

    for (let i = 0; i < n; i++) {
        multiplier *= (25 - i) / (25 - m - i);
    }

    return multiplier * 0.97;
}

function updateStats() {
    if (!gameActive) {
        renderStatsView(1.00, 0, 0);
        return;
    }

    currentMultiplier = calculateMultiplier(revealedTiles, minesCount);
    const potentialWin = betAmount * currentMultiplier;
    renderStatsView(currentMultiplier, potentialWin, revealedTiles);
}

function renderStatsView(mult, win, safe) {
    statusBox.innerHTML = `
        <div class="stat-item">
            <p class="stat-label">Current Multiplier</p>
            <p class="stat-value" style="color: #10b981">${mult.toFixed(2)}x</p>
        </div>
        <div class="stat-item">
            <p class="stat-label">Potential Win</p>
            <p class="stat-value" style="color: #f59e0b">$${win.toFixed(0)}</p>
        </div>
        <div class="stat-item">
            <p class="stat-label">Safe Spots</p>
            <p class="stat-value">${safe}/${25 - minesCount}</p>
        </div>
    `;
}

function handleButtonClick() {
    if (!gameActive) {
        const bet = parseFloat(document.querySelector('.bet-input')?.value || 1);

        if (!window.balanceManager.hasSufficientBalance(bet) ) {
            alert('Insufficient balance to start the game.');
            return;
        }

        betAmount = bet;
        window.balanceManager.removeBalance(betAmount);
        startGame();
    }
    else cashout();
}

function startGame() {
    gameActive = true;
    revealedTiles = 0;
    minePositions = [];
    
    while(minePositions.length < minesCount) {
        let pos = Math.floor(Math.random() * 25);
        if (!minePositions.includes(pos)) {
            minePositions.push(pos);
        }
    }

    initGrid();
    updateStats();
    
    mainButton.classList.remove('start-mode');
    mainButton.classList.add('cashout-mode');
    buttonText.innerText = `Cashout $${betAmount}`;
    buttonIcon.innerHTML = `<span style="font-size: 18px">$</span>`;
    statusBox.style.borderColor = "#2d334a";
}

function handleTileClick(index) {
    if (!gameActive) {
        return;
    }

    const tile = gridElement.children[index];
    if (tile.classList.contains('revealed')) {
        return;
    }

    tile.classList.add('revealed');

    if (minePositions.includes(index)) {
        gameOver(false);
    } else {
        tile.classList.add('safe');
        tile.innerHTML = DIAMOND_ICON;
        revealedTiles++;
        updateStats();
        buttonText.innerText = `Cashout $${(betAmount * currentMultiplier).toFixed(2)}`;
        
        if (revealedTiles === (25 - minesCount)) {
            gameOver(true);
        }
    }
}

function cashout() {
    window.balanceManager.addBalance(betAmount * currentMultiplier);
    gameOver(true);
}

function gameOver(won) {
    gameActive = false;
    mainButton.classList.remove('cashout-mode');
    mainButton.classList.add('start-mode');
    buttonText.innerText = "Start Game";
    buttonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`;

    minePositions.forEach(pos => {
        const tile = gridElement.children[pos];
        tile.classList.add('bug', 'revealed');
        tile.innerHTML = BUG_ICON;
    });

    if (won) {
        const winAmount = (betAmount * currentMultiplier).toFixed(0);
        statusBox.innerHTML = `
            <div class="banner-content banner-success">
                <span style="font-size: 24px; margin-bottom: 4px">🥳</span>
                <span style="color: #10b981; font-weight: 700; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">
                    // Success! Won $${winAmount}!
                </span>
            </div>
        `;
        statusBox.style.borderColor = "#10b981";
    } else {
        statusBox.innerHTML = `
            <div class="banner-content banner-error">
                <span style="font-size: 24px; margin-bottom: 4px">💥</span>
                <span style="color: #ef4444; font-weight: 700; text-transform: uppercase; font-size: 13px; letter-spacing: 1px;">
                    // Game Over! Hit a bug!
                </span>
            </div>
        `;
        statusBox.style.borderColor = "#ef4444";
    }
}

window.onload = () => {
    initGrid();
    setBugs(3);
};