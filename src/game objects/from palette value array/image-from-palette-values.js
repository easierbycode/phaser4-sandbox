class ImageFromPaletteValues extends Phaser.Scene
{
    create ()
    {
        this.selectedSprite = null;
        this.osdMenu = null;

        const pixelWidth = 6;
        const pixelHeight = 6;
        const palette = {
            0: '#282210',
            1: '#f8f4e8',
            2: '#c7a02b',
            3: '#d8b448',
            4: '#80671a',
            5: '#ecd180',
            6: '#30270c',
            7: '#e0bf5c',
            8: '#d0ab3a',
            9: '#f2db94',
            A: '#f6e4ac',
            B: '#907420',
            C: '#e8c868',
            D: '#aa8a28',
            E: '#faeab8',
            F: '#d4b350'
        };

        const createFromPalette = (key, data) =>
        {
            const width = data[0].length * pixelWidth;
            const height = data.length * pixelHeight;
            const canvasTexture = this.textures.createCanvas(key, width, height);

            if (!canvasTexture)
            {
                return null;
            }

            const ctx = canvasTexture.context;

            ctx.clearRect(0, 0, width, height);

            data.forEach((row, y) =>
            {
                for (let x = 0; x < row.length; x++)
                {
                    const value = row[x];

                    if (value === '.')
                    {
                        continue;
                    }

                    const color = palette[value];

                    if (!color)
                    {
                        continue;
                    }

                    ctx.fillStyle = color;
                    ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
                }
            });

            canvasTexture.refresh();

            return canvasTexture;
        };

        const chick = [
            '...55.......',
            '.....5......',
            '...7888887..',
            '..788888887.',
            '..888088808.',
            '..888886666.',
            '..8888644444',
            '..8888645555',
            '888888644444',
            '88788776555.',
            '78788788876.',
            '56655677776.',
            '456777777654',
            '.4........4.'
        ];

        createFromPalette('chick', chick);

        const burd = [
            '..E.............',
            '.DEEEEEEDDD.....',
            '..EEEEEEDDD.....',
            '..EE00EE77778666',
            '..EEEEEE77777666',
            '..EEEE7777777666',
            '..EEEE7655567666',
            'EEEEEE7777757666',
            'EEEEEEDD555.7666',
            '..DEEEEEDDD.....',
            '..EEEEEEDDD.....',
            '.7EEEEEEDDD.6...',
            '.77EEEEEDDD66...',
            '..77......66....'
        ];

        createFromPalette('burd', burd);

        const alien = [
            '....44........',
            '....44........',
            '......5.......',
            '......5.......',
            '....ABBBBA....',
            '...ABBBBBBA...',
            '..ABB8228BBA..',
            '..BB882288BB..',
            '.ABB885588BBA.',
            'BBBB885588BBBB',
            'BBBB788887BBBB',
            '.ABBB7777BBBA.',
            '.ABBBBBBBBBBA.',
            '.AABBBBBBBBAA.',
            '.AAAAAAAAAAAA.',
            '.5AAAAAAAAAA5.'
        ];

        createFromPalette('alien', alien);

        const ufo = [
            '....DDDDDDDD....',
            '...DDEEDDDDDD...',
            '..DDDEEDDDDDDD..',
            '..DDDDDDDDDDDD..',
            '..DDDD5555DDDD..',
            '..DDD555555DDD..',
            '..DDD555555DDD..',
            '..DDD555555DDD..',
            '..334244333333..',
            '.33344443333333.',
            '3333444433333333',
            '....5...5..5....',
            '...5....5...5...',
            '.66....66....66.',
            '.66....66....66.'
        ];

        createFromPalette('ufo', ufo);

        const star = [
            '.....828.....',
            '....72227....',
            '....82228....',
            '...7222227...',
            '2222222222222',
            '8222222222228',
            '.72222222227.',
            '..787777787..',
            '..877777778..',
            '.78778887787.',
            '.27887.78872.',
            '.787.....787.'
        ];

        createFromPalette('star', star);

        const ship = [
            '.....DEEEEEED...',
            '.....EEEEEFFE...',
            '.....EEEDDFFE...',
            '334..EEDDDDEE...',
            '3333.EEDDDDEE...',
            '33333EEDDDDEE...',
            '.FF2222222222F..',
            '.F222222222222F.',
            '.22222222222222F',
            '4443322222222222',
            '44433FFFFFFFFFFF',
            '.111FFFFFFFFFFF.',
            '.11FFFFFFFFFFF..',
            '.1FFFFFFFFFF1...',
            '...3333.........',
            '...333..........'
        ];

        createFromPalette('ship', ship);

        const cat = [
            '....443...443.',
            '...4433..4433.',
            '..44333.48333.',
            '88888888244444',
            '44444444433333',
            '44444444433333',
            '44044404433333',
            '44488844433333',
            '44400044433333',
            '44F202F4433333',
            '44202024433333',
            '44F222F4433333',
            '44444444433333',
            '4433...4433.33',
            '4433...4433.33'
        ];

        createFromPalette('cat', cat);

        const joypad = [
            '........65....5.',
            '.......5..5..5..',
            '.......5...55...',
            '.......5........',
            '.51FFFFFFFFFF15.',
            '51FFFFFFFFEEFF15',
            '1FF55FFFFFEEFFF1',
            'FF5555FFFFFFF33F',
            'FF0000FFAAFFF33F',
            'FF1001FFAAFFFFFF',
            'FFF11FFFFFF88FFF',
            '2FFFFF2222F88FF2',
            '1222221111222221',
            '11FFF111111FFF11',
            '.1FFF1....1FFF1.',
            '..111......111..'
        ];

        createFromPalette('joypad', joypad);

        const joystick = [
            '..............',
            '....533335....',
            '....348333....',
            '....344333....',
            '....333533....',
            '....533335....',
            '......55......',
            '......33......',
            '......33......',
            '......55......',
            '....551155....',
            '.343556655343.',
            '61111111111116',
            '50000000000005',
            '50000000000005',
            '55555555555555',
            '.555......555.'
        ];

        createFromPalette('joystick', joystick);

        const addSelectableSprite = (x, y, key) =>
        {
            const sprite = this.add.image(x, y, key).setOrigin(0, 1);

            sprite.setInteractive({ useHandCursor: true });

            sprite.on('pointerdown', () =>
            {
                this.showOsdMenu(sprite);
            });

            return sprite;
        };

        addSelectableSprite(150, 200, 'chick');
        addSelectableSprite(350, 200, 'burd');
        addSelectableSprite(550, 200, 'alien');

        addSelectableSprite(150, 350, 'ufo');
        addSelectableSprite(350, 350, 'star');
        addSelectableSprite(550, 350, 'ship');

        addSelectableSprite(150, 500, 'cat');
        addSelectableSprite(350, 500, 'joystick');
        addSelectableSprite(550, 500, 'joypad');

        this.input.on('pointerdown', (pointer, gameObjects) =>
        {
            if (gameObjects.length === 0)
            {
                this.hideOsdMenu();
            }
        });
    }

    hideOsdMenu ()
    {
        if (this.osdMenu)
        {
            this.osdMenu.destroy(true);
            this.osdMenu = null;
        }
    }

    showOsdMenu (sprite)
    {
        this.hideOsdMenu();

        this.selectedSprite = sprite;

        const menuWidth = 172;
        const menuHeight = 42;
        const menuX = Phaser.Math.Clamp(sprite.x + (sprite.displayWidth / 2), menuWidth / 2 + 12, 800 - menuWidth / 2 - 12);
        const menuY = Phaser.Math.Clamp(sprite.y - sprite.displayHeight - 18, menuHeight / 2 + 12, 600 - menuHeight / 2 - 12);

        const container = this.add.container(menuX, menuY);
        container.setDepth(10);

        const panel = this.add.rectangle(0, 0, menuWidth, menuHeight, 0x101010, 0.9)
            .setStrokeStyle(2, 0xf8f4e8, 1);

        container.add(panel);

        const createButton = (x, label, callback) =>
        {
            const button = this.add.rectangle(x, 0, 46, 28, 0x2a2a2a, 1)
                .setStrokeStyle(1, 0x8a8a8a, 1)
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(x, 0, label, {
                fontFamily: 'Arial',
                fontSize: 14,
                color: '#ffffff'
            }).setOrigin(0.5);

            button.on('pointerdown', callback);

            container.add([ button, text ]);
        };

        createButton(-56, '⬇', () =>
        {
            const link = document.createElement('a');
            link.download = `${sprite.texture.key}.png`;
            link.href = sprite.texture.getSourceImage().toDataURL('image/png');
            link.click();
        });

        createButton(0, '@2x', () =>
        {
            sprite.setScale(2);
            this.showOsdMenu(sprite);
        });

        createButton(56, '@3x', () =>
        {
            sprite.setScale(3);
            this.showOsdMenu(sprite);
        });

        this.osdMenu = container;

    }
}

const config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: ImageFromPaletteValues
};

const game = new Phaser.Game(config);
