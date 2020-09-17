const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
var path = require('path');
require('./passport-setup');
const url = require('url');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res
        .status(200)
        .sendFile(path.join(__dirname,"public","index.html"));
});
app.get('/failed', (req, res) => res.send('You Failed to log in!'))


app.get('/good', isLoggedIn, (req, res) => 
{
    res
        .status(200)
        .sendFile(path.join(__dirname,"public","user-register-step1.html"));
    //res.send(`Welcome To Twenty70 Mr ${req.user.displayName}!`);
    console.log(req.user);
    console.log(req.user._json.email);
});


app.get('/user-register-step2', isLoggedIn, (req, res) => 
{
    res
        .status(200)
        .sendFile(path.join(__dirname,"public","user-register-step2.html"));
    //console.log(req.body);
    //res.send(`Welcome To Twenty70 Mr ${req.user.displayName}!`);
});


// app.get('/user-register-step2',isLoggedIn,(req,res)=>{
//     res
//         .status(200)
//         .sendFile(path.join(__dirname,"public","user-register-step2.html"));
// });


app.post('/user-register-step2',(req,res)=>{
    // res
    //     .status(200)
    //     .sendFile(path.join(__dirname,"public","user-register-step2.html"));
    // console.log(req.url);
    const urlobj = url.parse(req.url,true);
    const queryData = urlobj.query
    var digits = '0123456789';
    let OTP ='';
    const number = req.body.number;

        for(let i=0;i<6;i++){
            OTP+=digits[Math.floor(Math.random()*10)];
        }
        res.redirect('/user-register-step2');
        console.log(number);
        console.log(OTP);
});

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


// app.get('/sample',(req,res)=>{
//     res
//         .status(200)
//         .sendFile(path.join(__dirname,"public","sample.html"));
// });

// app.post('/sample',(req,res)=>{
//     console.log(req.body.number);
// });
const PORT = process.env.PORT || 1519;
app.listen(PORT, () => console.log(`Sample Google Login ${PORT}!`))