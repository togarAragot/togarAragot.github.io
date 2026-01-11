document.addEventListener('DOMContentLoaded', function() {
  const suits = ["♥", "♦", "♣", "♠"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  
  let deck = [], playerHand = [], dealerHand = [], gameOver = false, bet = 1;

  const dealerRow = document.getElementById("dealer-row");
  const playerRow = document.getElementById("player-row");
  const dealerTotalEl = document.getElementById("dealer-total");
  const playerTotalEl = document.getElementById("player-total");
  const playBtn = document.getElementById("play-btn");
  const hitBtn = document.getElementById("hit-btn");
  const standBtn = document.getElementById("stand-btn");
  const statusText = document.getElementById("status-text");
  const betButtons = document.querySelectorAll(".bet-buttons button");

  const codeSymbols = {
    "♥": { text: "JS {}", red: true, suitClass: "suit-heart" },
    "♦": { text: "C#", red: true, suitClass: "suit-diamond" },
    "♣": { text: "K", red: false, suitClass: "suit-club" },
    "♠": { text: "ASM", red: false, suitClass: "suit-spade" }
  };

  function createDeck() {
    const d = [];
    for (const s of suits) for (const r of ranks) d.push({ suit: s, rank: r });
    return d;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function cardValue(rank) {
    if (rank === "A") return 11;
    if (["J", "Q", "K"].includes(rank)) return 10;
    return parseInt(rank, 10);
  }

  function handValue(hand) {
    let sum = 0, aces = 0;
    for (const card of hand) {
      sum += cardValue(card.rank);
      if (card.rank === "A") aces++;
    }
    while (sum > 21 && aces > 0) { sum -= 10; aces--; }
    return sum;
  }

  function createCardElement(card, hidden) {
    const div = document.createElement("div");
    
    if (hidden) {
      div.className = "card hidden-card";
      return div;
    }

    const cardType = codeSymbols[card.suit];
    div.className = "card";
    if (cardType.red) div.classList.add("red");
    div.classList.add(cardType.suitClass);

    const rankTop = document.createElement("div");
    rankTop.className = "card-rank";
    rankTop.textContent = card.rank;

    const suitEl = document.createElement("div");
    suitEl.className = "card-suit code-symbol";
    suitEl.textContent = cardType.text;

    div.appendChild(rankTop);
    div.appendChild(suitEl);
    return div;
  }

  function renderHands(showDealerHole = false) {
    dealerRow.innerHTML = "";
    playerRow.innerHTML = "";

    dealerHand.forEach((card, index) => {
      const hidden = index === 0 && !showDealerHole;
      dealerRow.appendChild(createCardElement(card, hidden));
    });

    playerHand.forEach(card => {
      playerRow.appendChild(createCardElement(card, false));
    });

    if (!showDealerHole) {
      // Berechnet nur den Wert der sichtbaren Karte (Index 1)
      const visibleValue = handValue([dealerHand[1]]);
      dealerTotalEl.textContent = `Dealer: ${visibleValue} + ?`;
      playerTotalEl.textContent = `You: ${handValue(playerHand)}`;
    } else {
      dealerTotalEl.textContent = `Dealer: ${handValue(dealerHand)}`;
      playerTotalEl.textContent = `You: ${handValue(playerHand)}`;
    }
  }

  function startGame() {
    bet = parseFloat(document.querySelector(".bet-input").value);

    if (!window.balanceManager.hasSufficientBalance(bet)) {
      alert("Insufficient balance for this bet!");
      return;
    }
    
    window.balanceManager.removeBalance(bet);

    deck = createDeck();
    shuffle(deck);
    playerHand = [];
    dealerHand = [];
    gameOver = false;

    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());

    hitBtn.classList.remove("hidden");
    standBtn.classList.remove("hidden");
    playBtn.classList.add("hidden");
    statusText.textContent = `Bet: $${bet} | Good Luck!`;
    
    renderHands(false);

    if (handValue(playerHand) === 21) endRound();
  }

  function playerHit() {
    if (gameOver) return;
    playerHand.push(deck.pop());
    renderHands(false);
    if (handValue(playerHand) > 21) endRound();
  }

  function dealerPlay() {
    while (handValue(dealerHand) < 17) dealerHand.push(deck.pop());
  }

  function endRound() {
    gameOver = true;
    dealerPlay();
    renderHands(true);

    const playerTotal = handValue(playerHand);
    const dealerTotal = handValue(dealerHand);
    let result;

    if (playerTotal > 21) result = "Bust – You lose!";
    else if (dealerTotal > 21) {
        window.balanceManager.addBalance(bet * 2);
        result = "Dealer busts – You win!";
    } else if (playerTotal > dealerTotal) {
        window.balanceManager.addBalance(bet * 2);
        result = "You win!";
    } else if (playerTotal < dealerTotal) {
        result = "Dealer wins.";
    } else {
        window.balanceManager.addBalance(bet);
        result = "Push – Tie!";
    }

    statusText.textContent = `${result} | New game?`;
    hitBtn.classList.add("hidden");
    standBtn.classList.add("hidden");
    playBtn.classList.remove("hidden");
  }

  playBtn.addEventListener("click", startGame);
  hitBtn.addEventListener("click", playerHit);
  standBtn.addEventListener("click", endRound);
});