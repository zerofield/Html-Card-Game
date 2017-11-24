//define Card constructor
var Card = function(style) {
	this.style = style;
};

Card.prototype.createHtml = function() {
	var html = '<li class="card"><i class="fa ' + this.style + '"></i></li>';
	return html;
}

//define the Game 
var Game = function() {
	this.counter = 0;
	this.openCards = [];
	//create the deck
	this.deck = [];
	this.deck.push(new Card('fa-diamond'));
	this.deck.push(new Card('fa-diamond'));
	this.deck.push(new Card('fa-paper-plan-o'));
	this.deck.push(new Card('fa-paper-plan-o'));
	this.deck.push(new Card('fa-anchor'));
	this.deck.push(new Card('fa-anchor'));
	this.deck.push(new Card('fa-bolt'));
	this.deck.push(new Card('fa-bolt'));
	this.deck.push(new Card('fa-cube'));
	this.deck.push(new Card('fa-cube'));
	this.deck.push(new Card('fa-leaf'));
	this.deck.push(new Card('fa-leaf'));
	this.deck.push(new Card('fa-bicycle'));
	this.deck.push(new Card('fa-bicycle'));
	this.deck.push(new Card('fa-bomb'));
	this.deck.push(new Card('fa-bomb'));
}

Game.prototype.restart = function() {
	this.counter = 0;
	this.openCards.length = 0;
	this.shuffle(this.deck);

	// - loop through each card and create its HTML
	var deckHtml = '';
	this.deck.forEach(function(card) {
		deckHtml += card.createHtml();
	});


	//add each card's HTML to the page
	$('.deck').html(deckHtml);
	$('.moves').html('' + this.counter);

	var game = this;

	//set up the event listener for a card
	$('.card').each(function() {
		$(this).click(function() {
			game.onCardClick(this);
		});
	});
};

Game.prototype.onCardClick = function(cardHtmlElem) {
	//console.log(this);

	if (this.openCards.indexOf(cardHtmlElem) != -1) {
		return;
	}

	//display the card's symbol
	$(cardHtmlElem).addClass('open show');
	
	

	//if the cards do not match, remove the cards from the list and hide the card's symbol
	if (this.openCards.length == 2) {
		$(this.openCards[0]).removeClass('open show');
		$(this.openCards[1]).removeClass('open show');
		this.openCards.length = 0;
	}

	//add the card to a *list* of "open" cards
	this.openCards.push(cardHtmlElem);

	if (this.openCards.length == 2) {
		var firstOne = $(this.openCards[0]);
		var secondOne = $(this.openCards[1]);

		console.log(firstOne.html());
		console.log(secondOne.html());

		//if the cards do match, lock the cards in the open position
		if (firstOne.html() == secondOne.html()) {
			console.log('first one and second one matched!');

			firstOne.off('click');
			secondOne.off('click');

			firstOne.removeClass('open show');
			secondOne.removeClass('open show');

			firstOne.addClass('match');
			secondOne.addClass('match');

			this.openCards.length = 0;
		}

		//if all cards have matched, display a message with the final score
		if ($('.match').length == this.deck.length) {
			//TODO	
			//console.log('all cards matched!');
			alert('Congratulation! It took you ' + this.counter + ' moves to match all cards!');
		}

		//increment the move counter and display it on the page
		++this.counter;
		$('.moves').html('' + this.counter);
	}
}


// Shuffle function from http://stackoverflow.com/a/2450976
Game.prototype.shuffle = function(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//restart the game
var game = new Game();
game.restart();

//add restart listener
$('.restart').click(function() {
	game.restart();
});