// Written for Phaser 4.0.0-rc5
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let allSprites = [];
let uiText;
let failedListText;
let spriteScale = 2.0;
let cameraZoom = 1.0;
let keys;
const SCALE_INCREMENT = 0.1;
const PAN_SPEED = 5;

// --- Helper: Safely measures a block of solid color ---
function measureRenderedPixelBlock(startX, startY, renderer) {
    const originColor = renderer.snapshotPixel(startX, startY);
    // Cannot measure if the starting point is invalid (e.g., off-screen)
    if (!originColor) return { width: 0, height: 0 };

    let width = 1;
    let height = 1;
    const rendererWidth = renderer.width;
    const rendererHeight = renderer.height;

    // Scan right to find width, with boundary checks
    while (startX + width < rendererWidth) {
        const nextPixelColor = renderer.snapshotPixel(startX + width, startY);
        if (nextPixelColor && nextPixelColor.r === originColor.r && nextPixelColor.g === originColor.g && nextPixelColor.b === originColor.b) {
            width++;
        } else {
            break;
        }
    }

    // Scan down to find height, with boundary checks
    while (startY + height < rendererHeight) {
        const nextPixelColor = renderer.snapshotPixel(startX, startY + height);
        if (nextPixelColor && nextPixelColor.r === originColor.r && nextPixelColor.g === originColor.g && nextPixelColor.b === originColor.b) {
            height++;
        } else {
            break;
        }
    }

    return { width, height };
}


function preload() {
    this.load.atlas('game_asset', 'https://assets.codepen.io/11817390/evil_invaders_asset.png', 'https://assets.codepen.io/11817390/evil_invaders_asset.json');
}

function create() {
    const texture = this.textures.get('game_asset');
    const frames = texture.getFrameNames();

    // --- UI Setup ---
    uiText = this.add.text(10, 10, '', {
        fontSize: '16px',
        fill: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.8)'
    }).setScrollFactor(0).setDepth(100);

    failedListText = this.add.text(10, 120, 'Press the "P" key to run the pixel check.', {
        fontSize: '14px',
        fill: '#aaccff',
        backgroundColor: 'rgba(0,0,0,0.8)',
        wordWrap: { width: 780 }
    }).setScrollFactor(0).setDepth(100);

    // --- Sprite Grid & World Bounds ---
    const startX = 60;
    const startY = 150;
    const padding = 80;
    const columns = 6;
    let worldWidth = 0;
    let worldHeight = 0;

    frames.forEach((frameName, index) => {
        if (frameName === '-1') return;
        const i = index % columns;
        const j = Math.floor(index / columns);
        const spriteX = startX + i * padding;
        const spriteY = startY + j * 100;

        const sprite = this.add.sprite(spriteX, spriteY, 'game_asset', frameName);
        sprite.setTint(0xaaaaff); // Initial neutral tint
        allSprites.push(sprite);

        worldWidth = Math.max(worldWidth, spriteX + sprite.width * 4); // Add buffer
        worldHeight = Math.max(worldHeight, spriteY + sprite.height * 4);
    });

    // --- Input and Camera ---
    keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,P');
    this.cameras.main.setBackgroundColor('#1d1d1d');
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
}

function update() {
    // --- Handle Settings Input ---
    let settingsChanged = false;
    if (Phaser.Input.Keyboard.JustDown(keys.UP)) {
        spriteScale += SCALE_INCREMENT;
        settingsChanged = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.DOWN)) {
        spriteScale = Math.max(0.1, spriteScale - SCALE_INCREMENT);
        settingsChanged = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.RIGHT)) {
        cameraZoom += SCALE_INCREMENT;
        settingsChanged = true;
    }
    if (Phaser.Input.Keyboard.JustDown(keys.LEFT)) {
        cameraZoom = Math.max(0.1, cameraZoom - SCALE_INCREMENT);
        settingsChanged = true;
    }

    if (settingsChanged) {
        allSprites.forEach(sprite => {
            sprite.setScale(spriteScale);
            // Reset tint when settings change, indicating check is needed
            sprite.setTint(0xaaaaff); 
            failedListText.setText('Settings changed. Press "P" to re-run pixel check.');
            failedListText.setFill('#aaccff');
        });
        this.cameras.main.setZoom(cameraZoom);
    }
    
    // --- On-Demand Pixel Check ---
    if (Phaser.Input.Keyboard.JustDown(keys.P)) {
        performPixelPerfectCheck.call(this);
    }
    
    // --- Camera Panning ---
    if (keys.W.isDown) this.cameras.main.scrollY -= PAN_SPEED / cameraZoom;
    if (keys.S.isDown) this.cameras.main.scrollY += PAN_SPEED / cameraZoom;
    if (keys.A.isDown) this.cameras.main.scrollX -= PAN_SPEED / cameraZoom;
    if (keys.D.isDown) this.cameras.main.scrollX += PAN_SPEED / cameraZoom;

    // --- Update UI ---
    const totalScale = spriteScale * cameraZoom;
    uiText.setText([
        `Use Arrow Keys to change scale/zoom.`,
        `Use WASD Keys to pan the camera.`,
        `Sprite Scale: ${spriteScale.toFixed(2)}`,
        `Camera Zoom: ${cameraZoom.toFixed(2)}`,
        `Total Render Scale: ${totalScale.toFixed(2)}`
    ]);
}

function performPixelPerfectCheck() {
    console.log("Running Pixel Perfect Check...");
    const failedSprites = [];
    const renderer = this.game.renderer;

    allSprites.forEach(sprite => {
        // Skip check if sprite is fully outside the camera view
        if (!this.cameras.main.worldView.contains(sprite.x, sprite.y)) {
             sprite.setTint(0x555555); // Grey out off-screen sprites
             return;
        }
        
        let pass = false;
        const topLeft = sprite.getTopLeft();
        const x = Math.floor(topLeft.x);
        const y = Math.floor(topLeft.y);

        const firstBlock = measureRenderedPixelBlock(x, y, renderer);

        if (firstBlock.width > 0 && firstBlock.width === firstBlock.height) {
            const nextX = x + firstBlock.width;
            const nextY = y + firstBlock.height;

            // Check block to the right AND below for consistency
            const rightBlock = measureRenderedPixelBlock(nextX, y, renderer);
            const downBlock = measureRenderedPixelBlock(x, nextY, renderer);

            if (rightBlock.width === firstBlock.width && rightBlock.height === firstBlock.height &&
                downBlock.width === firstBlock.width && downBlock.height === firstBlock.height) {
                pass = true;
            }
        }
        
        if (pass) {
            sprite.setTint(0x00ff00); // Green
        } else {
            sprite.setTint(0xff0000); // Red
            failedSprites.push(sprite.frame.name);
        }
    });

    if (failedSprites.length > 0) {
        failedListText.setText(`FAILING SPRITES (Uneven Pixel Blocks):\n${failedSprites.join(', ')}`);
        failedListText.setFill('#ff9999');
    } else {
        failedListText.setText('All visible sprites passed the pixel-perfect check!');
        failedListText.setFill('#99ff99');
    }
}