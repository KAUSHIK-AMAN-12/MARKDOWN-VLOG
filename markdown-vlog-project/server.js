const express = require('express')
const mongoose = require('mongoose')
const articleRouter = require('./routes/article')
const app = express()
app.set('view engine' , 'ejs') 
app.use(express.json())

mongoose.connect('mongodb://localhost/markdownVlog' ,   //Database in mongodb is markdownVlog
{useNewUrlParser : true , useUnifiedTopology : true})
//--> useNewUrlParser - it means certain features can be removed in our future

const db = mongoose.connection
//db.dropDatabase();

db.on('error',(error)=>
{
    console.log(error)
})
db.once('open',()=>
{
    console.log('connected safely')
})

app.use(express.urlencoded({extended : false}))


app.get('/',(req,res)=>
{
    const articles = [
        {
        title : 'Test article',
        createdAt : new Date(),
        description : 'Test description'
    },
    {
        title : 'Test article 2',
        createdAt : new Date(),
        description : 'Test description 2'
    },
]
    res.render('articles/index' , {articles : articles })
})

app.use('/articles', articleRouter )

app.listen(4000,()=>
{
    console.log('http://localhost:4000')
})