export class TouchController {
  constructor() {
    this.dir = { x: 0, y: 0 };
    this.actionAttack = false;
    this.actionInteract = false;

    // Estado del Joystick
    this.joystickActive = false;
    this.joystickCenter = { x: 0, y: 0 };
    this.joystickPos = { x: 0, y: 0 };
    this.maxRadius = 40; // Radio máximo de desplazamiento del joystick

    this.createUI();
    this.bindEvents();
  }

  createUI() {
    // Contenedor principal de controles táctiles superpuesto al canvas
    this.container = document.createElement('div');
    this.container.id = 'touch-controls';
    this.container.innerHTML = `
      <div id="joystick-base">
        <div id="joystick-stick"></div>
      </div>
      <div id="action-buttons">
        <button id="btn-attack" class="action-btn">⚔️</button>
        <button id="btn-interact" class="action-btn">💬</button>
      </div>
    `;
    document.body.appendChild(this.container);
  }

  bindEvents() {
    const base = document.getElementById('joystick-base');
    const stick = document.getElementById('joystick-stick');
    const btnAttack = document.getElementById('btn-attack');
    const btnInteract = document.getElementById('btn-interact');

    // --- LÓGICA DEL JOYSTICK TÁCTIL ---
    base.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = base.getBoundingClientRect();
      this.joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      this.joystickActive = true;
      this.updateJoystick(touch.clientX, touch.clientY, stick, base);
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!this.joystickActive) return;
      e.preventDefault();
      const touch = e.touches[0];
      this.updateJoystick(touch.clientX, touch.clientY, stick, base);
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (!this.joystickActive) return;
      this.joystickActive = false;
      this.dir = { x: 0, y: 0 };
      stick.style.transform = `translate(0px, 0px)`;
    });

    // --- LÓGICA DE BOTONES ---
    btnAttack.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.actionAttack = true;
    });
    btnAttack.addEventListener('touchend', () => { this.actionAttack = false; });

    btnInteract.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.actionInteract = true;
    });
    btnInteract.addEventListener('touchend', () => { this.actionInteract = false; });
  }

  updateJoystick(clientX, clientY, stick, base) {
    let dx = clientX - this.joystickCenter.x;
    let dy = clientY - this.joystickCenter.y;
    const distance = Math.hypot(dx, dy);

    // Limitar al radio máximo del joystick
    if (distance > this.maxRadius) {
      dx = (dx / distance) * this.maxRadius;
      dy = (dy / distance) * this.maxRadius;
    }

    // Mover visualmente el stick en pantalla
    stick.style.transform = `translate(${dx}px, ${dy}px)`;

    // Normalizar la dirección para el movimiento del jugador (-1 a 1)
    this.dir.x = dx / this.maxRadius;
    this.dir.y = dy / this.maxRadius;

    // Aplicar un pequeño umbral (deadzone) para evitar drift
    if (Math.abs(this.dir.x) < 0.15) this.dir.x = 0;
    if (Math.abs(this.dir.y) < 0.15) this.dir.y = 0;
  }
}