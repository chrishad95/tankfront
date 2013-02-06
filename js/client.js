var tanksGame = {
    height: 0,
    width: 0,
    ships: [],
    ship_zize: 10,
    asteroids: [],
    difficulty_level: 1
};

var sources = {
    tiles: 'img/tiles.png'
};

tanksGame.pressedKeys = [];

var KEY = {
    UP: 38,
	DOWN: 40,
	W:87,
	S:83,
	ENTER: 13,
	RIGHT: 39,
	SPACE: 32,
    LEFT: 37
};

$(function () {
    //set up and interval to loop the game loop
    tanksGame.timer = setInterval(gameloop, 30);
    $(document).keydown(function(e) {
	    tanksGame.pressedKeys[e.which] = true;
	});

	$(document).keyup(function (e) {
	    tanksGame.pressedKeys[e.which] = false;
	});
	tanksGame.width = parseInt($("#game").width());
	tanksGame.height = parseInt($("#game").height());
    tanksGame.img = new Image();
    tanksGame.img.src = 'img/tiles.png';
    
        
});

function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function loadImages(sources, callback) {
    var assetDir = '';
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = assetDir + sources[src];
    }
}


loadImages(sources, initStage);
      
      
function initStage(images) {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 700,
        height: 500
    });
}
          
function gameloop() {
    // get the reference of the canvas element and the drawing context.
    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');
    clear(ctx);
    if (tanksGame.ships.length < 1) {
        tanksGame.ships.push(new Ship(tanksGame.width / 2, tanksGame.height / 2, 0, 0, 0));
    }

    // bullets
    if (tanksGame.pressedKeys[KEY.SPACE]) {
        //ctx.lineTo(x + tanksGame.ship_zize * Math.cos(toRadians(rotation)), y + tanksGame.ship_zize * Math.sin(toRadians(rotation)));

        var velocityY = tanksGame.ships[0].speedY + 5 * Math.sin(toRadians(tanksGame.ships[0].rotation));
        var velocityX = tanksGame.ships[0].speedX + 5 * Math.cos(toRadians(tanksGame.ships[0].rotation));

        if (tanksGame.ships[0].bullets.length < 3) {
            tanksGame.ships[0].bullets.push(new Bullet(tanksGame.ships[0].x + tanksGame.ship_zize * Math.cos(toRadians(tanksGame.ships[0].rotation)), tanksGame.ships[0].y + tanksGame.ship_zize * Math.sin(toRadians(tanksGame.ships[0].rotation)), velocityX, velocityY));
        }
        //console.log("made a bullet. bullets:" + tanksGame.ships[0].bullets.length);
	}
    moveShips(ctx);
    moveBullets(ctx);
    if (tanksGame.asteroids.length < 2) {
        tanksGame.asteroids.push(new Asteroid(-10, Math.random() * tanksGame.height, 1+  Math.random() , 1 + Math.random(), 20));
        
    }
    moveAsteroids(ctx);

}

function Asteroid(x, y, speedX, speedY, size) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.size = size;
    this.points = [];
    console.log(speedX);

    var n_points = 5 + parseInt(Math.random() * 10);

    var theta = 0;
    theta += Math.floor(360 / n_points);
    for (var i = 0; i < n_points; i++) {
        var p = {};
        var d =  5 + Math.random() * (10 + this.size);
        p.x = d * Math.cos(toRadians(theta));
        p.y = d * Math.sin(toRadians(theta));
        this.points.push(p);

        theta += Math.floor(360 / n_points);
    }
}

function Ship(x, y, speedX, speedY, rotation) {
    this.rotation = rotation;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.bullets = [];
}

function Bullet( x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.life = 30;
}

