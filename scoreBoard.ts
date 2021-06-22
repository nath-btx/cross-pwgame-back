let scoreBoardFile = require('./games.json')
const fs = require('fs')
function scoreBoardToJSON(scoreBoard:object){
    console.log(scoreBoard)
    fs.writeFileSync('./games.json',JSON.stringify(scoreBoard))
}

export default scoreBoardToJSON