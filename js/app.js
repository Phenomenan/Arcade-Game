"use strict";
//Star constructor
var Star = function() {
  //random position of star
  this.x = Math.floor(Math.random() * 6 + 1) * 100;
  this.y = Math.floor(Math.random() * 4 + 1) * 80;
  this.sprite = "images/Star.png";
};
//Render star
Star.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//creating star objects
var star1 = new Star(1, 70);
var star2 = new Star(1, 70);
var star3 = new Star(1, 70);
var allStars = [star1, star2, star3];

//Make random speed number
var randomNumber = function(speedHigh, speedLow) {
  return Math.floor(Math.random() * (speedHigh - speedLow) + 1) + speedLow;
};

// Enemy Constructor
var Enemy = function(x, y) {
  //Position of enemy
  this.x = x;
  this.y = y;
  this.speed = randomNumber(1000, 150); //Speed of the enemy
  this.sprite = "images/enemy-bug.png"; //Load image of enemy
};

//update enemy's position and speed
Enemy.prototype.update = function(dt) {
  this.x += this.speed * dt; //Enemy moves to left
  //if Enemy go off screen
  if (this.x > 909) {
    this.x = Math.random() * -1200;
    this.speed = randomNumber(1000, 150); //new speed for next round
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//This part changes arrow key event handler, make new one for character selection (line 48-117)
var elem = document.querySelector("#light");
var style = window.getComputedStyle(elem);
var left = style.getPropertyValue("left");
var charSrc = "images/char-boy.png";

document.addEventListener(
  "keydown",
  function start(e) {
    if (e.keyCode !== 13) {
      if (e.keyCode == 39 && parseInt(left) < 445) {
        left = parseInt(left) + 105;
        elem.style.left = left + "px";
        console.log(left);
      }
      if (e.keyCode == 37 && parseInt(left) > 25) {
        left = parseInt(left) - 105;
        elem.style.left = left + "px";
        console.log(left);
      }
    } else {
      document.querySelector("#charSelect").style.display = "none";
      left = parseInt(left);
      switch (left) {
        case 25:
          charSrc = "images/char-boy.png";
          break;
        case 130:
          charSrc = "images/char-cat-girl.png";
          break;
        case 235:
          charSrc = "images/char-horn-girl.png";
          break;
        case 340:
          charSrc = "images/char-pink-girl.png";
          break;
        case 445:
          charSrc = "images/char-princess-girl.png";
          break;
      }
      document.removeEventListener("keydown", start, true);
      timerInterval = setInterval(function() {
        startTimer();
      }, 1000);
      // This listens for key presses
      document.addEventListener("keyup", function(e) {
        var allowedKeys = {
          37: "left",
          38: "up",
          39: "right",
          40: "down"
        };

        player.handleInput(allowedKeys[e.keyCode]);
      });

      document.addEventListener(
        "keydown",
        function(e) {
          // space and arrow keys
          if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
          }
        },
        false
      );
    }
  },
  true
);

var Player = function(x, y) {
  //posotion of player
  this.x = x;
  this.y = y;
  this.lives = 3;
  this.stars = 0;
  //Load image of player
  this.sprite = charSrc;
};

Player.prototype.update = function() {
  this.sprite = charSrc;
  this.x = this.x;
  this.y = this.y;
  checkCollisions();
  if (this.y <= 50) {
    happyEnding();
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
  this.x = 300;
  this.y = 480;
};

//if player goes off screen
Player.prototype.handleInput = function(allowedKeys) {
  switch (allowedKeys) {
    case "left":
      if (this.x > 0) {
        this.x -= 101;
      }
      break;

    case "up":
      if (this.y > 0) {
        this.y -= 83;
      }
      break;

    case "right":
      if (this.x < 600) {
        this.x += 101;
      }
      break;

    case "down":
      if (this.y < 450) {
        this.y += 83;
      }
  }
};

var checkCollisions = function() {
  //Rectangle Constructor
  var Rectangle = function(left, top) {
    this.left = left;
    this.top = top;
    this.right = this.left + 35;
    this.bottom = this.top + 20;
  };

  //Player Rectangle
  var playerRect = new Rectangle(player.x, player.y);
  //Loop to make enemies rectangles
  for (var i = 0; i < allEnemies.length; i++) {
    var enemyRect = new Rectangle(allEnemies[i].x, allEnemies[i].y);
    if (
      !(
        playerRect.left > enemyRect.right ||
        playerRect.right < enemyRect.left ||
        playerRect.top > enemyRect.bottom ||
        playerRect.bottom < enemyRect.top
      )
    ) {
      /* If player collides with bug, reset position of player */
      console.log("collision");
      if (player.lives > 1) {
        player.lives -= 1;
        document.getElementById("livesNum").innerHTML = "X" + player.lives;
        player.reset();
      } else {
        document.getElementById("livesNum").innerHTML = "X0";
        var gameOver = document.querySelector("#gameOver");
        gameOver.style.display = "block";
        clearInterval(timerInterval);
        document.addEventListener("keydown", function(e) {
          document.addEventListener(
            "keyup",
            function(event) {
              event.stopPropagation();
            },
            true
          );
          if (e.keyCode == 32) {
            location.reload();
          }
        });
      }
    }
  }
  //star collision
  for (var i = 0; i < allStars.length; i++) {
    var starRect = new Rectangle(allStars[i].x, allStars[i].y);
    if (
      !(
        playerRect.left > starRect.right ||
        playerRect.right < starRect.left ||
        playerRect.top > starRect.bottom ||
        playerRect.bottom < starRect.top
      )
    ) {
      /* If player collides with Star, increase starNum */
      console.log("catched");
      player.stars += 1;
      document.getElementById("starNum").innerHTML = player.stars;
      document.getElementById("starNumEnd").innerHTML = player.stars;
      allStars.splice(i, 1);
    }
  }
};
//winning function
var happyEnding = function() {
  var ending = document.querySelector("#ending");
  ending.style.display = "inline";
  clearInterval(timerInterval);
  document.addEventListener("keydown", function(e) {
    document.addEventListener(
      "keyup",
      function(event) {
        event.stopPropagation();
      },
      true
    );
    if (e.keyCode == 32) {
      location.reload();
    }
  });
};

//enemy objects
var enemyOne = new Enemy(-15, 60);
var enemySix = new Enemy(-20, 60);
var enemyTwo = new Enemy(-10, 140);
var enemySeven = new Enemy(-16, 140);
var enemyThree = new Enemy(-17, 225);
var enemyNine = new Enemy(-18, 225);
var enemyFour = new Enemy(-14, 310);
var enemyEight = new Enemy(-13, 310);
var enemyFive = new Enemy(-12, 390);
var allEnemies = [
  enemyOne,
  enemyTwo,
  enemyThree,
  enemyFour,
  enemyFive,
  enemySix,
  enemySeven,
  enemyEight,
  enemyNine
];

// Place the player object in a variable called player
var player = new Player(300, 480);

//game timer
let timerCounter = 0;
let timerMin = 0;
var sec;
var timerInterval;

function addTime(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return number;
  }
}
function startTimer() {
  timerCounter++;
  sec = timerCounter;
  if (timerCounter == 60) {
    timerMin++;
    sec = 0;
    timerCounter = 0;
  }
  document.querySelector(".timer").innerHTML =
    addTime(timerMin) + ":" + addTime(sec);
}
