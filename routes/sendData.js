var express = require('express')
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

module.exports = router;