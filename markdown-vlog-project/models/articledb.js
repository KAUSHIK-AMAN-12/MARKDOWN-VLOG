const mongoose = require('mongoose')
const marked = require('marked')  // it converts markdown to html
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)  //it allows to create html and purify it with 
                                                     //with JS-dom window object

const articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    markdown : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now         ///() => Date.now()
    },
    slug : {                              //--> slug for title
        type : String,
        required : true,
        unique : true
    },
    sanitizedHtml : {
        type: String,
        required : true
    }
})

//how to slug make automatically calculate everytime
// we need to validate before making an article everytime before update,create,delete
//validation means --> everything should be in defined order like unqueness of the order
// "function(next)" is going to run right before validate of an article so we cant save unlikely values

articleSchema.pre('validate' , function(next){ 
if (this.title)            //-> create slug by title
{
    this.slug = slugify(this.title, { lower : true , strict : true}) //-> lower : true -> for lower case
                                        //strict-> to force our slugift to get rid of unwanted character

if(this.markdown)
{
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))  //-> convert markdown to html and thn sanitizes it
    
}

next()
}
})



module.exports = mongoose.model('Article' , articleSchema)  //Article is our model/table name