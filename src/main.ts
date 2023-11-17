const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;

//----------Canvas variables
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const CANVAS_WIDTH: number = (canvas.width = window.innerWidth);

const CANVAS_HEIGHT: number =
  window.innerHeight < 500
    ? (canvas.height = window.innerHeight)
    : (canvas.height = 500);

const POSIBLE_DUCK_COLORS = ["blue", "black", "red"];

const duckIconsElements = document.querySelector(
  "[data-duck-icons]"
) as HTMLDivElement;

const shotsBulletIcons = document.querySelector(
  "[data-shots-bullet-icons]"
) as HTMLDivElement;

const scoreElement = document.querySelector(
  "[data-score]"
) as HTMLParagraphElement;

const levelElement = document.querySelector(
  "[data-level-element]"
) as HTMLSpanElement;
const showHighScoreCard = document.querySelector(
  "[data-show-high-score-card]"
) as HTMLDivElement;
const showFlyAwayCard = document.querySelector("[data-show-fly-away-card]");
const showLoseCard = document.querySelector(
  "[data-show-lose-card]"
) as HTMLDivElement;
const showGameOverCard = document.querySelector(
  "[data-show-game-over-card]"
) as HTMLDivElement;

const requiredDucksBar = document.querySelector(
  "[data-required-ducks-bar]"
) as HTMLDivElement;
//----------Canvas variables END

//----------Classes and sprites
const GAME_SPRITES_DOG = new Image();

GAME_SPRITES_DOG.src = "src/assets/game-sprites-dog.png";

const GAME_SPRITES_DUCKS = new Image();

GAME_SPRITES_DUCKS.src = "src/assets/game-sprites-ducks.png";
class Dog {
  public x: number;
  public y: number;
  public speedX: number;
  public speedY: number;
  public spriteWidth: number;
  public spriteHeight: number;
  public width: number;
  public height: number;
  public spriteFrameX: number;
  public spriteFrameY: number;
  public animationSpeed: number;
  public frames;
  public counterAnimation: number;
  public audio: HTMLAudioElement;
  public action:
    | ""
    | "idle"
    | "starting game"
    | "hunted duck"
    | "flew away duck"
    | "starting next level"
    | "game over";

  constructor() {
    this.action = "";
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.width = 100;
    this.height = 94;

    this.spriteFrameX = 0;
    this.spriteFrameY = 0;
    this.animationSpeed = 7;
    this.frames = 0;
    this.counterAnimation = 0;
    this.audio = new Audio();
  }

  declaringPositions(): void {
    if (this.action === "idle") {
      this.counterAnimation = 0;
      this.x = -100;
      this.y = -100;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteWidth = 0;
      this.spriteHeight = 0;
    }
    if (
      this.action === "starting game" ||
      this.action === "starting next level"
    ) {
      this.counterAnimation = 0;
      this.x = 0;
      this.y = CANVAS_HEIGHT - this.height;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteFrameX = 0;
      this.spriteFrameY = 0;
      this.spriteWidth = 60;
      this.spriteHeight = 54;
      if (this.action === "starting game")
        this.audio.src = "src/assets/audio/starting-game.mp3";
      if (this.action === "starting next level")
        this.audio.src = "src/assets/audio/next-round.mp3";
    }
    if (this.action === "hunted duck") {
      this.counterAnimation = 0;
      this.x = CANVAS_WIDTH * 0.5;
      this.y = CANVAS_HEIGHT - this.height;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteFrameX = 5;
      this.spriteFrameY = 0;
      this.spriteWidth = 62.5;
      this.spriteHeight = 54;
      this.audio.src = "src/assets/audio/duck-caught.mp3";
    }
    if (this.action === "flew away duck" || this.action === "game over") {
      this.counterAnimation = 0;
      this.x = CANVAS_WIDTH * 0.5;
      this.y = CANVAS_HEIGHT - this.height;
      this.speedX = 0;
      this.speedY = 0;

      this.spriteFrameX = 4;
      this.spriteFrameY = 1;
      this.spriteWidth = 62.5;
      this.spriteHeight = 54;
      if (this.action === "flew away duck")
        this.audio.src = "src/assets/audio/dog-laughing.mp3";
      if (this.action === "game over")
        this.audio.src = "src/assets/audio/lose-2.mp3";
    }
  }

