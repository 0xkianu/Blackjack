/* DOM variables */
let cards = document.querySelectorAll('.card');
let deal = document.getElementById('deal-btn');
let hit = document.getElementById('hit-btn');
let stand = document.getElementById('stand-btn');
let userScene = document.getElementsByClassName('user-scene');
let dealerScene = document.getElementsByClassName('dealer-scene');
let scene = document.getElementsByClassName('scene');
let scene2 = document.getElementsByClassName('scene2');
let scene3 = document.getElementsByClassName('scene3');
let scene4 = document.getElementsByClassName('scene4');
let cardBack = document.getElementsByClassName('card_face--back');
let cardBack2 = document.getElementsByClassName('card_face--back2');
let cardBack3 = document.getElementsByClassName('card_face--back3');
let cardBack4 = document.getElementsByClassName('card_face--back4');
let userScoreBoard = document.getElementsByClassName('scoreboard user');
let dealerScoreBoard = document.getElementsByClassName('scoreboard dealer');
let userWinsBoard = document.getElementsByClassName('wins user');
let dealerWinsBoard = document.getElementsByClassName('wins dealer');
let announcement = document.getElementById('announce-msg');
let announceDiv = document.getElementsByClassName('announce-div');

/* global variables */
let myCard;
let myCard2;
let dealerCard;
let dealerCard2;
let cardImg;
let cardImg2;
let cardImg3;
let cardImg4;
let delay = 500;
let delay1 = 200;
let delay2 = 1000;
let delay3 = 1500;
let delay4 = 700;
let scoreDelay = 1400;
let deckCounter=4;
let userWins = 0;
let dealerWins = 0;

let userScore = [];
let dealerScore = [];
let userFinalScore = 0;
let dealerFinalScore = 0;

let userDeckCards = [];
let dealerDeckCards = [];
let userCards = [];
let dealerCards = [];

let userContinue = true;


/* Card class */
class card {
  constructor(suit, number, value, altvalue) {
    this.suit = suit;
    this.number = number;
    this.value = value;
    this.altvalue = altvalue;
  }
}

/* Deck as array of cards */
const deck = [];

/* instantiate buttons as disabled */
hit.disabled = true;
stand.disabled = true;

/* Populate the deck with cards */
for(let x=0; x < 12; x++) {
  let varSuit = '';
  let varCard;
  /* 3 decks of cards */
  if((x === 0)||(x === 4)||(x === 8)) {
    varSuit = 'hearts';
  } else if((x === 1)||(x === 5)||(x === 9)) {
    varSuit = 'diamonds';
  } else if((x === 2)||(x === 6)||(x === 10)) {
    varSuit = 'spades';
  } else if((x === 3)||(x === 7)||(x === 11)) {
    varSuit = 'clubs';
  }
  for(let y=2; y < 15; y++) {
    if(y < 11) {
      varCard = new card(varSuit, String(y), y, y);
    } else if(y === 11) {
      varCard = new card(varSuit, 'jack', 10, 10);
    } else if(y === 12) {
      varCard = new card(varSuit, 'queen', 10, 10);
    } else if(y === 13) {
      varCard = new card(varSuit, 'king', 10, 10);
    } else if(y === 14) {
      varCard = new card(varSuit, 'ace', 11, 1);
    }
    deck.push(varCard);
  } 
}

let sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};


