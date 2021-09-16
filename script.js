const gameContainer = document.getElementById("game");
//variables init
let clickNumber;
let score;
let completePair;
//initialize best score from local storage
bestScoreInit();

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over and hidden class (hidden will override color if declared last in the css)
    newDiv.classList.add(color, 'hidden');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// Action when card is clicked
function handleCardClick(event) {
  let card = event.target;

  //reduce click counter
  clickNumber--;
  
  // Change background color of card when clicked on
  //Remove class hidden to the card clicked
  card.classList.remove('hidden');
  card.setAttribute('id','clicked');

  //no more than two tries
  if (clickNumber===0){
    //Increase score by 10 per click
    score+=10; 
    showScore(score);

    let playCard = document.querySelectorAll("#clicked");
    //Click on same card...send alert and delete styles for the game to continue
      if (playCard.length===1){
        setTimeout(function(){alert('Do not play the same card!');},10)
        setTimeout(function(){card.classList.add('hidden');playCard[0].removeAttribute('id');playCard[0].classList.add('hidden');clickNumber=2;},10);
      }

      else if(playCard[0].className===playCard[1].className){
        playCard[0].setAttribute('id','on');
        playCard[1].setAttribute('id','on');
        clickNumber=2;
        completePair++;
        //end of game
        if (completePair===COLORS.length/2){
          clickNumber=-1;//negative value to clickNumber to avoid further action clicks
          newBestScore(score);
          bestScoreInit()
          score=0;
          setTimeout(function(){alert("You win...use start button to play again!");},10);
        }
      }
      else{
        setTimeout(function(){playCard[0].classList.add('hidden');playCard[0].removeAttribute('id');playCard[1].removeAttribute('id');playCard[1].classList.add('hidden');clickNumber=2;},1000);
      }
    }
}

//reset the game board
function resetGame(){
  let cardDiv = document.querySelectorAll('#game div');
  for(let card of cardDiv){
    card.remove();
  }  
}

//show score function
function showScore(value){
  const currentScore = document.querySelector('#currentScore');
  currentScore.innerText = value;

  return value;
}

//download local Storage best score
function bestScoreInit(){
  let bestScore=localStorage.getItem('bestScore');
  //Select best score element in html
  const minScore = document.querySelector('#bestScore');
  //if no score in local storage
  if (bestScore===null){
    minScore.innerText = 'No Best Score Yet';
  } 
  //if any score, assign to html element
  else{
    minScore.innerText = JSON.stringify(bestScore);
  }
}
  
//upload best score to local storage
function newBestScore(value){
  let savedBestScore=localStorage.getItem('bestScore');
  //if new score is lower than best score, replace. If no score yet in local storage, copy assigne new score
  if (value< parseInt(JSON.stringify(savedBestScore)) || savedBestScore===null){
    localStorage.setItem('bestScore', String(value));
  }
}
 

// Start the game when the start button is pressed
let startButton=document.querySelector('#startButton button');
startButton.addEventListener("click", function(){
  //remove old game board
  resetGame();
  //create new game board;
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  //initialize number of clicks allowed
  clickNumber=2;
  //Setup scores
  score=showScore(0);
  //init best score with local storage data when DOM loads
  bestScoreInit();
  //init completePair
  completePair=0;

})
