// rest of the code remains same
import { create } from "domain";
import { Response, Request } from "express";
import { send } from "process";
require('dotenv').config()

let MagicNumber = 0
let tableScores

function createMagicNumber(){
  MagicNumber = Math.floor(Math.random() * 1338)
  console.log(MagicNumber)
}

createMagicNumber()
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{ cors:{ origin :"*" }});


app.get("/", (req:Request,res:Response) => {
  res.send('hello')

})
server.listen(process.env.PORT ||3001, () => {
  console.log(`Server running on port ${process.env.PORT ||3001}`)
});

io.on('connection', (socket: any) => {
  console.log('client connected')
  socket.on('number', (msg: any)  => {
    console.log(msg)
    if(msg.number == MagicNumber){
      console.log('numbr found')
      socket.emit('victory',{username: msg.username, number:MagicNumber})
      createMagicNumber()
    }
  });
});