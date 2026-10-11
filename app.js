let playerHp = 80;
let maxPlayerHp = 80;
let playerArmor = 0;
let enemyHp = 60;
let maxEnemyHp = 60;
let playerEnergy = 3;
let maxPlayerEnergy = 3;
let specialCharges = 0;
let enemyIntent = { type: 'attack', value: 12 };

const enemyPool = [
  { name: 'Gastly', hp: 60, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
  { name: 'Haunter', hp: 75, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/93.png' },
  { name: 'Gengar', hp: 90, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
  { name: 'Misdreavus', hp: 65, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/200.png' },
  { name: 'Duskull', hp: 70, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/355.png' },
  { name: 'Litwick', hp: 55, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/607.png' },
  { name: 'Sableye', hp: 80, sprite: 'https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/302.png' }
];

let currentEnemy = null;

const initialDeck = [
  { id: '1', name: 'Slash', cost: 1, type: 'attack', value: 8, icon: 'fa-solid fa-hand-fist', desc: 'Ataque directo. Inflige 8 daño.' },
  { id: '2', name: 'Slash', cost: 1, type: 'attack', value: 8, icon: 'fa-solid fa-hand-fist', desc: 'Ataque directo. Inflige 8 daño.' },
  { id: '3', name: 'Slash', cost: 1, type: 'attack', value: 8, icon: 'fa-solid fa-hand-fist', desc: 'Ataque directo. Inflige 8 daño.' },
  { id: '4', name: 'Guard', cost: 1, type: 'defense', value: 6, icon: 'fa-solid fa-shield-halved', desc: '+6 de Armadura.' },
  { id: '5', name: 'Guard', cost: 1, type: 'defense', value: 6, icon: 'fa-solid fa-shield-halved', desc: '+6 de Armadura.' },
  { id: '6', name: 'Heal', cost: 1, type: 'heal', value: 6, icon: 'fa-solid fa-flask', desc: 'Sana 6 de vida.' }
];

let drawPile = [];
let discardPile = [];
let currentHand = [];

document.addEventListener('DOMContentLoaded', () => {
  initGame();
});

function initGame() {
  currentEnemy = enemyPool[Math.floor(Math.random() * enemyPool.length)];
  enemyHp = currentEnemy.hp;
  maxEnemyHp = currentEnemy.hp;

  document.getElementById('enemy-name').textContent = currentEnemy.name;
  document.getElementById('monster-sprite').src = currentEnemy.sprite;
  document.getElementById('enemy-max-hp').textContent = maxEnemyHp;

  drawPile = shuffle([...initialDeck]);
  discardPile = [];
  currentHand = [];
  playerHp = maxPlayerHp;
  playerArmor = 0;
  specialCharges = 0;
  playerEnergy = maxPlayerEnergy;

  updateIntent();
  updateUI();
  startTurn();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toggleGridGuide() {
  const guide = document.getElementById('grid-guide');
  guide.classList.toggle('hidden');
}

function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFS = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  const exitFS = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    if (requestFS) {
      requestFS.call(docEl).then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('portrait').catch(() => {});
        }
      }).catch(() => {});
    }
  } else {
    if (exitFS) {
      exitFS.call(doc);
    }
  }
}

function showToast(message, duration = 1500) {
  const toast = document.getElementById('game-toast');
  const toastText = document.getElementById('toast-text');
  toastText.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

function updateIntent() {
  const intents = [
    { type: 'attack', value: 10, text: 'Ataque: 10' },
    { type: 'attack', value: 14, text: 'Ataque: 14' },
    { type: 'defense', value: 8, text: 'Escudo: 8' }
  ];
  enemyIntent = intents[Math.floor(Math.random() * intents.length)];
  const intentEl = document.getElementById('enemy-intent-val');
  if (intentEl) intentEl.textContent = enemyIntent.value;
}

function inspectIntent() {
  if (enemyIntent.type === 'attack') {
    showToast(`El enemigo planea infligir ${enemyIntent.value} de daño.`, 2000);
  } else {
    showToast(`El enemigo planea ganar ${enemyIntent.value} de armadura.`, 2000);
  }
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

  const specialOrb = document.getElementById('special-orb');
  const specialChargesText = document.getElementById('special-charges');
  specialChargesText.textContent = `${specialCharges}/3`;

  if (specialCharges >= 3) {
    specialOrb.classList.add('ready');
  } else {
    specialOrb.classList.remove('ready');
  }

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
    if (specialCharges < 3) specialCharges++;
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
    showToast("¡Victoria! Siguiente enemigo...", 2000);
    setTimeout(initGame, 2000);
  }
}

function useSpecialAbility() {
  if (specialCharges < 3) {
    showToast("¡Carga el poder jugando 3 cartas de ataque!", 1800);
    return;
  }

  specialCharges = 0;
  enemyHp -= 24;
  if (enemyHp < 0) enemyHp = 0;

  showToast("💥 ¡FURIA DEVASTADORA! (24 Daño)", 2000);
  updateUI();

  if (enemyHp <= 0) {
    setTimeout(initGame, 2000);
  }
}

function endTurn() {
  discardPile.push(...currentHand);
  currentHand = [];
  renderHand();

  showToast("Turno Enemigo...", 1000);

  setTimeout(() => {
    if (enemyIntent.type === 'attack') {
      let damage = enemyIntent.value;
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
    }

    playerArmor = 0;
    updateIntent();
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
window.inspectIntent = inspectIntent;
window.toggleFullScreen = toggleFullScreen;
window.toggleGridGuide = toggleGridGuide;
window.useSpecialAbility = useSpecialAbility;