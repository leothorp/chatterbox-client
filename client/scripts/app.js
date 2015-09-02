var app;

$(document).ready(function() {

  app = {};
  app.friends = {};

  app.init = function(){
    app.fetch();
  };

  app.displayMessages = function (messages) {
    var chosenRoom = $("#roomSelect").val();
    var rooms = {};
    $("#roomSelect option").each(function(){
      var option = $(this).val();
      if (!(app.escapeHtml(option) in rooms)) {
        rooms[option] = true;
      }
    });
    for (var i = messages.length-1; i > 0; i--) {

      if (chosenRoom === "all rooms" || app.escapeHtml(messages[i].roomname) === chosenRoom) {
        app.addMessage(messages[i]);
        var room = $('<span>' + app.escapeHtml(messages[i].roomname) + '</span>');
        var currentRoomName = room[0].innerHTML;
        if (!(currentRoomName + '' in rooms)) {
          console.log(rooms);
          console.log(currentRoomName);
          console.log(currentRoomName in rooms);
          console.log('appending room');
          $("#roomSelect").append('<option>' + currentRoomName + '</option>');
          rooms[currentRoomName] = true;
        }
      } 
    }
  };

  app.addFriend = function(friend) {
    var friendName = friend[0].innerHTML;
    if (!(friendName in app.friends)) {
      app.friends[friendName] = true;
      $('.username').each(function() {
        if ($(this)[0].innerHTML === friendName) {
          $(this).addClass('friend');
        }
      });
    }
  };
 
  app.addMessage = function(message) {
    var userName = $('<span class="username">' + app.escapeHtml(message['username']) + ': ' + '</span>');
    if (userName[0].innerHTML in app.friends) {
      userName.addClass('friend');
    }
    var messageText =  $('<span>' + app.escapeHtml(message.text) + '</span>');

    var room = $('<span>' + app.escapeHtml(message.roomname) + '</span>');
    var currentMessage = $('<div class="message"></div>'); 
    currentMessage.append(userName);
    currentMessage.append(messageText);
    currentMessage.append(room);
    $('#chats').append(currentMessage);
  };

  app.addRoom = function(roomName) {
    $("#roomSelect").append('<option>' + roomName + '</option>');
  };


  app.server = 'https://api.parse.com/1/classes/chatterbox';
  
  app.fetch = function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data.results);
        app.displayMessages(data.results);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };


  app.send = function(message) {  
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('sent data: ' + data);
        console.log('chatterbox: Message sent');

      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  }; 

  app.clearMessages = function() {
    $('#chats').empty();
  };  

  app.escapeHtml = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  
  

  $(document).on('click', '.username', function() {
    console.log('clicked username');
    var friendToAdd = $(this);
    app.addFriend(friendToAdd); 
  });

  $('#roomSelect').change(function(){
    app.clearMessages();
    app.fetch();
  });

  $('#refresh').click(function(){
    app.clearMessages();
    app.fetch();
  });

  $('#submit').click(function() {
    var username = $('#userNameInput').val();
    var text = $('#messageInput').val();
    var room = $('#roomInput').val();
    app.addRoom(room);
    var message = {
      username: username,
      text: text,
      roomname: room
    };
    console.log(message);
    app.send(message); 

  });
});