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
    
    // Resolución interna retro (320x240 escalada perfectamente)
    this.internalWidth = 320;
    this.internalHeight = 240;
    
    this.initCanvas();

    // Sistemas Core y Entidades
    this.input = new InputHandler();
    this.camera = new Camera(this.internalWidth, this.internalHeight);
    
    this.player = new Player(100, 100);
    
    // Instanciamos enemigos usando la configuración modular
    this.enemies = [
      new Enemy(180, 120, ENEMY_TYPES.SLIME),
      new Enemy(240, 180, ENEMY_TYPES.GOBLIN),
      new Enemy(80, 200, ENEMY_TYPES.SLIME)
    ];

    this.lastTime = 0;
    this.mapBounds = { width: 640, height: 480 }; // Límites del mundo virtual

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  initCanvas() {
    this.canvas.width = this.internalWidth;
    this.canvas.height = this.internalHeight;
    this.resizeCanvas();
  }

  resizeCanvas() {
    const scale = Math.min(
      window.innerWidth / this.internalWidth,
      window.innerHeight / this.internalHeight
    );
    this.canvas.style.width = `${this.internalWidth * Math.floor(scale)}px`;
    this.canvas.style.height = `${this.internalHeight * Math.floor(scale)}px`;
  }

  start() {
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  loop(timestamp) {
    // Delta time limitado a 100ms máximo para evitar saltos si la pestaña pierde foco
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  update(dt) {
    // Actualizar jugador
    this.player.update(dt, this.input);

    // Actualizar enemigos
    this.enemies.forEach(enemy => enemy.update(dt, this.player));

    // Cámara sigue al jugador sin salir de los límites del mapa
    this.camera.follow(this.player, this.mapBounds.width, this.mapBounds.height);
  }

  render() {
    // 1. Limpiar pantalla
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Dibujar cuadrícula de referencia del mapa
    this.renderMapGrid();

    // 3. Renderizar enemigos ordenados por posición Y (efecto profundidad básico tipo Zelda)
    const entities = [this.player, ...this.enemies];
    entities.sort((a, b) => a.pos.y - b.pos.y);

    entities.forEach(entity => {
      entity.render(this.ctx, this.camera);
    });
  }

  renderMapGrid() {
    this.ctx.strokeStyle = '#282828';
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
}

// ==========================================
// ARRANQUE SEGURO CON PANTALLA COMPLETA Y ASSETS
// ==========================================
async function initGame() {
  try {
    // Precargamos todos los recursos gráficos antes de iniciar el bucle
    await Promise.all([
      Assets.loadImage('player', 'assets/player_sheet.png'),
      Assets.loadImage('slime', 'assets/enemies/slime_sheet.png'),
      Assets.loadImage('goblin', 'assets/enemies/goblin_sheet.png')
    ]);

    // Lanzamos la pantalla de inicio táctil para forzar pantalla completa nativa
    new FullscreenManager(() => {
      const game = new Game();
      game.start();
    });

  } catch (error) {
    console.error("Error al inicializar el juego o cargar recursos:", error);
  }
}

initGame();