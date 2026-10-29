export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  normalize() {
    const len = Math.hypot(this.x, this.y);
    if (len > 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }
}