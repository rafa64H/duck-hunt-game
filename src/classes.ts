import { CANVAS_HEIGHT, CANVAS_WIDTH, ctx } from './main';

const GAME_SPRITES_DOG = new Image();

GAME_SPRITES_DOG.src = 'src/assets/game-sprites-dog.png';

const GAME_SPRITES_DUCKS = new Image();

GAME_SPRITES_DUCKS.src = 'src/assets/game-sprites-ducks.png';
export class Dog {
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
  public action: string;

  constructor() {
    this.action = '';
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
  }

  declaringPositions(): void {
    if (this.action === '') {
      this.x = -100;
      this.y = -100;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteWidth = 0;
      this.spriteHeight = 0;
    }
    if (this.action === 'starting game') {
      this.x = 0;
      this.y = CANVAS_HEIGHT - this.height;
      this.spriteWidth = 60;
      this.spriteHeight = 54;
    }
    if (this.action === 'hunted duck' || this.action === 'flew away duck') {
      this.x = CANVAS_WIDTH * 0.5;
      this.y = CANVAS_HEIGHT - this.height;
      this.spriteWidth = 62.5;
      this.spriteHeight = 54;
      console.log('hola');
    }
  }

  update(): void {
    if (this.frames % this.animationSpeed === 0) {
      if (this.action === 'starting game') {
        this.speedX = 8;

        if (this.counterAnimation >= 20) {
          this.spriteFrameX = 4;
          this.speedX = 0;

          if (this.counterAnimation >= 30) {
            this.spriteFrameY = 1;
            this.spriteFrameX = 0;
            if (this.counterAnimation >= 40) {
              this.spriteFrameX++;
              this.speedY = -20;
              this.speedX = 4;

              if (this.counterAnimation >= 45) {
                this.speedY = 20;
                this.spriteFrameX++;
              }
            }
          }
          this.counterAnimation++;
        } else {
          this.spriteFrameX < 3 ? this.spriteFrameX++ : (this.spriteFrameX = 0);
          this.counterAnimation++;
        }
      }

      if (this.action === 'hunted duck') {
        this.spriteFrameX = 5;
        this.spriteFrameY = 0;
        this.speedY = -15;
        if (this.y <= CANVAS_HEIGHT - 165 && this.counterAnimation < 10) {
          this.speedY = 0;
        }
        if (this.counterAnimation >= 10) {
          this.speedY = 15;
        }
        this.counterAnimation++;
      }

      if (this.action === 'flew away duck') {
        this.spriteFrameX === 4 ? (this.spriteFrameX = 3) : this.spriteFrameX++;
        this.spriteFrameY = 1;
        this.speedY = -15;
        if (this.y <= CANVAS_HEIGHT - 165 && this.counterAnimation < 10) {
          this.speedY = 0;
        }
        if (this.counterAnimation >= 10) {
          this.speedY = 15;
        }
        this.counterAnimation++;
      }
      this.x += this.speedX;
      this.y += this.speedY;
    }

    this.frames++;
  }

  draw(): void {
    if (this.action === 'starting game') {
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
      if (this.counterAnimation >= 45) {
        //When starting the game, create some grass so the dog can hide
        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
        ctx.fillStyle = 'green';
        ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
      }
    }

    if (this.action === 'hunted duck' || this.action === 'flew away duck') {
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
      ctx.fillStyle = 'lightgreen';
      ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    }
  }
}

export class Duck {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public spriteWidth: number;
  public spriteHeight: number;
  public spriteFrameX: number;
  public spriteFrameY: number;
  public speedX: number;
  public speedY: number;
  public animationSpeed: number;
  public frames: number;
  public counterAnimation: number;

  constructor(public color: string, public level: number) {
    this.level = level;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 94;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.spriteFrameX = 0;
    this.spriteFrameY = 0;
    this.speedX = 10;
    this.speedY = 10;
    this.color = color;
    this.animationSpeed = 4;
    this.frames = 0;
    this.counterAnimation = 0;
  }

  declaringPositions(): void {
    this.x = CANVAS_WIDTH * 0.5;
    this.y = CANVAS_HEIGHT - 300;
    this.spriteWidth = 38;
    this.spriteHeight = 40;
  }

  changeLookingDirection(): void {
    if (this.spriteFrameY === 0) {
      this.spriteFrameY = 1;
    } else {
      this.spriteFrameY = 0;
    }
  }

  update(): void {
    const borderTop = 0;
    const borderRight = CANVAS_WIDTH - this.width;
    const borderBottom = CANVAS_HEIGHT - this.height - 100;
    const borderLeft = 0;

    if (this.x <= borderLeft) {
      this.x = borderLeft;
      this.speedX = Math.abs(this.speedX);
    }
    if (this.x >= borderRight) {
      this.x = borderRight;
      this.speedX = -Math.abs(this.speedX);
    }
    if (this.y <= borderTop) {
      this.y = borderTop;
      this.speedY = Math.abs(this.speedY);
    }
    if (this.y >= borderBottom) {
      this.y = borderBottom;
      this.speedY = -Math.abs(this.speedY);
    }

    if (this.frames % this.animationSpeed === 0) {
      if (this.color === 'blue') {
        this.spriteFrameX <= 1 ? this.spriteFrameX++ : (this.spriteFrameX = 0);
      }
      if (this.counterAnimation === 500) {
        this.changeLookingDirection();
        this.counterAnimation = 0;
      }
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.frames++;
    this.counterAnimation++;
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
  }
}
