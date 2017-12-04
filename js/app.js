//define Card constructor
var Card = function(style) {
	this.style = style;
};

Card.prototype.createHtml = function() {
	var html = '<li class="animated card"><div class="card-container"><i class="card-front"/><i class="card-back fa ' + this.style + '"/></div></li>';
	return html;
}

//define the Game 
var Game = function() {
	this.stars = 3;
	this.clickCounter = 0;
	this.firstClickTime = 0;
	this.firstClick = true;
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

	var game = this;
	//add key up listner, if play presses 'r', game will be reset.
	$(document).keyup(function(event) {
		//console.log('event: ' + event.which);
		if (event.which == 82) {
			game.restart();
		}
	});
}

Game.prototype.restart = function() {
	this.canClick = true;
	this.firstClick = true;
	this.firstClickTime = 0;
	this.clickCounter = 0;
	this.setStars(3);
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

Game.prototype.setStars = function(starCount) {
	this.stars = starCount;
	var startHtml = '';
	for (var i = 0; i < starCount; ++i) {
		startHtml += '<li><i class="fa fa-star"></i></li>';
	}

	$('.stars').html(startHtml);
}


Game.prototype.playCardUnMatchAnimation = function(card) {
	//play wobble animation and flip card when animation ended
	card.find('.card-back').addClass('unmatch');
	card.addClass('wobble');
	var game = this;
	card.on('animationend', function() {
		card.off('animationend');
		card.removeClass('wobble');
		card.find('.card-container').removeClass('open');
		game.clickCounter--;
	});
}

Game.prototype.onCardClick = function(cardHtmlElem) {
	//console.log(this);


	//only when clickCounter less than 2 can player flip a card
	if (this.clickCounter >= 2) {
		//console.log('clickCounter = '+this.clickCounter);
		return;
	}

	//game starts only when player clicked card for the first time.
	if (this.firstClick) {
		this.firstClick = false;
		this.firstClickTime = new Date().getTime();
	}

	if (this.openCards.indexOf(cardHtmlElem) != -1) {
		//console.log('same card clicked');
		return;
	}

	this.clickCounter++;

	//display the card's symbol
	$(cardHtmlElem).find('.card-container').addClass('open');
	$(cardHtmlElem).find('.card-back').removeClass('unmatch');

	//add the card to a *list* of "open" cards
	this.openCards.push(cardHtmlElem);

	if (this.openCards.length == 2) {
		var firstOne = $(this.openCards[0]);
		var secondOne = $(this.openCards[1]);

		//console.log(firstOne.html());
		//console.log(secondOne.html());
		var game = this;
		//if the cards do match, lock the cards in the open position
		if (firstOne.html() == secondOne.html()) {
			//console.log('first one and second one matched!');

			firstOne.off('click');
			secondOne.off('click');

			//add class when transistion ended
			$(cardHtmlElem).find('.card-container').on('transitionend', function() {
				$(cardHtmlElem).find('.card-container').off('transitionend');

				//console.log('transistion ended')
				firstOne.find('.card-back').addClass('match');
				secondOne.find('.card-back').addClass('match');

				//add match animation
				firstOne.addClass('rubberBand');
				secondOne.addClass('rubberBand');


				//if all cards have matched, display a message with the final score
				console.log($('.match').length + ' ' + game.deck.length);
				if ($('.match').length == game.deck.length) {
					//console.log('all cards matched!');

					const now = new Date();
					const playTime = Math.round((now.getTime() - game.firstClickTime) / 1000);

					$('.modal-body').html('It took you ' + playTime + ' seconds to match all cards!\nDo you want another round?');
					$('#myModal').modal();

					$('#myModal').on('hide.bs.modal', function() {
						game.restart();
					});

				} else {
					if (game.counter >= 20) {
						game.setStars(1);
					} else if (game.counter >= 14) {
						game.setStars(2);
					} else {
						game.setStars(3);
					}

					//increment the move counter and display it on the page
					++game.counter;
					$('.moves').html('' + game.counter);
				}

			});

			this.clickCounter = 0;
		} else {

			//if the cards do not match, remove the cards from the list and hide the card's symbol
			$(cardHtmlElem).find('.card-container').on('transitionend', function() {
				$(cardHtmlElem).find('.card-container').off('transitionend');
				game.clickCounter = 2;
				game.playCardUnMatchAnimation(firstOne);
				game.playCardUnMatchAnimation(secondOne);
			});
		}
		this.openCards.length = 0;
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