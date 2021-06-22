// rest of the code remains same
import { createECDH } from "crypto";
import { Response, Request } from "express";
require('dotenv').config()
import scoreBoardToJSON from './scoreBoard'

let MagicNumber:Number = createMagicNumber()
let scoreBoard: {[key:string]:number}={ }
let dateStart:Date = new Date(0)

function createMagicNumber():number{
  return Math.floor(Math.random() * 1338)
}
console.log(MagicNumber)



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
  console.log('client connected')          //Listening for any new connections
  socket.on('number', (msg: any)  => {     //Listening for any new number submitted by user
    if(dateStart.getTime() == new Date(0).getTime()){ //Get date to register in game.json
      dateStart = new Date(Date.now())
    }
    if(msg.number == MagicNumber){         //If number is the right one then ...
      if(scoreBoard[msg.username] === 2){  //If he has 2 wins already, means he won the game
        scoreBoard[msg.username] ++
        io.sockets.emit('gameOver',{scoreBoard: scoreBoard, username:msg.username}) //We send info to clients that game is over and with the score board
        //Add save to json FILE of game state
        scoreBoardToJSON(scoreBoard, dateStart , new Date(Date.now()),'magicNumber')
        scoreBoard = {}
      }
      else{
        if(scoreBoard[msg.username]){  //Enter user in scoreboard   Then we send the info someone won to the clients      
          scoreBoard[msg.username] ++
        }
        else{                                //Increment user's score
          scoreBoard[msg.username] = 1
        }
        
        io.sockets.emit('victory',{username: msg.username, number:MagicNumber, scoreBoard:scoreBoard})
      }
      MagicNumber = createMagicNumber()
      console.log(MagicNumber)
    }
  });
});