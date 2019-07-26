const jwt = require('jsonwebtoken');
const config = require('../config');

//var firstFile = require('../eventFile');
//var firstFileEmitter = firstFile.emitter;
var emitter = require('../eventFile')
var printEmitter = emitter.myEmitter

//var events = require('events').EventEmitter;
//var emitter = new events.EventEmitter();
const tokenList = {};
module.exports = {
    getAdminPage: (req, res) => {        
        res.render('admin/admin.ejs', {
            title: 'Welcome to Appy Admin Panel'
        });       
    },
    getSecurePage: (req, res) => {
        res.send('I am secured');
    },
    getSignOutPage: (req, res) => {
        req.session = null;
        res.redirect('/');        
    },
    getLoginPage: (req, res) => {
        let message = '';
        let email = req.body.email;
        let password = req.body.password;
        let logintype = req.body.logintype;
        const user = {
            "email": req.body.email,
            "name": req.body.password
        }
        
        let usernameQuery = "SELECT * FROM public.authors WHERE email = '" + email + "' AND password = md5('" + password + "') ";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                console.log('error', err);
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                req.session.adminlogin = [];
                if (typeof(req.session.adminlogin) == 'undefined') {
                    req.session.adminlogin = [];
                }
                req.session.adminlogin.push({id: result[0].id, first_name: result[0].first_name, last_name: result[0].last_name, email: result[0].email, image: result[0].image});

                /*firstFileEmitter.emit('FirstEvent', function (data) {
                    console.log('First subscriber: ' + data);
                });*/
                printEmitter.emit('print', 'how was Dunkirk?')
                //printEmitter.emit('print', 'Dunkirk was awesome!!')
                //emitter.on('connection', listner1);
                //emitter.emit('newEvent', "Krunal");

                const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
                const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
                const response = {
                    "status": "Logged in",
                    "token": token,
                    "refreshToken": refreshToken,
                }
                tokenList[refreshToken] = response;

                /*req.session.adminlogin['first_name'] = result[0].first_name;
                req.session.adminlogin['last_name'] = result[0].last_name;
                req.session.adminlogin['email'] = result[0].email;
                req.session.adminlogin['image'] = result[0].image;*/
                console.log('success', req.session.adminlogin);
                message = 'Login successfully';
                if(logintype == 1){
                    res.redirect('/admin/dashboard');
                } else {
                    res.status(200).json(response);
                }                
            } /*else {
                console.log('invalid');
                message = 'Username / Password doesn\'t exists';
                res.render('admin.ejs', {
                    message,
                    title: 'Appy admin panel'
                });                
            }*/
        });
    },
    getTokenPage: (req, res) => {
        // refresh the damn token
        const postData = req.body
        // if refresh token exists
        console.log('tokenList', tokenList);
        console.log('\n\n\n');
        console.log('postData.refreshToken', postData.refreshToken);
        if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
            const user = {
                "email": postData.email
            }
            //const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
            const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
            
            const newtoken = tokenList[postData.refreshToken].token;
            const response = {
                "token": newtoken,
                "refreshToken": refreshToken
            }
            //const tokenList = {};
            tokenList[refreshToken] = response;
            // update the token in the list
            //tokenList[postData.token].token = 'token';
            /*tokenList[postData.refreshToken].refreshToken = refreshToken;
            tokenList[postData.refreshToken].refreshToken = refreshToken;*/
            console.log('\n\n\n');
            console.log('tokenList refreshToken', tokenList);
            res.status(200).json(response);        
        } else {
            res.status(404).send('Invalid request')
        }

    },
};

/*module.exports = {
    getHomePage: (req, res, next) => {

        //let query = "SELECT * FROM `authors` ORDER BY id ASC"; // query database to get all the players

        // execute query
        


        try {
            var limit = 2;
            var page = 1; //req.param('page');
            var skip = page * limit - page;
            var orderBy = 'id'; //req.param('orderBy');
            var sortBy = 'id'; //req.param('sortBy');
            // var qArray = [];

            if (orderBy) {
                // qArray = [orderBy, sortBy];
                var testquery = 'SELECT * FROM `authors` '+orderBy+' '+sortBy+' limit ' + limit + ' offset ' + skip;
            } else {
                // qArray = [];
                var testquery = 'SELECT * FROM `authors` limit 0, 10';
            }
            console.log('testquery', testquery);
            console.log("limit :" + limit + "\n page : " + page + "\n skip : " + skip + "\n orderBy :" + orderBy + " \n sortBy : " + sortBy);

            // conn.query('select name, password, contact, email from user where ID = ?', userID, function(err, rows, fields) {
            // conn.query('select name, password, contact, email from user limit ? offset ? order by ? ?',[limit, skip, orderBy, sortBy], function(err, rows, fields) {
            // conn.query('select name, password, contact, email from user limit '+limit+' offset '+skip, function(err, rows, fields) {                    
            db.query(testquery, (err, result) => {
                if (err) {
                     console.error('SQL error: ', err);
                }
                res.render('index.ejs', {
                    title: 'Welcome to Socka | View Players',
                    players: result
                });
            });
              
        } catch (ex) {
            console.error("Internal error:" + ex);
            return next(ex);
        }
    },
};*/