(function(){
  var 
  socket = io.connect(),
  $messageForm = $('#sendMessage'),
  $message = $('#message'),
  $botonEnviar = $('#botonEnviar'),
  $chat = $('#chat'),
  $user = $('#users'),
  $nick = $('#nickname'),
  $setNick = $('#setNick'),
  $numberConnected = $('#numberConnected'),
  username;
  
  /*modify Date to take now moment*/
  Date.prototype.timeNow = function () {

    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
  }

  /*function to validate username*/
  function usernameIsValid(username) {
    var validcharacters = '1234567890-_.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if(username.length > 20){
      return false
    }

    for (var i = 0, l = username.length; i < l; ++i) {
        if (validcharacters.indexOf(username.substr(i, 1)) == -1) {
            return false;
        }
        return true;
    }
  }

  $setNick.click(function(e){
    e.preventDefault(); 
    if(usernameIsValid($nick.val())){
        username = $nick.val();
        socket.emit('newUser', $nick.val(),function(data){
        if(data){
          $('#nickContainer').hide();
          $('#content').show();
        }else{
          $('#login-error').show();
        }
      });  
    }else{
      $('#login-error-name').show();
    }     
  })

  $botonEnviar.click(function(e){
    console.log($message.val())
    e.preventDefault()
    if( $message.val() !='' && username){
      socket.emit('sendMessage',$message.val()); 
      $message.val('');
      $chat.scrollTop($chat[0].scrollHeight);
    }
  });

  socket.on('newMessage',function(data){
    var nowDate = new Date();

    $chat.append("<strong>"+data.nick+"<small>["+nowDate.timeNow()+"]</small></strong><strong class='text-primary'> - "+data.msg+"</strong><br/>");
  });  

  socket.on('userLeft',function(data){

    $chat.append("<strong class='text-danger'>"+ data.msg +" left the channel </strong><br/>");
    $numberConnected.html('<strong>'+data.userConnected+'</strong>')
  }); 

  socket.on('userIn',function(data){

    $chat.append("<strong class='text-success'>"+ data.msg +" join the chat </strong><br/>");
    $numberConnected.html('<strong>'+data.userConnected+'</strong>')
  }); 

  socket.on('usernames',function(data){

    var usernamesString = "";
    for(var username in data){
      usernamesString += username + "</br>";
    }

    $user.html(usernamesString)
  });

}());