  update(): void {
    if (this.frames % this.animationSpeed === 0) {
      if (
        this.action === "starting game" ||
        this.action === "starting next level"
      ) {
        if (this.audio.currentTime < this.audio.duration) this.audio.play();
        this.speedX = 8;

        if (this.counterAnimation >= 20) {
          this.spriteFrameX = 4;
          this.speedX = 0;

          if (this.counterAnimation >= 40) {
            this.spriteFrameY = 1;
            this.spriteFrameX = 0;
            if (this.counterAnimation >= 50) {
              this.spriteFrameX++;
              this.speedY = -20;
              this.speedX = 4;

              if (this.counterAnimation >= 55 /*Dog hiding*/) {
                this.speedY = 20;
                this.spriteFrameX++;
                if (this.y > CANVAS_HEIGHT) {
                  this.action = "idle";
                  this.declaringPositions();
                  showDucks();
                }
              }
            }
          }
          this.counterAnimation++;
        } else {
          this.spriteFrameX < 3 ? this.spriteFrameX++ : (this.spriteFrameX = 0);
          this.counterAnimation++;
        }
      }

      if (this.action === "hunted duck") {
        if (this.audio.currentTime < this.audio.duration) this.audio.play();
        this.speedY = -15;
        if (this.y <= CANVAS_HEIGHT - 165 && this.counterAnimation < 10) {
          this.speedY = 0;
        }
        if (this.counterAnimation >= 10) {
          this.speedY = 15;
          if (this.y > CANVAS_HEIGHT) {
            this.action = "idle";

            this.declaringPositions();
            showDucks();
            if (
              globalVariables.ducksInTheLevel.length === 0 &&
              globalVariables.ducksToShow.length === 0
            ) {
              countHuntedDucks();
            }
          }
        }
        this.counterAnimation++;
      }

      if (this.action === "flew away duck") {
        if (this.audio.currentTime < this.audio.duration) this.audio.play();
        this.spriteFrameX === 4 ? (this.spriteFrameX = 3) : this.spriteFrameX++;
        this.speedY = -15;
        if (this.y <= CANVAS_HEIGHT - 165 && this.counterAnimation < 10) {
          this.speedY = 0;
        }
        if (this.counterAnimation >= 10) {
          this.speedY = 15;
          if (this.y > CANVAS_HEIGHT) {
            this.action = "idle";
            this.declaringPositions();
            showDucks();
            if (
              globalVariables.ducksInTheLevel.length === 0 &&
              globalVariables.ducksToShow.length === 0
            ) {
              countHuntedDucks();
            }
          }
        }
        this.counterAnimation++;
      }
      if (this.action === "game over") {
        if (this.audio.currentTime < this.audio.duration) this.audio.play();
        this.spriteFrameX === 4 ? (this.spriteFrameX = 3) : this.spriteFrameX++;
        this.speedY = -15;
        if (this.y <= CANVAS_HEIGHT - 165 && this.counterAnimation < 10) {
          this.speedY = 0;
        }
      }
      this.x += this.speedX;
      this.y += this.speedY;
    }

    this.frames++;
  }

