const express=require('express')
const mongoose=require('mongoose')
const ShortUrl=require('./models/shortUrl')
const app=express()

app.set('views', './view');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}))

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser:true, useUnifiedTopology:true
})

app.get('/', async(req,resp)=>{

    const shortUrls=await ShortUrl.find();
     resp.render('index',{shortUrls:shortUrls});
        
});

app.post('/shortUrls',async (req,resp)=>{
    await ShortUrl.create({full:req.body.fullUrl})
    resp.redirect('/')
})

app.get("/:shortUrl",async(req,resp)=>{
       const shortUrl=await  ShortUrl.findOne({short:req.params.shortUrl})
       if(shortUrl==null) return resp.sendStatus(400)
       shortUrl.clicks++;
       shortUrl.save()

       resp.redirect(shortUrl.full)
})
app.listen(process.env.PORT || 5000);