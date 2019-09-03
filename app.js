const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const passport = require('passport');


//passport config
require('./config/keys')(passport);

//mongoose
const uri = 'mongodb+srv://urbanweb:ggguuu@urbanweb-n0ifq.mongodb.net/test?retryWrites=true&w=majority';
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
		reconnectInterval: 500
	}) 
	.then(() => console.log('mongoDB connected...'))
	.catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({ extended: false }));

//static file
app.use(express.static('./public'));

//Express session
app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true
	})
);

// passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
    next()
});

//Routes
app.use('/', require('./routes/index'));
app.use('/todo', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
