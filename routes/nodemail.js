

module.exports = (name, email, subject, message, anexo) => {
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
        subject:  subject + ' ' + name+ ' ' + email,
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
    
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mail)
            .then(response => {
                smtpTransport.close();
                return resolve(response);
            })
            .catch(error => {
                smtpTransport.close();
                return reject(error);
            });
    })
}