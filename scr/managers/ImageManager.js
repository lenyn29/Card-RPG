export class ImageManager {
    constructor() {
        this.images = {};
    }

    load(name, src) {
        const img = new Image();
        img.src = src;

        this.images[name] = {
            image: img,
            loaded: false
        };

        img.onload = () => {
            this.images[name].loaded = true;
            console.log(`Image loaded: ${name}`);
        };

        img.onerror = () => {
            console.warn(`Image failed to load for: ${name}. Falling back to placeholder.`);
        };
    }

    get(name) {
        const entry = this.images[name];
        // Si la imagen existe y ya cargó con éxito, la devuelve; si no, retorna null
        return (entry && entry.loaded) ? entry.image : null;
    }

    loadAll() {
        // Aquí registras todos los sprites de tu juego
        this.load('player', './images/Player.png');
    }
}