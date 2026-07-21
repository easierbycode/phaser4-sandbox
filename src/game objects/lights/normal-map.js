class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setBaseURL('https://easierbycode.com/assets');

        // A diffuse + normal-map pair. Passing an array of two URLs to load.image
        // registers the second image as the texture's normal-map data source, so any
        // Game Object using this key can be lit per-pixel by the Light2D pipeline.
        //   [0] bg-flames            -> colour (diffuse)
        //   [1] bg-flames-normalmap  -> surface normals (RGB = XYZ)
        this.load.image('flames', [ 'bg-flames.png', 'bg-flames-normalmap.png' ]);
    }

    create ()
    {
        // Fill the canvas with the flames image and route it through Light2D.
        // Lights only affect Game Objects that call setLighting(true) AND have a
        // normal map, so the tint you see below is entirely driven by the normals.
        const flames = this.add.image(400, 300, 'flames').setLighting(true);
        flames.setDisplaySize(this.scale.width, this.scale.height);

        // Enable the lighting system and give the scene a dim base colour so the
        // moving lights read clearly against it.
        this.lights.enable();
        this.lights.setAmbientColor(0x202020);

        // A warm key light that follows the pointer - drag it across the surface
        // to watch the normal map catch the light ridge by ridge.
        this.mouseLight = this.lights.addLight(400, 300, 320, 0xffa040, 3);

        // Two coloured lights orbiting the scene for constant motion.
        this.orbitA = this.lights.addLight(0, 0, 260, 0x3366ff, 2.5);
        this.orbitB = this.lights.addLight(0, 0, 260, 0xff3388, 2.5);

        this.input.on('pointermove', (pointer) =>
        {
            this.mouseLight.x = pointer.x;
            this.mouseLight.y = pointer.y;
        });

        // Click to cycle the key light through a small palette.
        const colors = [ 0xffa040, 0xffffff, 0x00ffcc, 0xff2222, 0x66ff33 ];
        let current = 0;

        this.input.on('pointerdown', () =>
        {
            current = (current + 1) % colors.length;
            this.mouseLight.setColor(colors[current]);
        });

        // Captions.
        this.add.text(16, 16, 'Normal Map Lighting', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.add.text(16, 52, 'move the pointer to light the flames • click to change colour', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffd9aa',
            stroke: '#000000',
            strokeThickness: 3
        });
    }

    update (time)
    {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // Sweep the two coloured lights on opposite orbits.
        this.orbitA.x = cx + Math.cos(time / 900) * 320;
        this.orbitA.y = cy + Math.sin(time / 900) * 220;

        this.orbitB.x = cx + Math.cos(time / 1300 + Math.PI) * 300;
        this.orbitB.y = cy + Math.sin(time / 1300 + Math.PI) * 200;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: Example
};

const game = new Phaser.Game(config);