/* Function to clear game board after game is over */
let clearGame = () => { 
  scene[0].classList.remove('visible');
  scene[0].classList.add('clear');
  setTimeout(function() {
    cards[0].classList.remove('is-flipped');
  }, delay);
  
  scene2[0].classList.remove('visible');
  scene2[0].classList.add('clear');
  setTimeout(function() {
    cards[2].classList.remove('is-flipped');
  }, delay);
  
  scene3[0].classList.remove('visible');
  scene3[0].classList.add('clear');
  setTimeout(function() {
    cards[1].classList.remove('is-flipped');
  }, delay);
  
  scene4[0].classList.remove('visible');
  scene4[0].classList.add('clear');
  setTimeout(function() {
    cards[3].classList.remove('is-flipped');
  }, delay);

  userCards.forEach(function(card) {
    card.classList.remove('visible');
    card.classList.add('clear');
  })

  dealerCards.forEach(function(card) {
    card.classList.remove('visible');
    card.classList.add('clear');
  })

  
  setTimeout(function() {
    userScene[0].innerHTML = '<div class="scene"><div class="card"><div class="card_face card_face--front"></div><div class="card_face card_face--back"></div></div></div><div class="scene2"><div class="card"><div class="card_face card_face--front"></div><div class="card_face card_face--back3"></div></div></div>';
  }, delay);
  setTimeout(function() {
    dealerScene[0].innerHTML = '<div class="scene3"><div class="card"><div class="card_face card_face--front"></div><div class="card_face card_face--back2"></div></div></div><div class="scene4"><div class="card"><div class="card_face card_face--front"></div><div class="card_face card_face--back4"></div></div></div>';
  }, delay);
 
  deal.disabled = false;
  hit.disabled = true;
  stand.disabled = true;
  deckCounter = 4;
  userCards = [];
  dealerCards = [];
  userDeckCards = [];
  dealerDeckCards = [];
  userScore = [];
  dealerScore = [];
  userFinalScore = 0;
  dealerFinalScore = 0;
  userScoreBoard[0].innerText = 0;
  dealerScoreBoard[0].innerText = 0;
  userContinue = true;
  dealerContinue = true;
  dealerContinue = true;
  setTimeout(function() {
    shuffleDeck();
  }, delay);
  announceDiv[0].style.visibility = 'hidden';
};

/* Calculate the score */
let calcUserScore = (scoreArray,deckCards,scoreBoard) => {
  let arrayLen = deckCards.length;
  let scoreLen = scoreArray.length;
  let lastScore = deckCards[arrayLen-1].value;
  let lastAltScore = deckCards[arrayLen-1].altvalue;
  let tempScore, tempAltScore, displayScore;

  /* If this is a new game */
  if(scoreLen === 0) {
      if(deckCards[0].score !== deckCards[0].altvalue) {
        scoreArray.push(deckCards[0].value);
        scoreArray.push(deckCards[0].altvalue);
      } else {
        scoreArray.push(deckCards[0].value);
      }
  }

  scoreLen = scoreArray.length;  /* reestablish length of scoreArray array */
  
  /* Add new scores for new card */
  if(lastScore !== lastAltScore) {
    for(let i=0; i < scoreLen; i++) {
      tempScore = lastScore + scoreArray[i];
      tempAltScore = lastAltScore + scoreArray[i];
      
      if(tempScore <= 21) {
        scoreArray.push(tempScore);
      }
      if(tempAltScore <= 21)  {
        scoreArray.push(tempAltScore);
      }
    }
  } else {
    for(let i=0; i < scoreLen; i++) {
      tempScore = lastScore + scoreArray[i];
      if(tempScore <= 21) {
        scoreArray.push(tempScore);
      }
    }
  }

  scoreArray.splice(0, scoreLen);
  scoreArray = [... new Set(scoreArray)];
  scoreLen = scoreArray.length; /* reset scoreArray array length */

  /* Check new scores */
  if (scoreArray.length === 0) {
    setTimeout(function() {
      scoreBoard[0].innerText = tempScore;
    }, scoreDelay);
    
    hit.disabled = true;
    stand.disabled = true;
    deal.disabled = false;
    userContinue = false;
    dealerContinue = false;
    userFinalScore = 'bust'; 
    playDealerHand();
    
  } else {
    displayScore = scoreArray.join('/');

    setTimeout(function() {
      scoreBoard[0].innerText = displayScore;
    }, scoreDelay);

    if(scoreArray.includes(21)) {
      if(arrayLen === 2) {
        console.log(scoreArray);
        userContinue = false;
        dealerContinue = false;
        userFinalScore = 'blackjack';
        setTimeout(function() {
          scoreBoard[0].innerText = userFinalScore;
        }, scoreDelay);
      }
      hit.disabled = true;
      stand.disabled = true;
      deal.disabled = false;
      
      playDealerHand(); 
    }

    if(userFinalScore !== 'blackjack') {
      userFinalScore = Math.max(...scoreArray);
    }
  }

}

