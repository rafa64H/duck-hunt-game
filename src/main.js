var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var canvas = document.getElementById("game-canvas");
//----------Canvas variables
var ctx = canvas.getContext("2d");
var CANVAS_WIDTH = (canvas.width = window.innerWidth);
var CANVAS_HEIGHT = window.innerHeight < 500
    ? (canvas.height = window.innerHeight)
    : (canvas.height = 500);
var POSIBLE_DUCK_COLORS = ["blue", "black", "red"];
var duckIconsElements = document.querySelector("[data-duck-icons]");
var shotsBulletIcons = document.querySelector("[data-shots-bullet-icons]");
var scoreElement = document.querySelector("[data-score]");
var levelElement = document.querySelector("[data-level-element]");
var showHighScoreCard = document.querySelector("[data-show-high-score-card]");
var showFlyAwayCard = document.querySelector("[data-show-fly-away-card]");
var showLoseCard = document.querySelector("[data-show-lose-card]");
var showGameOverCard = document.querySelector("[data-show-game-over-card]");
var requiredDucksBar = document.querySelector("[data-required-ducks-bar]");
//----------Canvas variables END
//----------Classes and sprites
var GAME_SPRITES_DOG = new Image();
GAME_SPRITES_DOG.src = "src/assets/game-sprites-dog.png";
var GAME_SPRITES_DUCKS = new Image();
GAME_SPRITES_DUCKS.src = "src/assets/game-sprites-ducks.png";
var Dog = /** @class */ (function () {
    function Dog() {
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
    Dog.prototype.declaringPositions = function () {
        if (this.action === "idle") {
            this.counterAnimation = 0;
            this.x = -100;
            this.y = -100;
            this.speedX = 0;
            this.speedY = 0;
            this.spriteWidth = 0;
            this.spriteHeight = 0;
        }
        if (this.action === "starting game" ||
            this.action === "starting next level") {
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
    };
    Dog.prototype.update = function () {
        if (this.frames % this.animationSpeed === 0) {
            if (this.action === "starting game" ||
                this.action === "starting next level") {
                if (this.audio.currentTime < this.audio.duration)
                    this.audio.play();
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
                }
                else {
                    this.spriteFrameX < 3 ? this.spriteFrameX++ : (this.spriteFrameX = 0);
                    this.counterAnimation++;
                }
            }
            if (this.action === "hunted duck") {
                if (this.audio.currentTime < this.audio.duration)
                    this.audio.play();
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
                        if (globalVariables.ducksInTheLevel.length === 0 &&
                            globalVariables.ducksToShow.length === 0) {
                            countHuntedDucks();
                        }
                    }
                }
                this.counterAnimation++;
            }
            if (this.action === "flew away duck") {
                if (this.audio.currentTime < this.audio.duration)
                    this.audio.play();
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
                        if (globalVariables.ducksInTheLevel.length === 0 &&
                            globalVariables.ducksToShow.length === 0) {
                            countHuntedDucks();
                        }
                    }
                }
                this.counterAnimation++;
            }
            if (this.action === "game over") {
                if (this.audio.currentTime < this.audio.duration)
                    this.audio.play();
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
    };
    Dog.prototype.draw = function () {
        if (this.action === "starting game" ||
            this.action === "starting next level") {
            ctx.drawImage(GAME_SPRITES_DOG, this.spriteWidth * this.spriteFrameX, this.spriteHeight * this.spriteFrameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
            if (this.counterAnimation >= 55 /*Dog hiding*/) {
                //When starting the game, create some grass so the dog can hide
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
                ctx.fillStyle = "green";
                ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
            }
        }
        if (this.action === "hunted duck" ||
            this.action === "flew away duck" ||
            this.action === "game over") {
            ctx.drawImage(GAME_SPRITES_DOG, this.spriteWidth * this.spriteFrameX, this.spriteHeight * this.spriteFrameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
            ctx.fillStyle = "green";
            ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
        }
    };
    return Dog;
}());
var Duck = /** @class */ (function () {
    function Duck(color, level) {
        this.color = color;
        this.level = level;
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
    Duck.prototype.changeAudio = function () {
        if (this.action === "dying") {
            this.audio.src = "src/assets/audio/duck-falling.mp3";
        }
        if (this.action === "hunted") {
            this.audio.src = "src/assets/audio/duck-drop.mp3";
        }
    };
    Duck.prototype.declaringPositions = function () {
        this.initialTime = Date.now();
        var randomX = Math.round(Math.random() * CANVAS_WIDTH - this.width - 0 + this.width);
        var randomY = Math.round(Math.random() * (CANVAS_HEIGHT - 150) - 0 + this.height);
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
    };
    Duck.prototype.changeDirection = function () {
        var negativeOrPositiveX = Math.round(Math.random() * 10) >= 5 ? true : false;
        var negativeOrPositiveY = Math.round(Math.random() * 10) >= 5 ? true : false;
        if (negativeOrPositiveX) {
            this.speedX = Math.abs(this.speedXOnLevel);
        }
        else {
            this.speedX = -Math.abs(this.speedXOnLevel);
        }
        if (negativeOrPositiveY) {
            this.speedY = Math.abs(this.speedYOnLevel);
        }
        else {
            this.speedY = -Math.abs(this.speedYOnLevel);
        }
        if (this.spriteFrameY === 0) {
            this.spriteFrameY = 1;
        }
        else {
            this.spriteFrameY = 0;
        }
    };
    Duck.prototype["delete"] = function (typeOfDelete) {
        var currentLevelGreaterThanFour = this.level > 4 ? true : false;
        if (typeOfDelete === "flew away") {
            var flyingDucks = globalVariables.ducksToShow.some(function (duck) {
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
        }
        else {
            increaseScore(1000);
            var numberOfDucksInLevel = currentLevelGreaterThanFour ? 2 : 1;
            var notHuntedDuckIcons = globalVariables.duckIcons.filter(function (duckIcon) {
                var huntedDuckAttribute = duckIcon.getAttribute("data-hunted");
                return huntedDuckAttribute !== "true";
            });
            notHuntedDuckIcons[0].setAttribute("data-hunted", "true");
            var huntedDucks = globalVariables.ducksToShow.filter(function (duck) {
                return duck.action === "hunted";
            });
            var flyingDucks = globalVariables.ducksToShow.some(function (duck) {
                return duck.action !== "hunted" && duck.action !== "flew away";
            });
            if (huntedDucks.length === numberOfDucksInLevel && !flyingDucks) {
                dog.action = "hunted duck";
                dog.declaringPositions();
                currentLevelGreaterThanFour
                    ? globalVariables.ducksToShow.splice(0, 2)
                    : globalVariables.ducksToShow.splice(0, 1);
            }
            else if (flyingDucks) {
            }
            else {
                hideCard("fly away");
                dog.action = "flew away duck";
                dog.declaringPositions();
                currentLevelGreaterThanFour
                    ? globalVariables.ducksToShow.splice(0, 2)
                    : globalVariables.ducksToShow.splice(0, 1);
            }
        }
    };
    Duck.prototype.update = function () {
        if (this.action === "flying") {
            this.counterAnimation++;
            if (this.audio.currentTime >= this.audio.duration * 0.8) {
                this.audio.currentTime = 0;
            }
            this.audio.play();
            var currentTime = Date.now() - this.initialTime;
            var currentSeconds = currentTime / 1000;
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
                    this["delete"]("hunted");
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
                this["delete"]("flew away");
            }
            this.counterAnimation++;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.frames++;
    };
    Duck.prototype.draw = function () {
        ctx.drawImage(GAME_SPRITES_DUCKS, this.spriteWidth * this.spriteFrameX, this.spriteHeight * this.spriteFrameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        if (this.action === "dying") {
            ctx.drawImage(GAME_SPRITES_DUCKS, this.spriteWidth * this.spriteFrameX, this.spriteHeight * this.spriteFrameY, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
            ctx.fillStyle = "green";
            ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
        }
    };
    return Duck;
}());
var Shoot = /** @class */ (function () {
    function Shoot(eventX, eventY) {
        this.eventX = eventX;
        this.eventY = eventY;
        this.width = 40;
        this.height = 40;
        this.x = eventX - this.width * 0.5;
        this.y = eventY - this.height * 0.5;
        this.frames = 0;
        this.counterAnimation = 0;
    }
    Shoot.prototype["delete"] = function () {
        var indexOfThis = globalVariables.shootArr.indexOf(this);
        globalVariables.shootArr.splice(indexOfThis, 1);
        var unspentBullets = globalVariables.bulletIcons.filter(function (bulletIcon) {
            var spent = bulletIcon.getAttribute("data-spent");
            return spent !== "true";
        });
        var aliveDucks = globalVariables.ducksToShow.filter(function (duck) {
            return duck.action === "flying";
        });
        if (unspentBullets.length === 0 && aliveDucks.length !== 0) {
            aliveDucks.forEach(function (duck) {
                duck.action = "fly away";
            });
            return;
        }
    };
    Shoot.prototype.update = function () {
        collisionInstance.collisionShoot(this);
        if (this.counterAnimation === 10) {
            this["delete"]();
        }
        this.counterAnimation++;
        this.frames++;
    };
    Shoot.prototype.draw = function () {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Shoot;
}());
var Collision = /** @class */ (function () {
    function Collision() {
    }
    Collision.prototype.collisionDucks = function () {
        globalVariables.ducksToShow.forEach(function (duck) {
            var borderTop = 0;
            var borderRight = CANVAS_WIDTH - duck.width;
            var borderBottom = CANVAS_HEIGHT - duck.height - 100;
            var borderLeft = 0;
            if (duck.removeCollisionDetecion)
                return;
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
    };
    Collision.prototype.collisionShoot = function (shoot) {
        globalVariables.ducksToShow.forEach(function (duck) {
            if (duck.action === "flying") {
                if (shoot.x > duck.x + duck.width ||
                    shoot.x + shoot.width < duck.x ||
                    shoot.y > duck.y + duck.height ||
                    shoot.y + shoot.height < duck.y) {
                    //No collision
                }
                else {
                    duck.counterAnimation = 0;
                    duck.action = "dying";
                    duck.changeAudio();
                }
            }
        });
    };
    return Collision;
}());
//----------Classes and sprites END
//--------------------Global Variables--------------------
var globalVariables = {
    currentLevel: 1,
    currentRequiredDucks: 4,
    duckIcons: __spreadArray([], duckIconsElements.children, true),
    bulletIcons: __spreadArray([], shotsBulletIcons.children, true),
    currentScore: 0,
    levelsLeft: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    ducksInTheLevel: [],
    ducksToShow: [],
    shootArr: []
};
levelElement.textContent = globalVariables.currentLevel.toString();
scoreElement.textContent = globalVariables.currentScore.toString();
//--------------------Global Variables END--------------------
//----------Functions
function startGame() {
    var displayGameInfo = document.querySelector("[data-display-game-info]");
    displayGameInfo.setAttribute("data-display-game-info", "true");
    createDucksInTheLevel();
    gameLoop();
}
function countHuntedDucks() {
    var audioPoints = new Audio();
    audioPoints.src = "src/assets/audio/points.mp3";
    var audioLose = new Audio();
    audioLose.src = "src/assets/audio/lose.mp3";
    var audioHighScore = new Audio();
    audioHighScore.src = "src/assets/audio/high-score.mp3";
    var huntedDucksIcons = globalVariables.duckIcons.filter(function (duckIcon) {
        var huntedDuckAttribute = duckIcon.getAttribute("data-hunted");
        return huntedDuckAttribute === "true";
    });
    var currentIndex = 0;
    function playNextAudioAndCount() {
        if (huntedDucksIcons.length < 1) {
            audioLose.play();
            showCard("lose");
            audioLose.onended = function () {
                hideCard("lose");
                setTimeout(function () {
                    gameOver();
                }, 500);
            };
        }
        if (currentIndex < huntedDucksIcons.length) {
            var duckIcon_1 = huntedDucksIcons[currentIndex];
            duckIcon_1.setAttribute("data-counting", "true");
            audioPoints.play();
            audioPoints.onended = function () {
                duckIcon_1.removeAttribute("data-counting");
                currentIndex++;
                playNextAudioAndCount();
                if (currentIndex >= huntedDucksIcons.length) {
                    if (huntedDucksIcons.length < globalVariables.currentRequiredDucks) {
                        audioLose.play();
                        showCard("lose");
                        audioLose.onended = function () {
                            hideCard("lose");
                            setTimeout(function () {
                                gameOver();
                            }, 500);
                        };
                    }
                    else if (huntedDucksIcons.length === 10) {
                        audioHighScore.play();
                        increaseScore(100000);
                        showCard("high score");
                        audioHighScore.onended = function () {
                            hideCard("high score");
                            increaseRequiredDucksBar();
                            setTimeout(function () {
                                goToNextLevel();
                            }, 1000);
                        };
                    }
                    else {
                        increaseRequiredDucksBar();
                        setTimeout(function () {
                            goToNextLevel();
                        }, 1000);
                    }
                }
            };
        }
    }
    playNextAudioAndCount();
}
function goToNextLevel() {
    globalVariables.currentLevel++;
    levelElement.textContent = globalVariables.currentLevel.toString();
    createDucksInTheLevel();
    restoreAmmo();
    restoreDuckIcons();
    dog.action = "starting next level";
    dog.declaringPositions();
}
function gameOver() {
    showCard("game over");
    dog.action = "game over";
    dog.declaringPositions();
}
function showCard(card) {
    switch (card) {
        case "high score":
            showHighScoreCard === null || showHighScoreCard === void 0 ? void 0 : showHighScoreCard.setAttribute("data-show-high-score-card", "true");
            break;
        case "fly away":
            showFlyAwayCard === null || showFlyAwayCard === void 0 ? void 0 : showFlyAwayCard.setAttribute("data-show-fly-away-card", "true");
            break;
        case "lose":
            showLoseCard === null || showLoseCard === void 0 ? void 0 : showLoseCard.setAttribute("data-show-lose-card", "true");
            break;
        case "game over":
            showGameOverCard === null || showGameOverCard === void 0 ? void 0 : showGameOverCard.setAttribute("data-show-game-over-card", "true");
            break;
    }
}
function hideCard(card) {
    switch (card) {
        case "high score":
            showHighScoreCard === null || showHighScoreCard === void 0 ? void 0 : showHighScoreCard.setAttribute("data-show-high-score-card", "false");
            break;
        case "fly away":
            showFlyAwayCard === null || showFlyAwayCard === void 0 ? void 0 : showFlyAwayCard.setAttribute("data-show-fly-away-card", "false");
            break;
        case "lose":
            showLoseCard === null || showLoseCard === void 0 ? void 0 : showLoseCard.setAttribute("data-show-lose-card", "false");
            break;
        case "game over":
            showGameOverCard === null || showGameOverCard === void 0 ? void 0 : showGameOverCard.setAttribute("data-show-game-over-card", "false");
            break;
    }
}
function createDucksInTheLevel() {
    for (var i = 0; i < 10; i++) {
        var numberForColor = Math.round(Math.random() * 2);
        var colorNewDuck = POSIBLE_DUCK_COLORS[numberForColor];
        var newDuck = new Duck(colorNewDuck, globalVariables.currentLevel);
        newDuck.declaringPositions();
        globalVariables.ducksInTheLevel.push(newDuck);
    }
}
function restoreDuckIcons() {
    globalVariables.duckIcons.forEach(function (duckIcon) {
        duckIcon.setAttribute("data-hunted", "false");
    });
}
function increaseRequiredDucksBar() {
    var audioDuckDrop = new Audio();
    audioDuckDrop.src = "src/assets/audio/duck-drop.mp3";
    if (globalVariables.currentRequiredDucks < 8) {
        audioDuckDrop.play();
        globalVariables.currentRequiredDucks++;
    }
    requiredDucksBar.style.width = "".concat(globalVariables.currentRequiredDucks * 10, "%");
}
function increaseScore(value) {
    globalVariables.currentScore += value;
    scoreElement.textContent = globalVariables.currentScore.toString();
}
function restoreAmmo() {
    globalVariables.bulletIcons.forEach(function (bulletIcon) {
        bulletIcon.setAttribute("data-spent", "false");
    });
}
function showDucks() {
    restoreAmmo();
    if (globalVariables.currentLevel >= 5) {
        globalVariables.ducksToShow = globalVariables.ducksInTheLevel.splice(0, 2);
        globalVariables.ducksToShow.forEach(function (duck) { return duck.declaringPositions(); });
    }
    else {
        globalVariables.ducksToShow = globalVariables.ducksInTheLevel.splice(0, 1);
        globalVariables.ducksToShow.forEach(function (duck) { return duck.declaringPositions(); });
    }
}
function drawBackground() {
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
var dog = new Dog();
dog.action = "starting game";
dog.declaringPositions();
var collisionInstance = new Collision();
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBackground();
    dog.update();
    dog.draw();
    globalVariables.ducksToShow.forEach(function (duck) {
        duck.update();
        duck.draw();
    });
    globalVariables.shootArr.forEach(function (shoot) {
        shoot.update();
        shoot.draw();
    });
    collisionInstance.collisionDucks();
    requestAnimationFrame(function () { return gameLoop(); });
}
//----------Game loop END
//----------Event listeners
var buttonStartGame = document.querySelector("#start-game-btn");
buttonStartGame.addEventListener("click", function () {
    startGame();
    buttonStartGame.remove();
});
canvas.addEventListener("click", function (e) {
    var canvasBounds = canvas.getBoundingClientRect();
    var unspentBullets = globalVariables.bulletIcons.filter(function (bulletIcon) {
        var spent = bulletIcon.getAttribute("data-spent");
        return spent !== "true";
    });
    if (dog.action === "starting game" ||
        dog.action === "hunted duck" ||
        dog.action === "starting next level" ||
        unspentBullets.length === 0) {
        return;
    }
    unspentBullets[unspentBullets.length - 1].setAttribute("data-spent", "true");
    var shoot = new Shoot(e.x - canvasBounds.left, e.y - canvasBounds.top);
    var shootSound = new Audio("src/assets/audio/gunshot.mp3");
    shootSound.play();
    globalVariables.shootArr.push(shoot);
});
//----------Event listeners END
