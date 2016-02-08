var express = require('express');
var app = express();

var nicknames = {};
var countUser = 0;
    
app.use(express.static(__dirname + '/www'));

var port = process.env.PORT || 5000;


var server = app.listen(port,function(){
  var port = server.address().port;
  console.log('listen on :' + port);
});

var io = require('socket.io')(server);

/* Client events */
io.on('connection',function(socket){

  socket.on('sendMessage',function(data){
    io.sockets.emit('newMessage',{msg:data,nick:socket.nickname});
  });

  socket.on('newUser',function(data,callback){
    if(data in nicknames){
      callback(false)
    }
    else{
      callback(true);
      socket.nickname = data;
      nicknames[socket.nickname] = 1;
      countUser = countUser + 1;
      io.sockets.emit('userIn',{msg:socket.nickname,userConnected:countUser});
      updateNicknames();
    }
  });

  socket.on('disconnect',function(data){
    if(!socket.nickname)return;
    countUser = countUser - 1;
    io.sockets.emit('userLeft',{msg:socket.nickname,userConnected:countUser});
    delete nicknames[socket.nickname];
    updateNicknames();
  })

  function updateNicknames(){
    io.sockets.emit('usernames',nicknames)
  }
});
