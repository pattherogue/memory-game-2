const gameContainer = document.getElementById("game");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const scoreDisplay = document.getElementById("score");
const lowestScoreDisplay = document.getElementById("lowest-score");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-btn");

let COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
  "cyan",
  "yellow",
  // Add more colors here as needed
];

let shuffledColors = [];
let score = 0;
let lowestScore = localStorage.getItem('lowestScore') || Infinity;
let flippedCards = [];
let isClickAllowed = false;

function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("card");
    newDiv.style.backgroundColor = color;
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.appendChild(newDiv);
  }
}

function handleCardClick(event) {
  const card = event.target;

  if (!isClickAllowed || card === flippedCards[0] || card.classList.contains('flipped')) {
    return;
  }

  card.style.backgroundColor = card.classList[1];
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    isClickAllowed = false;

    const [card1, card2] = flippedCards;

    if (card1.style.backgroundColor === card2.style.backgroundColor) {
      score++;
      updateScore();
      if (score === shuffledColors.length / 2) {
        if (score < lowestScore) {
          lowestScore = score;
          localStorage.setItem('lowestScore', lowestScore);
          lowestScoreDisplay.textContent = `Lowest Score: ${lowestScore}`;
        }
        // Game over handling, you can add a message or logic here
      }

      flippedCards = [];
      isClickAllowed = true;
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          card.style.backgroundColor = '';
          card.classList.remove('flipped');
        });
        flippedCards = [];
        isClickAllowed = true;
      }, 1000);
    }
  } else if (flippedCards.length === 1) {
    isClickAllowed = true;
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

startButton.addEventListener('click', () => {
  showModal();
});

restartButton.addEventListener('click', () => {
  restartGame();
});

closeBtn.addEventListener('click', () => {
  closeModal();
});

function showModal() {
  modal.style.display = "block";
  startButton.disabled = true;
  restartButton.disabled = true;
}

function closeModal() {
  modal.style.display = "none";
  startButton.disabled = false;
  restartButton.disabled = true;
  startGame();
}

function startGame() {
  score = 0;
  updateScore();
  shuffledColors = shuffle(COLORS);
  gameContainer.innerHTML = "";
  createDivsForColors(shuffledColors);
  isClickAllowed = true;
}

function restartGame() {
  startButton.disabled = true;
  restartButton.disabled = true;
  score = 0;
  updateScore();
  shuffledColors = shuffle(COLORS);
  gameContainer.innerHTML = "";
  createDivsForColors(shuffledColors);
  isClickAllowed = true;
}

updateScore();
