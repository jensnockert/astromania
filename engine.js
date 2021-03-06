var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var FPS = 30;

var players = [];
var playerBullets = [];
var enemies = [];


function player_c(color, x, y, width, height)
{
  this.spawn_x = x;
  this.spawn_y = y;
  this.dead = false;
  this.deathCounter = 0;
  this.lives = 9;
  this.color = color;
  this.x = x;
  this.y = y;
  this.vx = 0;
  this.vy = 0;
  this.width = width;
  this.height = height;
  this.isInvincible = false;
  
  var RESPAWN_TIMEOUT = 3000;
  var self = this;
  
  self.die = function() {
    console.count("died");
    self.dead = true;
    self.lives--;
    setTimeout(self.respawn.bind(this), RESPAWN_TIMEOUT);
  };
  
  var RESPAWN_INVINCIBILITY_TIMEOUT = 2000;
  var RESPAWN_INVINCIBILITY_COLOR = "#0f0";
  
  this.respawn = function() {
    this.x = this.spawn_x;
    this.y = this.spawn_y;
    var oldColor = this.color; 
    this.isInvincible = true;
    this.dead = false;
    this.color = RESPAWN_INVINCIBILITY_COLOR;
    setTimeout(function() {
      this.isInvincible = false;
      this.color = oldColor;
    }.bind(this), RESPAWN_INVINCIBILITY_TIMEOUT);
    
  }.bind(this);
  var background = new Image();
  background.src = "cat.png";
  this.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
    canvas.drawImage(background,this.x, this.y);  
     canvas.drawImage(background,30, 0,30,30,30,0,0,0);  
  };
  
  this.shoot = function(start, direction) {
    var direction = direction || [1,0]
    var bPos = this.midpoint();
    var vx = direction[0];
    var vy = direction[1];
    var TIME_UNTIL_SHOOT = start - new Date();
    setTimeout(playerBullets.push(new bullet_c(self,bPos,vx,vy)), TIME_UNTIL_SHOOT);
  }.bind(this);
  
  this.midpoint = function() {
    return {
      x: this.x + this.width/2,
      y: this.y + this.height/2
    };
  }.bind(this);
  
}

players.push(new player_c("#00A", 10, 40, 30, 30));
players.push(new player_c("#0A0", 10, 550, 30, 30));
players.push(new player_c("#A00", 750, 550, 30, 30));
players.push(new player_c("#0ff", 750, 40, 30, 30));

window.Joysticks[0] = window.Joysticks[0] || {};
window.Joysticks[0].on_a = players[0].shoot;

window.Joysticks[1] = window.Joysticks[1] || {};
window.Joysticks[1].on_a = players[1].shoot;

window.Joysticks[2] = window.Joysticks[2] || {};
window.Joysticks[2].on_a = players[2].shoot;

window.Joysticks[3] = window.Joysticks[3] || {};
window.Joysticks[3].on_a = players[3].shoot;

function bullet_c(owner, bPos, vx, vy) {
  this.active = true;
  this.x = bPos.x;
  this.y = bPos.y;
  this.speed = 7;
  this.width = 3;
  this.height = 3;
  
  this.vx = vx * this.speed;
  this.vy = vy * this.speed;
  
  this.owner = owner;
  this.color = "#000";
  this.framesLeft = 120;

  this.draw = function() {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
  };

  this.noMore = function() {
    this.active = false;
  };
}


function enemy_c(x,y,vx,vy,size) {
  this.active = true;
  this.size = size;
  
  this.color = "#A2B";

  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.width = 14*size;
  this.height = 14*size;

<<<<<<< HEAD
  this.sprite = Sprite("enemy");
      
   var background = new Image();
  background.src = "cheese.png";

// Make sure the image is loaded first otherwise nothing will draw.


=======
  //this.sprite = Sprite("enemy");
>>>>>>> 6b525de15477a94fe77a6c5c63deb1fe49d8621a

  this.draw = function() {
    this.sprite.draw(canvas, this.x, this.y);
  //  this.sprite.drawImage(background,this.x, this.y); 
  //   canvas.drawImage(background,0,0);
  };
  
  this.draw = function() {
    canvas.fillStyle = this.color;
  //  canvas.fillRect(this.x, this.y, this.width, this.height); 
    //background.width = this.width;
    //background.heigth = this.height;
 //   console.log( background.heigth)
     canvas.drawImage(background,this.x, this.y,this.height,this.width);  
  };


  this.explode = function() {
    this.active = false;
    enemies.slice();
    if (this.size>1) {
      spawnEnemies(1,this.x,this.y,-this.vy,this.vx,size-1);
      spawnEnemies(1,this.x,this.y,this.vy,-this.vx,size-1);
    }
  };
}

function spawnEnemies(n,gx,gy,gvx,gvy, gsize) {
  var size = gsize || 3;
  var k = n || 1;
  var x, y, vx, vy;
  for(i=0; i<k; i++) {
    x = gx || Math.floor(CANVAS_WIDTH/2) + Math.floor((Math.random()*100)-50);
    y = gy || Math.floor(CANVAS_HEIGHT/2) + Math.floor((Math.random()*100)-50);
    vx = gvx || 0;
    vy = gvy || 0;
    while(vx + vy === 0) {
      vx = Math.floor((Math.random()*8)-4);
      vy = Math.floor((Math.random()*8)-4);
    }
    enemies.push(new enemy_c(x,y,vx,vy,size));
  }
};

