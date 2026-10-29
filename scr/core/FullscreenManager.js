export class FullscreenManager {
  constructor(onFullscreenReady) {
    this.createSplash(onFullscreenReady);
  }

  createSplash(onReady) {
    this.splash = document.createElement('div');
    this.splash.id = 'fullscreen-splash';
    this.splash.innerHTML = `
      <div class="splash-card">
        <h2>⚔️ 2D RPG Engine</h2>
        <p>Toca para iniciar en Pantalla Completa</p>
        <button id="start-btn">¡Jugar Ahora!</button>
      </div>
    `;

    Object.assign(this.splash.style, {
      position: 'fixed',
      top: '0', left: '0', width: '100vw', height: '100vh',
      background: '#0d0d0d',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000',
      color: '#fff',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    });

    document.body.appendChild(this.splash);

    const btn = document.getElementById('start-btn');
    Object.assign(btn.style, {
      padding: '12px 24px',
      fontSize: '18px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '15px',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)'
    });

    btn.addEventListener('click', () => {
      this.requestFullscreen();
      this.splash.remove();
      if (onReady) onReady();
    });
  }

  requestFullscreen() {
    const elem = document.documentElement;
    const requestMethod = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
    
    if (requestMethod) {
      requestMethod.call(elem).then(() => {
        // Intentar bloquear orientación a horizontal de forma segura
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      }).catch(err => {
        console.warn("Fullscreen denegado o no soportado por políticas del navegador:", err);
      });
    }
  }
}