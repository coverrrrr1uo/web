var db = require('./db');

function logChatRecords(room) {
db.findChatRecords({room: room}, function(result){
  console.log(result);
});
}

exports.init = function(io) {

  // the chat namespace
  const chat = io
      .of('/chat')
      .on('connection', function (socket) {
        try {
          /**
           * it creates or joins a room
           */
          socket.on('create or join', function (room, userId) {
            socket.join(room);
            chat.to(room).emit('joined', room, userId);
          });

          socket.on('chat', function (room, userId, chatText) {
            db.saveChatRecords(
              {
                room: room,
                userId: userId,
                chatText: chatText
              }      
            );
            logChatRecords(room);
            chat.to(room).emit('chat', room, userId, chatText);
          });

          socket.on('drawCanvas',function (room,userId,width, height, prevX, prevY, currX, currY, color, thickness) {
              chat.to(room).emit('Canvas' ,userId,width,height, prevX, prevY, currX, currY, color, thickness)
          });

          socket.on('Clear',function (room,userId,c_width,c_height) {
              chat.to(room).emit('clear',c_width,c_height)

          })

          socket.on('disconnect', function () {
            console.log('someone disconnected');
          });
        } catch (e) {
        }
      });





}