function drawAsteroid(ctx, idx) {

    ctx.beginPath();
    //console.log(tanksGame.asteroids[idx].points[0].x);

    ctx.moveTo(tanksGame.asteroids[idx].x + tanksGame.asteroids[idx].points[tanksGame.asteroids[idx].points.length - 1].x, tanksGame.asteroids[idx].y + tanksGame.asteroids[idx].points[tanksGame.asteroids[idx].points.length - 1].y);
    for (var i = 0; i < tanksGame.asteroids[idx].points.length; i++) {
        ctx.lineTo(tanksGame.asteroids[idx].x + tanksGame.asteroids[idx].points[i].x, tanksGame.asteroids[idx].y + tanksGame.asteroids[idx].points[i].y);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}

function drawBullet(ctx, x, y) {
    drawCircle(ctx, x, y, 2);
}

function drawTank(ctx, x, y, rotation) {
    var tank_width = 40;
    var tank_height = 40;
    var converted = convertTileCoords(15,3);
    
//    ctx.beginPath();
//    ctx.moveTo(x+0, y+0);
//    ctx.lineTo(x+0, y+tank_height);
//    ctx.lineTo(x+tank_width/4,y+tank_height);
//    ctx.lineTo(x+tank_width/4,y+3*tank_height/4);
//    ctx.lineTo(x+3*tank_width/4,y+3*tank_height/4);
//    ctx.lineTo(x+3*tank_width/4,y+tank_height);
//    ctx.lineTo(x+tank_width,y+tank_height);
//    ctx.lineTo(x+tank_width,y+0);
//    ctx.lineTo(x+3*tank_width/4,y+0);
//    ctx.lineTo(x+3*tank_width/4,y+tank_height/4);
//    ctx.lineTo(2+x+tank_width/2,y+tank_height/4);
//    ctx.lineTo(2+x+tank_width/2,y+0);
//    ctx.lineTo(x-2+tank_width/2,y+0);
//    ctx.lineTo(x-2+tank_width/2,y+tank_height/4);
//    ctx.lineTo(x+tank_width/4,y+tank_height/4);
//    ctx.lineTo(x+tank_width/4,y+0);
//    ctx.lineTo(x+0,y+0);
//    ctx.lineWidth = 1;
//    ctx.strokeStyle = '#cfc';
//    ctx.stroke();
    
    ctx.drawImage(tanksGame.img,converted.x,converted.y,32,32,x,y,32,32);
}

function convertTileCoords(x,y) {
    var res = [];
    res.x = (x-1) * 32;
    res.y = (y-1) * 32;
    return res;
}
function drawShip(ctx, x, y, rotation) {
    

    ctx.beginPath();
    // given x,y the center we need to move to the first point
    ctx.moveTo(x + tanksGame.ship_zize * Math.cos(toRadians(150 + rotation)), y + tanksGame.ship_zize * Math.sin(toRadians(150 + rotation)));
    ctx.lineTo(x + tanksGame.ship_zize * Math.cos(toRadians(rotation)), y + tanksGame.ship_zize * Math.sin(toRadians(rotation)));
    ctx.lineTo(x + tanksGame.ship_zize * Math.cos(toRadians(210 + rotation)), y + tanksGame.ship_zize * Math.sin(toRadians(210 + rotation)));
    ctx.lineTo(x + tanksGame.ship_zize * Math.cos(toRadians(150 + rotation)), y + tanksGame.ship_zize * Math.sin(toRadians(150 + rotation)));

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}

function toRadians(d) {
    //gives an angle in radians
    return d * Math.PI / 180;
}

function moveAsteroids(ctx) {
    for (var i = 0; i < tanksGame.asteroids.length; i++) {
        tanksGame.asteroids[i].x += tanksGame.asteroids[i].speedX;
        tanksGame.asteroids[i].y += tanksGame.asteroids[i].speedY;

        if (tanksGame.asteroids[i].x > parseInt($("#game").width()) - 10) {
            tanksGame.asteroids[i].x = parseInt($("#game").width() - 10);
            tanksGame.asteroids[i].x = -10;
            //tanksGame.asteroids[i].speedX *= -1;
        }
        if (tanksGame.asteroids[i].y > parseInt($("#game").height()) - 10) {
            tanksGame.asteroids[i].y = parseInt($("#game").height() - 10);
            tanksGame.asteroids[i].y = -10;
            //tanksGame.asteroids[i].speedY *= -1;
        }
        if (tanksGame.asteroids[i].x < -10) {
            tanksGame.asteroids[i].x = 0;
            tanksGame.asteroids[i].x = parseInt($("#game").width() - 10);
            //tanksGame.asteroids[i].speedX *= -1;
        }
        if (tanksGame.asteroids[i].y < -10) {
            tanksGame.asteroids[i].y = 0;
            tanksGame.asteroids[i].y = parseInt($("#game").height() - 10);
            //tanksGame.asteroids[i].speedY *= -1;
        }

        drawAsteroid(ctx, i);
    }
}


function moveBullets(ctx) {
    for (var i = 0; i < tanksGame.ships.length; i++) {
        for (var j = tanksGame.ships[i].bullets.length - 1; j >= 0; j--) {

            tanksGame.ships[i].bullets[j].life -= 1;
            if (tanksGame.ships[i].bullets[j].life > 0) {
                tanksGame.ships[i].bullets[j].x += tanksGame.ships[i].bullets[j].speedX;
                tanksGame.ships[i].bullets[j].y += tanksGame.ships[i].bullets[j].speedY;
                drawBullet(ctx, tanksGame.ships[i].bullets[j].x, tanksGame.ships[i].bullets[j].y);
            } else {
                tanksGame.ships[i].bullets.splice(j, 1);
            }

        }
    }


}

function moveShips(ctx) {

    if (tanksGame.pressedKeys[KEY.RIGHT]) {
        tanksGame.ships[0].rotation = (tanksGame.ships[0].rotation + 5) % 360;
    }
    if (tanksGame.pressedKeys[KEY.LEFT]) {
        tanksGame.ships[0].rotation = (360 + tanksGame.ships[0].rotation - 5) % 360;
    }
    if (tanksGame.pressedKeys[KEY.UP]) {
        // need to give it some gas here.
        var velocityY = 1 * Math.sin(toRadians(  tanksGame.ships[0].rotation));
        var velocityX = 1 *  Math.cos(toRadians(tanksGame.ships[0].rotation ));
        
        // constanct speed...
        tanksGame.ships[0].speedX = velocityX;
        tanksGame.ships[0].speedY = velocityY;
    } else {
        // if they take their foot off the gas, the tank stops
        tanksGame.ships[0].speedX = 0;
        tanksGame.ships[0].speedY = 0;
    }

    for (var i = 0; i < tanksGame.ships.length; i++) {
        tanksGame.ships[i].x += tanksGame.ships[i].speedX;
        tanksGame.ships[i].y += tanksGame.ships[i].speedY;

        if (tanksGame.ships[i].x > parseInt($("#game").width()) - 10) {
            tanksGame.ships[i].x = parseInt($("#game").width() - 10);
            tanksGame.ships[i].x = -10;
            //tanksGame.ships[i].speedX *= -1;
        }
        if (tanksGame.ships[i].y > parseInt($("#game").height()) - 10) {
            tanksGame.ships[i].y = parseInt($("#game").height() - 10);
            tanksGame.ships[i].y = -10;
            //tanksGame.ships[i].speedY *= -1;
        }
        if (tanksGame.ships[i].x < -10) {
            tanksGame.ships[i].x = 0;
            tanksGame.ships[i].x = parseInt($("#game").width() - 10);
            //tanksGame.ships[i].speedX *= -1;
        }
        if (tanksGame.ships[i].y < -10) {
            tanksGame.ships[i].y = 0;
            tanksGame.ships[i].y = parseInt($("#game").height() - 10);
            //tanksGame.ships[i].speedY *= -1;
        }

        drawTank(ctx, tanksGame.ships[i].x, tanksGame.ships[i].y, tanksGame.ships[i].rotation);
    }

}

function drawLine(ctx, x1, y1, x2, y2, thickness) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}
function drawCircle(ctx, x, y, radius) {

    ctx.fillStyle = "rgba(200,200,100,.9)";

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}


function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}
function Line(startPoint, endPoint, thickness) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.thickness = thickness;
}

function appendchat(s) {
    var t = $("#chatwindow").val();
    t = t + s;
    $("#chatwindow").val(t);
}
