// Written for Phaser 4.0.0-rc.6

class ScrollingBackground {
  constructor(scene, key, velocityY) {
    this.scene = scene;
    this.key = key;
    this.velocityY = velocityY;

    this.layers = this.scene.add.group();

    this.createLayers();
  }

  createLayers() {
    for (var i = 0; i < 2; i++) {
      var layer = this.scene.add.sprite(0, 0, this.key);
      layer.y = (layer.displayHeight * i);
      var flipX = Math.random() > 0.5 ? -1 : 1;
      var flipY = Math.random() > 0.5 ? -1 : 1;
      layer.setScale(flipX * 2, flipY * 2);
      layer.setDepth(-5 - (i - 1));
      this.scene.physics.world.enableBody(layer, 0);
      layer.body.velocity.y = this.velocityY;

      layer.setOrigin(0);
      layer.displayWidth = this.scene.scale.width + 200;  //window.innerWidth;
      layer.scaleY = layer.scaleX;

      layer.setBlendMode(3);

      this.layers.add(layer);
    }
  }

  update() {
    if (this.layers.getChildren()[0].y > 0) {
      for (var i = 0; i < this.layers.getChildren().length; i++) {
        var layer = this.layers.getChildren()[i];
        layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
      }
    }
  }
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'title-scene' });
  }

  preload() {
    this.load.script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js');

    this.load.image(
      'bg1',
      'assets/bg-1.png'
  );
  this.load.image(
      'bg2',
      'assets/bg-2.png'
  );
  this.load.image(
      'bg3',
      'assets/bg-3.png'
  );
  this.load.image(
      'bg4',
      'assets/bg-4.png'
  );
  this.load.image(
      'bg5',
      'assets/bg-5.png'
  );

  this.load.image(
    'laser1',
    'assets/lasers-bg1.png'
);
this.load.image(
    'laser2',
    'assets/lasers-bg2.png'
);
this.load.image(
    'laser3',
    'assets/lasers-bg3.png'
);
this.load.image(
    'laser4',
    'assets/lasers-bg4.png'
);

  this.load.image(
      'lights1-yellow-1',
      'assets/lights1-yellow-1.png'
  );
  this.load.image(
      'lights1-yellow-2',
      'assets/lights1-yellow-2.png'
  );
  this.load.image(
      'lights1-yellow-3',
      'assets/lights1-yellow-3.png'
  );
  this.load.image(
      'lights1-yellow-4',
      'assets/lights1-yellow-4.png'
  );
  this.load.image(
      'lights2-blue-1',
      'assets/lights2-blue-1.png'
  );
  this.load.image(
      'lights2-blue-2',
      'assets/lights2-blue-2.png'
  );
  this.load.image(
      'lights2-blue-3',
      'assets/lights2-blue-3.png'
  );
  this.load.image(
      'lights2-blue-4',
      'assets/lights2-blue-4.png'
  );
  this.load.image(
      'lights3-green-1',
      'assets/lights3-green-1.png'
  );
  this.load.image(
      'lights3-green-2',
      'assets/lights3-green-2.png'
  );
  this.load.image(
      'lights3-green-3',
      'assets/lights3-green-3.png'
  );
  this.load.image(
      'lights3-green-4',
      'assets/lights3-green-4.png'
  );
  this.load.image(
      'lights4-purple-1',
      'assets/lights4-purple-1.png'
  );
  this.load.image(
      'lights4-purple-2',
      'assets/lights4-purple-2.png'
  );
  this.load.image(
      'lights4-purple-3',
      'assets/lights4-purple-3.png'
  );
  this.load.image(
      'lights4-purple-4',
      'assets/lights4-purple-4.png'
  );

    // Load the dancing bear spritesheet. 18x28 frames
    // (Adjust the frameWidth/frameHeight if needed)
    this.load.spritesheet('dancing-bear', 'assets/dancing-bear.png', {
      frameWidth: 18,
      frameHeight: 28
    });

    // Additional star backgrounds for "lasers"
    this.load.image('starBg0', 'assets/star-bg-0.png');
    this.load.image('starBg1', 'assets/star-bg-1.png');

    this.load.spritesheet("music-notes", "assets/gold-music-notes-v3.png", {
      frameWidth: 53,
      frameHeight: 65
    });

    // Load a spark or flare image/atlas for fireworks
    // Here, we'll load an atlas called 'flares' that Phaser uses for particles
    // Adjust if you have your own spark asset.
    this.load.atlas('flares', 'assets/flares.png', 'assets/flares.json');
  }

  create() {
    // ---------- Background Setup ----------
    // Implementing 'bg' from PlayScene
    let bg = this.add.sprite(0, 0, 'bg1');
    bg.anims.create({
      frameRate: 1,
      frames: [
        {key: 'bg1'},
        {key: 'bg2'},
        {key: 'bg3'},
        {key: 'bg4'},
        {key: 'bg5'}
      ],
      key: 'default',
      repeat: -1
    });
    bg.setOrigin(0);
    // Let the background keep its original size so it can go off screen
    bg.play('default');

    // Set camera bounds to match the background’s full size
    this.cameras.main.setBounds(0, 0, bg.width, bg.height);


    // Laser sprite
    let lasers = this.add.sprite(0, 0, 'laser1');
    lasers.anims.create({
      key: 'default',
      frames: [
        { key: 'laser1' },
        { key: 'laser2' },
        { key: 'laser3' },
        { key: 'laser4' }
      ],
      frameRate: 8,
      repeat: -1,
      yoyo: true
    });
    lasers.setOrigin(0);
    // lasers.displayWidth = this.scale.width;
    lasers.displayHeight = this.scale.height;
    // lasers.scaleY = lasers.scaleX;
    lasers.scaleX = lasers.scaleY;

    lasers.setBlendMode(3);

    lasers.setDepth(1);
    lasers.play('default');

    // Implementing 'lights' from PlayScene
    let lights = this.add.sprite(this.scale.width / 2, -10, 'lights1-yellow-1');
    lights.anims.create({
      frameRate: 7,
      frames: [
        {key: 'lights1-yellow-1'},
        {key: 'lights1-yellow-2'},
        {key: 'lights1-yellow-3'},
        {key: 'lights1-yellow-4'},
        {key: 'lights1-yellow-3'},
        {key: 'lights1-yellow-2'},
        {key: 'lights1-yellow-1'},
        {key: 'lights2-blue-1'},
        {key: 'lights2-blue-2'},
        {key: 'lights2-blue-3'},
        {key: 'lights2-blue-4'},
        {key: 'lights2-blue-3'},
        {key: 'lights2-blue-2'},
        {key: 'lights2-blue-1'},
        {key: 'lights3-green-1'},
        {key: 'lights3-green-2'},
        {key: 'lights3-green-3'},
        {key: 'lights3-green-4'},
        {key: 'lights3-green-3'},
        {key: 'lights3-green-2'},
        {key: 'lights3-green-1'},
        {key: 'lights4-purple-1'},
        {key: 'lights4-purple-2'},
        {key: 'lights4-purple-3'},
        {key: 'lights4-purple-4'},
        {key: 'lights4-purple-3'},
        {key: 'lights4-purple-2'},
        {key: 'lights4-purple-1'}
      ],
      repeat: -1,
      key: 'default'
    });
    lights.setOrigin(0.5, 0);
    lights.displayWidth = this.scale.width * 0.55;
    lights.setBlendMode(1);
    lights.play('default');

    // Keep the original background color line
    this.cameras.main.setBackgroundColor('#222244'); // Darkish background

    // Create star scrolling backgrounds
    this.backgrounds = [];
    for (var i = 0; i < 3; i++) {
      var keys = ["starBg0", "starBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var b = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(b);
    }

    // ---------- Bear Animation Setup ----------
    this.anims.create({
      key: 'bearDance',
      frames: this.anims.generateFrameNumbers('dancing-bear', { start: 0, end: 5 }),
      frameRate: 15,
      repeat: -1
    });

    // Create an animation for music notes
    this.anims.create({
      key: 'titleMusicNotes',
      frames: this.anims.generateFrameNumbers('music-notes', { start: 0, end: 7 }),
      frameRate: 17,
      repeat: -1
    });

    // Add the monkey sprite in the center-ish
    this.monkey = this.add.sprite(120, 120, 'dancing-bear').play('bearDance');
    this.monkey.setOrigin(0.5);
    // Scale up if needed because frame is 18x28, quite small
    this.monkey.setScale(4);
    this.cameras.main.startFollow(this.monkey);

    // ---------- Complex Dancing Bear Timeline (using GSAP) ----------
    // Use TimelineMax to sequence various motions
    this.danceTimeline = new TimelineMax({ repeat: -1, repeatDelay: 0.5, yoyo: false });
    this.danceTimeline
      // Move right by 100px
      .to(this.monkey, 1, { x: "+=100", ease: Power1.easeInOut })
      // Then move left by 200px (100 px left of original)
      .to(this.monkey, 1, { x: "-=75", ease: Power1.easeInOut })
      // Small jump up + scale to simulate forward movement in Z
      .to(this.monkey, 0.5, { y: "-=60", scale: 4.5, ease: Bounce.easeOut })
      // Land back down
      .to(this.monkey, 0.5, { y: "+=60", scale: 4.0, ease: Bounce.easeIn })
      .call(() => {
        this.spawnMusicNotes();
      }, null, this, "+=0.2")
      // Quick rotation spin
      .to(this.monkey, 0.8, { rotation: Phaser.Math.DegToRad(360), ease: Back.easeInOut.config(1.7) }, "+=0.5")
      // Reset rotation to 0
      .to(this.monkey, 0.5, { rotation: 0, ease: Power0.easeNone })
      // Random horizontal shift again
      .to(this.monkey, 1, { x: "+=150", ease: Sine.easeInOut })
      .to(this.monkey, 1, { x: "-=150", ease: Sine.easeInOut })
      // Shake effect or smaller repeated moves
      .to(this.monkey, 0.2, { x: "+=10", ease: Power1.easeInOut, repeat: 5, yoyo: true })
      .to(this.monkey, 0.75, { scaleX: -this.monkey.scaleX, ease: Power2.easeInOut, repeat: 1, yoyo: true })
      .to(this.monkey, 1, { alpha: 0, ease: Power1.easeInOut })
      ;
    this.danceTimeline.eventCallback('onRepeat', () => {
      this.monkey.alpha = 1;
    });

    // ---------- Fireworks Particle Emitters ----------
    // Create an emitter directly
    this.fireworksEmitter = this.add.particles(0, 0, 'flares', {
      frame: [ 'blue', 'purple', 'white' ], // frames from 'flares' atlas
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      lifespan: 1000,
      scale: { start: 1, end: 0 },
      emitting: false,
      blendMode: 'ADD'
    });

    // Periodic fireworks
    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => {
        // Random explosion location in the upper portion
        const x = Phaser.Math.Between(0, this.scale.width);
        const y = Phaser.Math.Between(0, this.scale.height * 0.5);
        const quantity = Phaser.Math.Between(10, 20);
        this.fireworksEmitter.emitParticle(quantity, x, y);
      }
    });

    // ---------- Title Text with Post FX ----------
    this.titleBack = this.add.sprite(this.scale.width * 0.5, this.scale.height * 0.2, 'flares', 'white')
      .setScale(6)
      .setBlendMode(2)
      .setAlpha(0.6)
      .setDepth(0);

    this.titleText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.2, "SHOOTY\nBEARS", {
      fontFamily: "Arial Black",
      fontSize: "48px",
      color: "#ffffff"
    }).setOrigin(0.5)
      .setDepth(1);

    // Add bloom effect (if supported by your Phaser build)
    // Bloom parameters: (intensity, offsetX, offsetY, blurStrength, strength)
    // You might need to check the exact method signature in your version of Phaser
    if (this.titleText.postFX && this.titleText.postFX.addBloom) {
      this.titleText.postFX.addBloom(0.005, 4, 4, 1.2, 1);
    }

    // Add barrel effect (if supported). The amount typically is around 1 for no distortion
    if (this.titleText.postFX && this.titleText.postFX.addBarrel) {
      this.barrelFX = this.titleText.postFX.addBarrel(1.0);
    }

    // Scale tween for the title (pulsing effect)
    this.tweens.add({
      targets: this.titleText,
      scale: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // If we want to animate the barrel effect, let's do a tween on barrelFX.amount
    // Not all Phaser builds have dynamic property detection for postFX, so
    // your mileage may vary. We'll try:
    if (this.barrelFX) {
      this.tweens.add({
        targets: this.barrelFX,
        duration: 2000,
        amount: 0.85,    // warp factor
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // ---------- Timed "Build a Bear" Fireworks ----------
    // This is a simple approach: create letters or a shape for "BUILD A BEAR"
    // We'll do a bigger, special explosion. We'll just do a timer callback here
    this.time.addEvent({
      delay: 10000, // every 10 seconds
      loop: true,
      callback: () => {
        this.spellBuildABear();
      }
    });


    this.input.on("pointerdown", (pointer) => {
      this.scale.startFullscreen();
    });
  }

  spellBuildABear() {
    // In a real scenario, you might create shaped particle zones for each letter.
    // For a quick hack, let's just do multiple small explosions in letter positions
    // forming "BUILD A BEAR" across the screen.
    const text = "BUILD A BEAR";
    const startX = 150;
    const startY = 200;
    const spacing = 40;

    // For each char, we do a small explosion near that 'x' position
    // This won't be a perfect outline, but gives a rough idea.
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      // Skip space
      if (char === ' ') {
        continue;
      }
      let x = startX + i * spacing;
      let y = startY + Phaser.Math.Between(-10, 10);
      // small explosion
      // this.fireworksEmitter.explode(15, x, y);
      if (this.monkey) {
        this.fireworksEmitter.explode(15, this.monkey.x, this.monkey.y);
      }
    }
  }

  update(time, delta) {
    // We can do real-time changes if needed, but the timeline/tweens are automatic
    if (this.backgrounds) {
      for (var i = 0; i < this.backgrounds.length; i++) {
        this.backgrounds[i].update();
      }
    }
  }

  spawnMusicNotes() {
    if (!this.monkey) return;

    // We'll spawn two music notes near the dancing bear's position.
    const xPos1 = this.monkey.x - 40;
    const xPos2 = this.monkey.x + 40;
    const yPos = this.monkey.y;

    // Create musicNotes sprite
    this.musicNotes = this.add.sprite(xPos1, yPos, 'music-notes');
    this.musicNotes.play('titleMusicNotes');
    this.musicNotes.setInteractive();

    // Apply random tint to musicNotes
    this.musicNotes.setTint(
      Phaser.Utils.Array.GetRandom([0x55eeff, 0x5403f700, 0xd627bc, 0xd4af37, 0xeeaa00, 0xeecc66, 0xfcdb06])
    );

    // Create musicNotes2 sprite
    this.musicNotes2 = this.add.sprite(xPos2, yPos, 'music-notes');
    this.musicNotes2.play('titleMusicNotes');
    this.musicNotes2.setInteractive();

    // Apply random tint to musicNotes2
    this.musicNotes2.setTint(
      Phaser.Utils.Array.GetRandom([0x55eeff, 0x5403f700, 0xd627bc, 0xd4af37, 0xeeaa00, 0xeecc66, 0xfcdb06])
    );

    // Helper function for pointerdown
    const handleClick = (sprite) => {
      // Increase score
      if (typeof PROPERTIES !== 'undefined') {
        PROPERTIES.score = (PROPERTIES.score || 0) + 1000;
      }
      // Particle explosion
      this.fireworksEmitter.emitParticle(20, sprite.x, sprite.y);
      // Tween out with a "SNES Mode7" style transform effect
      this.tweens.add({
        targets: sprite,
        scale: 2.2,
        angle: 360,
        duration: 900,
        ease: 'Back.easeOut',
        onComplete: () => {
          sprite.destroy();
        }
      });
    };

    // Assign pointerdown to both
    this.musicNotes.once('pointerdown', () => handleClick(this.musicNotes));
    this.musicNotes2.once('pointerdown', () => handleClick(this.musicNotes2));

    // Destroy automatically after 3 seconds if not clicked
    this.time.delayedCall(3000, () => {
      if (this.musicNotes && this.musicNotes.active) {
        this.musicNotes.destroy();
      }
      if (this.musicNotes2 && this.musicNotes2.active) {
        this.musicNotes2.destroy();
      }
    });
  }
}

var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 256,
  height: 480,
  physics: {
    default: "arcade",
    arcade: {
      debug: new URL(window.location.href).searchParams.get("debug") == "1",
    },
  },
  scene: [TitleScene],
  scale: {
    autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.ScaleModes.FIT,
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  fps: {
    target: 120,
    forceSetTimeOut: true,
  },
};

const game = new Phaser.Game(config);
