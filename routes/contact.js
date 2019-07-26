module.exports = {
    getContactPage: (req, res) => {        
        res.render('contact.ejs', {
            title: 'Welcome to Contact Page'
        });       
    },
};