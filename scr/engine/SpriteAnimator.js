import { Assets } from './AssetManager.js';

export class SpriteAnimator {
  constructor(imageKey, frameWidth, frameHeight) {
    this.image = Assets.getImage(imageKey);
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    
    this.animations = {};
    this.currentAnim = null;
    this.currentFrame = 0;
    this.timer = 0;
    this.frameInterval = 0.1;
    this.onCompleteCallback = null;
  }

  addAnimation(name, row, totalFrames, flipX = false, loop = true) {
    this.animations[name] = { row, totalFrames, flipX, loop };
  }

  play(name, onComplete = null) {
    // CORREGIDO: Permite reiniciar animaciones non-loop (ataques) aunque sea el mismo nombre
    if (this.currentAnim !== name || (this.animations[name] && !this.animations[name].loop)) {
      this.currentAnim = name;
      this.currentFrame = 0;
      this.timer = 0;
      this.onCompleteCallback = onComplete;
    }
  }

  update(dt) {
    if (!this.currentAnim || !this.animations[this.currentAnim]) return;

    const anim = this.animations[this.currentAnim];
    this.timer += dt;

    if (this.timer >= this.frameInterval) {
      this.timer = 0;
      
      if (this.currentFrame < anim.totalFrames - 1) {
        this.currentFrame++;
      } else {
        if (anim.loop) {
          this.currentFrame = 0;
        } else {
          if (this.onCompleteCallback) {
            const cb = this.onCompleteCallback;
            this.onCompleteCallback = null;
            cb();
          }
        }
      }
    }
  }

  render(ctx, x, y, width, height) {
    if (!this.image || !this.currentAnim) return;

    const anim = this.animations[this.currentAnim];
    const sX = this.currentFrame * this.frameWidth;
    const sY = anim.row * this.frameHeight;

    ctx.save();

    if (anim.flipX) {
      ctx.translate(Math.floor(x) + width, Math.floor(y));
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.image,
        sX, sY, this.frameWidth, this.frameHeight,
        0, 0, width, height
      );
    } else {
      ctx.drawImage(
        this.image,
        sX, sY, this.frameWidth, this.frameHeight,
        Math.floor(x), Math.floor(y), width, height
      );
    }

    ctx.restore();
  }
}