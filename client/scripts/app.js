$(document).ready(function() {

//proposed fix to select clearing issue:  integrate the select population with displayMessages,
//(get rid of createRoomMenu) 
//at beginning of display message, build object of current select options.  as you iterate over
//messages, add the inner html of each <span> room element if it does not already appear
//in the storage object (and add it to the storage object).
//now no need for chosenRoom global; just query current value of the select.
//also, easy to implement only retrieving new messages: just start at the most recent message, 
//
//and iterate backwards through messages array prepending each message, 
//until you reach the message ID of the previous 
//most recent message (you never need to clear the messageDisplay)
  
  
  var getMessages = function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        displayMessages(data.results);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  var displayMessages = function (messages) {
    var chosenRoom = $("#selectRoom").val();
    var rooms = {};
    $("#selectRoom option").each(function(){
      var option = $(this).val();
      if (!(option in rooms)) {
        rooms[option] = true;
      }
    });

    for (var i = messages.length-1; i > 0; i--) {
      if (chosenRoom === "all rooms" || escapeHtml(messages[i].roomname) === chosenRoom) {
        var userName = $('<span class="username">' + escapeHtml(messages[i]['username']) + ': ' + '</span>');
        if (userName[0].innerHTML in friends) {
          userName.addClass('friend');
        }
        var message =  $('<span>' + escapeHtml(messages[i].text) + '</span>');
        var room = $('<span>' + escapeHtml(messages[i].roomname) + '</span>');
        var currentMessage = $('<div class="message"></div>'); 
        currentMessage.append(userName);
        currentMessage.append(message);
        currentMessage.append(room);
        $('#messageDisplay').append(currentMessage);
        var currentRoomName = room[0].innerHTML;
        if (!(currentRoomName in rooms)) {
          console.log('appending room');
          $("#selectRoom").append('<option>' + currentRoomName + '</option>');
          rooms[currentRoomName] = true;
        }
      } 
    }
  };

  var friends = {};

  $(document).on('click', '.username', function() {
    console.log('clicked username');
    var friendName = $(this)[0].innerHTML;
    if (!(friendName in friends)) {
      friends[friendName] = true;
      $('.username').each(function() {
        if ($(this)[0].innerHTML === friendName) {
          $(this).addClass('friend');
        }
      });
    }
  });

  $('#selectRoom').change(function(){
  //  chosenRoom = $('#selectRoom').val();
    $('#messageDisplay').empty();
    getMessages();
  });


  $('#refresh').click(function(){
    $('#messageDisplay').empty();
    getMessages();
  });

  var message = {
    username: 'shawndrost',
    text: '<script>console.log("XSS!!!");</script>',
    roomname: '4chan'
  };

  var escapeHtml = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  $('#submit').click(function() {
    var username = $('#userNameInput').val();
    var message = $('#messageInput').val();
    var room = $('#roomInput').val();
    sendMessage(username, message, room); 

  });

  var sendMessage = function(username, message, room) {
    var messageObj = {
      username: username,
      text: message,
      roomname: room
    }  
  
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(messageObj),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  };   

  
});
