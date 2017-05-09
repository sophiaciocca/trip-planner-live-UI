const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./models');
const router = require('./routes');

const app = express();
const port = 3000;

// rendering setup
nunjucks.configure('views', {noCache: true}); // re-renders, and does not use a cache
app.set('views', path.join(__dirname, '/views')); // where to look for files to render when `res.render` gets called (already true by default)
app.set('view engine', 'html'); // if `res.render` gets called, assume you're supposed to render an html file
app.engine('html', nunjucks.render); // if you go to `res.render` some html, use `nunjucks.render to do so

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// static file server middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));

// routing middleware
app.use(router);

// error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).render('error');
});

// sync db before starting the server
db.sync()
  .then(function () {
    app.listen(port, function () {
      console.log('Awaiting orders on port', port);
    });
  })
  .catch(function (err) {
    console.error('Failed to sync db');
    console.error(err.stack);
  });
