"use strict";

(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var COLOR = "#32ffaa";
  var RADIUS = 8;

  var Ship = Asteroids.Ship = function (options) {
    Asteroids.MovingObject.call(
      this,
      {
        pos: options.pos,
        vel: [0,0],
        radius: RADIUS,
        color: COLOR,
        game: options.game
      }
    );

    this.frozen = false;
    this.invincible = false;
    this.strobe = true;
  };

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    var theta = Math.atan2(this.vel[1], this.vel[0]) + Math.PI/2;
    ctx.rotate(theta);
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.moveTo(0, -10);
    ctx.lineTo(-10, 15);
    ctx.lineTo(0, 12)
    ctx.lineTo(10, 15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  var THRUST = 1.2;
  var REV_THRUST = 1.5;
  var MAX_SPEED = 10;

  Ship.prototype.power = function (impulse) {
    if (this.frozen) return;

    var thrust = THRUST;
    var rev_thrust = REV_THRUST;
    var vel = this.vel;
    var maxSpeed = MAX_SPEED;

    if (impulse[0] !== 0) {

      if (Math.abs(vel[0] + thrust * impulse[0]) >= maxSpeed) {
        return;
      } else {
        if ( vel[0] == 0 || (impulse[0] / Math.abs(impulse[0])) === (vel[0] / Math.abs(vel[0])) ) {
          vel[0] += impulse[0] * thrust;
        } else {
          var rev = impulse[0] * rev_thrust;
          vel[0] = Math.abs(rev) > Math.abs(vel[0]) ? 0 : (vel[0] + rev);
        }
      }

    } else {
      if (Math.abs(vel[1] + thrust * impulse[1]) >= maxSpeed) {
        return;
      } else {
        if ( vel[1] == 0 || (impulse[1] / Math.abs(impulse[1])) === (vel[1] / Math.abs(vel[1])) ) {
          vel[1] += impulse[1] * thrust;
        } else {
          var rev = impulse[1] * rev_thrust;
          vel[1] = Math.abs(rev) > Math.abs(vel[1]) ? 0 : (vel[1] + rev);
        }
      }
    }
  };

  Ship.prototype.relocate = function () {
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];

    this.invincible = true;
    this.keepInvincible();
  };

  Ship.prototype.keepInvincible = function () {
    window.setTimeout((function () {
      this.invincible = false;
      this.color = COLOR;
    }).bind(this), 3500);
  };

  Ship.prototype.flash = function () {
    if (this.strobe) {
      this.strobe = false;
      return;
    } else {
      this.flicker = true;
      this.color = this.color === "yellow" ? "#000" : "yellow";
    }
  }

  Ship.prototype.fireBullet = function () {
    if (this.game.isOver || this.frozen) return;

    var newVel = this.vel;
    var self = this;

    if (this.vel[0] === 0 && this.vel[1] === 0) {
      newVel = [.1, 0];
    };

    var bullet = new Asteroids.Bullet({
      pos: self.pos,
      vel: newVel,
      game: self.game
    });

    this.game.addBullet(bullet);
  };

  Ship.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Asteroids.Asteroid) {
      if (this.invincible) {
        this.vel = [(this.vel[0] + 0.01) * -1, (this.vel[1] + 0.01) * -1];
      } else {
        this.game.ghostIt();
        this.relocate();
      }
    };
  }
}) ();