const btn = document.querySelectorAll("button");
const Result = document.getElementById("result");
const playerScoreEl = document.getElementById("user-score");
const computerScoreEl = document.getElementById("computer-score");

let playerScore = 0;
let computerScore = 0;

// Computer choice
const computer = () => {
  const choice = ["rock", "paper", "scissors"];
  const randomChoice = Math.floor(Math.random() * choice.length);
  return choice[randomChoice];
};

// Play round
const playRound = (playerSelection, computerSelection) => {
  // Stop if game already over
  if (playerScore === 10 || computerScore === 10) {
    return "Game Over! Refresh to play again.";
  }

  if (playerSelection === computerSelection) {
    return "Its a tie 🤝";
  } else if (
    (playerSelection === "rock" && computerSelection === "scissors") ||
    (playerSelection === "paper" && computerSelection === "rock") ||
    (playerSelection === "scissors" && computerSelection === "paper")
  ) {
    playerScore++;
    playerScoreEl.innerText = playerScore;
    Result.innerText = `You Win! ${playerSelection} beats ${computerSelection}`;
  } else {
    computerScore++;
    computerScoreEl.innerText = computerScore;
    Result.innerText = `You Lose! ${computerSelection} beats ${playerSelection}`;
  }

  // Check for game over
  if (playerScore === 10) {
    Result.innerText = "🎉 Game Over! You are the WINNER!";
    disableButtons();
  } else if (computerScore === 10) {
    Result.innerText = "💻 Game Over! Computer WINS!";
    disableButtons();
  }
};

// Disable buttons
const disableButtons = () => {
  btn.forEach((button) => (button.disabled = true));
};

// Button click event
btn.forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.id, computer());
  });
});
