// js/engine.js
import { Player } from './entities/player.js';
import { Enemy, EnemyTypes } from './entities/enemy.js';
import { Camera } from './core/camera.js';
import { InputSystem } from './core/input.js';

export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.width = 800;
        this.height = 600;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.input = new InputSystem();
        this.camera = new Camera(this.width, this.height);

        this.player = new Player(400, 300);

        // Inicializamos exclusivamente el escuadrón de Slimes usando la clase unificada Enemy
        this.enemies = [
            new Enemy(300, 250, EnemyTypes.SLIME),
            new Enemy(500, 400, EnemyTypes.SLIME),
            new Enemy(700, 300, EnemyTypes.SLIME),
            new Enemy(200, 500, EnemyTypes.SLIME)
        ];

        this.solidObstacles = [
            { x: 150, y: 150, width: 100, height: 60 },
            { x: 600, y: 200, width: 80, height: 120 },
            { x: 350, y: 500, width: 150, height: 50 }
        ];

        this.lastTime = 0;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        let deltaTime = (currentTime - this.lastTime) / 1000;
        if (deltaTime > 0.1) deltaTime = 0.1;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.input, this.solidObstacles);

        if (this.input.isActionPressed && !this.player.isAttacking) {
            this.player.triggerAttack();
            this.checkPlayerAttackHits();
        }

        // Actualizar todos los enemigos activos
        this.enemies.forEach(enemy => {
            let damageToPlayer = enemy.update(deltaTime, this.player, this.solidObstacles);
            if (damageToPlayer > 0) {
                this.player.takeDamage(damageToPlayer);
            }
        });

        // Filtrar y eliminar enemigos cuya vida llegue a 0
        this.enemies = this.enemies.filter(enemy => enemy.hp > 0);

        this.camera.follow(this.player);
    }

    checkPlayerAttackHits() {
        let reach = 40;
        let hitbox = { x: this.player.x, y: this.player.y, width: this.player.width, height: this.player.height };

        if (this.player.facing === 'down') hitbox.y += reach;
        else if (this.player.facing === 'up') hitbox.y -= reach;
        else if (this.player.facing === 'left') hitbox.x -= reach;
        else if (this.player.facing === 'right') hitbox.x += reach;

        this.enemies.forEach(enemy => {
            if (
                hitbox.x < enemy.x + enemy.width &&
                hitbox.x + hitbox.width > enemy.x &&
                hitbox.y < enemy.y + enemy.height &&
                hitbox.y + hitbox.height > enemy.y
            ) {
                enemy.takeDamage(15);
            }
        });
    }

    draw() {
        this.ctx.fillStyle = '#1e1e24';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);

        this.ctx.fillStyle = '#2f2f38';
        this.solidObstacles.forEach(obs => {
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            this.ctx.strokeStyle = '#4a4a58';
            this.ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        });

        // Dibujar los slimes animados en pantalla
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });

        this.player.draw(this.ctx);

        this.ctx.restore();
    }
}