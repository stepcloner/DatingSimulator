const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const sampleSize = require('lodash.samplesize')

const urlencodedParser = bodyParser.urlencoded({ extend: true})
const loveScoreMatrix = {
    flower: [-1, 0, 2],
    ring: [2, -1, 1],
    necklace: [0, 3, 0],
    tea: [5, 5, 5]
}
let loveScore
const limitscore = 30

let dayleft = 0
const limitday = 0

const reset = function(){
    loveScore = 0
    dayleft = 10
}

let message = ''

reset()

const titile = `<h1>Dating Simulation</h>`

const scoreboard = function(){
    return(`
    <div>
        <label>Love Score: ${loveScore}</label> <br>
        <label>Day Left: ${dayleft} </label> 
        
    </div>
  
    `)
}

const image = `
    <div>
    <img src="/love.png"><br>
    </div><br>
`


const formSubmit = function(butt){
    let str = '<form action="/" method="POST">'
    str += '<input name="gift" type="hidden" value="'+butt+'"/>'
    str += '<button type="'+butt+'" value="'+butt+'" name="'+butt+'">'+butt+'</button>&nbsp;&nbsp;'
    str += '</form>'
    return str
}

const formButtons = function(){
    const buttonitems = sampleSize(Object.keys(loveScoreMatrix), 3)
    let str = '<div>'
    var i;
    for ( i = 0; i<buttonitems.length; i++)
    {
        str += formSubmit(buttonitems[i])
    }
    str += '</div>'
    return str
}

const checklimit = function(){
    message = ''
    if(loveScore >= limitscore)
    {
        message = 'jeep success'
        message += `<form action="/restart" method="POST">
        <button>Restart</button>
     </form>`
        return `${titile}${scoreboard()}${image}${message}`

    }else if(dayleft <= limitday)
    {
        message = 'end'
        message += `<form action="/restart" method="POST">
            <button>Restart</button>
         </form>`
         return `${titile}${scoreboard()}${image}${message}`
    }

    return `${titile}${scoreboard()}${image}${message}${formButtons()}`
}

app.get('/', function(request, response){
        reset()
        response.send(`${titile}${scoreboard()}${image}${formButtons()}`)
})

app.post('/restart', function(request, response) {
    reset()
    response.redirect('/')
  })

app.get('/love.png',function(request, response){
    response.sendFile(path.join(__dirname,'public','love.png'))
})

app.post('/',urlencodedParser, function(request, response){
    //Extract request body to get gift
    const {gift} = request.body
    const lovechange = loveScoreMatrix[gift][dayleft%3]
    loveScore = loveScore + lovechange
    dayleft = dayleft-1
    response.send(checklimit())
})
app.listen(3000)