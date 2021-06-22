import { readFileSync, writeFile } from 'fs';

function scoreBoardToJSON(scoreBoard:Object,  start:Date, end: Date, game:string ){
    let dataToAppend = datasToJSONFormat(scoreBoard,start,end,game) //Format the data we want to add to be able to add it
    let file = readFileSync('games.json')
    let actualData
    if(file.length === 0){   // The file is empty, we can't parse the JSON in it, it would crash
        actualData = {[game] : [dataToAppend]}
    }
    else{
        actualData = JSON.parse(readFileSync('games.json').toString())  // Read the data we have in the file
        if(!actualData[`${game}`]){                                         //If there is no data for the game in question, we create an array
            actualData[`${game}`] = [dataToAppend]
        }
        else{                                                               //If there already is data, we append it to the corresponding index
            actualData[`${game}`][actualData[`${game}`].length] = dataToAppend
        }
    }   

    writeFile('games.json',JSON.stringify(actualData,null,4),(err) => { //Finally we write the data to the file, erasing the previous content to make sure we dont have json syntax errors
        if(err) throw err
        console.log("Game has been saved to games.json")
    })

}


function datasToJSONFormat(scoreBoard:Object,  start:Date, end: Date, game:string ):string{
    let chaine = `
        {
            "beg":"${start}",
            "end":"${end}",
            "players":[
                ${Object.entries(scoreBoard).map((key)=> {
                    return `{"name": "${key[0]}", "points":${key[1]}}`
                })}
            ]
}`
    return JSON.parse(chaine)
}

export default scoreBoardToJSON