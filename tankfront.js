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



server.listen(process.env.PORT);

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
app.get('/js/kinetic.js', function (req, res) {
    res.sendfile(__dirname + '/js/kinetic.js');
});

io.sockets.on('connection', function (socket) {
    var id = gameData.playerCount++;
    gameData.players[id] = new Player(socket,id);
    console.log("Player " + id + " has joined.");
    
    socket.emit('current_position', {x: gameData.players[id].x, y: gameData.players[id].y, rotation: gameData.players[id].rotation});
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

function Player(socket, name){
    this.socket = socket;
	this.name = name;
    this.x = Math.floor(Math.random() * gameData.width);
    this.y = Math.floor(Math.random() * gameData.height);
    this.rotation = Math.floor(Math.random() * 360);
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