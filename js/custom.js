/*
 * Variables' declaration
 */
// Define a list that holds all card's tiles
var tiles = [
    'tile_01.png',
    'tile_01.png',
    'tile_02.png',
    'tile_02.png',
    'tile_03.png',
    'tile_03.png',
    'tile_04.png',
    'tile_04.png',
    'tile_05.png',
    'tile_05.png',
    'tile_06.png',
    'tile_06.png',
    'tile_07.png',
    'tile_07.png',
    'tile_08.png',
    'tile_08.png'
];

// Define variable for the html deck element
var deck = document.getElementById('deck');

// Define variable for the end game modal results
var modalContent = document.getElementById('modal-content');

// Define variable for the revealed cards
var revealedCards = 0;

// Define array to store the values of the cards picked in order to check for matching cards
var matchingCards = [];

// Define variable for the last card tile the user clicked on
var lastCardClicked = -1;

// Define varible that will allow to clear the setInterval
var stopInterval = '';

// Define variable to store the score
var score;

// Define variable to store the moves
var movesCounter;

// Define variables to set the timer counter
var miliseconds = 0, seconds = 0, minutes = 0, time;

// Define a variable for the time counter element
var timeCounter = document.getElementById('mytime');

// Define variable for the restart game glyphicon
var restartBtn = document.getElementById('restart-game').addEventListener('click', startGame);
 

/*
 * Start the GAME (call)
 */
startGame();
/*
 * @description Start the GAME (function), Display the cards on the page
 */
function startGame() {
    // Set score to zero
    score = 0;
    
    // Reset number of moves
    movesCounter = 0;
    setMoves(0);

    // Clear and start the time counter
    miliseconds = 0, seconds = 0, minutes = 0;
    clearTimeout(time);
    timer();

    // Clear setInterval timer
    clearInterval(stopInterval);

    // Shuffle list of cards using the provided "shuffle" method below
    tiles = shuffle(tiles);
    
    // Create new fresh start deck
    deck.innerHTML = '';
    
    // Clear modal content
    modalContent.innerHTML = '';

    // loop through each card and create its HTML, dinamically add each card's HTML to the page
    for (var index = 0; index < tiles.length; index++) {
        // Define variable for the cards inside tiles elements 
        var cards = ' class="card-face" src="img/tile_back.png" alt="card tiles images"';    
        // Define variable that will make the card tiles clickable
        var clickable = ' onclick="clickHandler(\'' + tiles[index] + '\', \'' + index + '\', this)"';
        // Define variable that dinamically sets and id for the cards' images
        var cardsId = ' id="check-card' + index + '"';
        // Set HTML elements deck
        deck.innerHTML += '<div class="col-md-3 col-xs-3 card-tile"><img' + cardsId + clickable + cards + '></div>';
    }
}


/*
 * @description Game logic for handling card tiles functionality
 * @param {string} card tile src element
 * @param {number} element iteration index
 * @param {string} html img element info
 */
function clickHandler(clickable, index, info) {
    // Handle revealed cards allowing to reveal only two cards
    if (revealedCards < 2 && lastCardClicked != index) {
        // Add revealed cards to the array so that allows to perform comparison on them
        matchingCards[revealedCards] = tiles[index];
        // Identify cards
        matchingCards[revealedCards + 2] = info.id;
        // Add revealed card tile and moves
        revealedCards++;
        setMoves(1);
        // Click event should reveal the hidden card's side
        info.src = 'img/' + tiles[index];
        // Perform marching comparisson on selected pair of cards
        if (revealedCards === 2) {
            if (matchingCards[0] === matchingCards[1]) {
                selectNewMatchingPair();
                // Tracking scores
                score++;
                // Check for game over
                if ((tiles.length / 2) <= score) {
                    $('#myModal').modal({ show: false})
                    $('#myModal').modal('show');
                    modalContent.innerHTML += 'Your time: ' + timeCounter.innerHTML + '<br>Number of Moves: ' + movesCounter + '<br>Rating: ' + rating;
                    clearTimeout(time);
                }
            } else {
                // Set up a time interval before tiles go back to unrevealed after half a sec
                stopInterval = setInterval(unmatchingCards, 500);
            }
        }
    lastCardClicked = index;
    }
}


/*
 * @description Manage unmatched card tiles
 */
function unmatchingCards() {
    // Reset card tile back to unrevealed card image
    document.getElementById(matchingCards[2]).src = "img/tile_back.png";
    document.getElementById(matchingCards[3]).src = "img/tile_back.png";
    selectNewMatchingPair();
}


/*
 * @description Selec new pair of card tiles to check
 * @description Reset counters and allow selecting new matching pair
 */
function selectNewMatchingPair() {
    // Clear out the value of revealed cards
    revealedCards = 0;
    // Empty the array of cards in order to allow new selecting cards
    matchingCards = [];
    // Avoid repeating selected card
    lastCardClicked = -1;
    // Clear setInterval timer
    clearInterval(stopInterval);
}


/*
 * @description Manage user's moves counter
 */
function setMoves(move) {
    movesCounter += move;
    numMoves = document.getElementById('clicks');
    numMoves.innerHTML = " Moves : " + movesCounter;
    // Update stars rating (call)
    updateStars(movesCounter);
}


/*
 * @description Manage stars rating counter
 * @param {number} from setMoves() number of user card tile clicks
 */
function updateStars(counter){
    ratingStars = document.getElementById('stars');
    star = '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
    ratingStars.innerHTML = star + star + star;
    rating = 'High';
    // Logic in order to show a specific number of stars
    if (counter >= 10 && counter <= 14) {
        ratingStars.innerHTML = star + star;
        rating = 'Medium';
    } else if (counter > 14) {
        ratingStars.innerHTML = star;
        rating = 'Low';
    }
}


/*
 * @description Manage timer counter
 */
function addTime() {
    seconds++;
    // Logic to update minutes every 60 seconds
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    // Logic to add leading zeros
    timeCounter.textContent = (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds > 9 ? seconds : '0' + seconds);
    timer();
}


/*
 * @description Add seconds to the timer counter
 */
function timer() {
    // Adding second to time
    time = setTimeout(addTime, 1000);
}


/*
 * @description Provided function that manage randomly shuffling card tiles
 *  Shuffle function from http://stackoverflow.com/a/2450976
 * @returns {array/list} randomly shuffled card tiles
 */
function shuffle(tiles) {
    var currentIndex = tiles.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = tiles[currentIndex];
        tiles[currentIndex] = tiles[randomIndex];
        tiles[randomIndex] = temporaryValue;
    }
    return tiles;
}