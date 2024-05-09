class SpaceDefenderScene extends Phaser.Scene {
    constructor() {
        super('SpaceDefenderScene');

        // Define player properties
        this.playerSpeed = 200;
        this.playerHealth = 100;

        // Define bullet properties
        this.bulletSpeed = 500;
        this.bulletRate = 200; // milliseconds
        this.lastFired = 0;

        // Define emitted sprite properties
        this.emittedSpriteSpeed = 3;
        this.emittedSpriteActive = false;

        // Define wave properties
        this.currentWave = 1;
        this.enemySpawnDelay = 3000; // milliseconds
        this.enemySpeed = 1.5;  
        this.enemyCount = 5; // Initial enemy count
    }

    preload() {
        // Load assets
        this.load.image('player', 'assets/playerShip2_blue.png');
        this.load.image('enemy', 'assets/enemyBlack1.png');
        this.load.image('bullet', 'assets/laserBlue02.png');
        this.load.audio('sound', 'assets/sfx_laser1.ogg');
        this.load.image('background','assets/purple.png');
    }

    create() {
        // Create Background
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(4);
        // Create player sprite
        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setOrigin(0.5, 1); // Set origin to bottom center
        this.player.setCollideWorldBounds(true); // Prevent player from going out of bounds

        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set up enemy group
        this.enemies = this.physics.add.group();

        // Set up emitted sprite group
        this.emittedSprites = this.physics.add.group();

        // Set up bullet group
        this.bullets = this.physics.add.group();

        // Set up text for displaying game information
        this.waveText = this.add.text(16, 16, 'Wave: 1', { fontSize: '32px', fill: '#ffffff' });
        this.healthText = this.add.text(16, 50, 'Health: 100', { fontSize: '32px', fill: '#ffffff' });

        // Start spawning enemies
        this.spawnEnemies();
        
    }

    resetgame(){
 
    const restartButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 50, 'Restart', { fontSize: '24px', fill: '#fff' })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.restart(); 
            this.input.keyboard.enabled = true;
            this.init_game();
            this.startgame();
    });
}


    update(time, delta) {
        // Update player movement
        this.movePlayer();

        // Update emitted sprite movement
        this.moveEmittedSprite();

        // Update bullet firing
        if (this.spacebar.isDown && time > this.lastFired) {
            this.fireBullet(time);
        }

        // Check for collisions
        this.physics.overlap(this.player, this.enemies, this.playerEnemyCollision, null, this);
        this.physics.overlap(this.emittedSprites, this.enemies, this.emittedSpriteEnemyCollision, null, this);
        this.physics.overlap(this.bullets, this.enemies, this.bulletEnemyCollision, null, this);

        // Check for level completion
        if (this.enemies.countActive() === 0) {
            this.currentWave++;
            this.waveText.setText(`Wave: ${this.currentWave}`);
            this.enemyCount += 2; // Increase enemy count for next wave
            this.spawnEnemies();
        }
    }
    checkLevelCompletion() {
        if (this.enemies.countActive() === 0) {
            this.currentWave++;
            this.waveText.setText(`Wave: ${this.currentWave}`);
            this.enemyCount += 2; // Increase enemy count for next wave
            this.spawnEnemies();
            this.createRestartButton();
        }
    }


    movePlayer(){
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
        } else {
            this.player.setVelocityX(0);
        }
        
    }


    moveEmittedSprite() {
        this.emittedSprites.children.iterate(emittedSprite => {
            emittedSprite.y -= this.emittedSpriteSpeed;
            if (emittedSprite.y < -emittedSprite.height) {
                emittedSprite.destroy();
            }
        });
    }

    spawnEnemies() {
        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies.create(
                Phaser.Math.Between(50, this.game.config.width - 50),
                Phaser.Math.Between(-500, -50),
                'enemy'
            );
            enemy.setVelocityY(this.enemySpeed * 40);
        }
    
    }
    

    fireBullet(time) { 
            this.explosionSound = this.sound.add('sound');
            this.explosionSound.play();
            if (time > this.lastFired) {
                const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet');
                bullet.setVelocityY(-this.bulletSpeed);
                this.lastFired = time + this.bulletRate;
            }
    }

    playerEnemyCollision(player, enemy) {
    enemy.destroy();
    
    // Reduce player health
    this.playerHealth -= 10;
    this.healthText.setText(`Health: ${this.playerHealth}`);
    
    // Check if player health is depleted
    if (this.playerHealth <= 0) {
        // Player is defeated, game over
        this.gameOver();
    }
    }

    emittedSpriteEnemyCollision(emittedSprite, enemy) {
     emittedSprite.destroy();
    enemy.destroy();
    }

    bulletEnemyCollision(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
    }
    resetgame()
{

}
makeEnemiesShoot() {
    this.enemies.children.iterate(enemy => {
        // Calculate angle towards player
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);

        // Create enemy bullet
        const bullet = this.enemyBullets.create(enemy.x, enemy.y, 'bullet');
        bullet.setVelocity(Math.cos(angle) * this.enemyBulletSpeed, Math.sin(angle) * this.enemyBulletSpeed);
    });
}
gameOver() {
    this.physics.pause();
    this.add.text(300, 250, 'Game Over', { fontSize: '64px', fill: '#ffffff' });
} 

 }
