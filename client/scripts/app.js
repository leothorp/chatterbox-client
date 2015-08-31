$(document).ready(function(){

  var getMessages = function(){
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


  var displayMessages = function (messages){
    for (var i = 0; i < messages.length; i++) {
      var message =  escapeHtml(messages[i].text);
      $('#messageDisplay').append('<div>' + message + '</div>');
    };
  };


  $('#refresh').click(function(){
    console.log('click');
    getMessages();
  });

  var message = {
    username: 'shawndrost',
    text: '<script>console.log("XSS!!!");</script>',
    roomname: '4chan'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

//   function unescapeHtml(escapedStr) {
//     var div = document.createElement('div');
//     div.innerHTML = escapedStr;
//     var child = div.childNodes[0];
//     return child ? child.nodeValue : '';
// };

  // getMessages();

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });


});