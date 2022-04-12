const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)
 const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')
app.use('/peerjs', peerServer);
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
  });
  app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
  });
 io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId);


  //     // messages

      socket.on('message', (message) => {
        //send message to the same room
        io.to(roomId).emit('createMessage', message)
    }); 
  
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
      })
    })
  })





server.listen(process.env.PORT||3000)
//https://hidden-inlet-70704.herokuapp.com/ | https://git.heroku.com/hidden-inlet-70704.git
//https://hidden-inlet-70704.herokuapp.com/a42ecba2-bd3a-4501-923f-cbdb5ed25447
//https://hidden-inlet-70704.herokuapp.com/3bf6912b-9daf-4e3d-87ef-85cb5a07e026