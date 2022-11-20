var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mikko.jk.rajala@gmail.com',
      pass: 'SYOTA_TEMP_PASSWORD'
    }
  });
  
  var mailOptions = {
    from: 'mikko.jk.rajala@gmail.com',
    to: 'juvuorin@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 