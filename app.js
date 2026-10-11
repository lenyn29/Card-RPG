// ESTADO INICIAL DEL JUEGO
let playerHp = 80;
let maxPlayerHp = 80;
let enemyHp = 60;
let maxEnemyHp = 60;
let playerEnergy = 3;
let maxPlayerEnergy = 3;

// BASE DE DATOS DE CARTAS (MEDIEVAL / FANTASÍA OSCURA)
const cardDatabase = [
  { id: '1', name: 'Corte Oscuro', cost: 1, type: 'attack', value: 8, art: '🗡️', desc: 'Infiltrado de sombras. Inflige 8 de daño.' },
  { id: '2', name: 'Escudo de Hierro', cost: 1, type: 'defense', value: 6, art: '🛡️', desc: 'Refuerza tu guardia. +6 de Armadura.' },
  { id: '3', name: 'Golpe Devastador', cost: 2, type: 'attack', value: 16, art: '🪓', desc: 'Ataque pesado. Inflige 16 de daño.' },
  { id: '4', name: 'Elixir Místico', cost: 1, type: 'heal', value: 5, art: '🧪', desc: 'Restaura 5 de vida.' }
];

let currentHand = [];

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  startCombat();
});

function startCombat() {
  updateUI();
  drawHand();
}

function updateUI() {
  document.getElementById('player-hp').textContent = playerHp;
  document.getElementById('enemy-hp').textContent = enemyHp;
  document.getElementById('player-energy').textContent = playerEnergy;

  // Actualizar barras de vida
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

function drawHand() {
  currentHand = [...cardDatabase]; // Roba las cartas de prueba
  renderHand();
}

function playCard(index) {
  const card = currentHand[index];

  if (playerEnergy < card.cost) {
    alert("¡No tienes suficiente energía!");
    return;
  }

  // Descontar energía
  playerEnergy -= card.cost;

  // Aplicar efecto
  if (card.type === 'attack') {
    enemyHp -= card.value;
    if (enemyHp < 0) enemyHp = 0;
  } else if (card.type === 'heal') {
    playerHp += card.value;
    if (playerHp > maxPlayerHp) playerHp = maxPlayerHp;
  }

  // Quitar carta jugada de la mano
  currentHand.splice(index, 1);
  updateUI();
  renderHand();

  if (enemyHp <= 0) {
    setTimeout(() => {
      alert("¡Has derrotado al enemigo!");
      enemyHp = maxEnemyHp;
      playerEnergy = maxPlayerEnergy;
      startCombat();
    }, 300);
  }
}

// Función endTurn vinculada y lista para usarse
function endTurn() {
  alert("Turno del enemigo...");
  playerHp -= 10;
  if (playerHp < 0) playerHp = 0;

  // Reiniciar turno del jugador
  playerEnergy = maxPlayerEnergy;
  drawHand();
  updateUI();

  if (playerHp <= 0) {
    alert("¡Has sido derrotado!");
    playerHp = maxPlayerHp;
    enemyHp = maxEnemyHp;
    startCombat();
  }
}
window.endTurn = endTurn; // Exponer globalmente para el botón en HTML