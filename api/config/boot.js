import https from 'https';
import fs from 'fs';
import sio from 'socket.io';

module.exports = app => {
  console.log('Node Environment', process.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'test') {
    const credentials = {
      key: fs.readFileSync('api/config/certs/mean.key', 'utf8'),
      cert: fs.readFileSync('api/config/certs/mean.cert', 'utf8'),
    };
    app.db.sequelize.sync().done(() => {
      const server = https.createServer(credentials, app)
        .listen(app.get('port'), () => {
          // socket config
          const io = sio(server);
          let channel = '';
          const messages = []; // remove this - is just a test
          io.sockets.on('connection', (socket) => {
            socket.on('create', (room) => {
              socket.join(room);
              channel = room;
            });
          });
          io.on('connection', (socket) => {
            socket.on('send:conversation', (data) => {
              messages.push(data); // remove this - is just a test
              // send any object you want
              io.sockets.in(channel).emit('send:conversation', messages);
            });
          });
          // socket config end
          console.log(`MEAN API - Port ${app.get('port')}`);
        });
    });
  } else {
    app.db.sequelize.sync().done();
  }
};
