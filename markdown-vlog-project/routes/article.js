///---- article related route , for example - delete article,add article,edit article

const route = require('express').Router()
const Article = require('./../models/articledb')

route.get('/new',(req,res)=>     //--> to render "/articles/new" page
{
    res.render('articles/new',{article : new Article()})    //--> ye hum agar sidha access karenge to article ki value nahi pata hogi page ko
})

route.get('/article/allusers',async(req,res)=>
{
  let allusers = await Article.find();
  res.json(allusers)
})

route.get('/:id' ,async (req,res)=>             //--> localhost:4000/articles/:id
{
  let user ;
  try{
  user = await Article.findOne({id : req.params.id})

  res.json(user)
  }
  catch(e)
  {
   res.json({ message : e.message})
  }
})

route.post('/',async(req,res)=> ///on clickin save button
{
  let article = new Article({
  title : req.body.title,
  description : req.body.description,
  markdown : req.body.markdown
  })
  try {
    article = await article.save();
    res.redirect(`/articles/${article.id}`)
  } catch (e) {
    res.render('articles/new', {article : article }) 
  }
})

module.exports = route