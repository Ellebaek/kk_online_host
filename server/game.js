class Game {

  constructor(player_sockets, ordered_players) {
    this._player_sockets = player_sockets; // key, value pair
    this._ordered_players = ordered_players; // players in sitting order
    this._dealer = ordered_players[0];
    this._chips = {}; // all player stacks
    this._current_hands = {}; // all player hands
    this._current_board = {}; // cards on table
    this._current_deck = []; // cards left in deck
    this._current_pot = 0; // chips in pot

    Object.values(this._player_sockets).forEach((item, i) => {
      item.emit('msg', 'Players shuffled. Game starting!');
    });
  }

  _setChips(player_name, chips) {
    this._chips[player_name] = chips;
  }

  _addToPot(player_name, chips) {
    this._current_pot = this._current_pot + chips;
    this._setChips(player_name, this._chips[player_name] - chips);
  }

  _createUnshuffledDeck() {
    var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    var result = [];
    for (var i=0; i<suits.length; i++) {
      for (var j=1; j<=13; j++) {
        result.push(suits[i] + j);
      }
    }
    return result;
  }

  _shuffleArray(inputArray) {
    for (var i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  _deal(dealer_name) {
    this._dealer = dealer_name;
    // create new deck
    var new_deck = this._createUnshuffledDeck();
    // shuffle deck
    _shuffleArray(new_deck);
    // deal (update _current_hands)

  }
}

module.exports = Game;
