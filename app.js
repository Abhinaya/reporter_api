
/**
 * Module dependencies.
 */

var express = require('express');
var orm = require('orm');
exports.db  = orm.connect("mysql://root@127.0.0.1/newgen_dev");
var app = express();
var Person = require('./models/user');
var http = require('http');
var path = require('path');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('your secret here'));
app.use(express.bodyParser());
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

var routes = require('./routes');
var user = require('./routes/user')(app);
// passport.use(new DigestStrategy({ qop: 'auth' },
//   function(username, done) {
//     Person.findOne({ full_name: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user, user.password);
//     });
//   }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser');
  console.log(id);
  Person.find(id, function(err, user) {
    done(err, user);
    if(err) {console.log('error'); console.log(err);}
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  Person.find({ full_name: username }, function (err, user) {
    user = user[0];
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    bcrypt.compare(password, user.encrypted_password, function(err, res){
      if(res){
        return done(null, user);
      }
      else{
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}
));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/login', passport.authenticate('local'), function(req, res) {
  console.log("passport user", req.user);
  res.json(req.user);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
