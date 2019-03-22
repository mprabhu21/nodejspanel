/*var events = require('events');
var em = new events.EventEmitter();

exports.saveScheme = function (req, res) {  

var dal = dalFactory.createDAL(constants.SCHEME);
return new Promise.resolve(dal.PromiseSave(req.body))
    .then(function(data){
        var schemeId = data._id;

        em.addListener('FirstEvent', function (data) {
            console.log('First subscriber: ' + data);
        });
        em.emit('FirstEvent', 'Test event emitter');

    }).catch(function(error){
        console.log(error);
    }); 
};
exports.emitter = em;*/

var EventEmitter = require('events').EventEmitter
var myEmitter = new EventEmitter();
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "mprabhu@q2m.in",
        pass: "Testing@123"
    }
});

myEmitter.on('print', (arg) => {
    console.log(arg);
    var mailOptions={
        to : 'mprabhu@q2m.in',
        subject : 'FYI Subject',
        text : 'FYI MEssage'
    }
    console.log('mailOptions', mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
                console.log('error', error);
            res.end("error");
        }else{
                console.log("Message sent: " + response);
            res.end("sent");
        }
    });
});
exports.myEmitter = myEmitter