export const ENEMY_TYPES = {
  SLIME: {
    name: 'Slime',
    width: 32, 
    height: 32,
    frameWidth: 32, 
    frameHeight: 32,
    speed: 45,
    health: 5, // <--- Ahora aguantan 3 golpes antes de morir
    spritePath: 'slime',
    animations: {
      idleDown:  { row: 0, frames: 4, loop: true },
      idleRight: { row: 1, frames: 4, loop: true, flip: false },
      idleLeft:  { row: 1, frames: 4, loop: true, flip: true },
      idleUp:    { row: 2, frames: 4, loop: true },

      walkDown:  { row: 3, frames: 6, loop: true },
      walkRight: { row: 4, frames: 6, loop: true, flip: false },
      walkLeft:  { row: 4, frames: 6, loop: true, flip: true },
      walkUp:    { row: 5, frames: 6, loop: true },

      attackDown:  { row: 6, frames: 6, loop: false },
      attackRight: { row: 7, frames: 6, loop: false, flip: false },
      attackLeft:  { row: 7, frames: 6, loop: false, flip: true },
      attackUp:    { row: 8, frames: 6, loop: false },

      hurtDown:  { row: 9, frames: 3, loop: false },
      hurtRight: { row: 10, frames: 3, loop: false, flip: false },
      hurtLeft:  { row: 10, frames: 3, loop: false, flip: true },
      hurtUp:    { row: 11, frames: 3, loop: false },

      deathRight: { row: 12, frames: 3, loop: false, flip: false },
      deathLeft:  { row: 12, frames: 3, loop: false, flip: true }
    }
  }
};