let calcDealerScore = (scoreArray,deckCards) => {
  let arrayLen = dealerDeckCards.length;
  let scoreLen = dealerScore.length;
  let lastScore = dealerDeckCards[arrayLen-1].value;
  let lastAltScore = dealerDeckCards[arrayLen-1].altvalue;
  let tempScore, tempAltScore;

  if(scoreLen === 0) {
    if(dealerDeckCards[0].score !== deckCards[0].altvalue) {
      dealerScore.push(dealerDeckCards[0].value);
      dealerScore.push(dealerDeckCards[0].altvalue);
    } else {
      dealerScore.push(dealerDeckCards[0].value);
    }
  }
  
  scoreLen = dealerScore.length;  /* reestablish length of scoreArray array */
  
  /* Add new scores for new card */
  if(lastScore !== lastAltScore) {
    for(let i=0; i < scoreLen; i++) {
      tempScore = lastScore + dealerScore[i];
      tempAltScore = lastAltScore + dealerScore[i];
      
      if(tempScore <= 21) {
        dealerScore.push(tempScore);
      }
      if(tempAltScore <= 21)  {
        dealerScore.push(tempAltScore);
      }
    }
  } else {
    for(let i=0; i < scoreLen; i++) {
      tempScore = lastScore + dealerScore[i];
      if(tempScore <= 21) {
        dealerScore.push(tempScore);
      }
    }
  }

  dealerScore.splice(0, scoreLen);
  dealerScore = [... new Set(dealerScore)];
  scoreLen = dealerScore.length; /* reset scoreArray array length */

  /* Check new scores */
  if (dealerScore.length === 0) {
    hit.disabled = true;
    stand.disabled = true;
    deal.disabled = false;
    dealerContinue = false;
    
    dealerFinalScore = tempScore;
    
  } else {
    displayScore = scoreArray.join('/');

    if(dealerScore.includes(21)) {
      if(arrayLen === 2) {
        dealerFinalScore = 'blackjack';
      }
      dealerContinue = false;
    }

    if(dealerFinalScore !== 'blackjack') {
      dealerFinalScore = Math.max(...scoreArray);
    }
    
    if(dealerFinalScore >= 17) {
      dealerContinue = false;
    }
  }
}

let checkFinalScores = () => {
  let winner = '';
  if(userFinalScore === 'bust') {
    winner = 'DEALER WINS PLAYER BUST';
    dealerWins++;
  } else if(userFinalScore === 'blackjack') {
    if(dealerFinalScore === 'blackjack') {
      winner = 'PUSH';
    } else {
      winner = 'PLAYER WINS BLACKJACK!';
      userWins++;
    }
  } else if(dealerFinalScore === 'blackjack') {
    winner = 'DEALER WINS BLACKJACK';
    dealerWins++;
  } else if(dealerFinalScore > 21) {
    winner = 'PLAYER WINS DEALER BUST';
    userWins++;
  } else if(userFinalScore > dealerFinalScore) {
    winner = 'PLAYER WINS';
    userWins++;
  } else if(dealerFinalScore > userFinalScore) {
    winner = 'DEALER WINS';
    dealerWins++
  } else {
    winner = 'PUSH';
  }

  announceDiv[0].style.visibility = 'visible';
  announcement.innerText = winner;
  userWinsBoard[0].innerText = userWins;
  dealerWinsBoard[0].innerText = dealerWins;
}

/* Play the dealer's hand */
let playDealerHand = () => {
  deal.disabled = true;
  hit.disabled = true;
  stand.disabled = true;
  
  cards[3].classList.add('is-flipped');

  /* First card analysis */
  calcDealerScore(dealerScore,dealerDeckCards);

  if(dealerContinue) {
    while(dealerContinue) {
    /* deal new card to dealer */ 
      let newCard = document.createElement("div");
      let numScenes = (dealerScene[0].children).length;
      let deckCard = deck[deckCounter];
      let cardImg = `url("playing_cards\/${deckCard.number}_of_${deckCard.suit}.png")`;

      elWidth = numScenes * 5;
      newCard.innerHTML = '<div class="card"><div class="card_face card_face--front"></div><div class="card_face card_face--back"></div></div>';
      newCard.setAttribute('style', `width: 15%;height: 100%;perspective: 600px;position: absolute;top: -1000%;left: ${elWidth}%;`);
      newCard.querySelector(".card_face--back").style.backgroundImage = cardImg;
      dealerScene[0].append(newCard);
      dealerCards.push(newCard);
      dealerDeckCards.push(deck[deckCounter]);
      deckCounter++;
    
      calcDealerScore(dealerScore,dealerDeckCards,dealerScoreBoard);
    }
    
    for(let i=0; i < dealerCards.length; i++) {
      setTimeout(function() {
        dealerCards[i].classList.add('visible');
        setTimeout(function() {
          dealerCards[i].querySelector(".card").classList.add('is-flipped');
        }, delay)
      }, (delay1 * (i+2)));
    } 
  }
  dealerScoreBoard[0].innerText = dealerFinalScore;
  
  checkFinalScores();
  setTimeout(function() {
    deal.disabled = false;
  }, delay);
}

