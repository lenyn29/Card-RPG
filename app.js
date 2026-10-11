// ESTADO INICIAL DEL JUEGO
let playerHp = 80;
let maxPlayerHp = 80;
let enemyHp = 60;
let maxEnemyHp = 60;
let playerEnergy = 3;
let maxPlayerEnergy = 3;

const initialDeck = [
  { id: '1', name: 'Corte Oscuro', cost: 1, type: 'attack', value: 8, art: '🗡️', desc: 'Ataque veloz. Inflige 8 de daño.' },
  { id: '2', name: 'Corte Oscuro', cost: 1, type: 'attack', value: 8, art: '🗡️', desc: 'Ataque veloz. Inflige 8 de daño.' },
  { id: '3', name: 'Corte Oscuro', cost: 1, type: 'attack', value: 8, art: '🗡️', desc: 'Ataque veloz. Inflige 8 de daño.' },
  { id: '4', name: 'Escudo Hierro', cost: 1, type: 'defense', value: 6, art: '🛡️', desc: 'Protección. +6 de Armadura.' },
  { id: '5', name: 'Escudo Hierro', cost: 1, type: 'defense', value: 6, art: '🛡️', desc: 'Protección. +6 de Armadura.' },
  { id: '6', name: 'Escudo Hierro', cost: 1, type: 'defense', value: 6, art: '🛡️', desc: 'Protección. +6 de Armadura.' },
  { id: '7', name: 'Golpe Pesado', cost: 2, type: 'attack', value: 16, art: '🪓', desc: 'Ataque pesado. 16 daño.' },
  { id: '8', name: 'Golpe Pesado', cost: 2, type: 'attack', value: 16, art: '🪓', desc: 'Ataque pesado. 16 daño.' },
  { id: '9', name: 'Elixir Vida', cost: 1, type: 'heal', value: 6, art: '🧪', desc: 'Restablece 6 de vida.' },
  { id: '10', name: 'Rayo Rúnico', cost: 2, type: 'attack', value: 18, art: '⚡', desc: 'Rayo místico. 18 daño.' }
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

// SISTEMA DE NOTIFICACIONES ELEGANTE (SIN ALERTS)
function showToast(message, duration = 1500) {
  const toast = document.getElementById('game-toast');
  const toastText = document.getElementById('toast-text');
  
  toastText.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

function startTurn() {
  playerEnergy = maxPlayerEnergy;
  drawCards(4);
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
    cardEl.className = 'game-card';
    cardEl.onclick = () => playCard(index);

    cardEl.innerHTML = `
      <div class="card-top">
        <span class="card-title">${card.name}</span>
        <span class="card-cost">${card.cost}</span>
      </div>
      <div class="card-art">${card.art}</div>
      <div class="card-desc">${card.desc}</div>
    `;

    handContainer.appendChild(cardEl);
  });
}

function playCard(index) {
  const card = currentHand[index];

  if (playerEnergy < card.cost) {
    showToast("¡Energía insuficiente!");
    return;
  }

  playerEnergy -= card.cost;

  if (card.type === 'attack') {
    enemyHp -= card.value;
    if (enemyHp < 0) enemyHp = 0;
  } else if (card.type === 'heal') {
    playerHp += card.value;
    if (playerHp > maxPlayerHp) playerHp = maxPlayerHp;
  }

  discardPile.push(currentHand.splice(index, 1)[0]);

  updateUI();
  renderHand();

  if (enemyHp <= 0) {
    showToast("¡Victoria! Has derrotado al enemigo", 2000);
    setTimeout(() => {
      initGame();
    }, 2000);
  }
}

function endTurn() {
  discardPile.push(...currentHand);
  currentHand = [];
  renderHand();

  showToast("Turno del enemigo...", 1200);

  setTimeout(() => {
    playerHp -= 10;
    if (playerHp < 0) playerHp = 0;

    updateUI();

    if (playerHp <= 0) {
      showToast("¡Has sido derrotado!", 2000);
      setTimeout(() => {
        initGame();
      }, 2000);
    } else {
      startTurn();
    }
  }, 1200);
}

window.endTurn = endTurn;