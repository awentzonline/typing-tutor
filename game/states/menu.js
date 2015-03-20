
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.backgroundSprite = this.game.add.sprite(0, 0, 'background0');
    
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};

    this.titleText = this.game.add.text(
      this.game.world.centerX, 300, 'H.P. Lovecraft\nTeaches Typing', style
    );
    this.titleText.anchor.setTo(0.5, 0.5);
    this.titleText.alpha = 0;

    this.instructionsText = this.game.add.text(
      this.game.world.centerX, 400, 'Press any key to start typing!',
      {font: '16px Arial', fill: '#ffffff', align: 'center'}
    );
    this.instructionsText.anchor.setTo(0.5, 0.5);
    this.instructionsText.alpha = 0;

    this.game.add.tween(this.titleText).to({alpha: 1.0}, 1000, Phaser.Easing.Linear.NONE, true, 500);
    this.game.add.tween(this.instructionsText).to({alpha: 1.0}, 1000, Phaser.Easing.Linear.NONE, true, 1200);
    this.game.input.keyboard.onDownCallback = this.onDown.bind(this);
  },
  onDown: function () {
    this.game.input.keyboard.onDownCallback = null;
    this.game.state.start('play');
  }
};

module.exports = Menu;
