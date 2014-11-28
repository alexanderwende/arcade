import World from './arcade/world';
import Entity from './arcade/entity';

import Position from './arcade/components/position';
import Velocity from './arcade/components/velocity';
import Gravity from './arcade/components/gravity';
import Shape from './arcade/components/shape';

import PhysicsSystem from './arcade/systems/physics';
import RenderSystem from './arcade/systems/render';

(function (window) {

    'use strict';

    var element = document.getElementById('game');
    var canvas = document.createElement('canvas');

    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;

    element.appendChild(canvas);

    var world = new World();

    world.addSystem(new PhysicsSystem({}));

    world.addSystem(new RenderSystem({
        context: canvas.getContext('2d')
    }));

    var entity = new Entity()
        .addComponent(new Position({
            x: canvas.width / 2,
            y: canvas.height / 2
        }))
        .addComponent(new Velocity({
            x: 0,
            y: 0
        }))
        .addComponent(new Gravity({}))
        .addComponent(new Shape({
            type: Shape.TYPE.TRIANGLE,
            width: 50,
            height: 50
        }));

    world.addEntity(entity);

    entity = new Entity()
        .addComponent(new Position({
            x: canvas.width / 2,
            y: canvas.height / 2
        }))
        .addComponent(new Velocity({
            x: 100,
            y: 0
        }))
        //.addComponent(new Gravity({}))
        .addComponent(new Shape({
            type: Shape.TYPE.CIRCLE,
            radius: 20
        }));

    world.addEntity(entity);

    window.world = world;



    var game = {

        requestId: 0,

        start: function () {
            this.requestId = window.requestAnimationFrame(this.loop.bind(this));
        },

        pause: function () {
            window.cancelAnimationFrame(this.requestId);
        },

        stop: function () {
            window.cancelAnimationFrame(this.requestId);
        },

        step: function () {
            world.update();
        },

        loop: function (time) {
            world.update();
            this.requestId = window.requestAnimationFrame(this.loop.bind(this));
        }
    };

    var start = document.getElementById('start');
    var pause = document.getElementById('pause');
    var step = document.getElementById('step');
    var stop = document.getElementById('stop');
    var smoothing = document.getElementById('smoothing');

    start.addEventListener('click', function () {
        game.start();
    }, false);

    pause.addEventListener('click', function () {
        game.pause();
    }, false);

    step.addEventListener('click', function () {
        game.step();
    }, false);

    stop.addEventListener('click', function () {
        game.stop();
    }, false);

    smoothing.addEventListener('change', function () {
        game.enableSmoothing = smoothing.checked;
    }, false);

})(window);
