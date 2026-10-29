import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';
import { Player } from '../entities/Player.js';
import { ImageManager } from '../managers/ImageManager.js';
import { RenderSystem } from '../systems/RenderSystem.js';
import { InputSystem } from '../systems/InputSystem.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.imageManager = new ImageManager();
        this.player = new Player();
        this.inputSystem = new InputSystem(this.canvas);
        this.renderSystem = new RenderSystem(this.canvas, this.imageManager, this.inputSystem);

        this.lastTime = 0;

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.imageManager.loadAll();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    resizeCanvas() {
        // Fijamos la resolución interna del canvas al estándar del motor (1280x720)
        // El CSS (object-fit: contain) se encarga de estirarlo visualmente a la pantalla sin deformarlo
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
    }

    gameLoop(timeStamp) {
        let dt = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;
        dt = Math.min(dt, 0.1);

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        const keys = this.inputSystem.getKeys();
        const inputVector = this.inputSystem.getVectorMovimiento();
        const atacando = this.inputSystem.isAtacando();

        if (atacando) {
            this.player.speedMultiplier = 1.5;
        } else {
            this.player.speedMultiplier = 1.0;
        }

        this.player.update(dt, keys, inputVector);
    }

    render() {
        this.renderSystem.render(this.player);
    }
}