var express = require('express'),
	app = express(),
	path = require('path'),
	i18n = require('i18n'),
	musti = require('mustache'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	jsdom = require('jsdom'),
	nodemailer = require('nodemailer'),
	wellknown = require('nodemailer-wellknown'),
	email = require('emailjs'),
    Cookies = require('cookies'),
	en_trans,
	ro_trans;


fs.readFile('./locales/en.json', 'utf8', function (err, data) {
  if (err) throw err;
  	en_trans = JSON.parse(data);
});

fs.readFile('./locales/ro.json', 'utf8', function (err, data) {
  if (err) throw err;
  	ro_trans = JSON.parse(data);
});

app.get('/:lang', function(req, res) {
    cookies = new Cookies( req, res);
    res.sendFile(path.join(__dirname + '/index.html'));
    console.log(req.params.lang);
    //res.cookie('language', req.params.lang, { maxAge: 900000, httpOnly: true });
    cookies.set('language', (req.params.lang == 'en') ? 'en' : 'ro');
    var lang = (req.params.lang == 'en') ? en_trans : ro_trans;
    var page = fs.readFileSync("index.html", "utf8");
	var html = musti.to_html(page, lang); 
	
	res.send(html); 
});

app.get('/',function(req,res){  
    res.redirect('/ro');
})

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "cristina.k.david@gmail.com",
        pass: "jvMM4paMCristina"
    }
});

var server  = email.server.connect({
   user:    "cristina.k.david@gmail.com", 
   password:"jvMM4paMCristina", 
   host:    "smtp.gmail.com", 
   tls:     true
});

// server.send({
// 	   text:    "bba", 
// 	   from:    "eu", 
// 	   to:      "cristina.k.david@gmail.com",
// 	   subject: "Mail from drbutDentalSpa contact form"
// 	}, function(err, message) { 
// 		console.log(err || message); });

// smtpTransport.verify(function(error, success) {
//    if (error) {
//         console.log(error);
//    } else {
//         console.log('Server is ready to take our messages');
//    }
// });



app.post('/send',function(req,res){
// 	var mailOptions={
// 	   to : req.query.to,
// 	   from : req.query.from, 
// 	   text : req.query.text
// 	}
// 	console.log(mailOptions);
// 	smtpTransport.sendMail(mailOptions, function(error, response){
// 		if(error){
// 			console.log(error);
// 			response.send("error");
// 		}else{
// 			console.log("Message sent: ");
// 			response.send("sent");
// 		}
// });


	var mailOptions={
	 	to : req.params.to,
	 	from : req.query.from, 
 	   	text : req.query.text
 	  }
 	  console.log(req.body);
	server.send({
	   text:    "SDf", 
	   from:    "df", 
	   to:      "cristina.k.david@gmail.com",
	   subject: "Mail from drbutDentalSpa contact form"
	}, function(err, message) { 
		console.log(err || message); });

});

app.use("/style", express.static(path.join(__dirname + '/style')));
app.use("/script", express.static(__dirname + '/script'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/wow", express.static(__dirname + '/wow'));
app.use("/content", express.static(__dirname + '/content'));

console.log("INFO - Application is running...");
app.listen(8080);