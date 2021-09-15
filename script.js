const gameContainer = document.getElementById("game");
//variables init
let clickNumber;
let score;
let completePair;
let completedPairs = [];
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

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

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
  
  //no more than two tries
  if (clickNumber>=0){
    //Increase score by 10 per click
    score+=10; 
    showScore(score);

    //Select all div on the page with a style and put them in an Array
    //Compare the colors in the array with the colors of completed pair
    //if equal, remove them from the playCard array so only the color of the  card clicked is used to find a match
    const playCards = document.querySelectorAll('div[style]');//nodeList
    const myArray= Array.from(playCards);///convert node list to array
       console.log(myArray);
    for (let i=0; i<myArray.length; i++){
      for (let pairColor of completedPairs){
        if(myArray[i]!==null){
          if (myArray[i].style.backgroundColor===pairColor){
            myArray[i]=null;
          }
        }
      }
    }
    const playCard = myArray.filter(e=>e!==null); 

    // Change background color of card when clicked on
    //Get the value in the class and assigns it to the background 
    let cardColor = card.classList.value;
    card.style.backgroundColor = cardColor;

    //Enter the loop for logic testing only if one card is already turned
    if (playCard[0]!=null){ 
      //first card turned and second card clicked have same background && cards are different...it's a match
      if(playCard[0].style.backgroundColor===cardColor && card !== playCard[0]){
        setTimeout(function(){alert("It's a match! ... Keep going to complete the game!");},10);
        //one pair completed added to the array of completed pairs
        completedPairs.push(cardColor);
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
      //Click on same card...send alert and delete styles for the game to continue
      else if (card === playCard[0]){
        setTimeout(function(){alert('Do not play the same card!');},10)
        setTimeout(function(){card.removeAttribute('style');playCard[0].removeAttribute('style');clickNumber=2;},10);
      }
      //Try again...also remove the style so the game can be played again (bug: sometimes the word 'style' remains as attribute in the div) 
      else{
        setTimeout(function(){card.removeAttribute('style');playCard[0].removeAttribute('style');clickNumber=2;console.log(playCard[0], card)},1000);
    }
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
