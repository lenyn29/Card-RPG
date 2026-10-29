import { TouchController } from './TouchController.js';

export class InputHandler {
  constructor() {
    this.keys = {};
    this.touch = new TouchController();
    
    // Control de pulsados únicos para evitar repetición continua
    this.attackPressedLastFrame = false;
    this.actionAttackTriggered = false;

    window.addEventListener('keydown', (e) => { this.keys[e.code] = true; });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
  }

  isPressed(code) {
    return !!this.keys[code];
  }

  get axis() {
    let x = 0;
    let y = 0;

    if (this.isPressed('KeyA') || this.isPressed('ArrowLeft'))  x -= 1;
    if (this.isPressed('KeyD') || this.isPressed('ArrowRight')) x += 1;
    if (this.isPressed('KeyW') || this.isPressed('ArrowUp'))    y -= 1;
    if (this.isPressed('KeyS') || this.isPressed('ArrowDown'))  y += 1;

    if (x === 0 && y === 0) {
      x = this.touch.dir.x;
      y = this.touch.dir.y;
    }

    return { x, y };
  }

  // Detecta estrictamente el momento exacto en que se presiona el ataque (un solo disparo)
  get isAttacking() {
    const rawAttack = this.isPressed('Space') || this.touch.actionAttack;
    let justPressed = false;

    if (rawAttack && !this.attackPressedLastFrame) {
      justPressed = true;
    }
    this.attackPressedLastFrame = rawAttack;
    return justPressed;
  }

  get isInteracting() {
    return this.isPressed('KeyE') || this.touch.actionInteract;
  }
}