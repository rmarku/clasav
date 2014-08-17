// Setting up required components
/* ----------------------------------------------------------------- */
var http = require('http'),
    path = require('path'),
    isProduction = (process.env.NODE_ENV === 'production'),
    port = isProduction ? 80 : process.env.PORT || 8000,
    express = require('express'),
    app = express(),
    socketio = require('socket.io');

// Setting up express for routing
app.set('port', port);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 86400000 }));

// Routing
/* -----------------------------------------------------------------
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/game', function(req, res) {
  res.render('game');
});
 */
var server = http.createServer(app);
//var io = socketio.listen(server);


// ...and actually starting the server!
/* ----------------------------------------------------------------- */

server.listen(app.get('port'), function() {
  console.log('Juego en http://127.0.0.1:' + app.get('port'));
});
