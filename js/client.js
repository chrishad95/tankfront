var tanksGame = {
    height: 600,
    width: 800,
    tanks: [],
    id: '',
    ship_zize: 10,
    asteroids: [],
	debug: true,
    difficulty_level: 1
};

var sources = {
    tiles: 'img/tiles.png',
    bg: 'img/pixel_grid.jpg'
};

tanksGame.pressedKeys = [];

var KEY = {
    UP: 38,
	DOWN: 40,
    A: 65,
    D:68,
	W:87,
	S:83,
	ENTER: 13,
	RIGHT: 39,
	SPACE: 32,
    LEFT: 37
};

$(function () {
    
    loadImages(sources, initStage);

    $(document).keydown(function(e) {
        tanksGame.pressedKeys[e.which] = true;
	});

	$(document).keyup(function (e) {
        tanksGame.pressedKeys[e.which] = false;
	});
});

      
function initStage(images) {
    
    tanksGame.socket = io.connect(null);
    tanksGame.socket.on('your_id', function (data) {
		tanksGame.id = data.id;
	});
    
    tanksGame.socket.on('update_game', function (data) {
		if (tanksGame.debug) {
			console.log("My id: " + tanksGame.id);
		}

		for (t in tanksGame.tanks) {
			if (! tanksGame.tanks[t].deleted) {
				var foundtank = false;
				for (servertank in data.tanks) {
					if (servertank == t) {
						foundtank = true;
					}
				}
				if (! foundtank) {
					console.log("deleting tank: " + t);
					tanksGame.tanks[t].deleted = true;
					tanksGame.tanks[t].image.destroy();
				}
			}
		}

		for (t in data.tanks) {
			if (tanksGame.debug) {
				console.log("Adding Tank: " + t);
			}
			if (tanksGame.tanks[t]) {
				tanksGame.tanks[t].image.setX( data.tanks[t].x);
				tanksGame.tanks[t].image.setY( data.tanks[t].y);
				if (data.tanks[t].rotation > tanksGame.tanks[t].rotation ){
					// server rotation is greater
					tanksGame.tanks[t].image.rotate(toRadians(data.tanks[t].rotation - tanksGame.tanks[t].rotation));
					tanksGame.tanks[t].rotation = data.tanks[t].rotation;
				} else {
					// server rotation is lesser
					tanksGame.tanks[t].image.rotate(toRadians(data.tanks[t].rotation - tanksGame.tanks[t].rotation));
					tanksGame.tanks[t].rotation = data.tanks[t].rotation;
				}

	            tanksGame.tanksLayer.draw();
			}  else {
				tanksGame.tanks[t] = new Tank(data.tanks[t].x  , data.tanks[t].y , 0, 0, data.tanks[t].rotation, (t != tanksGame.id));
				tanksGame.tanks[t].deleted = false;
	            tanksGame.tanksLayer.draw();
			}
		}
		if (tanksGame.debug) {
			tanksGame.debug = false;
			console.log(data);
			console.log(tanksGame);
		}

//        if (tanksGame.myTank) {
//            tanksGame.ships[0].speedX = 0;
//            tanksGame.ships[0].speedY = 0;
//            tanksGame.ships[0].x = data.x;
//            tanksGame.ships[0].y = data.y;
//            tanksGame.ships[0].rotation = data.rotation;
//            tanksGame.ships[0].image.rotate(toRadians(  data.rotation));
//            
//            tanksGame.ships[0].image.setX( tanksGame.ships[0].x);
//            tanksGame.ships[0].image.setY( tanksGame.ships[0].y);
//            tanksGame.tanksLayer.draw();
//        } else {
//            
//            tanksGame.myTank = new Tank(data.x  , data.y , 0, 0, data.rotation);
//            tanksGame.ships.push(tanksGame.myTank)
//        }
        
	});
    
    var stage = tanksGame.stage = new Kinetic.Stage({ container: "container", width: tanksGame.width, height: tanksGame.height });
    
    var bgLayer = new Kinetic.Layer();
  	bgLayer.add( new Kinetic.Image({
		image: images.bg,
		x: 0,
		y: 0
	}));
	stage.add(bgLayer);
    var tanksLayer = tanksGame.tanksLayer = new Kinetic.Layer();
    stage.add(tanksLayer);
    
    tanksGame.timer = setInterval(gameloop, 30);
}

function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function loadImages(sources, callback) {
    var assetDir = '';
    tanksGame.images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      tanksGame.images[src] = new Image();
      tanksGame.images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(tanksGame.images);
        }
      };
      tanksGame.images[src].src = assetDir + sources[src];
    }
}

          
function gameloop() {



//
//    // bullets
//    if (tanksGame.pressedKeys[KEY.SPACE]) {
//        //ctx.lineTo(x + tanksGame.ship_zize * Math.cos(toRadians(rotation)), y + tanksGame.ship_zize * Math.sin(toRadians(rotation)));
//
//        var velocityY = tanksGame.ships[0].speedY + 5 * Math.sin(toRadians(tanksGame.ships[0].rotation));
//        var velocityX = tanksGame.ships[0].speedX + 5 * Math.cos(toRadians(tanksGame.ships[0].rotation));
//
//        if (tanksGame.ships[0].bullets.length < 3) {
//            tanksGame.ships[0].bullets.push(new Bullet(tanksGame.ships[0].x + tanksGame.ship_zize * Math.cos(toRadians(tanksGame.ships[0].rotation)), tanksGame.ships[0].y + tanksGame.ship_zize * Math.sin(toRadians(tanksGame.ships[0].rotation)), velocityX, velocityY));
//        }
//        //console.log("made a bullet. bullets:" + tanksGame.ships[0].bullets.length);
//	}

    moveShips();
    
//    moveBullets(ctx);
//    if (tanksGame.asteroids.length < 2) {
//        tanksGame.asteroids.push(new Asteroid(-10, Math.random() * tanksGame.height, 1+  Math.random() , 1 + Math.random(), 20));
//        
//    }
//    moveAsteroids(ctx);

}

