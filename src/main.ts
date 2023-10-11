import { Collision, Dog, Duck, Shoot } from './classes';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export const CANVAS_WIDTH =
  window.innerWidth < 1024
    ? (canvas.width = window.innerWidth)
    : (canvas.width = 1024);
export const CANVAS_HEIGHT =
  window.innerHeight < 500
    ? (canvas.height = window.innerHeight)
    : (canvas.height = 500);

export const POSIBLE_DUCK_COLORS = ['blue', 'black', 'red'];

export const globalVariables = {
  currentLevel: 5 as number,
  levelsLeft: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as number[],
  ducksInTheLevel: [] as Duck[],
  ducksToShow: [] as Duck[],
  shootArr: [] as Shoot[],
};

export const collisionInstance = new Collision();

export function createShowDucks() {
  if (globalVariables.currentLevel >= 5) {
    globalVariables.ducksToShow = globalVariables.ducksInTheLevel.splice(0, 2);
    globalVariables.ducksToShow.forEach((duck) => duck.declaringPositions());
  } else {
    globalVariables.ducksToShow = globalVariables.ducksInTheLevel.splice(0, 1);
    globalVariables.ducksToShow.forEach((duck) => duck.declaringPositions());
  }
}
function drawBackground(): void {
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = 'brown';
  ctx.fillRect(50, CANVAS_HEIGHT - 300, 70, 300);
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(84, 150, 70, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
  ctx.fillStyle = 'green';
  ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
}
drawBackground();

function startGame() {
  const dog = new Dog();
  dog.action = 'starting game';
  dog.declaringPositions();

  for (let i = 0; i < 10; i++) {
    const numberForColor = Math.round(Math.random() * 2);
    const colorNewDuck = POSIBLE_DUCK_COLORS[numberForColor];

    const newDuck = new Duck(colorNewDuck, 1);
    newDuck.declaringPositions();
    globalVariables.ducksInTheLevel.push(newDuck);
  }

  gameLoop(dog);
}

function gameLoop(dog: Dog) {
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

  requestAnimationFrame(() => gameLoop(dog));
}

const buttonStartGame = document.querySelector(
  '#start-game-btn'
) as HTMLButtonElement;

buttonStartGame.addEventListener('click', (e) => {
  startGame();
  buttonStartGame.remove();
});

canvas.addEventListener('click', (e: MouseEvent) => {
  const shoot = new Shoot(e.x, e.y);

  globalVariables.shootArr.push(shoot);
});
