import { Dog, Duck } from './classes';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export const CANVAS_WIDTH = (canvas.width = 1024);
export const CANVAS_HEIGHT = (canvas.height = 500);

export const POSIBLE_DUCK_COLORS = ['blue', 'black', 'red'];
export const levelsLeft = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const dog = new Dog();
dog.action = 'starting game';
dog.declaringPositions();

const duck = new Duck('red', 1);
duck.declaringPositions();

function gameLoop() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawBackground();

  dog.update();
  dog.draw();

  duck.update();
  duck.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

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
