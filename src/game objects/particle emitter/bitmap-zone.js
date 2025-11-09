
class Example extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
        this.load.plugin('rexbitmapzoneplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbitmapzoneplugin.min.js', true);
        this.load.plugin('rexcanvasplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexcanvasplugin.min.js', true);
        this.load.atlas('flares', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/particles/flares/flares.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/particles/flares/flares.json');
        this.load.image('money', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/money.png');
    }

    create() {
        var canvasObject = this.add.rexCanvas(400, 300)
            .loadTexture('money')
            .setScale(10)
            .setVisible(false);

        var canvasZone = this.plugins.get('rexbitmapzoneplugin').add(canvasObject);

        var emitter = this.add.particles(400, 300, 'flares', {
            frame: { frames: ['green'] },
            blendMode: 'ADD',
            scale: { start: 0.1, end: 0.2 },
            quantity: 10,
            advance: 1000,
            speed: 8,
            gravityY: -20,
            emitZone: {
                type: 'random',
                source: canvasZone
            }
        })
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },  
    scene: Example
};

var game = new Phaser.Game(config);