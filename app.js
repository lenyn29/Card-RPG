let playerHp = 80;
let maxPlayerHp = 80;
let playerArmor = 0;
let enemyHp = 60;
let maxEnemyHp = 60;
let playerEnergy = 3;
let maxPlayerEnergy = 3;

const initialDeck = [
  { id: '1', name: 'Ataque', cost: 1, type: 'attack', value: 8, icon: 'fa-solid fa-hand-fist', desc: 'Ataque directo. Inflige 8 daño.' },
  { id: '2', name: 'Ataque', cost: 1, type: 'attack', value: 8, icon: 'fa-solid fa-hand-fist', desc: 'Ataque directo. Inflige 8 daño.' },
  { id: '3', name: 'Ataque', cost: 1, type: 'attack', value: 8, icon: 'fa-solid fa-hand-fist', desc: 'Ataque directo. Inflige 8 daño.' },
  { id: '4', name: 'Escudo', cost: 1, type: 'defense', value: 6, icon: 'fa-solid fa-shield-halved', desc: '+6 de Armadura.' },
  { id: '5', name: 'Escudo', cost: 1, type: 'defense', value: 6, icon: 'fa-solid fa-shield-halved', desc: '+6 de Armadura.' },
  { id: '6', name: 'Escudo', cost: 1, type: 'defense', value: 6, icon: 'fa-solid fa-shield-halved', desc: '+6 de Armadura.' },
  { id: '7', name: 'Golpe Pesado', cost: 2, type: 'attack', value: 16, icon: 'fa-solid fa-gavel', desc: 'Ataque fuerte. Inflige 16 daño.' },
  { id: '8', name: 'Poción', cost: 1, type: 'heal', value: 6, icon: 'fa-solid fa-flask', desc: 'Sana 6 de vida.' }
];

let drawPile = [];
let discardPile = [];
let currentHand = [];

document.addEventListener('DOMContentLoaded', () => {
  initGame();
});

function initGame() {
  drawPile = shuffle([...initialDeck]);
  discardPile = [];
  currentHand = [];
  playerHp = maxPlayerHp;
  enemyHp = maxEnemyHp;
  playerArmor = 0;
  playerEnergy = maxPlayerEnergy;

  startTurn();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showToast(message, duration = 1500) {
  const toast = document.getElementById('game-toast');
  const toastText = document.getElementById('toast-text');
  toastText.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

function startTurn() {
  playerEnergy = maxPlayerEnergy;
  drawCards(3);
  updateUI();
}

function drawCards(count) {
  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break;
      drawPile = shuffle([...discardPile]);
      discardPile = [];
    }
    currentHand.push(drawPile.pop());
  }
  renderHand();
}

function updateUI() {
  document.getElementById('player-hp').textContent = playerHp;
  document.getElementById('player-armor').textContent = playerArmor;
  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('player-energy').textContent = playerEnergy;
  document.getElementById('deck-count').textContent = drawPile.length;
  document.getElementById('discard-count').textContent = discardPile.length;

  const playerPct = Math.max(0, (playerHp / maxPlayerHp) * 100);
  const enemyPct = Math.max(0, (enemyHp / maxEnemyHp) * 100);

  document.getElementById('player-hp-fill').style.width = playerPct + '%';
  document.getElementById('enemy-hp-fill').style.width = enemyPct + '%';
}

function renderHand() {
  const handContainer = document.getElementById('player-hand');
  handContainer.innerHTML = '';

  currentHand.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = `game-card ${card.type}`;
    cardEl.onclick = () => playCard(index);

    cardEl.innerHTML = `
      <div class="card-cost-gem">${card.cost}</div>
      <div class="card-title">${card.name}</div>
      <div class="card-art ${card.type}"><i class="${card.icon}"></i></div>
      <div class="card-desc">${card.desc}</div>
    `;

    handContainer.appendChild(cardEl);
  });
}

function playCard(index) {
  const card = currentHand[index];

  if (playerEnergy < card.cost) {
    showToast("¡Sin energía suficiente!");
    return;
  }

  playerEnergy -= card.cost;

  if (card.type === 'attack') {
    enemyHp -= card.value;
    if (enemyHp < 0) enemyHp = 0;
  } else if (card.type === 'defense') {
    playerArmor += card.value;
  } else if (card.type === 'heal') {
    playerHp += card.value;
    if (playerHp > maxPlayerHp) playerHp = maxPlayerHp;
  }

  discardPile.push(currentHand.splice(index, 1)[0]);
  updateUI();
  renderHand();

  if (enemyHp <= 0) {
    showToast("¡Victoria!", 2000);
    setTimeout(initGame, 2000);
  }
}

function endTurn() {
  discardPile.push(...currentHand);
  currentHand = [];
  renderHand();

  showToast("Turno Enemigo...", 1000);

  setTimeout(() => {
    let damage = 12;
    if (playerArmor > 0) {
      if (playerArmor >= damage) {
        playerArmor -= damage;
        damage = 0;
      } else {
        damage -= playerArmor;
        playerArmor = 0;
      }
    }

    playerHp -= damage;
    if (playerHp < 0) playerHp = 0;

    updateUI();

    if (playerHp <= 0) {
      showToast("¡Derrotado!", 2000);
      setTimeout(initGame, 2000);
    } else {
      startTurn();
    }
  }, 1000);
}

window.endTurn = endTurn;