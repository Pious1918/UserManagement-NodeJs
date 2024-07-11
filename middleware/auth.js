


const isLogin = async (req, res, next) => {
    try {
        if (req.session.home) {
            // User is logged in, proceed to the next middleware or route handler
            next();
        } else {
            // User is not logged in, redirect to the home page
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
        // Handle errors as needed
        res.status(500).send('Internal Server Error');
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (req.session.home) {
            // User is logged in, redirect to the home page
            res.redirect('/home');
        } else {
            // User is logged out, proceed to the next middleware or route handler
            next();
        }
    } catch (error) {
        console.log(error.message);
        // Handle errors as needed
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    isLogin,
    isLogout
};
