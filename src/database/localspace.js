
import Phaser from 'https://esm.sh/phaser@4.0.0-rc.5';
import localspace from 'https://esm.sh/localspace';


class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {}

    async create() {
        const data = [
            { name: 'Rex', hp: 100, mp: 20 },
            { name: 'Alice', hp: 300, mp: 40 }
        ];

        await localspace.setItems(
            data.map(item => ({ key: item.name, value: item }))
        );

        const result = await localspace.getItems(data.map(item => item.name));

        this.add.text(10, 10, 'Data retrieved from localspace:', { font: '16px Courier', fill: '#ffffff' });
        this.add.text(10, 30, JSON.stringify(result, null, 2), { font: '16px Courier', fill: '#ffffff' });
    }

    update() {}
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
    scene: Demo
};

var game = new Phaser.Game(config);
