function preload() {
    this.load.path = "https://assets.codepen.io/11817390/";
    this.load.image("spark", "green.png");
    this.load.aseprite("inner-spinner", "inner-spinner.png", "inner-spinner.json");
    this.load.aseprite("max-headroom", "max-headroom.png", "max-headroom.json");
    this.load.aseprite("green-pulse", "green-pulse.png", "green-pulse.json");
}

function create() {
    // 0,0 becomes center of screen
    this.cameras.main.centerOn(0, 0);

    this.anims.createFromAseprite("inner-spinner");
    this.anims.createFromAseprite("max-headroom");
    this.anims.createFromAseprite("green-pulse");

    const emitCircle = new Phaser.Geom.Circle(0, 0, 350);
    const centerX = emitCircle.x;
    const centerY = emitCircle.y;

    const sprite4 = this.add.sprite(centerX, centerY, null).play({
        key: 'default',
        repeat: -1,
        frameRate: 6,
        yoyo: true
    });
    sprite4.setScale(10);
    sprite4.setBlendMode(Phaser.BlendModes.BLEND);
    sprite4.setAlpha(0.95);

    const sprite3 = this.add.sprite(centerX, centerY, null).play({
        key: 'green-pulse\\default',
        repeat: -1,
        frameRate: 60
    });
    sprite3.setScale(10);
    sprite3.setBlendMode(Phaser.BlendModes.BLEND);
    sprite3.setAlpha(0.65);

    /* ------------------------------------------------------------------
     * Particle emitter (Phaser 4 syntax)
     * ------------------------------------------------------------------*/
    const moveToCircle = new Phaser.Geom.Circle(-200, 0, 200);
    const moveToPoints = moveToCircle.getPoints(600);
    let moveToPoint = moveToPoints[0]; // updated every emission
    
    const emitter1 = this.add.particles(0, 0, "spark", {
        alpha: { start: 1, end: 0.65, ease: "Cubic.easeInOut" },
        blendMode: "SCREEN",
        onEmit: () => {
            moveToPoint = Phaser.Math.RND.pick(moveToPoints);
        },
        emitZone: { type: "random", source: emitCircle },

        frequency: 1000 / 60,
        lifespan: { min: 1000, max: 3000 },
        moveToX: () => moveToPoint.x,
        moveToY: () => moveToPoint.y,
        quantity: 10,
        scale: { start: 0.25, end: 0, ease: "Cubic.easeIn" }
    });

    const emitter2 = this.add.particles(0, 0, "spark", {
        alpha: { start: 0, end: 0.2, ease: "Cubic.easeInOut" },
        blendMode: "SCREEN",
        onEmit: () => {
            moveToPoint = Phaser.Math.RND.pick(moveToPoints);
        },
        emitZone: { source: emitCircle },
        frequency: 1000 / 60,
        lifespan: { min: 1000, max: 5000 },
        moveToX: () => moveToPoint.x,
        moveToY: () => moveToPoint.y,
        quantity: 10,
        scale: { start: 1, end: 0, ease: "Cubic.easeIn" }
    });

    // Max Headroom talking head
    const sprite2 = this.add.sprite(centerX, centerY, null).play({
        key: 'talk',
        repeat: -1,
        frameRate: 6,
        repeatDelay: 2500
    });
    sprite2.setScale(4);
    sprite2.setBlendMode(Phaser.BlendModes.MULTIPLY);
}


new Phaser.Game({
    parent: "phaser-example",
    width: 360,
    height: 640,
    scale: {
        mode: Phaser.Scale.EXPAND,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: { preload, create },

    transparent: true,
    autoRound: true,
    pixelArt: true,
    disableContextMenu: true
});