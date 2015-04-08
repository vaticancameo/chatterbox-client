// YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  messages: [],
  friends:[]
};

$('body').append('<div id="friends">FRIENDS</div>');
// $('body').append('<div id="chats"></div>');
// $('body').append('<div id="roomSelect"></div>');

app.init = function () {


};

app.createRoomOptions = function (array) {
  for (var i = 0; i < array.length; i++) {
     var $option = $('<option/>');
     $option.text = array[i];
     $option.value = array[i];
     $option.appendTo('select');

      // $('<option/>').value(array[i]['roomname'])
      // .text(array[i]["roomname"]).appendTo('select');
   }

};

app.send = function (message) {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');

    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {order: '-createdAt'},
    success: function (data) {
      app.messages = data.results;
      app.clearMessages();
      var rooms = [];
      for (var i =0; i < app.messages.length; i++) {
        var object = app.messages[i];
        object["username"] = _.escape(object["username"]);
        object["text"] = _.escape(object["text"]);
        object["roomname"] = _.escape(object["roomname"]);
        if (rooms.indexOf(object["roomname"]) === -1 && object["roomname"] !== undefined) {
          rooms.push(object["roomname"]);
      }
        app.addMessage(object);
      }
      app.createRoomOptions(rooms);
      console.log('chatterbox: Message received');
      console.log(data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.clearMessages = function () {
  $("#chats").empty();
};

app.addMessage = function(message) {
  var $messageBlock = $('<div class="message"></div>');
  var $userLink = $("<a href='#' class='username'></a>");
  $userLink.attr('data-user-id', message.username);
  $userLink.on("click", app.addFriend);
  $userLink.html(message.username + ":");
  $messageBlock.append($userLink);
  $messageBlock.append(" " + message.text);
  $("#chats").append($messageBlock);
};

app.addRoom = function(room) {
  var $roomBlock = $('<div></div>');
  $roomBlock.append(room.text);
  $("#roomSelect").append($roomBlock);
};

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

app.addFriend = function () {
   app.friends.push($(this).data('userId'));
   app.displayFriends();
}

app.displayFriends = function () {
   $("#friends").empty();
   var friends = app.friends;
   for (var i = 0 ; i < friends.length; i++) {
     var $friend = $('<div></div>');
     $friend.append(friends[i]);
     $("#friends").append($friend);    
   }
};

app.submit = function(message) {

}

$("form").submit(function (event) {
  event.preventDefault();
  var messageText = $(this).find("textarea[name='message']").val();
  var messageObj = {};
  messageObj.text = messageText;
  messageObj.username = "anon";
  messageObj.roomname = "lobby";
  app.send(messageObj);
});


setInterval(app.fetch, 5000);




