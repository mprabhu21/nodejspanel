console.log("Node Main.js Started!!!");
var express = require("express");
//var nodemailer = require("nodemailer");
var app =  express();
var http = require("http").Server(app);
//var io = require('socket.io')(http);
var router = express.Router();
var url = require('url');
var mymodule = require("./mymodule");

var events = require('events');
var emitter = new events.EventEmitter();

const jwt = require('jsonwebtoken');
const config = require('./config');
const tokenList = {};
var session = require("cookie-session");
//const mysql = require('mysql');
const path = require('path');
const fileUpload = require('express-fileupload');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended : false });
var validator = require('node-input-validator');
var cronJob = require('cron').CronJob;

/*var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "mprabhu@q2m.in",
        pass: "Testing@123"
    }
});*/
/*Const Port Number*/
const port = 3000;

app.use(session({secret : 'todotopsecret', cookie: { maxAge: 60000 }}));

/*const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ionicworld'
});


db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

global.db = db; */

app.set('port', process.env.port || port); // set express to use this port
app.set('views', [path.join(__dirname + '/views'), path.join(__dirname + '/views/admin')]); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
app.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
});

const server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
const io = require("socket.io")(server);

const {getChat} = require('./routes/chat');
app.get('/chat', function(req, res){
	const express = require('express')
    const app = express()
    const port = 8081;

    //set the template engine ejs
    app.set('view engine', 'ejs')

    //middlewares
    app.use(express.static('public'))

    //routes
    res.render('chatpage');

    //socket.io instantiation
    const io = require("socket.io")(server)


    //listen on every connection
    io.on('connection', (socket) => {
    console.log('New user connected')

        //default username
        socket.username = "Anonymous"

        //listen on change_username
        socket.on('change_username', (data) => {
            socket.username = data.username
        })

        //listen on new_message
        socket.on('new_message', (data) => {
            //broadcast the new message
            io.sockets.emit('new_message', {message : data.message, username : socket.username});
        })

        //listen on typing
        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {username : socket.username})
        })
    });   
});


io.on('connection',function(socket){
    console.log('We have user connected !');
        // This event will be emitted from Client when some one add comments.
    socket.on('comment added',function(data){
        console.log('Add comment to db!');
        console.log('User', data.user);
        console.log('Comment', data.comment);
        
        // Add the comment in database.
        socket.broadcast.emit("notify everyone",{user : data.user,comment : data.comment});
        /*db.addComment(data.user,data.comment,mysql,function(error,result){
            if (error) {
                io.emit('error');
            } else {
                // On successful addition, emit event for client.
               socket.broadcast.emit("notify everyone",{user : data.user,comment : data.comment});     
            }
        });*/
    });
});

const {getHomePage} = require('./routes/index');
const {getAppyPage} = require('./routes/appy');
const {getAboutPage} = require('./routes/about');
const {getAdminPage, getLoginPage, getSecurePage, getTokenPage} = require('./routes/admin');
const {getDashboard} = require('./routes/dashboard');

const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');

app.get('/', getAppyPage);

app.get('/admin', getAdminPage);
app.post('/login', getLoginPage);
app.post('/token', getTokenPage);

//app.use(require('./tokenChecker'));
app.get('/secure', getSecurePage);
app.get('/about_page', getAboutPage); 

app.get('/admin/dashboard', getDashboard);

app.get('/curd', getHomePage);
app.get('/add', addPlayerPage);
app.post('/add', addPlayer);

/*app.get('/todo', function(req, res){ 
	res.render('todo.ejs', {todolist: req.session.todolist});	
});

app.post('/todo/add', urlencodedParser, function(req, res){
	if(req.body.newtodo != ''){
		req.session.todolist.push(req.body.newtodo);
	}
	res.redirect('/todo');
});

app.get('/todo/delete/:id', function(req, res){
	if(req.params.id != ''){
		req.session.todolist.splice(req.params.id, 1);
	}
	res.redirect('/todo');
}); */


/*var routes  = require("../routes/")(router,mysql,pool);
app.use('/',router);*/

app.get('/push',function(req,res){
    res.sendFile(path.join(__dirname,'./Client','/index.html'));
});

app.get('/getStatus',function(req,res){    
    /*db.getConnection(function(err,connection){
        if (err) {
            connection.release();
            return res.json({"error" : true,"message" : "Error in database."});
        } else {*/
            /*var sqlQuery = "SELECT * FROM ??";
            var inserts = ["UserPost"];
            sqlQuery = mysql.format(sqlQuery,inserts);
            db.query(sqlQuery,function(err,rows){
                //db.release();
                if (err) {
                    return res.json({"error" : true,"message" : "Error in database."});
                } else {
                    res.json({"error" : false,"message" : rows});
                }
            });*/
        /*}
        connection.on('error', function(err) {
            return res.json({"error" : true,"message" : "Error in database."});
        });
    });*/
});


app.get('/valid', function(req, res){
	res.render('valid.ejs');
});


app.post('/valid/add', function(req, res){
	let validr = new validator(req.body, {
		email: 'required|email',
		password: 'required'
	});
	validr.check().then(function(matched){
		if(!matched){
			res.status(422).send(validr.errors);
		}
	});
});

/*app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('You\’re in reception. How can I help you?');
});*/

app.get('/basement', function(req, res) {
    //throw new Error();
    res.setHeaders('Content-Type', 'text/plain');
    res.end('You\’re in the wine cellar. Those bottles are mine!');
});

app.get('/floor/1/bedroom', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hey, this is a private <?php echo "test"; ?> area!');
});

app.get('/floor/:floornum/bedroom', function(req, res){
	res.render('bedroom.ejs', {floor : req.params.floornum});
});

app.use(function(req, res, next){
    /*res.setHeader('Content-Type', 'text/plain');*/
    res.send(404, 'Page cannot be found!');
    //res.redirect('/todo');
});

var job = new cronJob({
    cronTime: '* * * * * *',
    onTick: function() {
        console.log('running a task every minute');     
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});
//job.start();



//emitter.on('connection', listner1);

/*emitter.on('newEvent', function(user){
    console.log(user);
    var mailOptions={
        to : 'bala@q2m.in',
        subject : 'FYI Subject',
        text : 'FYI MEssage'
    }
    console.log('mailOptions', mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
                console.log('error', error);
            res.end("error");
        }else{
                console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});*/

app.use(function(err,req,res,next) {
  console.log(err.stack);
  res.status(500).send({"Error" : err.stack});
});

//app.listen(8081);



/*var server = http.createServer(function (request, response) {
	var page = url.parse(request.url).pathname;
   	//response.writeHead(200, {'Content-Type': 'text/plain'}); 	
   	response.writeHead(200, {"Content-Type": "text/html"});
	response.write('<!DOCTYPE html>'+
	'<html>'+
	' <head>'+
	' <meta charset="utf-8" />'+
	' <title>My Node.js page - '+ page +'!</title>'+
	' </head>'+ 
	' <body>');
	if(page == '/'){
   		response.write("you are in the dashboard");
   		mymodule.sayHello();
   	} else if (page == '/basement'){
   		response.write('you are in cellar');
   		mymodule.sayGoodBye();
   	}

	response.write(' </body>'+
	'</html>');
	//res.end();
   // Send the response body as "Hello World"
   response.end('Hello World\n');
});

server.on('close', function() { // We listened to the close event
    console.log('Goodbye!');
});

server.listen(8081);
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');*/