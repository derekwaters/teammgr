const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const {ensureAuthenticated} = require('../config/auth.js');

router.get('/', ensureAuthenticated, (req, res) => {
	Team.findByMemberUserId(req.user.id, function(err, teams) {
		res.render('teams', {
			user: req.user,
			teams: teams
		});
	});
});

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('newTeam', {
        // Dunno, do we need anything here?
    });
});

router.post('/new', ensureAuthenticated, (req, res) => {
	console.log('------------ POST A TEAM --------------');
	console.log(req.body);
	console.log('------------ POST A TEAM END ----------');
	// Check permissions
	var newTeam = new Team({
        name: req.body.name,
        league: req.body.league,
        // clubId: TODO,
        sport: req.body.sport,
        isKidsTeam: (req.body.kidsTeam !== undefined),
        managerIds: [ req.user.id ],
        players: [],
        // homeVenueId: TODO,
        teamEmail: req.body.email,
        teamPhone: req.body.phone,
        teamWebsite: req.body.website,
        settings: []
    });
    newTeam.save().then((value) => {
        console.log(value);
        res.send(
            {
                newTeam: newTeam,
                success: true
            }
        );
    }).catch((value) => {
        console.log(value);
        res.send(
            {
                newTeam: null,
                success: false
            }
        )
    });
});

module.exports = router;