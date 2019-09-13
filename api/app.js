var http = require('http');
var express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  swig = require('swig'),
  SpotifyStrategy = require ('passport-spotify').Strategy;

var logger = require('morgan');
var bodyParser = require('body-parser');
import routes from './server/routes';

import model, { Sequelize } from './server/models';
const { User } = model;


require('dotenv').config();
// var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// Spotify ENV
var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_url = process.env.REDIRECT_URI; // Your redirect url

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const SESSIONTIME = 50 * 60 * 1000 // 50 minutes

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: redirect_url
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      // asynchronous verification, for effect...
      User.findOrCreate({where: { spotifyId: profile.id }}).then(([user, created]) => {
        if (created) {
          console.log("User was a created");
          console.log(user.dataValues);          
        }
        else {
          console.log("User exists already")
          console.log(user.dataValues);
        }
        // Add the user id from the database to the profile
        profile.id = user.id

        // TODO: Store in db instead of profile
        profile.accessToken = accessToken
        profile.refreshToken = refreshToken

        // Add the duration of the session time to the current time
        profile.expireTime = Date.now() + SESSIONTIME

        return done(null, profile)
      })
    }
  )
);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};


const hostname = '0.0.0.0';
const port = 9000;
const app = express()
const server = http.createServer(app);

app.use(session({ 
    secret: 'cmpt470', 
    resave: true, 
    saveUninitialized: true,
    cookie: { maxAge: SESSIONTIME } 
  }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'))
app.use(cookieParser());



// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);
app.get('/login', passport.authenticate('spotify', {
  scope: [
    'user-read-email', 'user-read-private', 
    'user-read-playback-state', 'user-modify-playback-state',
    'streaming', 'playlist-read-private', 'playlist-modify-private', 'playlist-read-collaborative'
  ],
  // showDialog: true
}),
function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

// when login is successful, retrieve user info
app.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
app.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login/failed' }),
function(req, res) {
  res.redirect('http://localhost:3000');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('http://localhost:3000');
});

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

routes(app);


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});