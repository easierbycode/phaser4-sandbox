class Example extends Phaser.Scene {
    constructor() {
        super('Example');
    }

    preload() {
        this.load.setBaseURL("https://assets.codepen.io/11817390");
        this.load.image('rain', 'thalion-rain.png');
        this.load.image('touhou', 'touhou2.png');
        this.load.image('heart', 'heart.png');
        this.load.image('logo', 'phaser-wire-300.png');
    }

    create() {
        this.tile = this.add.tileSprite(400, 400, 800, 800, 'rain');

        this.tile2 = this.add.tileSprite(0, 16, 800, 372, 'logo').setOrigin(0, 0).setAlpha(0.25);

        this.tile3 = this.add.tileSprite(100, 400, 128, 800, 'heart');

        this.add.image(750, 800, 'touhou').setOrigin(1, 1);
    }

    update(time) {
        this.tile.tilePositionX += 2;
        this.tile.tileRotation = Math.sin(time / 2500);

        this.tile2.tilePositionX += 4;

        this.tile3.tilePositionY += 2;
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 800,
    height: 800,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: Example
})