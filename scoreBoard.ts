const fs = require('fs')
function scoreBoardToJSON(scoreBoard:Object,  start:Date, end: Date, game:string ){
    console.log(scoreBoard)
    let Object = 
        {
            "beg":start,
            "end":end,
            "players":scoreBoard
        }
    fs.writeFileSync('./games.json',"{\""+game+"\":["+JSON.stringify(Object)+"]}")
}

export default scoreBoardToJSON