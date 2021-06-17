const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Manager = require('../models/Manager');
const Worker = require('../models/Worker');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

let validate = false;

passport.use(
    'manager_login',
    new localStrategy(
      {
        //Since we're not using the default username field in the form, we need to change it to email
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {

          var user = await Manager.findOne({"email": email}).exec();

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          if(password === user.password){
              validate = true;
          }
  
          if (!validate) {
            console.log(user);
            return done(null, false, { message: "Incorrect Password" });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
);

passport.use(
    'worker_login',
    new localStrategy(
      {
        //Since we're not using the default username field in the form, we need to change it to email
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {

          var user = await Worker.findOne({"email": email}).exec();

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          if(password === user.password){
              validate = true;
          }
  
          if (!validate) {
            console.log(user);
            return done(null, false, { message: "Incorrect Password" });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
    )
);

passport.use(
    new JWTstrategy(
        {
            //This is the secret we gave
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
            //It extracts the secret token from the jwt token provided
        },
        async (token, done) => {
            try{
                return done(null, token.user);
            }catch(error){
                done(error);
            }
        }
    )
);