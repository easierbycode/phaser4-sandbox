// Game config toggles that influence how rotating sprites are rendered.
const gameSettings = {
  antialias: true,
  antialiasGL: true,
  roundPixels: false,
  pixelArt: true,
  mipmap: true
};

const TOGGLES = [
  { key: 'antialias',   label: 'Antialias (canvas)' },
  { key: 'antialiasGL', label: 'Antialias GL (multisample)' },
  { key: 'roundPixels', label: 'Round Pixels' },
  { key: 'pixelArt',    label: 'Pixel Art (nearest filter)' },
  { key: 'mipmap',      label: 'Mipmap Filter (LINEAR_MIPMAP_LINEAR)' }
];

function buildSettingsPanel() {
  const panel = document.querySelector('#settings-menu .settings-panel');
  if (!panel) return;

  panel.innerHTML = `
    <h2>Rotation Quality</h2>
    ${TOGGLES.map(t => `
      <div class="setting-item" style="display:flex; align-items:center; justify-content:space-between;">
        <label for="${t.key}-toggle" style="margin-bottom:0; flex:1;">${t.label}</label>
        <label class="toggle-switch">
          <input type="checkbox" id="${t.key}-toggle">
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('')}
    <button class="close-btn" id="close-settings">Close</button>
  `;

  TOGGLES.forEach(t => {
    const input = document.getElementById(`${t.key}-toggle`);
    input.checked = gameSettings[t.key];
    input.addEventListener('change', (e) => {
      gameSettings[t.key] = e.target.checked;
      restartGame();
    });
  });

  const settingsMenu = document.getElementById('settings-menu');
  document.getElementById('close-settings').addEventListener('click', () => {
    settingsMenu.classList.remove('visible');
  });
}

function setupSettingsCog() {
  const settingsCog = document.getElementById('settings-cog');
  const settingsMenu = document.getElementById('settings-menu');
  if (!settingsCog || !settingsMenu) return;

  const newCog = settingsCog.cloneNode(true);
  settingsCog.parentNode.replaceChild(newCog, settingsCog);
  newCog.addEventListener('click', () => settingsMenu.classList.add('visible'));

  settingsMenu.addEventListener('click', (e) => {
    if (e.target === settingsMenu) settingsMenu.classList.remove('visible');
  });
}

function buildPhaserConfig() {
  return {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 800,
    backgroundColor: '#1a2238',
    antialias: gameSettings.antialias,
    antialiasGL: gameSettings.antialiasGL,
    roundPixels: gameSettings.roundPixels,
    pixelArt: gameSettings.pixelArt,
    mipmapFilter: gameSettings.mipmap ? 'LINEAR_MIPMAP_LINEAR' : '',
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Game21Goofy
  };
}

function restartGame() {
  if (window.currentGame) {
    window.currentGame.destroy(true);
  }
  window.currentGame = new Phaser.Game(buildPhaserConfig());
}


const ASSET_BASE = 'https://raw.githubusercontent.com/easierbycode/monkey-kombat/main/assets';

const GLOBE_KEY = 'mario-globe';
const GOOFY_KEY = 'goofy-walk';
const GOOFY_JUMP_KEY = 'goofy-jump';
const BRICK_KEY = 'mario-brick';
const BRICK_PARTICLE_KEY = 'mario-brick-particle';
const BLOCK_KEY = 'mario-block';
const COIN_KEY = 'coin';
const FIREWORK_KEY = 'mario-firework';

const GOOFY_WALK_ANIM = 'goofy-walk-loop';
const BLOCK_PULSE_ANIM = 'mario-block-pulse';
const COIN_SPIN_ANIM = 'mario-coin-spin';
const FIREWORK_ANIM = 'mario-firework-spin';

const GLOBE_SCALE = 0.45;
const GOOFY_SCALE = 0.6;

const ANGULAR_SPEED_RAD_PER_SEC = 1.1;
const GLOBE_ROTATION_FACTOR = 0.25;

const LETTER_CELL_SIZE = 4;
const LETTER_GRID_W = 3;
const LETTER_GRID_H = 5;
const BRICK_SOURCE_PX = 16;
const BASE_LETTER_RADIUS_OFFSET = 38;
const LETTER_SPACING_PADDING = 1.25;

const GOOFY_HEIGHT_PX = 24;

const BASE_JUMP_PEAK_HEIGHT = 30;
const BASE_JUMP_DURATION_SEC = 0.75;
const COLLISION_RADIUS_PX = 6;

const FIREWORK_DISPLAY_MS = 3500;

const STATE_WALKING = 'walking';
const STATE_JUMPING = 'jumping';

const LETTER_PATTERNS = {
  'A': ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'],
  'B': ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'],
  'C': ['XXX', 'X..', 'X..', 'X..', 'XXX'],
  'D': ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'],
  'E': ['XXX', 'X..', 'XX.', 'X..', 'XXX'],
  'F': ['XXX', 'X..', 'XX.', 'X..', 'X..'],
  'G': ['XXX', 'X..', 'X.X', 'X.X', 'XXX'],
  'H': ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'],
  'I': ['XXX', '.X.', '.X.', '.X.', 'XXX'],
  'J': ['..X', '..X', '..X', 'X.X', 'XXX'],
  'K': ['X.X', 'X.X', 'XX.', 'X.X', 'X.X'],
  'L': ['X..', 'X..', 'X..', 'X..', 'XXX'],
  'N': ['X.X', 'XX.', 'X.X', '.XX', 'X.X'],
  'O': ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'],
  'P': ['XX.', 'X.X', 'XX.', 'X..', 'X..'],
  'Q': ['XXX', 'X.X', 'X.X', 'XXX', '..X'],
  'R': ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'],
  'S': ['.XX', 'X..', '.X.', '..X', 'XX.'],
  'T': ['XXX', '.X.', '.X.', '.X.', '.X.'],
  'U': ['X.X', 'X.X', 'X.X', 'X.X', 'XXX'],
  'V': ['X.X', 'X.X', 'X.X', 'X.X', '.X.'],
  'W': ['X.X', 'X.X', 'XXX', 'XXX', '.X.'],
  'X': ['X.X', 'X.X', '.X.', 'X.X', 'X.X'],
  'Y': ['X.X', 'X.X', '.X.', '.X.', '.X.'],
  'Z': ['XXX', '..X', '.X.', 'X..', 'XXX'],
  "'": ['.X.', '.X.', '...', '...', '...']
};

const M_DIAGONAL_PARTICLES = [
  { x: -3,   y: -8   },
  { x: -2,   y: -5.5 },
  { x: -1.2, y: -3   },
  { x: -0.5, y: -0.8 }
];
const M_V_TIP = { x: 0, y: 0.4 };

const DAY_NAMES = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

function buildPhaseTexts() {
  const today = DAY_NAMES[new Date().getDay()];
  return [
    "HAPPY MOTHER'S DAY",
    `HAPPY ${today}`,
    'YOUR PRINCESS IS IN ANOTHER CASTLE'
  ];
}

class Game21Goofy extends Phaser.Scene {
  constructor() {
    super({ key: 'Game21' });
  }

  preload() {
    this.load.atlas(GLOBE_KEY, `${ASSET_BASE}/mario-globe.png`, `${ASSET_BASE}/mario-globe.json`);
    this.load.atlas(GOOFY_KEY, `${ASSET_BASE}/goofy-walk.png`, `${ASSET_BASE}/goofy-walk.json`);
    this.load.atlas(GOOFY_JUMP_KEY, `${ASSET_BASE}/goofy-jump.png`, `${ASSET_BASE}/goofy-jump.json`);
    this.load.atlas(BRICK_KEY, `${ASSET_BASE}/mario-brick.png`, `${ASSET_BASE}/mario-brick.json`);
    this.load.atlas(BRICK_PARTICLE_KEY, `${ASSET_BASE}/mario-brick-particle.png`, `${ASSET_BASE}/mario-brick-particle.json`);
    this.load.atlas(BLOCK_KEY, `${ASSET_BASE}/mario-block.png`, `${ASSET_BASE}/mario-block.json`);
    this.load.atlas(COIN_KEY, `${ASSET_BASE}/coin.png`, `${ASSET_BASE}/coin.json`);
    this.load.atlas(FIREWORK_KEY, `${ASSET_BASE}/mario-firework.png`, `${ASSET_BASE}/mario-firework.json`);
  }

  create() {
    const w = this.game.config.width;
    const h = this.game.config.height;

    this.cameras.main.setBackgroundColor('#1a2238');

    this.globe = this.physics.add.sprite(w / 2, h / 2, GLOBE_KEY, 'atlas_s0');
    this.globe.setScale(GLOBE_SCALE);
    this.globe.setDepth(1);

    this.globeRadius = (this.globe.width * GLOBE_SCALE) / 2;
    this.globe.body.setCircle(this.globe.width / 2);
    this.globe.body.setOffset(0, 0);
    this.globe.body.setImmovable(true);
    this.globe.body.setAllowGravity(false);

    this.createAnimations();

    this.goofy = this.add.sprite(0, 0, GOOFY_KEY, 'atlas_s0');
    this.goofy.setOrigin(0.5, 1);
    this.goofy.setScale(GOOFY_SCALE);
    this.goofy.setDepth(3);
    this.goofy.play(GOOFY_WALK_ANIM);

    this.goofyAngle = -Math.PI / 2;
    this.direction = 1;
    this.state = STATE_WALKING;
    this.jumpElapsed = 0;

    this.phaseTexts = buildPhaseTexts();
    this.phaseIndex = 0;
    this.advancing = false;
    this.letterContainers = [];
    this.collidables = [];
    this.fireworks = [];
    this.lastSlots = [];

    this.startPhase(0);

    this.input.keyboard.on('keydown-LEFT', () => { if (this.state === STATE_WALKING) this.direction = -1; });
    this.input.keyboard.on('keydown-RIGHT', () => { if (this.state === STATE_WALKING) this.direction = 1; });
    this.input.keyboard.on('keydown-SPACE', () => this.startJump());
    this.input.on('pointerdown', () => this.startJump());

    this.positionGoofy();

    this.cameras.main.startFollow(this.goofy, true, 0.12, 0.12);
    this.cameras.main.centerOn(this.goofy.x, this.goofy.y);
  }

  createAnimations() {
    if (!this.anims.exists(GOOFY_WALK_ANIM)) {
      this.anims.create({
        key: GOOFY_WALK_ANIM,
        frames: this.anims.generateFrameNames(GOOFY_KEY, { prefix: 'atlas_s', start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!this.anims.exists(BLOCK_PULSE_ANIM)) {
      this.anims.create({
        key: BLOCK_PULSE_ANIM,
        frames: this.anims.generateFrameNames(BLOCK_KEY, { prefix: 'atlas_s', start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
      });
    }
    if (!this.anims.exists(COIN_SPIN_ANIM)) {
      this.anims.create({
        key: COIN_SPIN_ANIM,
        frames: this.anims.generateFrameNames(COIN_KEY, { prefix: 'atlas_s', start: 0, end: 11 }),
        frameRate: 16,
        repeat: -1
      });
    }
    if (!this.anims.exists(FIREWORK_ANIM)) {
      this.anims.create({
        key: FIREWORK_ANIM,
        frames: this.anims.generateFrameNames(FIREWORK_KEY, { prefix: 'atlas_s', start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
      });
    }
  }

  computeLayout(text) {
    const arcDeg = 240;
    const stepDeg = arcDeg / (text.length - 1);
    const stepRad = Phaser.Math.DegToRad(stepDeg);
    const letterWidthPx = LETTER_GRID_W * LETTER_CELL_SIZE;
    const minStepArc = letterWidthPx * LETTER_SPACING_PADDING;

    const baseLetterRadius = this.globeRadius + BASE_LETTER_RADIUS_OFFSET;
    const minLetterRadius = minStepArc / stepRad;
    const letterRadius = Math.max(baseLetterRadius, minLetterRadius);

    const letterRadiusOffset = letterRadius - this.globeRadius;
    const jumpPeakHeight = Math.max(BASE_JUMP_PEAK_HEIGHT, letterRadiusOffset);
    const jumpDurationSec = BASE_JUMP_DURATION_SEC * Math.sqrt(jumpPeakHeight / BASE_JUMP_PEAK_HEIGHT);

    const letterHeightPx = LETTER_GRID_H * LETTER_CELL_SIZE;
    const farthest = letterRadius + letterHeightPx;
    const viewport = Math.min(this.game.config.width, this.game.config.height);
    const zoomFitArc = (viewport * 0.5) / (farthest * 1.1);
    const cameraZoom = Math.min(2.5, Math.max(1.0, zoomFitArc));

    return { arcDeg, letterRadius, jumpPeakHeight, jumpDurationSec, cameraZoom };
  }

  startPhase(index) {
    this.clearPhaseObjects();

    const text = this.phaseTexts[index];
    const layout = this.computeLayout(text);
    this.letterRadius = layout.letterRadius;
    this.jumpPeakHeight = layout.jumpPeakHeight;
    this.jumpDurationSec = layout.jumpDurationSec;
    this.jumpRadius = this.globeRadius;

    this.cameras.main.zoomTo(layout.cameraZoom, 400, 'Sine.easeInOut');

    this.createMessageArc(text, layout.arcDeg, layout.letterRadius);

    this.activeCount = this.collidables.length;
    this.advancing = false;
  }

  clearPhaseObjects() {
    for (const c of this.letterContainers) {
      c.destroy(true);
    }
    this.letterContainers.length = 0;
    this.collidables.length = 0;

    for (const f of this.fireworks) {
      f.destroy();
    }
    this.fireworks.length = 0;

    this.lastSlots.length = 0;
  }

  createMessageArc(text, arcDeg, letterRadius) {
    const cx = this.globe.x;
    const cy = this.globe.y;

    const chars = text.split('');
    const stepDeg = arcDeg / (chars.length - 1);
    const startDeg = -90 - arcDeg / 2;

    chars.forEach((char, i) => {
      const deg = startDeg + i * stepDeg;
      const rad = Phaser.Math.DegToRad(deg);
      const x = cx + Math.cos(rad) * letterRadius;
      const y = cy + Math.sin(rad) * letterRadius;
      const upright = rad + Math.PI / 2;

      const container = this.add.container(x, y);
      container.setDepth(2);
      container.setRotation(upright);
      this.letterContainers.push(container);

      this.buildLetter(container, char, x, y, upright);
    });
  }

  buildLetter(container, char, containerX, containerY, rotation) {
    if (char === ' ') {
      const block = this.add.sprite(0, 0, BLOCK_KEY, 'atlas_s0');
      block.setScale(LETTER_CELL_SIZE / BRICK_SOURCE_PX * 1.5);
      block.play(BLOCK_PULSE_ANIM);
      container.add(block);
      this.collidables.push({
        type: 'block',
        worldX: containerX,
        worldY: containerY,
        sprite: block,
        container,
        consumed: false
      });
      this.lastSlots.push({ worldX: containerX, worldY: containerY });
      return;
    }

    if (char === 'M') {
      this.buildLetterM(container, containerX, containerY, rotation);
      return;
    }

    const pattern = LETTER_PATTERNS[char];
    if (!pattern) {
      return;
    }

    const brickScale = LETTER_CELL_SIZE / BRICK_SOURCE_PX;
    const colCenter = (LETTER_GRID_W - 1) / 2;
    const rowCenter = (LETTER_GRID_H - 1) / 2;
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    for (let row = 0; row < pattern.length; row++) {
      const line = pattern[row];
      for (let col = 0; col < line.length; col++) {
        if (line[col] !== 'X') {
          continue;
        }
        const localX = (col - colCenter) * LETTER_CELL_SIZE;
        const localY = (row - rowCenter) * LETTER_CELL_SIZE;
        const brick = this.add.image(localX, localY, BRICK_KEY, 'atlas_s0');
        brick.setScale(brickScale);
        container.add(brick);

        const worldX = containerX + localX * cosR - localY * sinR;
        const worldY = containerY + localX * sinR + localY * cosR;
        this.collidables.push({
          type: 'brick',
          worldX,
          worldY,
          sprite: brick,
          container,
          consumed: false
        });
        this.lastSlots.push({ worldX, worldY });
      }
    }
  }

  buildLetterM(container, containerX, containerY, rotation) {
    const brickScale = LETTER_CELL_SIZE / BRICK_SOURCE_PX;
    const particleScale = brickScale;
    const colCenter = (LETTER_GRID_W - 1) / 2;
    const rowCenter = (LETTER_GRID_H - 1) / 2;
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);

    const place = (localX, localY, key, scale, flipX) => {
      const sprite = this.add.image(localX, localY, key, 'atlas_s0');
      sprite.setScale(scale);
      if (flipX) {
        sprite.setFlipX(true);
      }
      container.add(sprite);

      const worldX = containerX + localX * cosR - localY * sinR;
      const worldY = containerY + localX * sinR + localY * cosR;
      this.collidables.push({
        type: 'brick',
        worldX,
        worldY,
        sprite,
        container,
        consumed: false
      });
      this.lastSlots.push({ worldX, worldY });
    };

    for (let row = 0; row < LETTER_GRID_H; row++) {
      for (const col of [0, 2]) {
        const localX = (col - colCenter) * LETTER_CELL_SIZE;
        const localY = (row - rowCenter) * LETTER_CELL_SIZE;
        place(localX, localY, BRICK_KEY, brickScale, false);
      }
    }

    for (const p of M_DIAGONAL_PARTICLES) {
      place(p.x, p.y, BRICK_PARTICLE_KEY, particleScale, false);
      place(-p.x, p.y, BRICK_PARTICLE_KEY, particleScale, true);
    }

    place(M_V_TIP.x, M_V_TIP.y, BRICK_PARTICLE_KEY, particleScale, false);
    place(M_V_TIP.x, M_V_TIP.y, BRICK_PARTICLE_KEY, particleScale, true);
  }

  startJump() {
    if (this.state !== STATE_WALKING || this.advancing) {
      return;
    }
    this.state = STATE_JUMPING;
    this.jumpElapsed = 0;
    this.goofy.anims.stop();
    this.goofy.setTexture(GOOFY_JUMP_KEY, 'atlas_s0');
  }

  endJump() {
    this.state = STATE_WALKING;
    this.jumpRadius = this.globeRadius;
    this.direction *= -1;
    this.goofy.setTexture(GOOFY_KEY, 'atlas_s0');
    this.goofy.play(GOOFY_WALK_ANIM);
  }

  update(_, deltaMs) {
    const dt = deltaMs / 1000;

    if (this.state === STATE_WALKING) {
      this.goofyAngle += this.direction * ANGULAR_SPEED_RAD_PER_SEC * dt;
    } else if (this.state === STATE_JUMPING) {
      this.jumpElapsed += dt;
      const t = this.jumpElapsed / this.jumpDurationSec;
      if (t >= 1) {
        this.endJump();
      } else {
        this.jumpRadius = this.globeRadius + this.jumpPeakHeight * Math.sin(Math.PI * t);
        this.checkLetterCollisions();
      }
    }

    if (this.globe) {
      const surfaceArc = ANGULAR_SPEED_RAD_PER_SEC * GLOBE_ROTATION_FACTOR * dt;
      this.globe.rotation -= this.direction * surfaceArc;
    }

    this.positionGoofy();
  }

  checkLetterCollisions() {
    const cx = this.globe.x;
    const cy = this.globe.y;
    const outwardX = Math.cos(this.goofyAngle);
    const outwardY = Math.sin(this.goofyAngle);
    const collisionR = this.jumpRadius + GOOFY_HEIGHT_PX * 0.7;
    const probeX = cx + outwardX * collisionR;
    const probeY = cy + outwardY * collisionR;
    const thresholdSq = COLLISION_RADIUS_PX * COLLISION_RADIUS_PX;

    for (const c of this.collidables) {
      if (c.consumed) continue;
      const dx = c.worldX - probeX;
      const dy = c.worldY - probeY;
      if (dx * dx + dy * dy < thresholdSq) {
        c.consumed = true;
        if (c.type === 'brick') {
          this.explodeBrick(c);
        } else if (c.type === 'block') {
          this.popBlock(c);
        }
        this.onConsumed();
      }
    }
  }

  onConsumed() {
    this.activeCount--;
    if (this.activeCount <= 0 && !this.advancing) {
      this.advancing = true;
      this.time.delayedCall(450, () => this.runFireworksThenAdvance());
    }
  }

  runFireworksThenAdvance() {
    const slots = this.lastSlots.slice();
    const fireworkScale = LETTER_CELL_SIZE / BRICK_SOURCE_PX * 1.2;

    for (const s of slots) {
      const fw = this.add.sprite(s.worldX, s.worldY, FIREWORK_KEY, 'atlas_s0');
      fw.setScale(fireworkScale);
      fw.setDepth(4);
      fw.play(FIREWORK_ANIM);
      this.fireworks.push(fw);
    }

    this.time.delayedCall(FIREWORK_DISPLAY_MS, () => {
      if (this.phaseIndex < this.phaseTexts.length - 1) {
        this.phaseIndex++;
        this.startPhase(this.phaseIndex);
      } else {
        this.clearPhaseObjects();
        this.advancing = false;
      }
    });
  }

  explodeBrick(c) {
    c.sprite.setVisible(false);

    const N = 5;
    for (let i = 0; i < N; i++) {
      const p = this.add.image(c.worldX, c.worldY, BRICK_PARTICLE_KEY, 'atlas_s0');
      p.setScale(0.5);
      p.setDepth(5);
      const angle = (i / N) * Math.PI * 2 + Math.random() * 0.6;
      const speed = 24 + Math.random() * 28;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 30;
      this.tweens.add({
        targets: p,
        x: c.worldX + vx * 0.7,
        y: c.worldY + vy * 0.7 + 80,
        angle: 360 * (Math.random() > 0.5 ? 1 : -1),
        alpha: { from: 1, to: 0 },
        duration: 800,
        ease: 'Quad.In',
        onComplete: () => p.destroy()
      });
    }
  }

  popBlock(c) {
    const radialAngle = Math.atan2(c.worldY - this.globe.y, c.worldX - this.globe.x);
    const outX = Math.cos(radialAngle);
    const outY = Math.sin(radialAngle);

    this.tweens.add({
      targets: c.sprite,
      scaleX: c.sprite.scaleX * 1.2,
      scaleY: c.sprite.scaleY * 1.2,
      duration: 80,
      yoyo: true
    });

    const N = 4;
    for (let i = 0; i < N; i++) {
      const coin = this.add.sprite(c.worldX, c.worldY, COIN_KEY, 'atlas_s0');
      coin.setScale(0.6);
      coin.setDepth(6);
      coin.play(COIN_SPIN_ANIM);

      const spread = (i - (N - 1) / 2) * 0.35;
      const angle = radialAngle + spread;
      const dist = 22 + Math.random() * 10;
      const peakX = c.worldX + Math.cos(angle) * dist;
      const peakY = c.worldY + Math.sin(angle) * dist;

      this.tweens.add({
        targets: coin,
        x: peakX,
        y: peakY,
        duration: 350,
        ease: 'Quad.Out',
        onComplete: () => {
          this.tweens.add({
            targets: coin,
            x: peakX + outX * 18,
            y: peakY + outY * 18,
            alpha: 0,
            duration: 450,
            ease: 'Quad.In',
            onComplete: () => coin.destroy()
          });
        }
      });
    }
  }

  positionGoofy() {
    if (!this.goofy || !this.globe) {
      return;
    }
    const cx = this.globe.x;
    const cy = this.globe.y;
    const r = (this.state === STATE_JUMPING) ? this.jumpRadius : this.globeRadius;
    this.goofy.x = cx + Math.cos(this.goofyAngle) * r;
    this.goofy.y = cy + Math.sin(this.goofyAngle) * r;
    this.goofy.rotation = this.goofyAngle + Math.PI / 2;
    this.goofy.setFlipX(this.direction < 0);
  }
}

setupSettingsCog();
buildSettingsPanel();
window.currentGame = new Phaser.Game(buildPhaserConfig());
