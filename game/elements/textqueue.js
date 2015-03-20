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
