class Example extends Phaser.Scene
{
    noise;

    constructor ()
    {
        super();
    }

    create ()
    {
        // A fullscreen animated simplex noise field.
        // Scrolls horizontally, evolves in place with noiseFlow,
        // and is twisted by a warp pass for extra turbulence.
        this.noise = this.add.noisesimplex3d({
            noiseCells: [ 6, 6, 6 ],
            noiseIterations: 5,
            noiseWarpAmount: 0.6,
            noiseWarpIterations: 3,
            noiseColorStart: 0x0a1446,
            noiseColorEnd: 0xff8844,
            noiseValueFactor: 0.5,
            noiseValueAdd: 0.5,
            noiseValuePower: 1.2,
            noiseSeed: [ 1, 2, 3 ]
        }, 0, 0, this.scale.width, this.scale.height).setOrigin(0, 0);

        // Caption.
        this.add.text(16, 16, 'NoiseSimplex3D', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });

        this.add.text(16, 52, 'scroll + flow + warp', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffd9aa',
            stroke: '#000000',
            strokeThickness: 3
        });

        // Click to re-seed the pattern.
        this.input.on('pointerdown', () =>
        {
            this.noise.randomizeNoiseSeed();
        });
    }

    update (time)
    {
        // Scroll the pattern across X over time.
        this.noise.noiseOffset[0] = time / 6000;
        this.noise.noiseOffset[1] = Math.sin(time / 12000) * 0.25;

        // Evolve the noise field in place. noiseFlow is periodic on 2*PI,
        // so this loops seamlessly without wandering to large numbers.
        this.noise.noiseFlow = (time / 4000) % (Math.PI * 2);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: Example
};

const game = new Phaser.Game(config);
