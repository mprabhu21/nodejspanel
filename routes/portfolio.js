module.exports = {
    getPortfolioPage: (req, res) => {        
        res.render('portfolio.ejs', {
            title: 'Welcome to Appy'
        });       
    },
};