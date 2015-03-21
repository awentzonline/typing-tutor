(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
'use strict';


function TextQueue(text) {
  this.text = text;
  this.words = text.split(' ');
}

TextQueue.prototype.fetchWords = function (maxChars) {
  var words = [];
  while (maxChars > 0 && this.words.length > 0) {
    var nextWord = this.words[0];
    words.push(nextWord);
    this.words.shift();
    maxChars -= nextWord;
  }
  return words.join(' ');
};

TextQueue.prototype.empty = function () {
  return this.words.length === 0;
};


module.exports = TextQueue;

},{}],3:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'scrambler');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],5:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Lost!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Press any key to restart.', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
    setTimeout(function () {
      this.game.input.keyboard.onDownCallback = this.onDown.bind(this);
    }.bind(this), 1000);
  },
  onDown: function () {
    this.game.input.keyboard.onDownCallback = null;
    this.game.state.start('play');
  }
};
module.exports = GameOver;

},{}],6:[function(require,module,exports){

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
      this.game.world.centerX, 400, 'Type to save the baby\nPress any key to start',
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

},{}],7:[function(require,module,exports){
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
    console.log('space key');
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
},{"../elements/scrambler":1,"../elements/textqueue":2}],8:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.spritesheet('scrambler_walk', 'assets/scrambler_walk.png', 200, 121);
    this.load.image('background0', 'assets/background0.jpg');
    this.load.image('baby0', 'assets/baby0.png');
    this.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[3])