
"use strict"

// game config
// Configure the game
const config = {
    
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    
    scene: SpaceDefenderScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false 
        }
    }
    

};

const game = new Phaser.Game(config);