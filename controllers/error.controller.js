exports.get404 =  (req,res,next)=> {
    res.status(404).render('404',{
        pageTitle:'Page not found',
        path:'',
        isAuthenticated: req.session.isLoggedIn,
    });
}

exports.get500 =  (req,res,next)=> {
    res.status(500).render('500',{
        pageTitle:'Internal Error',
        path:'',
        isAuthenticated: req.session.isLoggedIn,
    });
}