function moveShips() {

    if (tanksGame.pressedKeys[KEY.RIGHT] || tanksGame.pressedKeys[KEY.D] ) {
        //tanksGame.ships[0].rotation = (tanksGame.ships[0].rotation + 5) % 360;
        //tanksGame.ships[0].image.rotate(toRadians(  5));
        //tanksGame.tanksLayer.draw();
		tanksGame.socket.emit('move_right', null);
    }
    if (tanksGame.pressedKeys[KEY.LEFT]  || tanksGame.pressedKeys[KEY.A] ) {
		tanksGame.socket.emit('move_left', null);
        //tanksGame.ships[0].rotation = (360 + tanksGame.ships[0].rotation - 5) % 360;
        //tanksGame.ships[0].image.rotate(toRadians(  -5));
        //tanksGame.tanksLayer.draw();
    }
    if (tanksGame.pressedKeys[KEY.UP] || tanksGame.pressedKeys[KEY.W] ) {
		tanksGame.socket.emit('move_up', null);
		tanksGame.debug = true;
        //// need to give it some gas here.
        //var velocityX = 1 * Math.sin(toRadians(  tanksGame.ships[0].rotation));
        //velocityX = Math.floor(velocityX * 1000) / 1000;
        //
        //var velocityY = 1 *  Math.cos(toRadians(tanksGame.ships[0].rotation ));
        //velocityY = Math.floor(velocityY * -1000) / 1000;
        //
        //// constant speed...
        //
        //tanksGame.ships[0].speedX = velocityX;
        //tanksGame.ships[0].speedY = velocityY;
        //tanksGame.ships[0].x += velocityX;
        //tanksGame.ships[0].y += velocityY;
        //tanksGame.ships[0].image.setX( tanksGame.ships[0].x);
        //tanksGame.ships[0].image.setY( tanksGame.ships[0].y);
        //tanksGame.tanksLayer.draw();
                
    } 
    if (tanksGame.pressedKeys[KEY.DOWN] || tanksGame.pressedKeys[KEY.S] ) {
		tanksGame.socket.emit('move_down', null);
        // need to give it some gas here.
        //var velocityX = 1 * Math.sin(toRadians(  tanksGame.ships[0].rotation));
        //velocityX = Math.floor(velocityX * -1000) / 1000;
        //
        //var velocityY = 1 *  Math.cos(toRadians(tanksGame.ships[0].rotation ));
        //velocityY = Math.floor(velocityY * 1000) / 1000;
        //
        //// constant speed...
        //// maps article  
        //// http://stackoverflow.com/questions/11406161/managing-text-maps-in-a-2d-array-on-to-be-painted-on-html5-canvas
        //// gameloop latency
        //// https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization
        //
        //
        //tanksGame.ships[0].speedX = velocityX;
        //tanksGame.ships[0].speedY = velocityY;
        //tanksGame.ships[0].x += velocityX;
        //tanksGame.ships[0].y += velocityY;
        //tanksGame.ships[0].image.setX( tanksGame.ships[0].x);
        //tanksGame.ships[0].image.setY( tanksGame.ships[0].y);
        //tanksGame.tanksLayer.draw();
                
    } 
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
function Tank(x, y, speedX, speedY, rotation, enemy) {
    this.rotation = rotation;
    this.x = x;
    this.y = y;
    this.deleted = false;
    this.speedX = speedX;
    this.speedY = speedY;
    this.bullets = []; 
	if (enemy) {
    	this.image = new Kinetic.Image({
    	    x: x,
    	    y: y,
    	    crop: {width: 32, height: 32, x: convertTileCoords(18,5).x, y: convertTileCoords(18,5).y},
    	    width: 32,
    	    height: 32,
    	    offset: [16,16],
    	    image: tanksGame.images.tiles
    	});
	} else {
    	this.image = new Kinetic.Image({
    	    x: x,
    	    y: y,
    	    crop: {width: 32, height: 32, x: convertTileCoords(15,3).x, y: convertTileCoords(15,3).y},
    	    width: 32,
    	    height: 32,
    	    offset: [16,16],
    	    image: tanksGame.images.tiles
    	});
	}
    this.image.rotate( toRadians(this.rotation));
    
    
    tanksGame.tanksLayer.add(this.image);
    tanksGame.tanksLayer.draw();    
}

function Bullet( x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.life = 30;
}


function drawBullet(ctx, x, y) {
    drawCircle(ctx, x, y, 2);
}


function convertTileCoords(x,y) {
    var res = [];
    res.x = (x-1) * 32;
    res.y = (y-1) * 32;
    return res;
}

function toRadians(d) {
    //gives an angle in radians
    return d * Math.PI / 180;
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
