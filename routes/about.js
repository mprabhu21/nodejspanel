module.exports = {
    getAboutPage: (req, res) => {        
        res.render('about.ejs', {
            title: 'Welcome to Appy'
        });       
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