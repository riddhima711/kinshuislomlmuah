
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("enterBtn").addEventListener("click", () => {
  showScreen("dossier");
});

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.next);
  });
});

const gameArea = document.getElementById("gameArea");
const gameBtn = document.getElementById("gameBtn");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const gameHint = document.getElementById("gameHint");
const gameResult = document.getElementById("gameResult");

let score = 0;
let timeLeft = 15;
let gameRunning = false;
let gameTimer;
let spawnTimer;

function addStar() {
  if (!gameRunning) return;

  const star = document.createElement("button");
  star.className = "catch-star";
  star.type = "button";
  star.textContent = ["✦", "⭐", "💫"][Math.floor(Math.random() * 3)];
  star.setAttribute("aria-label", "Catch this star");

  const maxX = Math.max(0, gameArea.clientWidth - 55);
  const maxY = Math.max(0, gameArea.clientHeight - 55);

  star.style.left = Math.random() * maxX + "px";
  star.style.top = Math.random() * maxY + "px";

  star.addEventListener("click", () => {
    if (!gameRunning) return;
    score++;
    scoreText.textContent = score;
    star.remove();
    addStar();
  });

  gameArea.appendChild(star);

  setTimeout(() => star.remove(), 1400);
}

function startGame() {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);

  score = 0;
  timeLeft = 15;
  gameRunning = true;

  scoreText.textContent = score;
  timeText.textContent = timeLeft;
  gameResult.textContent = "";
  gameHint.textContent = "CATCH THOSE STARS!";
  gameBtn.textContent = "DRIVE IN PROGRESS...";

  gameArea.querySelectorAll(".catch-star").forEach(star => star.remove());

  for (let i = 0; i < 4; i++) addStar();

  spawnTimer = setInterval(addStar, 650);

  gameTimer = setInterval(() => {
    timeLeft--;
    timeText.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(gameTimer);
  clearInterval(spawnTimer);

  gameArea.querySelectorAll(".catch-star").forEach(star => star.remove());

  gameHint.textContent = "NIGHT DRIVE COMPLETE ✦";
  gameBtn.textContent = "PLAY AGAIN";
  
  const message = score >= 20
    ? "OKAY SPEED RACER, WHO GAVE YOU THIS MUCH POWER?"
    : score >= 10
      ? "NOT BAD, BIRTHDAY BOY. THE STARS APPROVE."
      : "THE VIEW WAS PRETTY, WASN'T IT? TRY AGAIN, DRIVER.";

  gameResult.textContent = message;
}

gameBtn.addEventListener("click", () => {
  if (!gameRunning) startGame();
});

document.getElementById("finalBtn").addEventListener("click", () => {
  showScreen("finale");
  launchConfetti();
});

document.getElementById("replayBtn").addEventListener("click", () => {
  clearInterval(gameTimer);
  clearInterval(spawnTimer);
  gameRunning = false;
  showScreen("welcome");
});

function launchConfetti() {
  const container = document.getElementById("confetti");
  container.innerHTML = "";

  const pieces = ["✦", "★", "💙", "✧", "·"];

  for (let i = 0; i < 65; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 2 + "s";
    piece.style.animationDuration = 2 + Math.random() * 2 + "s";
    piece.style.fontSize = 10 + Math.random() * 16 + "px";
    piece.style.color = ["#ffffff", "#83cfff", "#438fc7", "#173e64"][
      Math.floor(Math.random() * 4)
    ];

    container.appendChild(piece);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 5000);
}