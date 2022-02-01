var createError = require('http-errors');
var express = require('express');
const serverless = require('serverless-http')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var APIRouter = require('./sendData');
const bodyParser = require('body-parser');


var app = express();

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true,}
    );   
const connection =  mongoose.connection;
connection.once('open', () => {
    
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router()
var nodemailer = require('nodemailer');
const FormData = require('form-data');
const upload = require("multer")();

const gpass = process.env.GMAIL_PASS;
const greq = process.env.GMAIL_REQ;
const gmain = process.env.GMAIL_MAIN

router.get('/' , function(req, res, next){
    res.send('API is working!')
})

router.post('/',  upload.single('contactFile'),  async (req, res, next) =>{
    console.log( req.body);
    const name = req.body.contactName;
    const email = req.body.contactEmail;
    const subject = req.body.contactSubject;
    const message = req.body.contactMessage;
    const anexo = req.file;
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: greq,
        pass: gpass
      }
    });
  const mail = {
      from: greq,
      to: gmain,
      cc: email,
      subject:  subject + ' || ' + name+ ' || ' + email,
      text: message,
      //html: "<b>Opcionalmente, pode enviar como HTML</b>"
  } 
  if(anexo){
      console.log(anexo);
      mail.attachments = [];
      mail.attachments.push({
          filename: anexo.originalname,
          content: anexo.buffer
      })
  }
  smtpTransport.sendMail(mail)
          .then(response => {
              smtpTransport.close();
              return response;
          })
          .catch(error => {
              smtpTransport.close();
              return error;
          }); 
})

app.use('/.netlify/functions/api', router);
// app.use('/users', usersRouter);
// app.use('/sendData', APIRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports.handler = serverless(app);
// module.exports = app;
