var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var gameData = {};
gameData.playerCount = 0;
gameData.players = [];
gameData.height = 600,
gameData.width = 800,

server.listen(9090);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get('/css/style.css', function (req, res) {
    res.sendfile(__dirname + '/css/style.css');
});
app.get('/js/client.js', function (req, res) {
    res.sendfile(__dirname + '/js/client.js');
});

app.get('/img/tiles.png', function (req, res) {
res.sendfile(__dirname + '/img/tiles.png');
});
app.get('/img/pixel_grid.jpg', function (req, res) {
res.sendfile(__dirname + '/img/pixel_grid.jpg');
});
app.get('/js/kinetic-v4.3.1.min.js', function (req, res) {
    res.sendfile(__dirname + '/js/kinetic-v4.3.1.min.js');
});

io.sockets.on('connection', function (socket) {

    var id = gameData.playerCount++;
	id = id + randomstring(10);
	socket.set('id',id);

	var p = new Player(socket,id);

    gameData.players[id] = p;
    console.log("Player " + id + " has joined.");
    socket.emit('your_id', {id: id});
    
    socket.emit('current_position', {x: gameData.players[id].x, y: gameData.players[id].y, rotation: gameData.players[id].rotation});

    socket.on('move_right', function (data) {
		socket.get('id', function(err,id){
        	gameData.players[id].rotation = (gameData.players[id].rotation + 5) % 360;
		});
    });
    socket.on('move_left', function (data) {
		socket.get('id', function(err,id){
        	gameData.players[id].rotation = (gameData.players[id].rotation - 5) % 360;
		});
    });
    socket.on('move_up', function (data) {
		socket.get('id', function(err,id){
        	// need to give it some gas here.
        	var velocityX = 1 * Math.sin(toRadians(  gameData.players[id].rotation));
        	velocityX = Math.floor(velocityX * 1000) / 1000;
        	
        	var velocityY = 1 *  Math.cos(toRadians(gameData.players[id].rotation ));
        	velocityY = Math.floor(velocityY * -1000) / 1000;

        	gameData.players[id].x += velocityX;
        	gameData.players[id].y += velocityY;
		});
    });
    socket.on('move_down', function (data) {
		socket.get('id', function(err,id){
        	// need to give it some gas here.
        	var velocityX = 1 * Math.sin(toRadians(  gameData.players[id].rotation));
        	velocityX = Math.floor(velocityX * -1000) / 1000;
        	
        	var velocityY = 1 *  Math.cos(toRadians(gameData.players[id].rotation ));
        	velocityY = Math.floor(velocityY * 1000) / 1000;

        	gameData.players[id].x += velocityX;
        	gameData.players[id].y += velocityY;
		});
    });
	socket.on('disconnect', function() {
		socket.get('id', function(err,id){
			console.log(id + " disconnected.");
			delete gameData.players[id];
		});

	});
});


gameData.timer = setInterval(gameloop, 30);

function toRadians(d) {
    //gives an angle in radians
    return d * Math.PI / 180;
}

function Player(socket, name){
    this.socket = socket;
	this.name = name;
    this.x = Math.floor(Math.random() * gameData.width);
    this.y = Math.floor(Math.random() * gameData.height);
    this.rotation = Math.floor(Math.random() * 360);
}
function gameloop ()
{
	
	var tanks = {};
	for (var id in gameData.players) {
		tanks[id] =  {id: id, x: gameData.players[id].x, y: gameData.players[id].y, rotation: gameData.players[id].rotation};
	}
	for (var id in gameData.players) {
		gameData.players[id].socket.emit('update_game',  {tanks: tanks});
	}

}

function randomstring (num){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < num; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
//function Tank(x, y, speedX, speedY, rotation) {
//    this.rotation = rotation;
//    this.x = x;
//    this.y = y;
//    this.speedX = speedX;
//    this.speedY = speedY;
//    this.bullets = [];
//    console.log("x=" + x + " y=" + y);
//    
//    this.image = new Kinetic.Image({
//        x: x,
//        y: y,
//        crop: {width: 32, height: 32, x: convertTileCoords(15,3).x, y: convertTileCoords(15,3).y},
//        width: 32,
//        height: 32,
//        offset: [16,16],
//        image: tanksGame.images.tiles
//    });
//    
//    tanksGame.tanksLayer.add(this.image);
//    tanksGame.tanksLayer.draw();    
//}
//var express = require('express'),
//    app = express();
//
//app.use(express.logger());
//
//app.get('/', function(req, res){
//    res.send('Hello World');
//});
//
//app.listen(process.env.PORT);
//console.log('Express server started on port %s', process.env.PORT);
