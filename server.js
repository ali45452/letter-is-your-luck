
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

let locked = false;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
socket.on('buzz', (player) => {
  if (!locked) {
    locked = true;
    io.emit('winner', player);
    io.emit('lock');
    
      // ✅ تفعيل الأزرار تلقائيًا بعد 5 ثواني فقط
      setTimeout(() => {
        locked = false;
        io.emit('reset');
      }, 5000);
    }
  });

  socket.on('reset', () => {
    locked = false;
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

http.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000');
});
