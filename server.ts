// rest of the code remains same
import { Response, Request } from "express";
import { send } from "process";
require('dotenv').config()


const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{ cors:{ origin :"*" }});



app.get('/', (req:Request, res:Response) => {
  res.sendFile(__dirname + '/index.html');
});


app.get("/", (req:Request,res:Response) => {
  res.send('hello')

})
server.listen(process.env.PORT ||3001, () => {
  console.log(`Server running on port ${process.env.PORT ||3001}`)
});

io.on('connection', (socket: any) => {
  console.log('client connected')
  socket.on('chat message', (msg: any)  => {
    console.log('message sent')
    io.emit('chat message', (msg));
  });
});