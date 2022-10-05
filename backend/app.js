const express = require('express')
const bodyParser = require('body-parser')

require('./db/mongo') //connect db
//const user = require('./routes/user')
const dataRouter = require('./routes/data')

const app = express()
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
    next()
})
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('front'))

//app.use('/user',user)

//app.use('/',(req,res)=>{
//    res.send('Hello World!')
//})

app.use('/',dataRouter)

/* app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use('/',function(req,res){
    res.render('./front/index.html')
}) */

/* app.get('/', function(req,res) {
    res.sendFile(__dirname + "/front/index.html")
})
 */

module.exports = app