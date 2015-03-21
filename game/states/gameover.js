
'use strict';
function GameOver() {}

GameOver.prototype = {
  init: function (score) {
    this.score = score;
  },
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(
      this.game.world.centerX, 200,
      'You basically killed that baby\nwith your awful typing.\nYou only typed ' + this.game.score + ' letters.',
      { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Press any key to restart.', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
    
    this.deathSound = this.game.add.audio('squish');
    this.deathSound.play();
    
    setTimeout(function () {
      this.game.input.keyboard.onDownCallback = this.onDown.bind(this);
    }.bind(this), 1000);
  },
  onDown: function () {
    this.game.input.keyboard.onDownCallback = null;
    this.game.score = 0;
    this.deathSound.stop();
    this.game.state.start('play', true, false, [1]);
  }
};
module.exports = GameOver;
