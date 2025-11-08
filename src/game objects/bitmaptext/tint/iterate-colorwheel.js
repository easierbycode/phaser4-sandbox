// Settings management
const gameSettings = {
  colorMode: 'pairing', // 'pairing' or 'complementary'
  reverse: false
};

// Initialize settings from URL parameters (if present) or defaults
function initializeSettings() {
  const urlParams = new URL(window.location.href).searchParams;

  if (urlParams.get("complementary") === "1") {
    gameSettings.colorMode = 'complementary';
  }

  if (urlParams.get("reverse") === "1") {
    gameSettings.reverse = true;
  }

  // Update UI to match settings
  updateUIFromSettings();
}

// Update UI elements to reflect current settings
function updateUIFromSettings() {
  const colorModeSelect = document.getElementById('color-mode-select');
  const reverseToggle = document.getElementById('reverse-toggle');

  if (colorModeSelect) {
    colorModeSelect.value = gameSettings.colorMode;
  }

  if (reverseToggle) {
    reverseToggle.checked = gameSettings.reverse;
  }
}

// Setup settings menu event listeners
function setupSettingsMenu() {
  const settingsCog = document.getElementById('settings-cog');
  const settingsMenu = document.getElementById('settings-menu');
  const closeBtn = document.getElementById('close-settings');
  const colorModeSelect = document.getElementById('color-mode-select');
  const reverseToggle = document.getElementById('reverse-toggle');

  // Open settings menu
  settingsCog.addEventListener('click', () => {
    settingsMenu.classList.add('visible');
  });

  // Close settings menu
  closeBtn.addEventListener('click', () => {
    settingsMenu.classList.remove('visible');
  });

  // Close when clicking overlay
  settingsMenu.addEventListener('click', (e) => {
    if (e.target === settingsMenu) {
      settingsMenu.classList.remove('visible');
    }
  });

  // Color mode change
  colorModeSelect.addEventListener('change', (e) => {
    gameSettings.colorMode = e.target.value;
    restartGame();
  });

  // Reverse toggle change
  reverseToggle.addEventListener('change', (e) => {
    gameSettings.reverse = e.target.checked;
    restartGame();
  });
}

// Restart the game with new settings
function restartGame() {
  if (window.currentGame) {
    window.currentGame.destroy(true);
  }
  window.currentGame = new Phaser.Game(config);
}


class Example extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.setBaseURL("https://assets.codepen.io/11817390");
    this.load.image("knighthawks", "knight3.png");
    this.load.image("rain", "thalion-rain.png");
    this.load.image("contra", "contra1.png");
  }

  create() {
    this.add.image(0, 0, "rain").setOrigin(0).setScale(4);

    const config = {
      image: "knighthawks",
      width: 31,
      height: 25,
      chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
      charsPerRow: 10,
      spacing: { x: 1, y: 1 }
    };

    this.cache.bitmapFont.add(
      "knighthawks",
      Phaser.GameObjects.RetroFont.Parse(this, config)
    );

    const wheel = Phaser.Display.Color.HSVColorWheel(1, 1);
    const len = wheel.length;
    let i = 0;

    const wrap = (n, m) => ((n % m) + m) % m;

    // Use settings from gameSettings object
    const useComplementary = gameSettings.colorMode === 'complementary';
    const reverse = gameSettings.reverse;
    if (reverse) {
      i = len - 1;
    }

    const setTint = (data, idxA, idxB) => {
      const a = wheel[idxA].color;
      const b = wheel[idxB].color;

      data.tint.topLeft = a;
      data.tint.topRight = b;
      data.tint.bottomLeft = b;
      data.tint.bottomRight = a;

      reverse ? i -= 0.5 : i += 0.5;
      return data;
    }

    if (useComplementary) {
      /*  A) Perfect complementary hue (halfway around the wheel)  */
      /*  -------------------------------------------------------  */
      this.dynamic = this.add.dynamicBitmapText(
        0,
        0,
        "knighthawks",
        "               PHASER 4 COMPLEMENTARY COLORS"
      );
      this.dynamic.setDisplayCallback((data) => {
        const idxA = wrap(Math.floor(i), len);
        const idxB = wrap(idxA + (len >> 1), len); // +180° equivalent

        return setTint(data, idxA, idxB);
      });

    } else {
      /*  B) Mirror-end pairing (matches your original 359 - idx)  */
      /*  -------------------------------------------------------  */
      this.dynamic = this.add.dynamicBitmapText(
        0,
        0,
        "knighthawks",
        "               PHASER 4 PAIRING COLORS"
      );
      this.dynamic.setDisplayCallback((data) => {
        const idxA = wrap(Math.floor(i), len);
        const idxB = wrap(len - 1 - idxA, len); // mirror of idxA within range

        return setTint(data, idxA, idxB);
      });
    }


    this.dynamic.setScale(4);

    this.tweens.add({
      targets: this.dynamic,
      duration: 4000,
      y: 175 * 4,
      ease: "Sine.easeInOut",
      repeat: -1,
      yoyo: true
    });

    const probotector = this.add.sprite(1280, 800, "contra").setOrigin(1).setScale(4);

    // Enable the Phaser 4 filter system and add a hue-shifting color matrix
    probotector.enableFilters();
    const colorMatrixFx = probotector.filters.internal.addColorMatrix();

    const from = reverse ? 360 : 0;
    const to = reverse ? 0 : 360;

    this.tweens.addCounter({
      from: from,
      to: to,
      duration: 3000,
      repeat: -1,
      onUpdate: (tween) => {
        colorMatrixFx.colorMatrix.hue(tween.getValue());
      }
    });
  }

  update(time, delta) {
    this.dynamic.scrollX += 0.15 * delta;

    if (this.dynamic.scrollX > 1300) {
      this.dynamic.scrollX = 0;
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  pixelArt: true,
  width: 1280,
  height: 800,
  scene: Example,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Initialize settings and start the game
initializeSettings();
setupSettingsMenu();
window.currentGame = new Phaser.Game(config);
