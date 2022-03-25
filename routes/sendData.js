var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer');
const FormData = require('form-data');
const upload = require("multer")();

const gpass = 'benfas13';
const greq = 'bemmequero.bordados.pedidos@gmail.com';
const gmain = 'bemmequero.bordados@gmail.com'

router.get('/' , function(req, res, next){
    res.send('API is working!')
})

router.post('/',  upload.single('contactFile'),  async (req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //console.log( req.body)  ---> Debug
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
      //console.log(anexo)  ---> Debug
      mail.attachments = [];
      mail.attachments.push({
          filename: anexo.originalname,
          content: anexo.buffer
      })
  }
  
  //console.log(mail)  ---> Debug

await smtpTransport.sendMail(mail)
          .then(response => {
              smtpTransport.close();
              response.status = 200;
              response.message = "OK";
              return response;
          })
          .catch(error => {
              smtpTransport.close();
              error.message = "Not OK";
              return error;
          }); 
})

module.exports = router;