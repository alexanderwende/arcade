import World from './arcade/world';
import Entity from './arcade/entity';

import Position from './arcade/components/position';
import Velocity from './arcade/components/velocity';
import Gravity from './arcade/components/gravity';
import Force from './arcade/components/force';
import Shape from './arcade/components/shape';
import Input from './arcade/components/input';

import InputSystem from './arcade/systems/input';
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

    world.addSystem(new InputSystem({}));

    world.addSystem(new PhysicsSystem({}));

    world.addSystem(new RenderSystem({
        context: canvas.getContext('2d')
    }));

    var entity = new Entity()
        .addComponent(new Position({
            x: 2,
            y: 0.5
        }))
        .addComponent(new Velocity({
            x: 0,
            y: 0
        }))
        .addComponent(new Gravity({}))
        .addComponent(new Shape({
            type: Shape.TYPE.TRIANGLE,
            width: 1,
            height: 1
        }));

    world.addEntity(entity);

    entity = new Entity()
        .addComponent(new Position({
            x: 10,
            y: 10
        }))
        .addComponent(new Velocity({
            x: 0,
            y: 0
        }))
        .addComponent(new Force({}))
        .addComponent(new Input({
            keys: {
                37: function (entity, world) {
                    entity.components.force.x -= 5;
                },
                38: function (entity, world) {
                    entity.components.force.y -= 5;
                },
                39: function (entity, world) {
                    entity.components.force.x += 5;
                },
                40: function (entity, world) {
                    entity.components.force.y -+ 5;
                }
            }
        }))
        .addComponent(new Shape({
            type: Shape.TYPE.CIRCLE,
            radius: 0.5
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
