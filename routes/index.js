const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth.js');
const Team = require('../models/team');

router.get('/', (req, res) => {
	res.render('welcome');
});
router.get('/register', (req, res) => {
	res.render('register');
});
router.get('/dashboard', ensureAuthenticated, (req, res) => {
	console.log(req);
	res.render('dashboard', {
		user: req.user
	});
});
router.get('/teams', ensureAuthenticated, (req, res) => {
	console.log(req);
	Team.findByMemberUserId(req.user.id, function(err, teams) {
		res.render('teams', {
			user: req.user,
			teams: teams
		});
	});
});

module.exports = router;

