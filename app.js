
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , login = require('./routes/login')
  , register = require('./routes/register')
  , photos = require('./routes/photos')
  , http = require('http')
  , path = require('path')
  , Photo = require('./lib/photo')
  , user = require('./lib/middleware/user')
  , page = require('./lib/middleware/page')
  , validate = require('./lib/middleware/validate')
  , ensure = require('./lib/middleware/ensure')
  , messages = require('./lib/messages')
  , api = require('./routes/api');

// express setup
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('photos', __dirname + '/public/photos');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  //app.use(express.session());
  app.use(express.cookieSession());
  app.use(messages);
  app.use(user);
  app.use('/api', api.auth);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(routes.notfound);
  app.use(routes.error);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// routes
app.get('/', routes.index);
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/register', register.form);
app.post('/register', register.submit);
app.get('/upload', photos.form);
app.post('/upload', validate.required('photo[name]')
                  , validate.lengthAbove('photo[name]', 4)
                  , photos.submit(app.get('photos')));
app.get('/photo/:id/download' , ensure.authenticated
                              , photos.download(app.get('photos')));
app.get('/:page?', page(Photo.count), photos.list);

app.get('/api/user/:id', api.user);
app.get('/api/photo/:id', api.photo);
app.post('/api/photo', photos.submit(app.get('photos')));
app.get('/api/photos/:page?', page(Photo.count), api.photos);

// do it
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
