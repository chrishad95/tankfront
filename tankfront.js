var express = require('express'), app = express(), 
    io = require('socket.io').listen(app);

app.listen(process.env.PORT);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get('/css/style.css', function (req, res) {
    res.sendfile(__dirname + '/css/style.css');
});
app.get('/js/client.js', function (req, res) {
    res.sendfile(__dirname + '/js/client.js');
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

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