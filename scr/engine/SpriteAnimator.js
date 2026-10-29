import { Assets } from './AssetManager.js';

export class SpriteAnimator {
  constructor(imageKey, frameWidth, frameHeight) {
    // Obtenemos la imagen directamente de la caché global
    this.image = Assets.getImage(imageKey);
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    
    this.animations = {};
    this.currentAnim = null;
    this.currentFrame = 0;
    this.timer = 0;
    this.frameInterval = 0.12;
  }

  addAnimation(name, row, totalFrames) {
    this.animations[name] = { row, totalFrames };
  }

  play(name) {
    if (this.currentAnim !== name) {
      this.currentAnim = name;
      this.currentFrame = 0;
      this.timer = 0;
    }
  }

  update(dt) {
    if (!this.currentAnim || !this.animations[this.currentAnim]) return;
    const anim = this.animations[this.currentAnim];
    this.timer += dt;

    if (this.timer >= this.frameInterval) {
      this.timer = 0;
      this.currentFrame = (this.currentFrame + 1) % anim.totalFrames;
    }
  }

  render(ctx, x, y, width, height) {
    if (!this.image || !this.currentAnim) return;

    const anim = this.animations[this.currentAnim];
    const sX = this.currentFrame * this.frameWidth;
    const sY = anim.row * this.frameHeight;

    ctx.drawImage(
      this.image,
      sX, sY, this.frameWidth, this.frameHeight,
      Math.floor(x), Math.floor(y), width, height
    );
  }
}