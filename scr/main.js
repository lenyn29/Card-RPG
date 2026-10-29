import { InputHandler } from './core/InputHandler.js';
import { Camera } from './core/Camera.js';
import { FullscreenManager } from './core/FullscreenManager.js';
import { Assets } from './engine/AssetManager.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { ENEMY_TYPES } from './data/enemyTypes.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Altura base retro para mantener el zoom nítido de los sprites,
    // calculando el ancho proporcional al dispositivo real para pantalla completa.
    this.baseHeight = 160; 
    this.updateDynamicResolution();

    this.initCanvas();

    this.input = new InputHandler();
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    
    // Dimensiones del mundo de juego (Mapa con topes)
    this.mapBounds = { width: 800, height: 600 };

    // Instanciar Jugador en el mapa
    this.player = new Player(400, 300);
    
    // Instanciar Enemigos Slime
    this.enemies = [
      new Enemy(300, 220, ENEMY_TYPES.SLIME),
      new Enemy(500, 260, ENEMY_TYPES.SLIME),
      new Enemy(360, 380, ENEMY_TYPES.SLIME)
    ];

    this.lastTime = 0;
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  updateDynamicResolution() {
    const aspect = window.innerWidth / window.innerHeight;
    this.internalHeight = this.baseHeight;
    this.internalWidth = Math.round(this.baseHeight * aspect);
  }

  initCanvas() {
    this.canvas.width = this.internalWidth;
    this.canvas.height = this.internalHeight;
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.updateDynamicResolution();
    this.canvas.width = this.internalWidth;
    this.canvas.height = this.internalHeight;

    // Forzar tamaño físico a pantalla completa total (100vw x 100vh)
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
  }

  start() {
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  update(dt) {
    this.player.update(dt, this.input, this.enemies);

    // Filtrar enemigos ya eliminados tras su animación de muerte
    this.enemies = this.enemies.filter(enemy => !enemy.isRemoved);
    this.enemies.forEach(enemy => enemy.update(dt, this.player));

    this.resolveEntityCollisions();

    // Actualizar dimensiones de la cámara y seguir al jugador con límites de mapa
    this.camera.width = this.canvas.width;
    this.camera.height = this.canvas.height;
    this.camera.follow(this.player, this.mapBounds.width, this.mapBounds.height);
  }

  resolveEntityCollisions() {
    const entities = [this.player, ...this.enemies];

    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        let e1 = entities[i];
        let e2 = entities[j];

        if ((e1.isDead !== undefined && e1.isDead) || (e2.state === 'DEAD')) continue;

        // Colisión basada en el centro de las bases (pies)
        let c1 = e1.center;
        let c2 = e2.center;

        let dx = c2.x - c1.x;
        let dy = c2.y - c1.y;
        let distance = Math.hypot(dx, dy);

        let minDist = (e1.hitboxSize.x / 2) + (e2.hitboxSize.x / 2);

        if (distance < minDist && distance > 0) {
          let overlap = minDist - distance;
          let nx = dx / distance;
          let ny = dy / distance;

          e1.pos.x -= nx * overlap * 0.5;
          e1.pos.y -= ny * overlap * 0.5;
          e2.pos.x += nx * overlap * 0.5;
          e2.pos.y += ny * overlap * 0.5;
        }
      }
    }
  }

  render() {
    this.ctx.fillStyle = '#222831';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderMapGrid();

    // ORDENAMIENTO DE PROFUNDIDAD (Y-Sorting) basado en los pies de las entidades
    const entities = [this.player, ...this.enemies];
    entities.sort((a, b) => a.center.y - b.center.y);

    entities.forEach(entity => {
      entity.render(this.ctx, this.camera);
    });

    this.renderPlayerHUD();
  }

  renderMapGrid() {
    this.ctx.strokeStyle = '#2c3440';
    this.ctx.lineWidth = 1;
    const tileSize = 16;

    const startX = Math.floor(this.camera.x / tileSize) * tileSize;
    const startY = Math.floor(this.camera.y / tileSize) * tileSize;

    for (let x = startX; x < this.camera.x + this.canvas.width + tileSize; x += tileSize) {
      for (let y = startY; y < this.camera.y + this.canvas.height + tileSize; y += tileSize) {
        this.ctx.strokeRect(
          Math.floor(x - this.camera.x),
          Math.floor(y - this.camera.y),
          tileSize,
          tileSize
        );
      }
    }
  }

  renderPlayerHUD() {
    const x = 12;
    const y = 12;
    const w = 70;
    const h = 7;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(x, y, w, h);

    const healthPct = Math.max(0, this.player.health / this.player.maxHealth);
    this.ctx.fillStyle = '#2ecc71';
    this.ctx.fillRect(x, y, w * healthPct, h);

    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, w, h);
  }
}

// ==========================================
// ARRANQUE ASÍNCRONO DEL MOTOR Y PWA
// ==========================================
async function initGame() {
  try {
    await Promise.all([
      Assets.loadImage('player', './assets/sprites/player.png'),
      Assets.loadImage('slime', './assets/sprites/slime.png')
    ]);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('Service Worker no registrado:', err);
      });
    }

    new FullscreenManager(() => {
      const game = new Game();
      game.start();
    });

  } catch (error) {
    console.error("Error al inicializar el juego:", error);
  }
}

initGame();