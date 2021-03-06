"use strict";

(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (game, ctx) {
    this.game = game;
    this.ctx = ctx;
    this.shotClock = 5;
  };

  GameView.prototype.start = function () {
    this.game.ship.invincible = true;
    this.game.ship.keepInvincible();

    window.setInterval((function () {
      if (this.shotClock > 0) {this.shotClock-- };

      this.controlShip();
      this.game.step();
      this.game.draw(this.ctx);

      if (this.game.isOver) {
        this.gameOver();
      } else if (this.game.paused) {
        this.game.started ? this.renderPauseScreen() : this.renderStartScreen();
      }
    }).bind(this), 19);

    this.bindKeyHandlers();
  };

  GameView.prototype.gameOver = function () {
    this.ctx.fillStyle = "red";
    this.ctx.font = 72 + "pt 'Dosis'";
    this.ctx.fillText("GAME OVER", 500 - 255, 200);

    this.ctx.font = 48 + "pt 'Dosis'";
    this.ctx.fillText(("YOUR SCORE:   " + this.game.points), 500 - 245, 325);
  };

  GameView.prototype.bindKeyHandlers = function () {
    var self = this;

    key('p', function () {
      event.preventDefault();
      if (self.game.isOver) {
        self.game.restart();
        self.hame.ship.invincible = false;
      } else if (!self.game.started) {
        self.game.started = true;
        self.game.paused = false;
      } else {
        self.game.paused = self.game.paused ? false : true;
      }
    });

    key('r', function () {
      event.preventDefault();
      self.game.restart(self.ctx);
    });


    key('w', function() {
      event.preventDefault();
      self.game.ship.power([0,-1]);
    });
    key('s', function() {
      event.preventDefault();
      self.game.ship.power([0,1]);
     });
    key('a', function() {
      event.preventDefault();
      self.game.ship.power([-1,0]);
    });
    key('d', function() {
      event.preventDefault();
      self.game.ship.power([1,0]);
    });

    key('space', function () {
      event.preventDefault();
    });
    key('up', function () {
      event.preventDefault();
    });
    key('down', function () {
      event.preventDefault();
    });
    key('left', function () {
      event.preventDefault();
    });
    key('right', function () {
      event.preventDefault();
    });

    this.bindNumbers();

    key.sequence(['a', 'b'], function () {
      self.game.jumpToLevel(19);
    });
  };

  GameView.prototype.controlShip = function () {
    if (key.isPressed('left')) {
      this.game.ship.rotate(-1);
    }
    if (key.isPressed('right')) {
      this.game.ship.rotate(1);
    }
    if (key.isPressed('space') || key.isPressed('q')) {
      if (this.shotClock === 0) {
        this.game.ship.fireBullet();
        this.shotClock = 5;
      }
    }
    if (key.isPressed('up')) {
      this.game.ship.goShip(1);
    }
    if (key.isPressed('down')) {
      this.game.ship.goShip(-1);
    }
  };

  GameView.prototype.bindNumbers = function () {
    var self = this;

    ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(function (num) {
      key(num, function () {
        event.preventDefault();
        self.game.jumpToLevel(parseInt(num));
      })
    })
  }

  GameView.prototype.renderPauseScreen = function () {
    this.ctx.fillStyle = "#32ffaa";
    this.ctx.font = 72 + "pt 'Dosis'";
    this.ctx.fillText("P A U S E D", 500 - 200, 200);

    this.ctx.fillStyle = "red";
    this.ctx.font = 48 + "pt 'Dosis'";
    this.ctx.fillText(("Press 'P' to Play"), 500 - 190, 400);
  };

  GameView.prototype.renderStartScreen = function () {
    this.ctx.fillStyle = "#32ffaa";
    this.ctx.font = 72 + "pt 'Dosis'";
    this.ctx.fillText("a s t e r o i d s", 500 - 240, 200);

    this.ctx.fillStyle = "red";
    this.ctx.font = 48 + "pt 'Dosis'";
    this.ctx.fillText(("Press 'P' to Play/Pause"), 500 - 270, 400);
  };
}) ();
