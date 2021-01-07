const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/login', (req, res) => {
	res.render('login');
});
router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', async (req, res) => {

	const {name,email, password, password2, birthdate, phone, doctorName, doctorPhone, doctorEmail, doctorAddress, allergies, medicalNotes} = req.body;

	let errors = [];
	console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
	if (!name || !email || !password || !password2 || !birthdate) {
		errors.push({msg : "Please fill in all fields"})
	}
	if (password !== password2) {
		errors.push({msg : "passwords dont match"});
	}
	
	// TODO: Integrate with a better password quality checker
	if (password.length < 6) {
		errors.push({msg : 'password must be at least 6 characters'})
	}
	if (errors.length > 0) {
		res.render('register', {
			errors : errors,
			name : name,
			email : email,
			password : password,
			password2 : password2,
			birthdate : birthdate,
			phone: phone,
			doctorName: doctorName,
			doctorPhone: doctorPhone,
			doctorEmail: doctorEmail,
			doctorAddress: doctorAddress,
			allergies: allergies,
			medicalNotes: medicalNotes});
	} else {
		//validation passed
		console.log('About to find existing?');
		User.findOne({email: email}).exec((err, user) => {
			console.log(user);
			if (user) {
				errors.push({msg: 'email already registered'});
				res.render('register', {
					errors : errors,
					name : name,
					email : email,
					password : password,
					password2 : password2,
					birthdate : birthdate,
					phone: phone,
					doctorName: doctorName,
					doctorPhone: doctorPhone,
					doctorEmail: doctorEmail,
					doctorAddress: doctorAddress,
					allergies: allergies,
					medicalNotes: medicalNotes});
			} else {
				const newUser = new User({
					name: name,
					email: email,
					password: password,
					birthdate: birthdate,
					phone: phone,
					phoneVerified: false,
					emailVerified: false,
					medicalDetails: {
						doctorName: doctorName,
						doctorPhone: doctorPhone,
						doctorEmail: doctorEmail,
						doctorAddress: doctorAddress,
						allergies: allergies,
						otherNotes: medicalNotes
					}
				});
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, 
						(err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							newUser.save().then((value) => {
								console.log(value);
								req.flash('success_msg', 'You have now registered!');
								res.redirect('/users/login');
							}).catch(value => console.log(value));
						});
				});
			}
		});
	}
});
router.post('/login', (req, res, next) => {
	passport.authenticate(
		'local', {
			successRedirect: '/dashboard',
			failureRedirect: '/users/login',
			failureFlash: true
		}
	) (req, res, next);
});

router.get('/logout', (req, res, next) => {
	req.logout();
	req.flash('success_msg', 'Now logged out');
	res.redirect('/users/login');
});

module.exports = router;
