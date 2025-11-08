
import Phaser from 'https://esm.sh/phaser@4.0.0-rc.5';
// Import PapaParse (ES module build)
import Papa from "https://esm.sh/papaparse@5.4.1";
// Import LokiJS (latest stable version)
import loki from "https://esm.sh/lokijs@1.5.12";


class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {}

    create() {
        var csvString = `name,hp,mp
Rex,100,20
Alice,300,40`;

        var csvTable = Papa.parse(csvString, {
            dynamicTyping: true,
            header: true
        }).data;

        // Create the database
        var db = new loki();

        // Create a collection
        var children = db.addCollection('children');

        // insert csv-table
        children.insert(csvTable);

        var result = children.chain().data();
        console.log(result);
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