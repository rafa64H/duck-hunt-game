import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  collisionInstance,
  createShowDucks,
  ctx,
  dog,
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
  public action:
    | ''
    | 'idle'
    | 'starting game'
    | 'hunted duck'
    | 'flew away duck';

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
      this.counterAnimation = 0;
      this.x = -100;
      this.y = -100;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteWidth = 0;
      this.spriteHeight = 0;
    }
    if (this.action === 'starting game') {
      this.counterAnimation = 0;
      this.x = 0;
      this.y = CANVAS_HEIGHT - this.height;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteWidth = 60;
      this.spriteHeight = 54;
    }
    if (this.action === 'hunted duck' || this.action === 'flew away duck') {
      this.counterAnimation = 0;
      this.x = CANVAS_WIDTH * 0.5;
      this.y = CANVAS_HEIGHT - this.height;
      this.speedX = 0;
      this.speedY = 0;
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
                  this.declaringPositions();
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
          if (this.y > CANVAS_HEIGHT) {
            this.action = 'idle';
            this.declaringPositions();
            createShowDucks();
          }
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
  public action: 'flying' | 'dying';
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

  constructor(public color: string, public level: number) {
    this.level = level;
    this.action = 'flying';
    this.removeCollisionDetecion = false;
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
    this.speedXOnLevel = level;
    this.speedYOnLevel = level;
    this.speedX = level;
    this.speedY = level;
    this.animationSpeed = 4;
    this.frames = 0;
    this.counterAnimation = 0;
  }

  declaringPositions(): void {
    const randomX = Math.round(
      Math.random() * CANVAS_WIDTH - this.width - 0 + this.width
    );
    const randomY = Math.round(
      Math.random() * (CANVAS_HEIGHT - 150) - 0 + this.height
    );
    this.x = randomX;
    this.y = randomY;
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

  delete(): void {
    const indexOfThis = globalVariables.ducksToShow.indexOf(this);
    globalVariables.ducksToShow.splice(indexOfThis, 1);

    const notHuntedDuckIcons = globalVariables.duckIcons.filter((duckIcon) => {
      const huntedDuckAttribute = duckIcon.getAttribute('data-hunted');
      return huntedDuckAttribute !== 'true';
    });

    notHuntedDuckIcons[0].setAttribute('data-hunted', 'true');

    console.log(globalVariables.duckIcons);
    if (globalVariables.ducksToShow.length === 0) {
      dog.action = 'hunted duck';
      console.log(dog.x, dog.y, dog.width, dog.height);
      dog.declaringPositions();
      console.log(dog.x, dog.y, dog.width, dog.height);
    }
  }

  update(): void {
    if (this.action === 'flying') {
      this.counterAnimation++;
      if (this.frames % this.animationSpeed === 0) {
        console.log(this.counterAnimation);
        if (this.counterAnimation >= 70) {
          this.changeDirection();
          this.counterAnimation = 0;
        }

        if (this.color === 'blue') {
          this.spriteFrameX <= 1
            ? this.spriteFrameX++
            : (this.spriteFrameX = 0);
        }
        if (this.color === 'black') {
          this.spriteFrameX <= 4
            ? this.spriteFrameX++
            : (this.spriteFrameX = 3);
        }
        if (this.color === 'red') {
          this.spriteFrameX <= 7
            ? this.spriteFrameX++
            : (this.spriteFrameX = 6);
        }
      }
    }
    if (this.action === 'dying') {
      this.spriteFrameX =
        this.color === 'blue' ? 0 : this.color === 'black' ? 3 : 6;
      this.spriteFrameY = 3;
      this.speedX = 0;
      this.speedY = 0;
      this.counterAnimation++;

      if (this.counterAnimation >= 100) {
        this.speedY = 10;
        this.spriteFrameX =
          this.color === 'blue' ? 1 : this.color === 'black' ? 4 : 7;

        if (this.y >= CANVAS_HEIGHT) {
          this.delete();
        }
      }
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

    if (this.action === 'dying') {
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
      ctx.fillStyle = 'lightgreen';
      ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
      ctx.fillStyle = 'green';
      ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    }
  }
}

export class Shoot {
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
    const indexOfThis = globalVariables.shootArr.indexOf(this);
    globalVariables.shootArr.splice(indexOfThis, 1);
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
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class Collision {
  collisionDucks(): void {
    globalVariables.ducksToShow.forEach((duck) => {
      const borderTop = 0;
      const borderRight = CANVAS_WIDTH - duck.width;
      const borderBottom = CANVAS_HEIGHT - duck.height - 100;
      const borderLeft = 0;

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
      if (
        shoot.x > duck.x + duck.width ||
        shoot.x + shoot.width < duck.x ||
        shoot.y > duck.y + duck.height ||
        shoot.y + shoot.height < duck.y
      ) {
        //No collision
      } else {
        duck.counterAnimation = 0;
        duck.action = 'dying';
        duck.removeCollisionDetecion = true;
      }
    });
  }
}
