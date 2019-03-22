module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `authors` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: 'Welcome to Socka | View Players',
                players: result
            });
        });
    },
};


var addComment = function(user,comment,mysql,pool,callback) {
    var self = this;
    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            return callback(true,null);
        } else {
            var sqlQuery = "INSERT into ?? (??,??,??) VALUES ((SELECT ?? FROM ?? WHERE ?? = ?),?,?)";
            var inserts = ["UserComment","UserId","UserName","Comment","UserId","User","UserName",user,user,comment];
            sqlQuery = mysql.format(sqlQuery,inserts);
            connection.query(sqlQuery,function(err,rows){
                connection.release();
                if (err) {
                    return callback(true,null);
                } else {
                    callback(false,"comment added");
                }
            });
        }
        connection.on('error', function(err) {
            return callback(true,null);
        });
    });
};
module.exports.addComment = addComment;

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