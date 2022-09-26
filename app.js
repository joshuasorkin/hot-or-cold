require('dotenv').config();
const PlayerMap = require('./player-map');

var express = require('express');
var app = express();

var debug = require('debug')('hot-or-cold:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '1337');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}




var createError = require('http-errors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const io = require('socket.io')(server,{
  cors: {
      origin: "http://localhost:1337",
      methods: ["GET", "POST"],
      credentials:true
  }
});
const cors = require('cors');

const playerMap = new PlayerMap();

io.on('connection',socket=>{
  console.log(`new socket connected: ${socket.id}`);

  socket.on('accelerometer',accelerometer =>{
    //console.log({accelerometer});
  });

  socket.on('coordinates',message =>{
    if(!playerMap.player_exists(socket.id)){
      playerMap.create_player(socket.id,message);
    }
    else{
      let distance_difference =
      playerMap.update_player_coordinates(socket.id,message);
      //if distance to target is 0, player is at target
      let player_properties = playerMap.get_player_properties(socket.id);
      let target_distance = player_properties.closest_target.distance;
      if (target_distance === 0){
        io.to(socket.id).emit('hot-or-cold','fusion');
      }
      else{
        if(distance_difference > 0){
          io.to(socket.id).emit('hot-or-cold',`cold\ndistance:${target_distance}\ndifference: +${distance_difference}`);
        }
        if(distance_difference < 0){
          io.to(socket.id).emit('hot-or-cold',`hot\ndistance: ${target_distance}\ndifference: -${distance_difference}`);
        }
        if(distance_difference === 0){
          io.to(socket.id).emit('hot-or-cold',`***\ndistance: ${target_distance}`);
        }
      }
    }
  });
  socket.on('disconnect',message=>{
    console.log(`removing player ${socket.id}`);
    playerMap.remove_player(socket.id);
  })
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//load routes
const RouterLoader = require('./routerLoader');
const routerLoader = new RouterLoader(app);
routerLoader.loadRoutes();


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
