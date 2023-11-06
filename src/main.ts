import { Collision, Dog, Duck, Shoot } from "./classes";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export const CANVAS_WIDTH = (canvas.width = window.innerWidth);

export const CANVAS_HEIGHT =
  window.innerHeight < 500
    ? (canvas.height = window.innerHeight)
    : (canvas.height = 500);

export const POSIBLE_DUCK_COLORS = ["blue", "black", "red"];

const duckIconsElements = document.querySelector(
  "[data-duck-icons]"
) as HTMLDivElement;

const shotsBulletIcons = document.querySelector(
  "[data-shots-bullet-icons]"
) as HTMLDivElement;

export const scoreElement = document.querySelector("[data-score]");

export const levelElement = document.querySelector("[data-level-element]");
export const showHighScoreCard = document.querySelector(
  "[data-show-high-score-card]"
);
export const showFlyAwayCard = document.querySelector(
  "[data-show-fly-away-card]"
);
export const showLoseCard = document.querySelector("[data-show-lose-card]");
export const showGameOverCard = document.querySelector(
  "[data-show-game-over-card]"
);

export const requiredDucksBar = document.querySelector(
  "[data-required-ducks-bar]"
) as HTMLElement;

export const globalVariables = {
  currentLevel: 1 as number,
  currentRequiredDucks: 4 as number,
  duckIcons: [...duckIconsElements.children] as HTMLElement[],
  bulletIcons: [...shotsBulletIcons.children] as HTMLElement[],
  currentScore: 0 as number,
  levelsLeft: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as number[],
  ducksInTheLevel: [] as Duck[],
  ducksToShow: [] as Duck[],
  shootArr: [] as Shoot[],
};

export function showCard(
  card: "high score" | "fly away" | "lose" | "game over"
): void {
  switch (card) {
    case "high score":
      showHighScoreCard?.setAttribute("data-show-high-score-card", "true");
      break;
    case "fly away":
      showFlyAwayCard?.setAttribute("data-show-fly-away-card", "true");
      break;
    case "lose":
      showLoseCard?.setAttribute("data-show-lose-card", "true");
      break;
    case "game over":
      showGameOverCard?.setAttribute("data-show-game-over-card", "true");
      break;
  }
}

export function hideCard(
  card: "high score" | "fly away" | "lose" | "game over"
): void {
  switch (card) {
    case "high score":
      showHighScoreCard?.setAttribute("data-show-high-score-card", "false");
      break;
    case "fly away":
      showFlyAwayCard?.setAttribute("data-show-fly-away-card", "false");
      break;
    case "lose":
      showLoseCard?.setAttribute("data-show-lose-card", "false");
      break;
    case "game over":
      showGameOverCard?.setAttribute("data-show-game-over-card", "false");
      break;
  }
}

levelElement!.textContent = globalVariables.currentLevel.toString();
scoreElement!.textContent = globalVariables.currentScore.toString();

export const collisionInstance = new Collision();

export function countHuntedDucks(): void {
  const audioPoints = new Audio();
  audioPoints.src = "src/assets/audio/points.mp3";

  const audioLose = new Audio();
  audioLose.src = "src/assets/audio/lose.mp3";

  const audioHighScore = new Audio();
  audioHighScore.src = "src/assets/audio/high-score.mp3";

  const huntedDucksIcons = globalVariables.duckIcons.filter((duckIcon) => {
    const huntedDuckAttribute = duckIcon.getAttribute("data-hunted");
    return huntedDuckAttribute === "true";
  });

  let currentIndex = 0;

  function playNextAudioAndCount(): void {
    if (huntedDucksIcons.length < 1) {
      audioLose.play();
      showCard("lose");
      audioLose.onended = (): void => {
        hideCard("lose");
        setTimeout((): void => {
          gameOver();
        }, 500);
      };
    }

    if (currentIndex < huntedDucksIcons.length) {
      const duckIcon = huntedDucksIcons[currentIndex];
      duckIcon.setAttribute("data-counting", "true");
      audioPoints.play();

      audioPoints.onended = (): void => {
        duckIcon.removeAttribute("data-counting");
        currentIndex++;
        playNextAudioAndCount();
        if (currentIndex >= huntedDucksIcons.length) {
          if (huntedDucksIcons.length < globalVariables.currentRequiredDucks) {
            audioLose.play();
            showCard("lose");
            audioLose.onended = (): void => {
              hideCard("lose");
              setTimeout((): void => {
                gameOver();
              }, 500);
            };
          } else if (huntedDucksIcons.length === 10) {
            audioHighScore.play();
            increaseScore(100000);
            showCard("high score");

            audioHighScore.onended = (): void => {
              hideCard("high score");
              increaseRequiredDucksBar();
              setTimeout((): void => {
                goToNextLevel();
              }, 1000);
            };
          } else {
            increaseRequiredDucksBar();

            setTimeout((): void => {
              goToNextLevel();
            }, 1000);
          }
        }
      };
    }
  }
  playNextAudioAndCount();
}

