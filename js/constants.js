/*
 * constants.js: contains various numeric constants for tuning the game
 */

define(function(require) {
    'use strict';

    return {
        MAX_VELOCITY: 3,            // max speed for player 
        ACCELERATION: 0.2,          // how rapidly he accelerates
        DECELERATION: 0.07,         // how quickly he decelerates
        LEFT: 1,                    
        RIGHT: 0,
        SHIP_SPAWN_TIME: 0.1,       // how frequently (in seconds) fish spawn
        MIN_EAT_OVERLAP: 0.05       // minimum area needed for small fish to eat or be eaten (ratio)
    };
}); 