/* Function to shuffle the deck */
let shuffleDeck = () => {
  let currentIndex = deck.length,  randomIndex;
  cards = document.querySelectorAll('.card');

  while (currentIndex != 0) {
  
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex--;

  [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
  }
  
  myCard = deck[0];
  myCard2 = deck[2];
  dealerCard = deck[1];
  dealerCard2 = deck[3]
  cardImg = `url("playing_cards\/${myCard.number}_of_${myCard.suit}.png")`;
  cardImg2 = `url("playing_cards\/${dealerCard.number}_of_${dealerCard.suit}.png")`;
  cardImg3 = `url("playing_cards\/${myCard2.number}_of_${myCard2.suit}.png")`;
  cardImg4 = `url("playing_cards\/${dealerCard2.number}_of_${dealerCard2.suit}.png")`;

  cardBack[0].style.backgroundImage = cardImg;
  cardBack2[0].style.backgroundImage = cardImg2;
  cardBack3[0].style.backgroundImage = cardImg3;
  cardBack4[0].style.backgroundImage = cardImg4;

  userDeckCards.push(deck[0]);
  dealerDeckCards.push(deck[1]);
  userDeckCards.push(deck[2]);
  dealerDeckCards.push(deck[3]);
}


shuffleDeck();  /* Shuffle the deck to start the game */

/* Event listener for the deal button */
deal.addEventListener('click', function() {
    /* First card to player */
    clearGame();
    setTimeout(function() {
    scene[0].classList.remove('clear');
    scene[0].classList.add('visible');
    setTimeout(function() {
      cards[0].classList.add('is-flipped');
    }, delay);
    
    /* Second card to dealer */
    setTimeout(function() {
      scene3[0].classList.remove('clear');
      scene3[0].classList.add('visible');
      setTimeout(function() {
        cards[2].classList.add('is-flipped');
      }, delay);
    }, delay);
    
    /* Third card to player */
    setTimeout(function() {
      scene2[0].classList.remove('clear');
      scene2[0].classList.add('visible');
      setTimeout(function() {
        cards[1].classList.add('is-flipped');
      }, delay);
    }, delay2);

    /* Fourth card to player */
    setTimeout(function() {
      scene4[0].classList.remove('clear');
      scene4[0].classList.add('visible');
    }, delay3);

    deal.disabled = true;
    hit.disabled = false;
    stand.disabled = false;
    calcUserScore(userScore,userDeckCards,userScoreBoard); }, delay2);
});

/* Event listener for hit button */
hit.addEventListener('click', function() {
    let newCard = document.createElement("div");
    let numScenes = (userScene[0].children).length;
    let deckCard = deck[deckCounter];
    let cardImg = `url("playing_cards\/${deckCard.number}_of_${deckCard.suit}.png")`;

    elWidth = numScenes * 5;
    newCard.innerHTML = '<div class="card"><div class="card_face card_face--front"></div><div class="card_face card_face--back"></div></div>';
    newCard.setAttribute('style', `width: 15%;height: 100%;perspective: 600px;position: absolute;top: -1000%;left: ${elWidth}%;`);
    newCard.querySelector(".card_face--back").style.backgroundImage = cardImg;
    userScene[0].append(newCard);
    setTimeout(function() {
      newCard.classList.add('visible');
      setTimeout(function() {
        newCard.querySelector(".card").classList.add('is-flipped');
      }, delay);
    }, delay1);
    userCards.push(newCard);
    userDeckCards.push(deck[deckCounter]);
    deckCounter++;
    calcUserScore(userScore,userDeckCards,userScoreBoard);
});

/* Event listener for stand button */
stand.addEventListener('click', playDealerHand); 
