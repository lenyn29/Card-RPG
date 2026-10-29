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
    
    // Estilos inline del splash overlay
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
      this.lockLandscape();
      this.splash.remove();
      if (onReady) onReady();
    });
  }

  requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.log(err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  lockLandscape() {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Algunos navegadores móviles bloquean el lock si no está instalado como PWA
      });
    }
  }
}