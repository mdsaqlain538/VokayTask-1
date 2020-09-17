const Passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

Passport.serializeUser(function(user,done){
    done(null,user);
});

Passport.deserializeUser(function(user,done){
    done(null,user);
});


Passport.use(new GoogleStrategy({
    clientID: '42305043835-9ah719thlsnsi2qfmtfvvtueb741r91m.apps.googleusercontent.com',
    clientSecret: 'WTCMSyqaYsfPEP-y_crnwSe2',
    callbackURL: "https://voaky.herokuapp.com/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, profile) {
      return done(null, profile);
    //});
  }
));



//your Client ID
//42305043835-9ah719thlsnsi2qfmtfvvtueb741r91m.apps.googleusercontent.com

//Your Client Secret
//WTCMSyqaYsfPEP-y_crnwSe2
