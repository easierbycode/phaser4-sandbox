
import Phaser from 'https://esm.sh/phaser@4.0.0-rc.5';
// Import PapaParse (ES module build)
import Papa from "https://esm.sh/papaparse@5.4.1";
// Import localspace (modern storage library)
import localspace from "https://esm.sh/localspace@1.0.1";


class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {}

    async create() {
        var csvString = `name,hp,mp
Rex,100,20
Alice,300,40`;

        var csvTable = Papa.parse(csvString, {
            dynamicTyping: true,
            header: true
        }).data;

        // Create a localspace instance for game data
        const gameData = localspace.createInstance({
            name: 'gameData',
            storeName: 'characters'
        });

        // Store each character from CSV into localspace
        const items = csvTable.map((row, index) => ({
            key: `character:${index}`,
            value: row
        }));

        // Use batch operation for efficient storage
        await gameData.setItems(items);

        // Also store the full table for reference
        await gameData.setItem('allCharacters', csvTable);

        // Retrieve and display all stored characters
        const storedCharacters = await gameData.getItem('allCharacters');
        console.log('Stored characters:', storedCharacters);

        // Retrieve individual characters using batch get
        const keys = csvTable.map((_, index) => `character:${index}`);
        const individualResults = await gameData.getItems(keys);
        console.log('Individual character records:', individualResults);

        // Display on screen
        this.add.text(400, 200, 'CSV Data stored in localspace!', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(400, 280, 'Check console for stored data', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Display character info on screen
        let yPos = 350;
        for (const char of storedCharacters) {
            this.add.text(400, yPos, `${char.name}: HP=${char.hp}, MP=${char.mp}`, {
                fontFamily: 'Arial',
                fontSize: 16,
                color: '#00ff00'
            }).setOrigin(0.5);
            yPos += 30;
        }
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