spawnEnemies(6);

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
  "' height='" + CANVAS_HEIGHT + "'></canvas");
var canvas = canvasElement.get(0).getContext("2d");



canvasElement.appendTo('body');

setInterval(function() {
  update();
  draw();
}, 1000/FPS);

function update() {
  updatePlayers()
  updateEnemies()
  updateBullets()
  
  enemies = enemies.filter(function(enemy) {
    return enemy.active;
  });
  
  playerBullets = playerBullets.filter(function(bullet) {
    return bullet.active;
  });
  
  handleCollisions();
  
  if (enemies.length < 6) {
    spawnEnemies(1);
  }
}



function updatePlayers() {
  var player;
  for(i=0;i<players.length;i++) {
    if(Joysticks[i].stick === undefined){
      continue;
    }
    player = players[i];
    
    
    player.x += Joysticks[i].stick[0]*5;
    player.y += Joysticks[i].stick[1]*5;
    
    player.x = ((player.x % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH;
    player.y = ((player.y % CANVAS_HEIGHT) + CANVAS_HEIGHT) % CANVAS_HEIGHT;
  }
}

function updateEnemies() {
  var enemy;
  for(i=0;i<enemies.length;i++){
    enemy = enemies[i];
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    
    enemy.x = ((enemy.x % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH;
    enemy.y = ((enemy.y % CANVAS_HEIGHT) + CANVAS_HEIGHT) % CANVAS_HEIGHT;
  }
}

function updateBullets() {
  var bullet;
  for(i=0;i<playerBullets.length;i++) {
    
    bullet = playerBullets[i];
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    
    bullet.x = ((bullet.x % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH;
    bullet.y = ((bullet.y % CANVAS_HEIGHT) + CANVAS_HEIGHT) % CANVAS_HEIGHT;
    if (bullet.framesLeft < 1) {
      bullet.noMore();
    }
    bullet.framesLeft--;
  }
}

function draw() {
  canvas.fillStyle="lightblue";
  canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
  /*    
    
   var background = new Image();
  background.src = "sky.png";

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){
    canvas.drawImage(background,0,0); 
                                  }                              */
  players.forEach(function(player) {
    if (!player.dead) {
      player.draw()
    }
  });
  
  playerBullets.forEach(function(bullet) {
    bullet.draw();
  });

  enemies.forEach(function(enemy) {
    enemy.draw();
  });
  canvas.fillStyle="#FFF";
<<<<<<< HEAD
  canvas.font = '30pt'
  canvas.fillText("P1:" + players[0].lives, 50, 50);

  

=======
  canvas.font = 'normal 30pt sans-serif'
  canvas.fillText("P1:" + players[0].lives, players[0].spawn_x, players[0].spawn_y);
  canvas.fillText("P2:" + players[1].lives, players[1].spawn_x, players[1].spawn_y);
  canvas.fillText("P3:" + players[2].lives, players[2].spawn_x-50, players[2].spawn_y);
  canvas.fillText("P4:" + players[3].lives, players[3].spawn_x-50, players[3].spawn_y);
>>>>>>> 6b525de15477a94fe77a6c5c63deb1fe49d8621a
}

function collides(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function changeDirection() {
  var enemy;
  for(i=0;i<enemies.length;i++){
    enemy = enemies[i];
    enemy.vx = Math.floor((Math.random()*8)-4);
    enemy.vy = Math.floor((Math.random()*8)-4);
  }
}

function bindToB(start, direction) {
  var TIME_UNTIL_SHOOT = start - new Date();
    setTimeout(changeDirection, TIME_UNTIL_SHOOT);
}

window.Joysticks[0].on_b = bindToB;
window.Joysticks[1].on_b = bindToB;
window.Joysticks[2].on_b = bindToB;
window.Joysticks[3].on_b = bindToB;

function handleCollisions() {
  playerBullets.forEach(function(bullet) {
    enemies.forEach(function(enemy) {
      if(collides(bullet, enemy)) {
        enemy.explode();
        bullet.active = false;
      }
    });
  });

  enemies.forEach(function(enemy) {
    players.forEach(function(player) {
      if (!player.dead && !player.isInvincible) {
        if(collides(enemy, player)) {
          enemy.explode();
          player.die();
        }
      }
    });
  });
  
  players.forEach(function(player) {
    if (!player.dead && !player.isInvincible) {
      playerBullets.forEach(function(bullet) {
          if(collides(player, bullet)) {
            if (bullet.owner !== player) {
              bullet.active = false;
              player.die();
            }
          }
      });
    }
  });
}
console.log(players[0])
  for(var i = 0; i < players[0].lives; i++){
      console.log("ss");
      $('.lifebar').append('<img id="theImg" src="noter.png" />')
     
     }
     


