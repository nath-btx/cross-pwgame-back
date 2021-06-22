// rest of the code remains same
import { createECDH } from "crypto";
import { Response, Request } from "express";
require('dotenv').config()
import scoreBoardToJSON from './scoreBoard'

let MagicNumber:Number = createMagicNumber()
let scoreBoard: {[key:string]:number}={ }

function createMagicNumber():number{
  return Math.floor(Math.random() * 1338)
}
console.log(MagicNumber)
scoreBoardToJSON({valdofal:3, user:2})


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
    if(msg.number == MagicNumber){         //If number is the right one then ...
      if(scoreBoard[msg.username] === 2){  //If he has 2 wins already, means he won the game
        scoreBoard[msg.username] ++
        socket.emit('gameOver',{scoreBoard: scoreBoard}) //We send info to clients that game is over and with the score board
        //Add save to json FILE of game state
        console.log('gameover')
        scoreBoardToJSON(scoreBoard)
        scoreBoard = {}
      }
      else{
        if(scoreBoard[msg.username]){        //Enter user in scoreboard         
          scoreBoard[msg.username] ++
        }
        else{                                //Increment user's score
          scoreBoard[msg.username] = 1
        }
      }
                                            //Then we send the info someone won to the clients
      socket.emit('victory',{username: msg.username, number:MagicNumber, scoreBoard:scoreBoard})
      MagicNumber = createMagicNumber()
      console.log(MagicNumber)
    }
    console.log(scoreBoard)
  });
});