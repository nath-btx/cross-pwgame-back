import { Response, Request } from "express";
require('dotenv').config()
import scoreBoardToJSON from './scoreBoard'
var randomWords = require('random-words');



const app = require('express')();
const server = require('http').createServer(app);
const io  = require('socket.io')(server,{ cors:{ origin :"*" }});


app.get("/", (req:Request,res:Response) => {
  res.send('hello world')

})
server.listen(process.env.PORT ||3001, () => {
  console.log(`Server running on port ${process.env.PORT ||3001}`)
});




// MAGIC NUMBER PART 
let MagicNumber:Number = createMagicNumber()
let magicNumberScoreBoard: {[key:string]:number}={ }
let magicNumberDate:Date = new Date(0)
function createMagicNumber():number{
  let numero = Math.floor(Math.random() * 1338)
  console.log(numero)
  return numero
}

// RANDOM WORD PART
let randomWord:string = createWord()
let wordScoreBoard: {[key:string]:number}={ }
let wordDate:Date = new Date(0)

function createWord(){
  console.log('new word created')
  return randomWords()
}
function sendWord():void{
  io.sockets.emit('wordToType', {randomWord:randomWord})
}

//WORD AND FURIOUS PART
let randomKey = createKey()
let keyScoreBoard: {[key:string]:number}={ }
let inGameScoreboard : {[key:string]:number}={ }
let keyDate: Date = new Date(0)


function createKey():String{
  return String.fromCharCode(Math.floor(Math.random()*26) + 97)
}
function sendKey(): void{
  io.sockets.emit('keyToSpam',{key:randomKey})
}

function timer():void{ //Executes 42 seconds after game start, should end game
  let arr = Object.values(inGameScoreboard)
  let max = Math.max(...arr)
  let winner:any = (Object.keys(inGameScoreboard).find(key => inGameScoreboard[key] === max))


  if(!keyScoreBoard[winner]){
    keyScoreBoard[winner] = 0
  }
  keyScoreBoard[winner] ++
  if(keyScoreBoard[winner] == 3){
    io.sockets.emit('keyOver',{scoreboard: inGameScoreboard, username:winner})
    scoreBoardToJSON(keyScoreBoard, keyDate, new Date(Date.now()), 'WordAndFurious')
    keyScoreBoard ={}
  }
  else{
    io.sockets.emit('timerOver',{scoreboard: inGameScoreboard, username:winner})
  }
  inGameScoreboard={}

}


io.on('connection', (socket: any) => {


  console.log('client connected')          //Listening for any new connections
  socket.on('newClient',(Client:any) => {
    sendKey()
  })
  socket.on('key', (msg:any) => {         //Listening for keys sent
    if(keyDate.getTime() == new Date(0).getTime()){ //Get date to register in game.json
      keyDate = new Date(Date.now())
    }
    console.log(`user ${msg.username} typed key ${msg.key} expected ${randomKey}`)
    if(!inGameScoreboard[msg.username]){
      if(Object.keys(inGameScoreboard).length === 0){
        console.log('timer started')
        setTimeout(timer,1000)
      }
      inGameScoreboard[msg.username] = 0
    }
    if(msg.key == randomKey){
      inGameScoreboard[msg.username]++
    }
  })

  // MAGIC NUMBER PART 
  socket.on('number', (msg: any)  => {     //Listening for any new number submitted by user
    console.log(`user ${msg.username} submitted number ${msg.number}`)
    if(!magicNumberScoreBoard[msg.username]){
      magicNumberScoreBoard[msg.username] = 0
    }
    if(magicNumberDate.getTime() == new Date(0).getTime()){ //Get date to register in game.json
      magicNumberDate = new Date(Date.now())
    }
    if(msg.number == MagicNumber){         //If number is the right one then ...
      if(magicNumberScoreBoard[msg.username] === 2){  //If he has 2 wins already, means he won the game
        console.log(`game over : ${msg.username} won the game`)
        magicNumberScoreBoard[msg.username] ++
        io.sockets.emit('gameOver',{scoreboard: magicNumberScoreBoard, username:msg.username}) //We send info to clients that game is over and with the score board
        scoreBoardToJSON(magicNumberScoreBoard, magicNumberDate , new Date(Date.now()),'magicNumber')
        magicNumberScoreBoard = {}
      }
      else{    
          magicNumberScoreBoard[msg.username] ++        
          io.sockets.emit('victory',{username: msg.username, number:MagicNumber, scoreboard:magicNumberScoreBoard})
      }
      MagicNumber = createMagicNumber()
    }
  });



// QUICK WORD 
  socket.on('newPlayer',(player:any) => { // Send the word to the player that connected
    if(Object.keys(wordScoreBoard).length === 0){
      randomWord = createWord()
    }
    sendWord()
  })
  socket.on('word',(msg: any ) => {  
    console.log(`user ${msg.username} submitted word ${msg.word} expected ${randomWord}`)
    if(!wordScoreBoard[msg.username]){
      wordScoreBoard[msg.username] = 0
    }
    if(wordDate.getTime() == new Date(0).getTime()){
      wordDate = new Date(Date.now())
    }
    if(msg.word == randomWord){
      if(wordScoreBoard[msg.username] === 4){
        console.log(`game over : ${msg.username} won the game`)
        wordScoreBoard[msg.username]++
        console.log(wordScoreBoard)
        io.sockets.emit('wordgameover',{scoreBoard: wordScoreBoard, username: msg.username})
        scoreBoardToJSON(wordScoreBoard, wordDate, new Date(Date.now()),'QuickWord')
        wordScoreBoard = {}
      }
      else{
        wordScoreBoard[msg.username] ++
        io.sockets.emit('wordvictory',{username: msg.username, word:randomWord, scoreBoard:magicNumberScoreBoard})
      }
      console.log("should create new word")
      randomWord = createWord()
      sendWord()
    }    
  })
}); 