export function goToNextLevel(): void {
  globalVariables.currentLevel++;

  levelElement!.textContent = globalVariables.currentLevel.toString();

  createDucksInTheLevel();
  restoreAmmo();
  restoreDuckIcons();

  dog.action = "starting next level";
  dog.declaringPositions();
}

export function gameOver(): void {
  showCard("game over");
  dog.action = "game over";
  dog.declaringPositions();
}

export function createDucksInTheLevel(): void {
  for (let i = 0; i < 10; i++) {
    const numberForColor = Math.round(Math.random() * 2);
    const colorNewDuck = POSIBLE_DUCK_COLORS[numberForColor];

    const newDuck = new Duck(colorNewDuck, globalVariables.currentLevel);
    newDuck.declaringPositions();
    globalVariables.ducksInTheLevel.push(newDuck);
  }
}

export function restoreDuckIcons(): void {
  globalVariables.duckIcons.forEach((duckIcon) => {
    duckIcon.setAttribute("data-hunted", "false");
  });
}

export function increaseRequiredDucksBar(): void {
  const audioDuckDrop = new Audio();
  audioDuckDrop.src = "src/assets/audio/duck-drop.mp3";

  if (globalVariables.currentRequiredDucks < 8) {
    audioDuckDrop.play();
    globalVariables.currentRequiredDucks++;
  }

  requiredDucksBar.style.width = `${
    globalVariables.currentRequiredDucks * 10
  }%`;
}

export function increaseScore(value: number): void {
  globalVariables.currentScore += value;
  scoreElement!.textContent = globalVariables.currentScore.toString();
}

export function restoreAmmo(): void {
  globalVariables.bulletIcons.forEach((bulletIcon) => {
    bulletIcon.setAttribute("data-spent", "false");
  });
}

export function showDucks(): void {
  restoreAmmo();
  if (globalVariables.currentLevel >= 5) {
    globalVariables.ducksToShow = globalVariables.ducksInTheLevel.splice(0, 2);
    globalVariables.ducksToShow.forEach((duck) => duck.declaringPositions());
  } else {
    globalVariables.ducksToShow = globalVariables.ducksInTheLevel.splice(0, 1);
    globalVariables.ducksToShow.forEach((duck) => duck.declaringPositions());
  }
}
function drawBackground(): void {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "brown";
  ctx.fillRect(50, CANVAS_HEIGHT - 300, 70, 300);
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(84, 150, 70, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
  ctx.fillStyle = "green";
  ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
}
drawBackground();

export const dog = new Dog();
dog.action = "starting game";
dog.declaringPositions();

function startGame() {
  const displayGameInfo = document.querySelector(
    "[data-display-game-info]"
  ) as HTMLParagraphElement;
  displayGameInfo.setAttribute("data-display-game-info", "true");

  createDucksInTheLevel();

  gameLoop();
}

function gameLoop() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();

  dog.update();
  dog.draw();

  globalVariables.ducksToShow.forEach((duck) => {
    duck.update();
    duck.draw();
  });

  globalVariables.shootArr.forEach((shoot) => {
    shoot.update();
    shoot.draw();
  });

  collisionInstance.collisionDucks();

  requestAnimationFrame(() => gameLoop());
}

const buttonStartGame = document.querySelector(
  "#start-game-btn"
) as HTMLButtonElement;

buttonStartGame.addEventListener("click", (e) => {
  startGame();
  buttonStartGame.remove();
});

canvas.addEventListener("click", (e: MouseEvent) => {
  const canvasBounds = canvas.getBoundingClientRect();

  const unspentBullets = globalVariables.bulletIcons.filter((bulletIcon) => {
    const spent = bulletIcon.getAttribute("data-spent");
    return spent !== "true";
  });

  if (
    dog.action === "starting game" ||
    dog.action === "hunted duck" ||
    dog.action === "starting next level" ||
    unspentBullets.length === 0
  ) {
    return;
  }

  unspentBullets[unspentBullets.length - 1].setAttribute("data-spent", "true");

  const shoot = new Shoot(e.x - canvasBounds.left, e.y - canvasBounds.top);
  const shootSound = new Audio("src/assets/audio/gunshot.mp3");
  shootSound.play();

  globalVariables.shootArr.push(shoot);
});
