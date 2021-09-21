///---- article related route , for example - delete article,add article,edit article

const route = require('express').Router()
const Article = require('../models/articledb')

route.get('/new',(req,res)=>     //--> to render "/articles/new" page
{
    res.render('articles/new',{article : new Article()})    //--> ye hum agar sidha access karenge to article ki value nahi pata hogi page ko
})

//-- for edit article page ----///
route.get('/edit/:id',async(req,res)=>     //--> to render "/articles/edit/:82346128356108" page
{
  const article = await Article.findById(req.params.id)
    res.render('articles/edit',{article : article})    //--> ye hum agar sidha access karenge to article ki value nahi pata hogi page ko
})



route.get('/:slug' ,async (req,res)=>             //--> find by slug --> find by title
{
  let article ;
  try{
  article = await Article.findOne({ slug : req.params.slug })
  if(article == null)
  {
    return res.status(404).send('no article exist')
   // res.redirect('/')                         //--> back to our home page
   }
  //res.json(user)
  res.render('articles/show' , { article : article})
  }
  catch
  {
   res.redirect('/')
  }
})

// route.get('/:id' ,async (req,res)=>             //--> localhost:4000/articles/:id
// {
//   let article ;
//   try{
//   article = await Article.findById(req.params.id)
//   if(article == null)
//   {
//     return res.status(404).send('no article exist')
//    // res.redirect('/')                         //--> back to our home page
//    }
//   //res.json(user)
//   res.render('articles/show' , { article : article})
//   }
//   catch
//   {
//    res.redirect('/')
//   }
// })


route.get('/article/allarticles',async(req,res)=>
{
  let allusers = await Article.find();
  res.json(allusers)
})


//----        To create New Article  -----------------////
route.post('/',async(req,res,next)=> ///on clickin save button
{
  req.article = new Article()               //req.article me Article() pass kiya jara raha hai
  next()
}, saveArticleAndRedirect('new'))

//-----       to DELETE an ARTICLE  --------------///
route.delete('/:id',async(req,res)=>
{
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')         //back to homepage after delete
})

//-------------- TO UPDATE EDIT For Article ----------------------------///
route.put('/:id', async(req,res,next)=>
{
req.article = await Article.findById(req.params.id)
next()
}, saveArticleAndRedirect('edit'))            //pass 'edit' to saveArticleAndRedirect func()

function saveArticleAndRedirect(path)    //--> it is going to take path - edit/new
{
  return async (req,res)=>{
      // let article = new Article({
      // title : req.body.title,
      // description : req.body.description,
      // markdown : req.body.markdown
      // })
      //   article = await article.save();
        //res.json(article)
        //res.redirect(`/articles/${article.id}`)          //---> redirect to page with id
        let article = req.article            //yaha blank hai bas
          article.title = req.body.title
          article.description = req.body.description
          article.markdown = req.body.markdown
        
        try{
          article = await article.save()
        res.redirect(`/articles/${article.slug}`)        //if successful redirecting to--> user-show page 
      } catch (e) {
    
          //res.json({message : e.message})
          console.log(e)
        res.render(`articles/${path}`, {article : article })     //render "/articles/new" again
      }
  }
}



module.exports = route