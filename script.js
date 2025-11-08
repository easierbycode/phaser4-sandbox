
import Phaser from "https://esm.sh/phaser@4.0.0-rc.5";


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

    // Specify color pairing method in URL query string
    // e.g., ?complementary = 1
    const useComplementary = new URL(window.location.href).searchParams.get("complementary") == "1";
    // Specify color iteration direction in URL query string
    // e.g., ?reverse       = 1
    const reverse = new URL(window.location.href).searchParams.get("reverse") == "1";
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

    this.add.image(1280, 800, "contra").setOrigin(1).setScale(4);
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

const game = new Phaser.Game(config);