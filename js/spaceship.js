/*
 * Spaceship.js: defines the Spaceship class, the main entity in the game
 */

define(function(require) {
    'use strict';

    var 
    C    = require('constants'),
    Util = require('util');

    function Spaceship(position) {

        // our Spaceship is an instance of a paper Group
        Group.call(this);

        // temporary raster of Spaceship
        var raster = new Raster('s1');
        raster.position = view.center;
        raster.rotate(-90);

        this.addChild(raster);
        this.position = position;
        this.orientation = C.LEFT;
        this.velocity = [0, 0];
    }

    Spaceship.prototype = Object.create(Group.prototype);

    Spaceship.prototype.addVelocity = function(vector) {
       this.velocity = [Util.addVelocity(this.velocity[0], vector[0]),
                        Util.addVelocity(this.velocity[1], vector[1])];
    }

    return Spaceship;
});