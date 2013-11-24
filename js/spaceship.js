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

        var start = new Point(0, 0);

        // points of Spaceship outline
        var segments = [start, 
                        start.add([20, 10]), 
                        start.add([40, 3]), 
                        start.add([50, 10]), 
                        start.add([50, -10]), 
                        start.add([40, -3]), 
                        start.add([20, -10])];

        var outline = new Path(segments);
        outline.strokeColor = 'black';
        outline.fillColor = '#a00';
        outline.closed = true;
        outline.smooth();
        
        this.addChild(outline);
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
