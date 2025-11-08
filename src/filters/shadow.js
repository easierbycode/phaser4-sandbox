class Example extends Phaser.Scene {
    preload() {
        this.load.setBaseURL("https://assets.codepen.io/11817390");
        this.load.image('player', 'g.png');
    }

    create() {

        const playerImg1 = this.add.image(this.scale.width / 2, this.scale.height / 2 - 50, 'player').setScale(8);
        playerImg1.setInteractive();
        window.fxShadow = playerImg1.enableFilters().filters.external.addShadow(3, -3, 0.006, 0.5, 0x333333, 8);

        this.add.tween({
            targets: playerImg1,
            scale: 8.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        this.add.tween({
            targets: fxShadow,
            x: 5,
            y: -5,
            duration: 800,
            yoyo: true,
            repeat: -1
        })

    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ecf0f1',
    parent: 'phaser-example',
    scene: Example,
    pixelArt: true
};

const game = new Phaser.Game(config);