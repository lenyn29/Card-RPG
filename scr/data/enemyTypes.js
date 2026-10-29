export const ENEMY_TYPES = {
  SLIME: {
    name: 'Slime',
    width: 16, height: 16,
    frameWidth: 16, frameHeight: 16,
    speed: 40,
    spritePath: 'assets/enemies/slime_sheet.png',
    animations: {
      idle: { row: 0, totalFrames: 2 },
      move: { row: 1, totalFrames: 4 }
    }
  },
  GOBLIN: {
    name: 'Goblin',
    width: 16, height: 24,
    frameWidth: 16, frameHeight: 24,
    speed: 70,
    spritePath: 'assets/enemies/goblin_sheet.png',
    animations: {
      idle: { row: 0, totalFrames: 1 },
      move: { row: 1, totalFrames: 4 }
    }
  }
};