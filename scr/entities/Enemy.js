import { Entity } from './Entity.js';
import { SpriteAnimator } from '../engine/SpriteAnimator.js';

export class Enemy extends Entity {
  constructor(x, y, enemyConfig) {
    super(x, y, enemyConfig.width, enemyConfig.height);
    this.name = enemyConfig.name;
    this.speed = enemyConfig.speed;
    
    // Cada enemigo recibe su propia configuración de spritesheet
    this.animator = new SpriteAnimator(
      enemyConfig.spritePath, 
      enemyConfig.frameWidth, 
      enemyConfig.frameHeight
    );

    // Cargar animaciones desde la configuración
    for (const [animName, data] of Object.entries(enemyConfig.animations)) {
      this.animator.addAnimation(animName, data.row, data.totalFrames);
    }
    
    this.animator.play('idle');
  }

  update(dt, playerPos) {
    // Aquí iría la inteligencia artificial básica (ej: perseguir al jugador)
    // Por ahora, solo actualizamos la animación
    this.animator.update(dt);
  }

  render(ctx, camera) {
    const screenX = this.pos.x - camera.x;
    const screenY = this.pos.y - camera.y;
    this.animator.render(ctx, screenX, screenY, this.size.x, this.size.y);
  }
}