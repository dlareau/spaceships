/*
 * game.js: handles most game logic
 */

// paperjs has to have this run before
// any modules can reference paper variables
// todo--better, more modular way to do this?
paper.install(window);
paper.setup('spaceships');

define(function(require) {
    'use strict';

    var 
    Spaceship = require('spaceship'),
    C    = require('constants'),
    Util = require('util');
    

    var Game = {
        start: function() {
            this.player = new Spaceship(view.bounds.LeftCenter);
            this.lastSpaceship = 0;
            this.score = 0;
            this.started = true;

            for (var i = 0; i < 10; i++) {
                this.newEnemy();
            }
        },

        end: function() {
            document.getElementById('dialogue').style.display = 'block';
            document.getElementById('score').innerHTML = 'Your score was ' + this.score;
            project.activeLayer.removeChildren();
            this.started = false;
        },

        loop: function(e) {

            if (!this.started) {
                return;
            }

            var player = this.player;

            // handle keyboard events for moving spaceship
            if (Key.isDown('w') || Key.isDown('up')) { 
                player.addVelocity([0, -C.ACCELERATION]);
            } else if (Key.isDown('s') || Key.isDown('down')) {
                player.addVelocity([0, C.ACCELERATION]);
            } 
            
            if (Key.isDown('a') || Key.isDown('left')) {
                player.addVelocity([-C.ACCELERATION, 0]);
            } else if (Key.isDown('d') || Key.isDown('right')) {
                player.addVelocity([C.ACCELERATION, 0]);
            }

            // do simple 2D physics for the player
            // calculate velocity with deceleration
            var playerBounds = player.strokeBounds;

            if (!view.bounds.contains(playerBounds)) {
                
                // fixme: player can still get stuck. detection isn't 
                var nx = playerBounds.width / 2, ny = playerBounds.height / 2;
                if ((player.position.x <= nx && player.velocity[0] < 0) ||
                    (player.position.x >= view.bounds.width - nx && player.velocity[0] > 0)) {
                    player.velocity[0] = 0;
                } else if((player.position.y <= ny && player.velocity[1] < 0) ||
                          (player.position.y >= view.bounds.height - ny && player.velocity[1] > 0)) {
                    player.velocity[1] = 0;
                }
            }


            // move the spaceship by the given velocity
            player.position = player.position.add(player.velocity);

            // handle enemy spaceship logic and collisions
            _.forEach(project.activeLayer.children, function(otherSpaceship) {
                if (player.id === otherSpaceship.id) {
                    return;
                }
                
                var 
                otherBounds = otherSpaceship.strokeBounds,
                overlap = otherBounds.intersect(playerBounds),
                overlapArea = overlap.width * overlap.height,
                otherArea   = otherBounds.width * otherBounds.height;

                if (overlapArea / otherArea > C.MIN_EAT_OVERLAP & overlap.width > 0) {
                    if (playerBounds.width > otherBounds.width) {
                        player.scale((playerBounds.width + 7 * (otherBounds.width / playerBounds.width + 0.3)) / playerBounds.width);
                        otherSpaceship.remove();
                        this.score++;
                    } else {
                        this.end();
                    }
                }
                
                otherSpaceship.position = otherSpaceship.position.add(otherSpaceship.velocity);

                // todo: add GC
                /*if (!other_bounds.intersects(view.bounds) && !view.bounds.contains(other_bounds)) {
                  otherSpaceship.remove();
                  }*/
            }, this);
            
            Util.decelerate(player.velocity);

            // generate spaceshipes every second
            if (e.time - this.lastSpaceship >= C.SHIP_SPAWN_TIME) {
                this.newEnemy();
                this.lastSpaceship = e.time;
            }
        },

        newEnemy: function() {
            var pos = Math.random() * view.bounds.height;
            var enemy = new Spaceship([view.bounds.width, pos]);
            
            var cur_scale = this.player.strokeBounds.width / enemy.strokeBounds.width;

            var scale = cur_scale;
            enemy.scale(scale);

            enemy.position.x += enemy.strokeBounds.width / 2;
            
            enemy.addVelocity([-3 * (cur_scale / scale), 0]);
            enemy.children[0].fillColor = '#' + (Math.round(0xffffff * Math.random())).toString(16);
        }
    };

    view.onFrame = _.bind(Game.loop, Game);

    return Game;
});
