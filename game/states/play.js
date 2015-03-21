'use strict';

var Scrambler = require('../elements/scrambler');
var TextQueue = require('../elements/textqueue');

var NUM_LEVELS = 3;

function Play() {}

Play.prototype = {
  init: function (levelId) {
    this.levelId = levelId;
  },
  preload: function () {
    this.game.load.text('levelData', 'assets/levels/level_' + this.levelId + '.json');
  },
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.level = JSON.parse(this.game.cache.getText('levelData'));
    this.backgroundSprite = this.game.add.sprite(0, 0, 'background0');
    this.scoreText = this.game.add.bitmapText(
      this.game.width * 0.5, this.game.height * 0.05, 'font', '0', 64
    );
    this.scoreText.align = 'center';
    // baby
    this.baby = this.game.add.sprite(this.game.width * 0.8, this.game.height * 0.8, 'baby0')
    this.baby.anchor.set(0.5, 0);
    this.game.physics.arcade.enable(this.baby);
    // scrambler
    this.creature = null;
    // text stuff
    this.textQueue = new TextQueue(this.level.words);
    this.currentText = this.game.add.bitmapText(
      this.game.width * 0.4, this.game.height * 0.4, 'font', this.textQueue.fetchWords(10) + ' '
    );
    this.currentText.alpha = 0;
    this.textInput = '';
    // dont let the spacebar push us around
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.preStart();
    setTimeout(function () { this.beginPlay(); }.bind(this), 1500);
    this.game.add.tween(this.currentText).to({alpha: 1.0}, 1000, Phaser.Easing.Linear.NONE, true);
  },
  preStart: function () {  
    this.titleText = this.game.add.text(
      this.game.world.centerX, this.game.world.height * 0.3, this.level.title,
      {
        font: '65px Arial', fill: '#ffffff', align: 'center'
      }
    );
    this.titleText.anchor.setTo(0.5, 0.5);
  },
  beginPlay: function () {
    this.spaceKey.onDown.add(this.onSpacePress.bind(this));
    this.game.input.keyboard.onPressCallback = this.onKeyPress.bind(this);
    this.titleText.text = 'Begin typing'
    this.game.add.tween(this.titleText).to({alpha: 0}, 1000, Phaser.Easing.Linear.NONE, true, 1000);
    this.spawnCreature();
  },
  update: function() {
    if (this.creature) {
      this.game.physics.arcade.collide(this.creature, this.baby, function (creature, baby) {
        this.game.state.start('gameover');
      }.bind(this));
    }
    if (this.currentText.text.trim().length == 0) {
      var nextLevelId = (this.level.id % NUM_LEVELS) + 1;
      this.game.state.start('play', true, false, [nextLevelId]);
    }
    this.updateText();
    if (this.game.score.toString() != this.scoreText.text) {
      this.scoreText.text = this.game.score.toString();
    }
  },
  updateText: function () {
    var visibleText = this.currentText.text;
    // consume input
    for (var i = 0; i < this.textInput.length; i++) {
      var letter = this.textInput[i];
      if (letter == visibleText[0]) {
        visibleText = visibleText.substr(1, visibleText.length);
        this.hitCreature();
      }
    }
    this.textInput = '';
    // add more upcoming text
    var dl = 40 - visibleText.length;
    if (dl > 5) {
      var moreText = this.textQueue.fetchWords(dl) + ' ';
      visibleText += moreText;
    }
    if (visibleText != this.currentText.text) {
      this.currentText.text = visibleText;
    }
  },
  spawnCreature: function () {
    if (!this.creature) {
      this.creature = new Scrambler(
        this.game, 0, this.game.height * 0.8
      );
      this.game.add.existing(this.creature);
    } else {
      this.creature.reset();
    }
    this.game.physics.arcade.enable(this.creature);
    this.creature.x = -this.creature.width * 0.5;
    this.creature.body.acceleration.x = 70;
  },
  hitCreature: function () {
    if (!this.creature) {
      return;
    }
    var maxReverseVelocity = -12;
    var vx = this.creature.body.velocity.x - 16;
    this.creature.body.velocity.x = Math.max(maxReverseVelocity, vx);
    this.game.score += 1;
  },
  onSpacePress: function () {
    this.onKeyPress(' ');
  },
  onKeyPress: function (letter) {
    this.textInput += letter;
  },
  shutdown: function () {
    this.spaceKey.onDown.removeAll();
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.onPressCallback = null;
  }
};

module.exports = Play;