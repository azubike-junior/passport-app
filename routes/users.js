const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport')

const User = require('../models/User');

router.get('/login', (req, res) => {
	res.render('Login');
});

router.get('/register', (req, res) => {
	res.render('Register');
});

//register handler
router.post('/register', (req, res) => {
	console.log(req.body);
	const {name, email, password, password2} = req.body;
	let errors = [];

	//check required fields
	if(!name || !email || !password ||!password2){
		errors.push({msg: 'please fill in all fields'});
	}

	// check passwords match
	if(password !== password2){
		errors.push({ msg: 'password do not match' });
	}

	//check password length
	if(password.length < 6){
		errors.push({ msg: 'password should be atleast 6 characters' });
	}

	if(errors.length > 0){
		res.render('register',{
			errors,
			name,
			email,
			password, 
			password2
		})
	}else{
		User.findOne({email: email})
		.then(user =>{
			if(user){
				//user exists
				errors.push({msg: 'Email is already registered'});
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2	
				});
			}else{
				const newUser = new User({
					name,
					email,
					password
				});
				//Hash password
				bcrypt.genSalt(10, (err, salt)=> {
					bcrypt.hash(newUser.password, salt, (err, hash)=> {
						// Store hash in your password DB.
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
						.then(user => { 
							req.flash('success_msg', 'you are now registered and can log in');
							res.redirect('/users/login')
						})
						.catch(err)
					
					});
				});
				
			}
		
		})
	}

});

//login handler
router.post('/login', (req, res, next)=>{
		passport.authenticate('local', {
			successRedirect: '/todo',
			failureRedirect: '/users/login',
			failureFlash: true
		})(req, res, next);
	});

//logout handler
router.get('/logout', (req, res)=>{
	req.logOut();
	req.flash('success_msg', 'you are logged out');
	res.redirect('/users/login');
})
module.exports = router;