  draw(): void {
    if (
      this.action === "starting game" ||
      this.action === "starting next level"
    ) {
      ctx.drawImage(
        GAME_SPRITES_DOG,
        this.spriteWidth * this.spriteFrameX,
        this.spriteHeight * this.spriteFrameY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      if (this.counterAnimation >= 55 /*Dog hiding*/) {
        //When starting the game, create some grass so the dog can hide
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
        ctx.fillStyle = "green";
        ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
      }
    }

    if (
      this.action === "hunted duck" ||
      this.action === "flew away duck" ||
      this.action === "game over"
    ) {
      ctx.drawImage(
        GAME_SPRITES_DOG,
        this.spriteWidth * this.spriteFrameX,
        this.spriteHeight * this.spriteFrameY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      ctx.fillStyle = "lightgreen";
      ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
      ctx.fillStyle = "green";
      ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    }
  }
}

class Duck {
  public action: "flying" | "dying" | "fly away" | "hunted" | "flew away";
  public removeCollisionDetecion: boolean;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public spriteWidth: number;
  public spriteHeight: number;
  public spriteFrameX: number;
  public spriteFrameY: number;
  public speedXOnLevel: number;
  public speedYOnLevel: number;
  public speedX: number;
  public speedY: number;
  public animationSpeed: number;
  public frames: number;
  public counterAnimation: number;
  public audio: HTMLAudioElement;
  public initialTime: number;

  constructor(public color: string, public level: number) {
    this.level = level;
    this.action = "flying";
    this.removeCollisionDetecion = false;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 94;
    this.color = color;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.spriteFrameX =
      this.color === "blue" ? 0 : this.color === "black" ? 3 : 6;

    this.spriteFrameY = 0;
    this.speedXOnLevel = level >= 12 ? 12 : level + 1;
    this.speedYOnLevel = level >= 12 ? 12 : level + 1;
    this.speedX = this.speedXOnLevel;
    this.speedY = this.speedYOnLevel;
    this.animationSpeed = 4;
    this.frames = 0;
    this.counterAnimation = 0;
    this.audio = new Audio("src/assets/audio/duck-flapping.mp3");
    this.initialTime = 0;
  }

  changeAudio(): void {
    if (this.action === "dying") {
      this.audio.src = "src/assets/audio/duck-falling.mp3";
    }
    if (this.action === "hunted") {
      this.audio.src = "src/assets/audio/duck-drop.mp3";
    }
  }

  declaringPositions(): void {
    this.initialTime = Date.now();

    const randomX: number = Math.round(
      Math.random() * CANVAS_WIDTH - this.width - 0 + this.width
    );
    const randomY: number = Math.round(
      Math.random() * (CANVAS_HEIGHT - 150) - 0 + this.height
    );
    this.x = randomX;
    this.y = randomY;
    if (this.color === "blue") {
      this.spriteWidth = 38;
      this.spriteHeight = 40;
    }
    if (this.color === "black" || this.color === "red") {
      this.spriteWidth = 42;
      this.spriteHeight = 40;
    }
  }

  changeDirection(): void {
    const negativeOrPositiveX: boolean =
      Math.round(Math.random() * 10) >= 5 ? true : false;
    const negativeOrPositiveY: boolean =
      Math.round(Math.random() * 10) >= 5 ? true : false;

    if (negativeOrPositiveX) {
      this.speedX = Math.abs(this.speedXOnLevel);
    } else {
      this.speedX = -Math.abs(this.speedXOnLevel);
    }

    if (negativeOrPositiveY) {
      this.speedY = Math.abs(this.speedYOnLevel);
    } else {
      this.speedY = -Math.abs(this.speedYOnLevel);
    }

    if (this.spriteFrameY === 0) {
      this.spriteFrameY = 1;
    } else {
      this.spriteFrameY = 0;
    }
  }

  delete(typeOfDelete: "flew away" | "hunted"): void {
    const currentLevelGreaterThanFour: boolean = this.level > 4 ? true : false;

    if (typeOfDelete === "flew away") {
      const flyingDucks: boolean = globalVariables.ducksToShow.some((duck) => {
        return duck.action !== "hunted" && duck.action !== "flew away";
      });

      if (!flyingDucks) {
        hideCard("fly away");

        dog.action = "flew away duck";
        dog.declaringPositions();
        currentLevelGreaterThanFour
          ? globalVariables.ducksToShow.splice(0, 2)
          : globalVariables.ducksToShow.splice(0, 1);
      }
    } else {
      increaseScore(1000);

      const numberOfDucksInLevel: 2 | 1 = currentLevelGreaterThanFour ? 2 : 1;

      const notHuntedDuckIcons: HTMLElement[] =
        globalVariables.duckIcons.filter((duckIcon) => {
          const huntedDuckAttribute = duckIcon.getAttribute("data-hunted");
          return huntedDuckAttribute !== "true";
        });

      notHuntedDuckIcons[0].setAttribute("data-hunted", "true");

      const huntedDucks: Duck[] = globalVariables.ducksToShow.filter((duck) => {
        return duck.action === "hunted";
      });

      const flyingDucks: boolean = globalVariables.ducksToShow.some((duck) => {
        return duck.action !== "hunted" && duck.action !== "flew away";
      });

      if (huntedDucks.length === numberOfDucksInLevel && !flyingDucks) {
        dog.action = "hunted duck";
        dog.declaringPositions();
        currentLevelGreaterThanFour
          ? globalVariables.ducksToShow.splice(0, 2)
          : globalVariables.ducksToShow.splice(0, 1);
      } else if (flyingDucks) {
      } else {
        hideCard("fly away");

        dog.action = "flew away duck";
        dog.declaringPositions();
        currentLevelGreaterThanFour
          ? globalVariables.ducksToShow.splice(0, 2)
          : globalVariables.ducksToShow.splice(0, 1);
      }
    }
  }

  update(): void {
    if (this.action === "flying") {
      this.counterAnimation++;
      if (this.audio.currentTime >= this.audio.duration * 0.8) {
        this.audio.currentTime = 0;
      }
      this.audio.play();

      const currentTime: number = Date.now() - this.initialTime;

      const currentSeconds: number = currentTime / 1000;

      console.log(currentSeconds);
      if (currentSeconds >= 5) {
        this.action = "fly away";
      }

      if (this.frames % this.animationSpeed === 0) {
        if (this.counterAnimation >= 70) {
          this.changeDirection();
          this.counterAnimation = 0;
        }

        if (this.color === "blue") {
          this.spriteFrameX <= 1
            ? this.spriteFrameX++
            : (this.spriteFrameX = 0);
        }
        if (this.color === "black") {
          this.spriteFrameX <= 4
            ? this.spriteFrameX++
            : (this.spriteFrameX = 3);
        }
        if (this.color === "red") {
          this.spriteFrameX <= 7
            ? this.spriteFrameX++
            : (this.spriteFrameX = 6);
        }
      }
    }
    if (this.action === "dying") {
      this.removeCollisionDetecion = true;
      this.spriteFrameX =
        this.color === "blue" ? 0 : this.color === "black" ? 3 : 6;
      this.spriteFrameY = 3;
      this.speedX = 0;
      this.speedY = 0;
      this.counterAnimation++;

      if (this.counterAnimation >= 100) {
        this.audio.play();
        this.speedY = 10;
        this.spriteFrameX =
          this.color === "blue" ? 1 : this.color === "black" ? 4 : 7;

        if (this.y >= CANVAS_HEIGHT) {
          this.action = "hunted";
          this.changeAudio();
          this.audio.play();
          this.delete("hunted");
        }
      }
    }
    if (this.action === "fly away") {
      showCard("fly away");
      this.removeCollisionDetecion = true;
      this.spriteFrameY = 2;
      this.speedX = 0;
      this.speedY = -10;
      if (this.frames % this.animationSpeed === 0) {
        if (this.color === "blue") {
          this.spriteFrameX <= 1
            ? this.spriteFrameX++
            : (this.spriteFrameX = 0);
        }
        if (this.color === "black") {
          this.spriteFrameX <= 4
            ? this.spriteFrameX++
            : (this.spriteFrameX = 3);
        }
        if (this.color === "red") {
          this.spriteFrameX <= 7
            ? this.spriteFrameX++
            : (this.spriteFrameX = 6);
        }
      }
      if (this.y + this.height < 0) {
        this.action = "flew away";
        this.delete("flew away");
      }
      this.counterAnimation++;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.frames++;
  }

  draw(): void {
    ctx.drawImage(
      GAME_SPRITES_DUCKS,
      this.spriteWidth * this.spriteFrameX,
      this.spriteHeight * this.spriteFrameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (this.action === "dying") {
      ctx.drawImage(
        GAME_SPRITES_DUCKS,
        this.spriteWidth * this.spriteFrameX,
        this.spriteHeight * this.spriteFrameY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      ctx.fillStyle = "lightgreen";
      ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
      ctx.fillStyle = "green";
      ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    }
  }
}

class Shoot {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public frames: number;
  public counterAnimation: number;
  constructor(public eventX: number, public eventY: number) {
    this.width = 40;
    this.height = 40;
    this.x = eventX - this.width * 0.5;
    this.y = eventY - this.height * 0.5;
    this.frames = 0;
    this.counterAnimation = 0;
  }

  delete() {
    const indexOfThis: number = globalVariables.shootArr.indexOf(this);
    globalVariables.shootArr.splice(indexOfThis, 1);

    const unspentBullets: HTMLElement[] = globalVariables.bulletIcons.filter(
      (bulletIcon) => {
        const spent = bulletIcon.getAttribute("data-spent");
        return spent !== "true";
      }
    );

    const aliveDucks: Duck[] = globalVariables.ducksToShow.filter((duck) => {
      return duck.action === "flying";
    });

    if (unspentBullets.length === 0 && aliveDucks.length !== 0) {
      aliveDucks.forEach((duck) => {
        duck.action = "fly away";
      });
      return;
    }
  }

  update(): void {
    collisionInstance.collisionShoot(this);
    if (this.counterAnimation === 10) {
      this.delete();
    }
    this.counterAnimation++;
    this.frames++;
  }

  draw(): void {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Collision {
  collisionDucks(): void {
    globalVariables.ducksToShow.forEach((duck) => {
      const borderTop: number = 0;
      const borderRight: number = CANVAS_WIDTH - duck.width;
      const borderBottom: number = CANVAS_HEIGHT - duck.height - 100;
      const borderLeft: number = 0;

      if (duck.removeCollisionDetecion) return;
      if (duck.x <= borderLeft) {
        duck.x = borderLeft;
        duck.speedX = Math.abs(duck.speedX);
      }
      if (duck.x >= borderRight) {
        duck.x = borderRight;
        duck.speedX = -Math.abs(duck.speedX);
      }
      if (duck.y <= borderTop) {
        duck.y = borderTop;
        duck.speedY = Math.abs(duck.speedY);
      }
      if (duck.y >= borderBottom) {
        duck.y = borderBottom;
        duck.speedY = -Math.abs(duck.speedY);
      }
    });
  }

  collisionShoot(shoot: Shoot): void {
    globalVariables.ducksToShow.forEach((duck) => {
      if (duck.action === "flying") {
        if (
          shoot.x > duck.x + duck.width ||
          shoot.x + shoot.width < duck.x ||
          shoot.y > duck.y + duck.height ||
          shoot.y + shoot.height < duck.y
        ) {
          //No collision
        } else {
          duck.counterAnimation = 0;
          duck.action = "dying";
          duck.changeAudio();
        }
      }
    });
  }
}
//----------Classes and sprites END

//--------------------Global Variables--------------------
const globalVariables = {
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

levelElement!.textContent = globalVariables.currentLevel.toString();
scoreElement!.textContent = globalVariables.currentScore.toString();
//--------------------Global Variables END--------------------

//----------Functions
function startGame() {
  const displayGameInfo = document.querySelector(
    "[data-display-game-info]"
  ) as HTMLParagraphElement;
  displayGameInfo.setAttribute("data-display-game-info", "true");

  createDucksInTheLevel();

  gameLoop();
}

function countHuntedDucks(): void {
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

function goToNextLevel(): void {
  globalVariables.currentLevel++;

  levelElement!.textContent = globalVariables.currentLevel.toString();

  createDucksInTheLevel();
  restoreAmmo();
  restoreDuckIcons();

  dog.action = "starting next level";
  dog.declaringPositions();
}

function gameOver(): void {
  showCard("game over");
  dog.action = "game over";
  dog.declaringPositions();
}

function showCard(
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

function hideCard(
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

function createDucksInTheLevel(): void {
  for (let i = 0; i < 10; i++) {
    const numberForColor: number = Math.round(Math.random() * 2);
    const colorNewDuck: string = POSIBLE_DUCK_COLORS[numberForColor];

    const newDuck = new Duck(colorNewDuck, globalVariables.currentLevel);
    newDuck.declaringPositions();
    globalVariables.ducksInTheLevel.push(newDuck);
  }
}

function restoreDuckIcons(): void {
  globalVariables.duckIcons.forEach((duckIcon) => {
    duckIcon.setAttribute("data-hunted", "false");
  });
}

function increaseRequiredDucksBar(): void {
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

function increaseScore(value: number): void {
  globalVariables.currentScore += value;
  scoreElement!.textContent = globalVariables.currentScore.toString();
}

function restoreAmmo(): void {
  globalVariables.bulletIcons.forEach((bulletIcon) => {
    bulletIcon.setAttribute("data-spent", "false");
  });
}

function showDucks(): void {
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
//----------Functions

//----------Game loop
const dog = new Dog();
dog.action = "starting game";
dog.declaringPositions();

const collisionInstance = new Collision();

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
//----------Game loop END

//----------Event listeners
const buttonStartGame = document.querySelector(
  "#start-game-btn"
) as HTMLButtonElement;

buttonStartGame.addEventListener("click", () => {
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
//----------Event listeners END
