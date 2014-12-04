import World from './arcade/world';
import Entity from './arcade/entity';

import Position from './arcade/components/position';
import Velocity from './arcade/components/velocity';
import Gravity from './arcade/components/gravity';
import Force from './arcade/components/force';
import Mass from './arcade/components/mass';
import Shape from './arcade/components/shape';
import Input from './arcade/components/input';
import Collision from './arcade/components/collision';

import InputSystem from './arcade/systems/input';
import PhysicsSystem from './arcade/systems/physics';
import CollisionSystem from './arcade/systems/collision';
import RenderSystem from './arcade/systems/render';

(function (window) {

    'use strict';

    var element = document.getElementById('game');
    var canvas = document.createElement('canvas');

    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;

    element.appendChild(canvas);

    var world = new World({ width: 40, height: 30 });

    world.addSystem(new InputSystem({}));

    world.addSystem(new PhysicsSystem({}));

    world.addSystem(new CollisionSystem({}));

    world.addSystem(new RenderSystem({
        context: canvas.getContext('2d')
    }));

    var shape;
    var entity;

    shape = new Shape({
        type: Shape.TYPE.CIRCLE,
        radius: 1
    });

    entity = new Entity()
        .addComponent(new Position({
            x: 4,
            y: 3
        }))
        .addComponent(new Velocity({
            x: 2,
            y: 0
        }))
        .addComponent(new Gravity({}))
        .addComponent(new Collision({
            shape: shape
        }))
        .addComponent(new Mass({mass: 1}))
        .addComponent(shape);

    world.addEntity(entity);

    shape = new Shape({
        type: Shape.TYPE.RECT,
        width: 1.5,
        height: 1.5
    });

    entity = new Entity()
        .addComponent(new Position({
            x: 6.5,
            y: 3
        }))
        .addComponent(new Velocity({
            x: 0,
            y: 0
        }))
        .addComponent(new Gravity({}))
        .addComponent(new Collision({
            shape: shape
        }))
        .addComponent(new Mass({mass: 0.5}))
        .addComponent(shape);

    world.addEntity(entity);

    entity = new Entity()
        .addComponent(new Position({
            x: 8,
            y: 20
        }))
        .addComponent(new Velocity({
            x: 0,
            y: 0
        }))
        .addComponent(new Collision({
            shape: shape
        }))
        .addComponent(new Mass({mass: 0}))
        .addComponent(shape);

    world.addEntity(entity);

    // Player

    shape = new Shape({
        type: Shape.TYPE.CIRCLE,
        radius: 1
    });

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
        .addComponent(new Collision({
            shape: shape
        }))
        .addComponent(new Mass({mass: 2}))
        .addComponent(new Input({
            keys: {
                37: function (entity, world) {
                    entity.components.force.x -= 20;
                },
                38: function (entity, world) {
                    entity.components.force.y -= 20;
                },
                39: function (entity, world) {
                    entity.components.force.x += 20;
                },
                40: function (entity, world) {
                    entity.components.force.y += 20;
                }
            }
        }))
        .addComponent(shape);

    world.addEntity(entity);

    // Bounds

    shape = new Shape({
        type: Shape.TYPE.RECT,
        width: 38,
        height: 1
    });

    entity = new Entity()
       .addComponent(new Position(20, 29))
       .addComponent(new Velocity(0, 0))
       .addComponent(new Mass(0))
       .addComponent(shape)
       .addComponent(new Collision({ shape: shape }));

    world.addEntity(entity);

    entity = new Entity()
       .addComponent(new Position(20, 1))
       .addComponent(new Velocity(0, 0))
       .addComponent(new Mass(0))
       .addComponent(shape)
       .addComponent(new Collision({ shape: shape }));

    world.addEntity(entity);

    shape = new Shape({
        type: Shape.TYPE.RECT,
        width: 1,
        height: 25
    });

    entity = new Entity()
       .addComponent(new Position(1, 15))
       .addComponent(new Velocity(0, 0))
       .addComponent(new Mass(0))
       .addComponent(shape)
       .addComponent(new Collision({ shape: shape }));

    world.addEntity(entity);

    entity = new Entity()
       .addComponent(new Position(39, 15))
       .addComponent(new Velocity(0, 0))
       .addComponent(new Mass(0))
       .addComponent(shape)
       .addComponent(new Collision({ shape: shape }));

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
