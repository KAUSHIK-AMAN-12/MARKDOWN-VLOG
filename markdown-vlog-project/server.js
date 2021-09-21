const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const articleRouter = require('./routes/article')
const Article = require('./models/articledb')
const app = express()
app.set('view engine' , 'ejs') 
app.use(express.json())

mongoose.connect('mongodb://localhost/markdownVlog' ,   //Database in mongodb is markdownVlog
{useNewUrlParser : true , useUnifiedTopology : true,
    usecreateIndexes : true})

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
app.use(methodOverride('_method'))

app.get('/',async(req,res)=>
{
//     const articles = [
//         {
//         title : 'Test article',
//         createdAt : new Date(),
//         description : 'Test description'
//     },
//     {
//         title : 'Test article 2',
//         createdAt : new Date(),
//         description : 'Test description 2'
//     },
// ]
    let articles = await Article.find().sort({createdAt : 'desc'}); //sorted on the base of creation
    res.render('articles/index' , {articles : articles })
})

app.use('/articles', articleRouter )

app.listen(4000,()=>
{
    console.log('http://localhost:4000')
})