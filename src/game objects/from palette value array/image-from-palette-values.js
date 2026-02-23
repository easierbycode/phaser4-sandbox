class ImageFromPaletteValues extends Phaser.Scene
{
    create ()
    {
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

        this.palette = palette;
        this.basePixelWidth = pixelWidth;
        this.basePixelHeight = pixelHeight;
        this.spriteDataMap = {};
        this.spriteScales = {};
        this.selectedSprite = null;

        const createFromPalette = (key, data, pw, ph) =>
        {
            pw = pw || pixelWidth;
            ph = ph || pixelHeight;

            const width = data[0].length * pw;
            const height = data.length * ph;

            if (this.textures.exists(key))
            {
                this.textures.remove(key);
            }

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
                    ctx.fillRect(x * pw, y * ph, pw, ph);
                }
            });

            canvasTexture.refresh();

            return canvasTexture;
        };

        this.createFromPalette = createFromPalette;

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

        this.spriteDataMap['chick'] = chick;
        this.spriteDataMap['burd'] = burd;
        this.spriteDataMap['alien'] = alien;
        this.spriteDataMap['ufo'] = ufo;
        this.spriteDataMap['star'] = star;
        this.spriteDataMap['ship'] = ship;
        this.spriteDataMap['cat'] = cat;
        this.spriteDataMap['joypad'] = joypad;
        this.spriteDataMap['joystick'] = joystick;

        const spriteConfigs = [
            { key: 'chick', x: 150, y: 200 },
            { key: 'burd', x: 350, y: 200 },
            { key: 'alien', x: 550, y: 200 },
            { key: 'ufo', x: 150, y: 350 },
            { key: 'star', x: 350, y: 350 },
            { key: 'ship', x: 550, y: 350 },
            { key: 'cat', x: 150, y: 500 },
            { key: 'joystick', x: 350, y: 500 },
            { key: 'joypad', x: 550, y: 500 }
        ];

        spriteConfigs.forEach(cfg =>
        {
            createFromPalette(cfg.key, this.spriteDataMap[cfg.key]);

            const img = this.add.image(cfg.x, cfg.y, cfg.key).setOrigin(0, 1);
            img.setInteractive();
            img.setData('key', cfg.key);
            img.setData('baseX', cfg.x);
            img.setData('baseY', cfg.y);

            this.spriteScales[cfg.key] = 1;

            img.on('pointerdown', () =>
            {
                this.showOSD(img);
            });
        });

        this.createOSD();

        this.input.on('pointerdown', (pointer, gameObjects) =>
        {
            if (gameObjects.length === 0)
            {
                this.hideOSD();
            }
        });
    }

    createOSD ()
    {
        const osd = this.add.container(0, 0);
        osd.setDepth(1000);
        osd.setVisible(false);
        this.osd = osd;

        // Background panel
        const bg = this.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.93);
        bg.fillRoundedRect(0, 0, 164, 38, 8);
        bg.lineStyle(1, 0x667eea, 0.6);
        bg.strokeRoundedRect(0, 0, 164, 38, 8);
        osd.add(bg);

        // Download button background
        const dlBg = this.add.graphics();
        dlBg.fillStyle(0x667eea, 0.15);
        dlBg.fillRoundedRect(5, 5, 28, 28, 5);
        osd.add(dlBg);

        // Download icon
        const dlIcon = this.add.graphics();
        dlIcon.lineStyle(2, 0x667eea, 1);

        // Arrow shaft
        dlIcon.beginPath();
        dlIcon.moveTo(19, 10);
        dlIcon.lineTo(19, 22);
        dlIcon.strokePath();

        // Arrow head
        dlIcon.beginPath();
        dlIcon.moveTo(13, 18);
        dlIcon.lineTo(19, 24);
        dlIcon.lineTo(25, 18);
        dlIcon.strokePath();

        // Tray
        dlIcon.beginPath();
        dlIcon.moveTo(10, 26);
        dlIcon.lineTo(10, 29);
        dlIcon.lineTo(28, 29);
        dlIcon.lineTo(28, 26);
        dlIcon.strokePath();

        osd.add(dlIcon);

        // Download hit zone
        const dlZone = this.add.zone(19, 19, 28, 28).setInteractive({ useHandCursor: true });
        dlZone.on('pointerdown', () =>
        {
            if (this.selectedSprite)
            {
                this.downloadSprite(this.selectedSprite);
            }
        });
        dlZone.on('pointerover', () =>
        {
            dlBg.clear();
            dlBg.fillStyle(0x667eea, 0.35);
            dlBg.fillRoundedRect(5, 5, 28, 28, 5);
        });
        dlZone.on('pointerout', () =>
        {
            dlBg.clear();
            dlBg.fillStyle(0x667eea, 0.15);
            dlBg.fillRoundedRect(5, 5, 28, 28, 5);
        });
        osd.add(dlZone);

        // Divider line
        const divider = this.add.graphics();
        divider.lineStyle(1, 0x667eea, 0.3);
        divider.beginPath();
        divider.moveTo(38, 7);
        divider.lineTo(38, 31);
        divider.strokePath();
        osd.add(divider);

        // Scale toggle buttons: @1x, @2x, @3x
        this.scaleButtons = [];
        const scales = [1, 2, 3];

        scales.forEach((scale, i) =>
        {
            const bx = 44 + i * 40;
            const label = `@${scale}x`;

            const btnBg = this.add.graphics();
            btnBg.fillStyle(0x667eea, 0.0);
            btnBg.fillRoundedRect(bx, 5, 36, 28, 5);

            const txt = this.add.text(bx + 18, 19, label, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                color: '#8888aa',
                fontStyle: '',
                align: 'center'
            }).setOrigin(0.5, 0.5);

            const zone = this.add.zone(bx + 18, 19, 36, 28).setInteractive({ useHandCursor: true });

            zone.on('pointerdown', () =>
            {
                if (this.selectedSprite)
                {
                    this.setResolution(this.selectedSprite, scale);
                }
            });

            zone.on('pointerover', () =>
            {
                if (!txt.getData('active'))
                {
                    txt.setColor('#ccccee');
                    btnBg.clear();
                    btnBg.fillStyle(0x667eea, 0.1);
                    btnBg.fillRoundedRect(bx, 5, 36, 28, 5);
                }
            });

            zone.on('pointerout', () =>
            {
                if (!txt.getData('active'))
                {
                    txt.setColor('#8888aa');
                    btnBg.clear();
                    btnBg.fillStyle(0x667eea, 0.0);
                    btnBg.fillRoundedRect(bx, 5, 36, 28, 5);
                }
            });

            this.scaleButtons.push({ txt, btnBg, bx, scale });
            osd.add(btnBg);
            osd.add(txt);
            osd.add(zone);
        });
    }

    showOSD (sprite)
    {
        if (this.selectedSprite === sprite && this.osd.visible)
        {
            this.hideOSD();
            return;
        }

        this.selectedSprite = sprite;

        const key = sprite.getData('key');
        const currentScale = this.spriteScales[key] || 1;

        this.updateScaleButtons(currentScale);

        // Position OSD above the sprite, centered
        const bounds = sprite.getBounds();
        const osdWidth = 164;
        const osdX = bounds.x + (bounds.width / 2) - (osdWidth / 2);
        const osdY = bounds.y - 48;

        this.osd.setPosition(
            Phaser.Math.Clamp(osdX, 4, 800 - osdWidth - 4),
            Math.max(4, osdY)
        );
        this.osd.setVisible(true);
    }

    hideOSD ()
    {
        if (this.osd)
        {
            this.osd.setVisible(false);
        }
        this.selectedSprite = null;
    }

    updateScaleButtons (activeScale)
    {
        this.scaleButtons.forEach(({ txt, btnBg, bx, scale }) =>
        {
            if (scale === activeScale)
            {
                txt.setColor('#667eea');
                txt.setStyle({ fontStyle: 'bold' });
                txt.setData('active', true);
                btnBg.clear();
                btnBg.fillStyle(0x667eea, 0.2);
                btnBg.fillRoundedRect(bx, 5, 36, 28, 5);
            }
            else
            {
                txt.setColor('#8888aa');
                txt.setStyle({ fontStyle: '' });
                txt.setData('active', false);
                btnBg.clear();
                btnBg.fillStyle(0x667eea, 0.0);
                btnBg.fillRoundedRect(bx, 5, 36, 28, 5);
            }
        });
    }

    downloadSprite (sprite)
    {
        const key = sprite.getData('key');
        const currentScale = this.spriteScales[key] || 1;
        const data = this.spriteDataMap[key];

        const pw = this.basePixelWidth * currentScale;
        const ph = this.basePixelHeight * currentScale;
        const w = data[0].length * pw;
        const h = data.length * ph;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        data.forEach((row, y) =>
        {
            for (let x = 0; x < row.length; x++)
            {
                const value = row[x];

                if (value === '.')
                {
                    continue;
                }

                const color = this.palette[value];

                if (!color)
                {
                    continue;
                }

                ctx.fillStyle = color;
                ctx.fillRect(x * pw, y * ph, pw, ph);
            }
        });

        const suffix = currentScale > 1 ? `@${currentScale}x` : '';
        const filename = `${key}${suffix}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    setResolution (sprite, scale)
    {
        const key = sprite.getData('key');
        const data = this.spriteDataMap[key];

        this.spriteScales[key] = scale;

        const pw = this.basePixelWidth * scale;
        const ph = this.basePixelHeight * scale;

        this.createFromPalette(key, data, pw, ph);

        sprite.setTexture(key);

        this.updateScaleButtons(scale);
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
