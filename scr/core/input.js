// js/core/input.js

export class InputManager {
    constructor() {
        this.axis = { x: 0, y: 0 };
        this.actions = {
            attack: false,
            dodge: false,
            skill: false
        };

        this.keys = {};

        // Datos del Joystick Virtual Táctil (Lado Izquierdo)
        this.touchData = {
            active: false,
            id: null,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            maxRadius: 50
        };

        // Datos del Botón Táctil de Ataque (Lado Derecho)
        this.attackButton = {
            active: false,
            id: null,
            x: 0, // Se calculará según el tamaño del canvas/ventana
            y: 0,
            radius: 35
        };

        this.initListeners();
    }

    initListeners() {
        // --- 1. EVENTOS DE TECLADO (PC) ---
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // --- 2. EVENTOS TÁCTILES (MÓVIL / TABLET) ---
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        window.addEventListener('touchcancel', (e) => this.handleTouchEnd(e));
    }

    handleTouchStart(e) {
        const rect = document.getElementById('gameCanvas').getBoundingClientRect();
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            
            // Coordenadas relativas a la ventana
            let clientX = touch.clientX;
            let clientY = touch.clientY;

            // Mitad izquierda: Joystick de movimiento
            if (clientX < window.innerWidth / 2 && !this.touchData.active) {
                this.touchData.active = true;
                this.touchData.id = touch.identifier;
                this.touchData.startX = clientX;
                this.touchData.startY = clientY;
                this.touchData.currentX = clientX;
                this.touchData.currentY = clientY;
            } 
            // Mitad derecha: Botón de Ataque
            else if (clientX >= window.innerWidth / 2 && !this.attackButton.active) {
                // Comprobar si el toque está cerca del botón de ataque virtual en pantalla
                let scaleX = document.getElementById('gameCanvas').width / rect.width;
                let scaleY = document.getElementById('gameCanvas').height / rect.height;
                let canvasX = (clientX - rect.left) * scaleX;
                let canvasY = (clientY - rect.top) * scaleY;

                let dx = canvasX - this.attackButton.x;
                let dy = canvasY - this.attackButton.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                // Si se toca el área del botón o la mitad derecha inferior
                if (dist < 70 || clientX > window.innerWidth - 120) {
                    this.attackButton.active = true;
                    this.attackButton.id = touch.identifier;
                }
            }
        }
    }

    handleTouchMove(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            
            if (this.touchData.active && touch.identifier === this.touchData.id) {
                this.touchData.currentX = touch.clientX;
                this.touchData.currentY = touch.clientY;
            }
        }
    }

    handleTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            
            if (this.touchData.active && touch.identifier === this.touchData.id) {
                this.touchData.active = false;
                this.touchData.id = null;
            }
            if (this.attackButton.active && touch.identifier === this.attackButton.id) {
                this.attackButton.active = false;
                this.attackButton.id = null;
            }
        }
    }

    // Dibujar los controles táctiles (Joystick + Botón de Ataque) en el Canvas
    draw(ctx, canvas) {
        // Posicionar el botón de ataque fijo en la esquina inferior derecha del canvas lógico
        this.attackButton.x = canvas.width - 70;
        this.attackButton.y = canvas.height - 70;

        ctx.save();

        // 1. --- DIBUJAR BOTÓN DE ATAQUE TÁCTIL ---
        ctx.beginPath();
        ctx.arc(this.attackButton.x, this.attackButton.y, this.attackButton.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.attackButton.active ? 'rgba(160, 40, 40, 0.6)' : 'rgba(35, 25, 30, 0.5)';
        ctx.strokeStyle = 'rgba(180, 80, 80, 0.7)';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Icono de espada/ataque dentro del botón
        ctx.fillStyle = '#d1d1d1';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚔', this.attackButton.x, this.attackButton.y);

        // 2. --- DIBUJAR JOYSTICK VIRTUAL (si está activo) ---
        if (this.touchData.active) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const startX = (this.touchData.startX - rect.left) * scaleX;
            const startY = (this.touchData.startY - rect.top) * scaleY;
            const currentX = (this.touchData.currentX - rect.left) * scaleX;
            const currentY = (this.touchData.currentY - rect.top) * scaleY;

            // Base exterior
            ctx.beginPath();
            ctx.arc(startX, startY, this.touchData.maxRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(20, 20, 25, 0.4)';
            ctx.strokeStyle = 'rgba(100, 100, 120, 0.6)';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();

            // Pomo interior
            let dx = currentX - startX;
            let dy = currentY - startY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let knobX = currentX;
            let knobY = currentY;

            if (distance > this.touchData.maxRadius) {
                knobX = startX + (dx / distance) * this.touchData.maxRadius;
                knobY = startY + (dy / distance) * this.touchData.maxRadius;
            }

            ctx.beginPath();
            ctx.arc(knobX, knobY, 22, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140, 140, 160, 0.6)';
            ctx.strokeStyle = 'rgba(200, 200, 220, 0.8)';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }

    update() {
        let moveX = 0;
        let moveY = 0;

        // --- TECLADO (PC) ---
        if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;

        // Acciones por teclado o botón táctil
        let keyAttack = !!(this.keys['KeyJ'] || this.keys['KeyX'] || this.keys['Space']);
        this.actions.attack = keyAttack || this.attackButton.active;

        this.actions.dodge = !!(this.keys['KeyK'] || this.keys['ShiftLeft']);

        // --- JOYSTICK TÁCTIL ---
        if (this.touchData.active) {
            let dx = this.touchData.currentX - this.touchData.startX;
            let dy = this.touchData.currentY - this.touchData.startY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                let limitedDist = Math.min(distance, this.touchData.maxRadius);
                moveX = (dx / distance) * (limitedDist / this.touchData.maxRadius);
                moveY = (dy / distance) * (limitedDist / this.touchData.maxRadius);
            }
        }

        if (moveX !== 0 && moveY !== 0 && !this.touchData.active) {
            moveX *= 0.7071;
            moveY *= 0.7071;
        }

        this.axis.x = moveX;
        this.axis.y = moveY;
    }
}