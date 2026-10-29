import { Vector2 } from '../engine/Vector2.js';

export class Entity {
  constructor(x, y, width, height) {
    this.pos = new Vector2(x, y);
    this.size = new Vector2(width, height);
    this.velocity = new Vector2(0, 0);
    this.speed = 0;
  }

  update(dt) {
    this.pos.x += this.velocity.x * this.speed * dt;
    this.pos.y += this.velocity.y * this.speed * dt;
  }

  render(ctx, camera) {
    // Implementar en subclases
  }
}