var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer');

const gpass = process.env.GMAIL_PASS;
const greq = process.env.GMAIL_REQ;
const gmain = process.env.GMAIL_MAIN

 var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bemmequero.bordados.pedidos@gmail.com',
          pass: 'benfas14'
        }
      });


router.get('/' , function(req, res, next){
    res.send('API is working!')
})
router.post('/', function(req, res, next){
    console.log(req.body)
      var mailOptions = {
        from: greq,
        to: gmain,
        cc: req.body.contactEmail,
        subject: req.body.contactSubject + ' ' + req.body.contactName + ' ' + req.body.contactEmail,
        text: req.body.contactMessage + ' ' + req.body.contactPicture
      };
        
      mail.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
}  )

module.exports = router;