import { Entity } from './Entity.js';
import { SpriteAnimator } from '../engine/SpriteAnimator.js';

export class Enemy extends Entity {
  constructor(x, y, config) {
    // Sprite 32x32. Base física reducida: 16x10 en el centro inferior
    super(x, y, config.width, config.height, 16, 10);
    this.name = config.name;
    this.speed = config.speed;
    this.maxHealth = config.health || 3;
    this.health = this.maxHealth;

    this.animator = new SpriteAnimator(config.spritePath, config.frameWidth, config.frameHeight);

    for (const [animName, data] of Object.entries(config.animations)) {
      this.animator.addAnimation(animName, data.row, data.frames, data.flip || false, data.loop);
    }

    this.state = 'IDLE'; 
    this.lastDirection = 'Down';
    this.animator.play('idleDown');
  }

  takeDamage(amount, knockbackDirX, knockbackDirY) {
    if (this.state === 'DEAD') return;
    this.health -= amount;

    if (this.health <= 0) {
      this.die();
    } else {
      this.hurt(knockbackDirX, knockbackDirY);
    }
  }

  hurt(dirX, dirY) {
    this.state = 'HURT';
    this.velocity.set(dirX * 2, dirY * 2);

    const hurtAnim = `hurt${this.lastDirection}`;
    this.animator.play(hurtAnim, () => {
      this.state = 'IDLE';
    });
  }

  die() {
    this.state = 'DEAD';
    this.velocity.set(0, 1);
    const deathAnim = (this.lastDirection === 'Left') ? 'deathLeft' : 'deathRight';
    this.animator.play(deathAnim, () => {
      this.isRemoved = true;
    });
  }

  update(dt, player) {
    if (this.state === 'DEAD') {
      this.animator.update(dt);
      return;
    }

    if (this.state === 'HURT') {
      super.update(dt);
      this.animator.update(dt);
      return;
    }

    const dx = player.center.x - this.center.x;
    const dy = player.center.y - this.center.y;
    const distance = Math.hypot(dx, dy);

    // Prioridad diagonal para animaciones laterales
    if (Math.abs(dx) >= Math.abs(dy) * 0.7) {
      this.lastDirection = dx > 0 ? 'Right' : 'Left';
    } else {
      this.lastDirection = dy > 0 ? 'Down' : 'Up';
    }

    if (distance < 20 && this.state !== 'ATTACK') {
      this.state = 'ATTACK';
      this.velocity.set(0, 0);
      this.animator.play(`attack${this.lastDirection}`, () => {
        this.state = 'IDLE';
        if (Math.hypot(player.center.x - this.center.x, player.center.y - this.center.y) < 24) {
          const kx = player.center.x >= this.center.x ? 1 : -1;
          const ky = player.center.y >= this.center.y ? 1 : -1;
          player.takeDamage(10, kx, ky);
        }
      });
    } else if (distance < 160 && distance >= 20) {
      this.state = 'CHASE';
      this.velocity.set(dx, dy).normalize();
      super.update(dt);
      this.animator.play(`walk${this.lastDirection}`);
    } else if (this.state !== 'ATTACK') {
      this.state = 'IDLE';
      this.velocity.set(0, 0);
      this.animator.play(`idle${this.lastDirection}`);
    }

    this.animator.update(dt);
  }

  render(ctx, camera) {
    if (this.isRemoved) return;

    const screenX = this.pos.x - camera.x;
    const screenY = this.pos.y - camera.y;
    this.animator.render(ctx, screenX, screenY, this.size.x, this.size.y);

    if (this.health < this.maxHealth && this.state !== 'DEAD') {
      const barW = 20;
      const barH = 3;
      const barX = screenX + (this.size.x / 2) - (barW / 2);
      const barY = screenY - 4;

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(barX, barY, barW, barH);

      const healthPct = this.health / this.maxHealth;
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(barX, barY, barW * healthPct, barH);
    }
  }
}