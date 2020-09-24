const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
var path = require('path');
require('./passport-setup');
const url = require('url');
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
const axios = require('axios');
const createSchema = require('./models/create-challenge');
const otpSchema = require('./models/otp-verification');
//fabb791416a1eb66fdb44f3081108fb89002cb7225558edc254cc9307340dacb
//const saqlain = require("./saqlain");


app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));


app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))


//DATABASE CONNECTION
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");
});


//mongodb+srv://Saqlain:<password>@cluster0.no4g1.mongodb.net/<dbname>?retryWrites=true&w=majority


const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

//flash message middleware
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
  })


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/failed', (req, res) => res.send('You Failed to log in!'))


app.get('/good', isLoggedIn, (req, res) => 
{
    res.render('user-register-step1');
});


app.get('/user-register-step2', isLoggedIn, (req, res) => 
{
    res.render('user-register-step2');
});

app.post('/user-index',(req,res)=>{
    const { otp  } = req.body;
    const  email  = req.user._json.email;
    otpSchema.findOne({email},(err,user)=>{
        //const {_id,email,number,otp} =user;
        if(otp==user.otp){
            res.render('user-index');
        }else{
            res.render('user-register-step2')
        }
    })
})

app.post('/user-register-step2',(req,res)=>{

    var digits = '0123456789';
    let OTP ='';
    const number = req.body.number;

        for(let i=0;i<6;i++){
            OTP+=digits[Math.floor(Math.random()*10)];
        }

        var url = 'https://api.textlocal.in/send/?apikey=fJfBJnyz91c-TbqrXa8U1yvh9RFUFlIIypeUFJkyJN&numbers='+number+'&sender=TXTLCL&message='+'Your Vokay OTP is '+OTP;
    axios
        .get(url)
        .then(function (response) {
            console.log(req.user._json.email);
        })
        .catch(function (error) {
          console.log(error);
    });
            const otp = new otpSchema();
            otp.email = req.user._json.email;
            otp.number = number;
            otp.otp = OTP;
            otp.save((err, user) => {
                //console.log(err);
                if (err) {
                  return res.status(400).json({
                    err: "NOT able to save user in DB"
                  });
                }
                else{
                    // req.session.message = {
                    //     type: 'success',
                    //     intro: 'Challenge Created ! ',
                    //     message: 'Sucessfully'
                    //   }
                    res.redirect('/user-register-step2');
                }  
              });
        
});

const handlebars = require('express3-handlebars').create()
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')


app.get('/user-challenge-add.html', (req, res)=>{
    res.render('user-challenge-add');
  });

app.get('/user-create-challenge.html',(req,res)=>{
    createSchema.find((err,docs)=>{
        if(!err){
            res.render("user-create-challenge",{
                list:docs
            })
        }
    })
})

app.get('/user-challenge-add',(re,res)=>{
    res.render('user-challenge-add');
});

app.get('/user-challenges.html',(req,res)=>{
    res.render('user-challenges');
});

app.post('/user-challenge-add',(req,res)=>{
    const create = new createSchema(req.body);
    create.date = req.body.date[0];
    create.Image = req.body.Image;
    //console.log(req.body);
    create.save((err, user) => {
        //console.log(err);
        
        if (err) {
          return res.status(400).json({
            err: "NOT able to save user in DB"
          });
        }
        else{
            req.session.message = {
                type: 'success',
                intro: 'Challenge Created ! ',
                message: 'Sucessfully'
              }
              console.log(user);
              res.redirect('/user-challenge-add');
        }
        //res.render('/user-challenge-add');
      });
})

//API for OTP Verification
//fJfBJnyz91c-TbqrXa8U1yvh9RFUFlIIypeUFJkyJN

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
});




const PORT = process.env.PORT || 1519;
app.listen(PORT, () => console.log(`Sample Google Login ${PORT}!`))