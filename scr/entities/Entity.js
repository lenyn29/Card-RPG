import { Vector2 } from '../engine/Vector2.js';

export class Entity {
  constructor(x, y, width, height, hitboxWidth = width, hitboxHeight = height) {
    this.pos = new Vector2(x, y);
    this.size = new Vector2(width, height);
    this.velocity = new Vector2(0, 0);
    this.speed = 0;

    // Caja de colisión reducida para los pies/base
    this.hitboxSize = new Vector2(hitboxWidth, hitboxHeight);
  }

  // Obtener el centro exacto de la base/pies para ordenamiento de profundidad y colisiones
  get hitboxOffset() {
    return {
      x: (this.size.x - this.hitboxSize.x) / 2,
      y: this.size.y - this.hitboxSize.y
    };
  }

  get center() {
    return {
      x: this.pos.x + this.size.x / 2,
      y: this.pos.y + this.size.y - (this.hitboxSize.y / 2)
    };
  }

  update(dt) {
    this.pos.x += this.velocity.x * this.speed * dt;
    this.pos.y += this.velocity.y * this.speed * dt;
  }

  render(ctx, camera) {
    // Sobrescrito por subclases
  }
}