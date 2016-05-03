//currentSessionOpen is the variable to show if we're in the middle of trying to match
var currentSessionOpen = false;
//initialize the prevousCard value for the checking of matches
var previousCard = null;
//initialize number of pairs to be 0
var numPairs = 0;

//this function adds the random letter cards we put into a stack and organizes them into the right rows and columns
function createDeck()
{
    var rows = 6;
    var cols = 6;
    var key = createRandom();
    var deck = {};
    deck.rows = [];

    // create each row
    for (var i = 0; i < rows; i++)
    {
        var row = {};
        row.cards = [];

        // creat each card in the row
        for (var j = 0; j < cols; j++)
        {
            var card = {};
            card.isFaceUp = false;
            card.item = key.pop();
            row.cards.push(card);
        }
        deck.rows.push(row);
    }
    return deck;
}

//this function takes a hard-coded array of characters and picks characters randomly. It then puts two of each random character in another 
//array, and removes the letter it picked from the choices so that the letter won't be duplicated as another match pair
function createRandom()
{
    var matches = 18;
    var pool = [];
    var answers = [];
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'W', 'X', 'Y', 'Z'];

    // makes a placeholder array to work with
    

    // create array for the total number of cards with the index mathing the value as a plceholder
    for (var i = 0; i < matches * 2; i++)
    {
        pool.push(i); // random numbers
    }

    // generate an array with the random letters
    for (var n = 0; n < matches; n++)
    {
        // grab random letter from array and remove that letter from the
        // original array

        //get random index of letter we want to grab
        var randLetter = Math.floor((Math.random() * letters.length));

        //grab the letter at the random index then remove that letter from the array of letters that we're starting from so we don't duplicate it
        var letter = letters[randLetter];
        removeByIndex(letters, randLetter);

        // get random index for placeholder array
        var randPool = Math.floor((Math.random() * pool.length));

        //insert letter into answers from the pool spot we just figured
        insertByIndex(answers, pool[randPool], letter);

        // remove the pool spot from the possible future pool spots so we don't put another random card in the same place
        removeByIndex(pool, randPool);

        // repeat above process 
        randPool = Math.floor((Math.random() * pool.length));
        insertByIndex(answers, pool[randPool], letter);
        removeByIndex(pool, randPool);
    }
    return answers;
}

// uses splice to remove from array
function removeByIndex(arr, index)
{
    arr.splice(index, 1);
}

//uses splice to add to array
function insertByIndex(arr, index, item)
{
    arr.splice(index, 0, item);
}


var app = angular.module('cards', ['ngAnimate']);

app.controller("CardController", function($scope, $timeout)
{

    $scope.deck = createDeck();



$scope.check = function(card)
{
    //case that there is a match of 2 cards picked
    if (currentSessionOpen && previousCard.item == card.item && !card.isFaceUp)
    {
        card.isFaceUp = true;
        previousCard = null;
        currentSessionOpen = false;
        numPairs++;
    }

    //case that there is not a match of 2 card picked
    else if (currentSessionOpen && previousCard.item != card.item && !card.isFaceUp)
    {
    	card.isFaceUp = true;
    	currentSessionOpen = false;
    	//turn the cards back over after we have seen the match fail
    	$timeout(function(){
    		previousCard.isFaceUp = card.isFaceUp = false;
    		previousCard = null;

    	}, 400);

    }
    //if we've only selected one
    else{
        card.isFaceUp = true;
        currentSessionOpen = true;
        previousCard = card;
    }


    //output message upon victory
    if (numPairs == 18)
    {
        alert("You've Done It!");
    }
};


});
