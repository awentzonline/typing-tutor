'use strict';


function Scrambler(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'scrambler_walk');
  this.animations.add('walk', []);
  this.animations.play('walk', 10, true);
  this.anchor.set(0.5, 0.2);
  this.fpsMax = 20;
  this.fpsMin = 5;
  this.speedMax = 300;
  this.speedMin = 50;
}

Scrambler.prototype = Object.create(Phaser.Sprite.prototype);
Scrambler.constructor = Scrambler

module.exports = Scrambler;

Scrambler.prototype.update = function () {
  var velocity = this.body.velocity.getMagnitude();
  if (velocity == 0) {
    this.animations.stop();
  } else {
    var speedRatio = Math.max(
      0, (velocity - this.speedMin) / (this.speedMax - this.speedMin)
    );
    var fps = this.fpsMin + speedRatio * (this.fpsMax - this.fpsMin);
    this.animations.play('walk', fps, true);
    this.animations.currentAnim.delay = 1000 / fps; 
  }
};