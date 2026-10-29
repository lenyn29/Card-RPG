export class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.width = viewportWidth;
    this.height = viewportHeight;
  }

  follow(target, mapWidth, mapHeight) {
    // Centrar en el objetivo
    let targetX = target.pos.x + target.size.x / 2 - this.width / 2;
    let targetY = target.pos.y + target.size.y / 2 - this.height / 2;

    // Smooth lerp (Suavizado)
    this.x += (targetX - this.x) * 0.1;
    this.y += (targetY - this.y) * 0.1;

    // Bloqueo de límites del mapa
    this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
  }
}