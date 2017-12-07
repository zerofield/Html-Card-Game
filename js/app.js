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
	this.firstClick = true;
	this.seconds = 0;
	this.intervalId = 0;
	this.counter = 0;
	this.openCards = [];
	//create the deck
	this.deck = [];

	const icons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
	icons.forEach(item => {
		this.deck.push(new Card(item));
		this.deck.push(new Card(item));
	});

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
	this.clickCounter = 0;
	this.setStars(3);
	this.seconds = 0;

	clearInterval(this.intervalId);
	this.intervalId = 0;
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


	$('.seconds').html('0s');
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

		var game = this;
		this.intervalId = setInterval(() => {
			$('.seconds').html(`${++this.seconds}s`);
		}, 1000);
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

		if (this.counter >= 20) {
			this.setStars(1);
		} else if (this.counter >= 14) {
			this.setStars(2);
		} else {
			this.setStars(3);
		}

		//increment the move counter and display it on the page
		++this.counter;
		$('.moves').html('' + this.counter);

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
					//stop timer
					clearInterval(game.intervalId);
					$('.modal-body').html(`It took you ${game.seconds} seconds to match all cards!
						Do you want another round?`);


					var starHtml = '';
					for(var i = 0;i < game.stars; i++){
						starHtml += '<li><i class="fa fa-star"></i></li>';
					}

					$('.dialog-stars').html(starHtml);

					$('#myModal').modal();

					$('#myModal').on('hide.bs.modal', function() {
						game.restart();
					});

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