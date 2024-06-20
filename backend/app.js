// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const app = express();


// connectDB();

// app.use(cors());
// app.use(express.json({ extended: false }));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/posts', require('./routes/posts'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users.js'))

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection...');

  socket.on('join', ({ userId }) => {
    socket.join(userId);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const message = { senderId, receiverId, text, date: new Date() };
    io.to(receiverId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

