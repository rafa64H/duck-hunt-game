import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  createShowDucks,
  ctx,
  globalVariables,
} from './main';

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
    if (this.action === 'idle') {
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
                if (this.y > CANVAS_HEIGHT) {
                  this.action = 'idle';
                  createShowDucks();
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
  public speedXOnLevel: number;
  public speedYOnLevel: number;
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
    this.color = color;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.spriteFrameX =
      this.color === 'blue' ? 0 : this.color === 'black' ? 3 : 6;

    this.spriteFrameY = 0;
    this.speedXOnLevel = 10;
    this.speedYOnLevel = 10;
    this.speedX = 10;
    this.speedY = 10;
    this.animationSpeed = 4;
    this.frames = 0;
    this.counterAnimation = 0;
  }

  declaringPositions(): void {
    const randomX = Math.round(Math.random() * 10);
    const randomY = Math.round(Math.random() * 10);
    this.x = randomX >= 5 ? CANVAS_WIDTH - this.width : 0 + this.width;
    this.y = randomY >= 5 ? CANVAS_HEIGHT - 150 : 0 + this.height;
    if (this.color === 'blue') {
      this.spriteWidth = 38;
      this.spriteHeight = 40;
    }
    if (this.color === 'black' || this.color === 'red') {
      this.spriteWidth = 42;
      this.spriteHeight = 40;
    }
  }

  changeDirection(): void {
    const negativeOrPositiveX =
      Math.round(Math.random() * 10) >= 5 ? true : false;
    const negativeOrPositiveY =
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

  update(): void {
    if (this.counterAnimation === 70) {
      this.changeDirection();
      this.counterAnimation = 0;
    }

    if (this.frames % this.animationSpeed === 0) {
      if (this.color === 'blue') {
        this.spriteFrameX <= 1 ? this.spriteFrameX++ : (this.spriteFrameX = 0);
      }
      if (this.color === 'black') {
        this.spriteFrameX <= 4 ? this.spriteFrameX++ : (this.spriteFrameX = 3);
      }
      if (this.color === 'red') {
        this.spriteFrameX <= 7 ? this.spriteFrameX++ : (this.spriteFrameX = 6);
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

export class Shoot {
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
    const indexOfThis = globalVariables.shootArr.indexOf(this);
    globalVariables.shootArr.splice(indexOfThis, 1);
  }

  update() {
    if (this.counterAnimation === 10) {
      this.delete();
    }
    this.counterAnimation++;
    this.frames++;
  }

  draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Collision {
  collisionDucks() {
    globalVariables.ducksToShow.forEach((duck) => {
      const borderTop = 0;
      const borderRight = CANVAS_WIDTH - duck.width;
      const borderBottom = CANVAS_HEIGHT - duck.height - 100;
      const borderLeft = 0;

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
}
