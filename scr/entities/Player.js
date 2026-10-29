import { Entity } from './Entity.js';
import { SpriteAnimator } from '../engine/SpriteAnimator.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 16, 16);
    this.speed = 100;

    // Inicializamos el spritesheet (asumiendo celdas de 16x16)
    this.animator = new SpriteAnimator('assets/player_sheet.png', 16, 16);
    
    // Configuramos las animaciones según las filas de la imagen
    this.animator.addAnimation('walkDown', 0, 4);
    this.animator.addAnimation('walkLeft', 1, 4);
    this.animator.addAnimation('walkRight', 2, 4);
    this.animator.addAnimation('walkUp', 3, 4);
  }

  update(dt, input) {
    const dir = input.axis;
    this.velocity.set(dir.x, dir.y);
    this.velocity.normalize();

    super.update(dt);

    // Lógica para cambiar la animación según la dirección actual
    if (dir.y > 0) this.animator.play('walkDown');
    else if (dir.y < 0) this.animator.play('walkUp');
    else if (dir.x < 0) this.animator.play('walkLeft');
    else if (dir.x > 0) this.animator.play('walkRight');
    else {
      // Si está quieto, podríamos pausar o congelar el fotograma
      this.animator.currentFrame = 0; 
    }

    this.animator.update(dt);
  }

  render(ctx, camera) {
    // Renderizamos usando la posición corregida por la cámara
    const screenX = this.pos.x - camera.x;
    const screenY = this.pos.y - camera.y;

    this.animator.render(ctx, screenX, screenY, this.size.x, this.size.y);
  }
}