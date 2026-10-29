import { Entity } from './Entity.js';
import { SpriteAnimator } from '../engine/SpriteAnimator.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 48, 48, 16, 12);
    this.speed = 120;
    this.maxHealth = 100;
    this.health = 100;

    this.animator = new SpriteAnimator('player', 48, 48);

    // Animaciones Reposo
    this.animator.addAnimation('idleDown', 0, 6, false, true);
    this.animator.addAnimation('idleRight', 1, 6, false, true);
    this.animator.addAnimation('idleLeft', 1, 6, true, true);
    this.animator.addAnimation('idleUp', 2, 6, false, true);

    // Animaciones Caminata
    this.animator.addAnimation('walkDown', 3, 6, false, true);
    this.animator.addAnimation('walkRight', 4, 6, false, true);
    this.animator.addAnimation('walkLeft', 4, 6, true, true);
    this.animator.addAnimation('walkUp', 5, 6, false, true);

    // Animaciones Ataque
    this.animator.addAnimation('attackDown', 6, 3, false, false);
    this.animator.addAnimation('attackRight', 7, 3, false, false);
    this.animator.addAnimation('attackLeft', 7, 3, true, false);
    this.animator.addAnimation('attackUp', 8, 3, false, false);

    // Animaciones Muerte
    this.animator.addAnimation('deathRight', 9, 3, false, false);
    this.animator.addAnimation('deathLeft', 9, 3, true, false);

    this.lastDirection = 'Down';
    this.isAttacking = false;
    this.isDead = false;
    this.invulnerableTimer = 0;

    this.animator.play('idleDown');
  }

  takeDamage(amount, knockbackX, knockbackY) {
    if (this.isDead || this.invulnerableTimer > 0) return;
    
    this.health -= amount;
    this.invulnerableTimer = 0.8;

    // RETROCESO DE 2 UNIDADES: Desplazamiento directo y limpio en la dirección del golpe
    this.pos.x += knockbackX * 2;
    this.pos.y += knockbackY * 2;

    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.velocity.set(0, 0);
    const deathAnim = (this.lastDirection === 'Left') ? 'deathLeft' : 'deathRight';
    
    // Al terminar la animación de muerte, reiniciamos la página/juego automáticamente
    this.animator.play(deathAnim, () => {
      setTimeout(() => {
        window.location.reload();
      }, 400);
    });
  }

  update(dt, input, enemies) {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    if (this.isDead) {
      this.animator.update(dt);
      return;
    }

    if (this.isAttacking) {
      this.velocity.set(0, 0);
      this.animator.update(dt);
      return;
    }

    if (input.isAttacking) {
      this.isAttacking = true;
      this.velocity.set(0, 0);
      
      const attackAnim = `attack${this.lastDirection}`;
      this.animator.play(attackAnim, () => {
        this.isAttacking = false;
      });

      this.checkAttackHit(enemies);
      this.animator.update(dt);
      return;
    }

    const dir = input.axis;
    this.velocity.set(dir.x, dir.y);
    this.velocity.normalize();

    super.update(dt);

    const isMoving = dir.x !== 0 || dir.y !== 0;

    if (isMoving) {
      if (Math.abs(dir.x) > 0.1) {
        if (dir.x < 0) {
          this.animator.play('walkLeft');
          this.lastDirection = 'Left';
        } else {
          this.animator.play('walkRight');
          this.lastDirection = 'Right';
        }
      } else {
        if (dir.y > 0) {
          this.animator.play('walkDown');
          this.lastDirection = 'Down';
        } else if (dir.y < 0) {
          this.animator.play('walkUp');
          this.lastDirection = 'Up';
        }
      }
    } else {
      this.animator.play(`idle${this.lastDirection}`);
    }

    this.animator.update(dt);
  }

  checkAttackHit(enemies) {
    let hitBox = { x: this.pos.x + 8, y: this.pos.y + 8, w: 32, h: 32 };
    if (this.lastDirection === 'Down') hitBox.y += 20;
    if (this.lastDirection === 'Up') hitBox.y -= 20;
    if (this.lastDirection === 'Right') hitBox.x += 20;
    if (this.lastDirection === 'Left') hitBox.x -= 20;

    enemies.forEach(enemy => {
      if (enemy.state === 'DEAD') return;
      if (
        hitBox.x < enemy.pos.x + enemy.size.x &&
        hitBox.x + hitBox.w > enemy.pos.x &&
        hitBox.y < enemy.pos.y + enemy.size.y &&
        hitBox.y + hitBox.h > enemy.pos.y
      ) {
        const kx = enemy.center.x >= this.center.x ? 1 : -1;
        const ky = enemy.center.y >= this.center.y ? 1 : -1;
        enemy.takeDamage(1, kx, ky);
      }
    });
  }

  render(ctx, camera) {
    const screenX = this.pos.x - camera.x;
    const screenY = this.pos.y - camera.y;
    
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
      return; 
    }

    this.animator.render(ctx, screenX, screenY, this.size.x, this.size.y);
  }
}