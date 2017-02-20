var express = require('express');
var body_parser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();
app.use(body_parser.urlencoded({ extended: false }));

// DATABASE
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/idecider';

var Emails, Database;

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  // console.log("Connected correctly to server");
  Database = db;
  Emails = db.collection('emails');
});

app.post('/backend/signup', function(req, res) {
  var email = req.body.email;
  if (email) {
    Emails.findOne({email: email}, function(err, email) {
      if(email) {
        res.redirect('/success.html');
        return;
      }
      Emails.insert({email: email}, function(err, email){
        console.log("Email: " + email);
        res.redirect('/success.html');
      });
    });
  }
});

app.post('/backend/sendMessage', function(req, res) {
  var transporter = nodemailer.createTransport({
     service: 'Yandex',
     auth: {
         user: 'noreply@idecider.ru', // Your email id
         pass: 'noreply123' // Your password
     }
 });
 var text = "Имя: " + req.body.name + "\nemail: "
  + req.body.email + "\n" + req.body.message;
 var mailOptions = {
 from: 'noreply@idecider.ru', // sender address
 to: 'support@idecider.ru', // list of receivers
 subject: req.body.subject, // Subject line
 text: text //
 };
 transporter.sendMail(mailOptions, function(error, info){
   if(error){
     console.log(error);
     //res.json({yo: 'error'});
   }else{
     console.log('Message sent: ' + info.response);
     //res.json({yo: info.response});
   };
   res.redirect('/success_message.html');
 });
})

var server = app.listen(8080, "127.0.0.1");
