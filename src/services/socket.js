const logger = require('./logger');

const users = require('./socketUsers');
const { addUser, removeUser, getUser, getUsersInCity } = users;

const io = require('socket.io')();
const socketApi = {
  io: io,
  users,
};

io.on('connection', (socket) => {
  //socket.on('join', ({ name, room }, callback) => {
  socket.on('join', (props) => {
    const { error, user } = addUser({
      id: socket.id,
      name: props.name,
      province: props.province,
      city: props.city,
    });
    console.log('Connected', props);
    //if (error) return callback(error);

    // Emit will send message to the user
    // who had joined
    socket.emit('message', {
      user: 'admin',
      text: `${user.name},
          welcome to room ${user.room}.`,
    });

    // Broadcast will send message to everyone
    // in the room except the joined user
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name}, has joined` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInCity(user.room),
    });
    //callback();
  });

  socket.on('joinPage', ({ room, name }) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    //if (error) return callback(error);
    if (error) {
      logger.error(error);
    }

    // Emit will send message to the user
    // who had joined
    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${user.room}.`,
      count: getUsersInCity(room).length,
      id: socket.id,
    });

    // Broadcast will send message to everyone
    // in the room except the joined user
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} ${socket.id}, has joined ${room}`,
    });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInCity(user.room),
    });
    //callback();
  });

  socket.on('leavePage', ({ room }) => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(room).emit('message', {
        user: 'admin',
        text: `${user.name} ${socket.id} had left ${room}`,
      });
    }
  });

  //socket.on('sendMessage', (message, callback) => {
  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInCity(user.room),
    });
    //callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} had left`,
      });
    }
  });
});

module.exports = socketApi;
