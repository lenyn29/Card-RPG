import { TouchController } from './TouchController.js';

export class InputHandler {
  constructor() {
    this.keys = {};
    this.touch = new TouchController(); // Integramos el control táctil

    window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
  }

  isPressed(code) {
    return !!this.keys[code];
  }

  get axis() {
    let x = 0;
    let y = 0;

    // 1. Prioridad Teclado
    if (this.isPressed('KeyA') || this.isPressed('ArrowLeft'))  x -= 1;
    if (this.isPressed('KeyD') || this.isPressed('ArrowRight')) x += 1;
    if (this.isPressed('KeyW') || this.isPressed('ArrowUp'))    y -= 1;
    if (this.isPressed('KeyS') || this.isPressed('ArrowDown'))  y += 1;

    // 2. Si no hay teclado, sumamos el joystick táctil
    if (x === 0 && y === 0) {
      x = this.touch.dir.x;
      y = this.touch.dir.y;
    }

    return { x, y };
  }

  get isAttacking() {
    return this.isPressed('Space') || this.touch.actionAttack;
  }

  get isInteracting() {
    return this.isPressed('KeyE') || this.touch.actionInteract;
  }
}