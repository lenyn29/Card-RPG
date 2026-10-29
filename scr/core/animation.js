// js/core/animation.js

export class SpriteAnimator {
    constructor(imageSrc, frameWidth, frameHeight, animationsConfig) {
        this.image = new Image();
        this.isLoaded = false;
        
        this.image.onload = () => { this.isLoaded = true; };
        this.image.onerror = () => { this.isLoaded = false; };
        this.image.src = imageSrc;

        this.frameWidth = frameWidth;   // 32px
        this.frameHeight = frameHeight; // 32px
        
        this.animations = animationsConfig; // { idle, walk, attack, death }
        this.currentAnim = 'idle';
        this.currentDirection = 'down'; // 'down', 'left', 'right', 'up'
        this.currentFrame = 0;
        this.timer = 0;
        this.frameInterval = 0.12; // Velocidad de la animación
        this.isFinished = false;
    }

    setAnimation(name, direction = 'down') {
        if (this.animations[name]) {
            if (this.currentAnim !== name || this.currentDirection !== direction) {
                this.currentAnim = name;
                this.currentDirection = direction;
                this.currentFrame = 0;
                this.timer = 0;
                this.isFinished = false;
            }
        }
    }

    update(deltaTime) {
        const animConfig = this.animations[this.currentAnim];
        if (!animConfig) return;

        // Si es la animación de muerte y ya terminó, se congela en el último fotograma
        if (this.isFinished) return;

        this.timer += deltaTime;
        if (this.timer >= this.frameInterval) {
            this.timer = 0;
            if (this.currentFrame < animConfig.frames - 1) {
                this.currentFrame++;
            } else {
                if (this.currentAnim === 'death') {
                    this.isFinished = true;
                } else {
                    this.currentFrame = 0; // Reinicia el bucle para idle, walk, attack
                }
            }
        }
    }

    draw(ctx, x, y, width, height, fallbackColor = '#3a3a47') {
        if (this.isLoaded) {
            const animConfig = this.animations[this.currentAnim];
            if (!animConfig) return;

            // Seleccionar la fila exacta según la dirección actual
            let row = animConfig.rowDown; // por defecto
            if (this.currentDirection === 'up') row = animConfig.rowUp;
            else if (this.currentDirection === 'right' || this.currentDirection === 'left') row = animConfig.rowSide;

            let col = this.currentFrame;
            let needsFlip = (this.currentDirection === 'left');

            ctx.save();

            // Si mira a la izquierda, aplicamos el efecto espejo horizontal exacto
            if (needsFlip) {
                ctx.translate(x + width / 2, y + height / 2);
                ctx.scale(-1, 1);
                ctx.translate(-(x + width / 2), -(y + height / 2));
            }

            ctx.drawImage(
                this.image,
                col * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight,
                x, y, width, height
            );

            ctx.restore();
        } else {
            // Respaldo visual por si la imagen de sprites tarda un instante en cargar
            ctx.fillStyle = fallbackColor;
            ctx.fillRect(x, y, width, height);
            ctx.strokeStyle = '#8a8a9e';
            ctx.strokeRect(x, y, width, height);
        }
    }
}