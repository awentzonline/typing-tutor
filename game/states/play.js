'use strict';

var Scrambler = require('../elements/scrambler');
var TextQueue = require('../elements/textqueue');

function Play() {}

Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.level = {
      title: 'The Beast in the Cave',
      words: 'The horrible conclusion which had been gradually intruding itself upon my confused and reluctant mind was now an awful certainty. I was lost, completely, hopelessly lost in the vast and labyrinthine recess of the Mammoth Cave. Turn as I might, in no direction could my straining vision seize on any object capable of serving as a guidepost to set me on the outward path. That nevermore should I behold the blessed light of day, or scan the pleasant hills and dales of the beautiful world outside, my reason could no longer entertain the slightest unbelief. Hope had departed. Yet, indoctrinated as I was by a life of philosophical study, I derived no small measure of satisfaction from my unimpassioned demeanour; for although I had frequently read of the wild frenzies into which were thrown the victims of similar situations, I experienced none of these, but stood quiet as soon as I clearly realised the loss of my bearings. Nor did the thought that I had probably wandered beyond the utmost limits of an ordinary search cause me to abandon my composure even for a moment. If I must die, I reflected, then was this terrible yet majestic cavern as welcome a sepulchre as that which any churchyard might afford, a conception which carried with it more of tranquillity than of despair. Starving would prove my ultimate fate; of this I was certain. Some, I knew, had gone mad under circumstances such as these, but I felt that this end would not be mine. My disaster was the result of no fault save my own, since unknown to the guide I had separated myself from the regular party of sightseers; and, wandering for over an hour in forbidden avenues of the cave, had found myself unable to retrace the devious windings which I had pursued since forsaking my companions.'
    };
    this.backgroundSprite = this.game.add.sprite(0, 0, 'background0');
    // baby
    this.baby = this.game.add.sprite(this.game.width * 0.8, this.game.height * 0.8, 'baby0')
    this.baby.anchor.set(0.5, 0);
    this.game.physics.arcade.enable(this.baby);
    // scrambler
    this.creature = null;
    // text stuff
    this.textQueue = new TextQueue(this.level.words);
    this.currentText = this.game.add.bitmapText(
      this.game.width * 0.4, this.game.height * 0.4, 'font', this.textQueue.fetchWords(10) + ' ', 32
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
    if (this.textQueue.empty()) {
      this.game.state.start('menu');
    }
    this.updateText();
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