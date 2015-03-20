'use strict';

var Scrambler = require('../elements/scrambler');
var TextQueue = require('../elements/textqueue');

function Play() {}

Play.prototype = {
  create: function() {
    this.words = 'Of the pleasures and pains of opium much has been written. The ecstasies and horrors of De Quincey and the paradis artificiels of Baudelaire are preserved and interpreted with an art which makes them immortal, and the world knows well the beauty, the terror and the mystery of those obscure realms into which the inspired dreamer is transported. But much as has been told, no man has yet dared intimate the nature of the phantasms thus unfolded to the mind, or hint at the direction of the unheard-of roads along whose ornate and exotic course the partaker of the drug is so irresistibly borne. De Quincey was drawn back into Asia, that teeming land of nebulous shadows whose hideous antiquity is so impressive that "the vast age of the race and name overpowers the sense of youth in the individual," but farther than that he dared not go. Those who have gone farther seldom returned, and even when they have, they have been either silent or quite mad. I took opium but once -- in the year of the plague, when doctors sought to deaden the agonies they could not cure. There was an overdose -- my physician was worn out with horror and exertion -- and I travelled very far indeed. In the end I returned and lived, but my nights are filled with strange memories, nor have I ever permitted a doctor to give me opium again.'
    this.backgroundSprite = this.game.add.sprite(0, 0, 'background0');
    // scrambler
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.creature = null;
    // text stuff
    this.textQueue = new TextQueue(this.words);
    this.currentText = this.game.add.bitmapText(
      this.game.width * 0.4, this.game.height * 0.4, 'font', this.textQueue.fetchWords(10) + ' ', 32
    );
    this.textInput = '';
    this.game.input.keyboard.onPressCallback = this.onKeyPress.bind(this);
  },
  update: function() {
    if (this.creature) {
      if (this.creature.x > this.game.width) {
        this.creature.kill();
      }
    } else {
      this.spawnCreature();
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
        this.game, 0, this.game.height * 0.7
      );
      this.creature.x = -this.creature.width;
      this.game.add.existing(this.creature);
      this.game.physics.arcade.enable(this.creature);
      this.creature.body.velocity.x = 200;
    } else {
      this.creature.revive(100);
      this.game.physics.arcade.enable(this.creature);
      this.creature.x = -this.creature.width;
      this.creature.body.velocity.x = 200;
    }
  },
  onKeyPress: function (letter) {
    this.textInput += letter;
    console.log(this.textInput);
  }
};

module.exports = Play;