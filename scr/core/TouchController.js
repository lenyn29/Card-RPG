export class TouchController {
  constructor() {
    this.dir = { x: 0, y: 0 };
    this.actionAttack = false;

    this.createTouchUI();
    this.initListeners();
  }

  createTouchUI() {
    // Contenedor general táctil
    const container = document.createElement('div');
    container.id = 'touch-controls';

    // Joystick Base
    const joystickBase = document.createElement('div');
    joystickBase.id = 'joystick-base';
    
    const joystickStick = document.createElement('div');
    joystickStick.id = 'joystick-stick';
    joystickBase.appendChild(joystickStick);
    container.appendChild(joystickBase);

    // Contenedor de Botones de Acción (Solo Ataque)
    const actionContainer = document.createElement('div');
    actionContainer.id = 'action-buttons';

    // Único botón: Ataque
    const attackBtn = document.createElement('button');
    attackBtn.className = 'action-btn';
    attackBtn.id = 'btn-attack';
    attackBtn.innerHTML = '⚔️';
    
    actionContainer.appendChild(attackBtn);
    container.appendChild(actionContainer);

    document.body.appendChild(container);

    this.joystickBase = joystickBase;
    this.joystickStick = joystickStick;
    this.attackBtn = attackBtn;
  }

  initListeners() {
    let joystickCenter = { x: 0, y: 0 };
    let touchId = null;
    const maxDist = 45;

    // Control del Joystick
    this.joystickBase.addEventListener('pointerdown', (e) => {
      const rect = this.joystickBase.getBoundingClientRect();
      joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      touchId = e.pointerId;
      this.updateJoystick(e.clientX, e.clientY, joystickCenter, maxDist);
    });

    window.addEventListener('pointermove', (e) => {
      if (touchId !== null && e.pointerId === touchId) {
        this.updateJoystick(e.clientX, e.clientY, joystickCenter, maxDist);
      }
    });

    const releaseJoystick = (e) => {
      if (touchId !== null && e.pointerId === touchId) {
        touchId = null;
        this.dir = { x: 0, y: 0 };
        this.joystickStick.style.transform = `translate(0px, 0px)`;
      }
    };

    window.addEventListener('pointerup', releaseJoystick);
    window.addEventListener('pointercancel', releaseJoystick);

    // Botón de Ataque único
    this.attackBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.actionAttack = true;
    });

    const releaseAttack = (e) => {
      this.actionAttack = false;
    };

    this.attackBtn.addEventListener('pointerup', releaseAttack);
    this.attackBtn.addEventListener('pointerleave', releaseAttack);
  }

  updateJoystick(clientX, clientY, center, maxDist) {
    let dx = clientX - center.x;
    let dy = clientY - center.y;
    let dist = Math.hypot(dx, dy);

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }

    this.joystickStick.style.transform = `translate(${dx}px, ${dy}px)`;

    // Normalizar dirección para el movimiento del jugador
    this.dir.x = dist > 5 ? dx / maxDist : 0;
    this.dir.y = dist > 5 ? dy / maxDist : 0;
  }
}