export class AssetManager {
  constructor() {
    this.images = {};
  }

  loadImage(name, url) {
    return new Promise((resolve, reject) => {
      if (this.images[name]) {
        resolve(this.images[name]);
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.images[name] = img;
        resolve(img);
      };
      img.onerror = () => reject(`Error cargando imagen: ${url}`);
    });
  }

  getImage(name) {
    return this.images[name];
  }
}

export const Assets = new AssetManager();