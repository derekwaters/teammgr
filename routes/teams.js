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

/* Handlers for opening a team page */
router.get('/:teamId', ensureAuthenticated, (req, res) => {
    Team.findById(req.params.teamId, function(err, team) {
        if (err) {
            res.status(404);
        } else {
            res.render('team', {
                user: req.user,
                team: team
            })
        }
    });
});



/* Handlers for adding new teams */
router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('newTeam', {
        user: req.user
        // Dunno, do we need anything here?
    });
});

router.post('/new', ensureAuthenticated, (req, res) => {
	// Check permissions
	var newTeam = new Team({
        name: req.body.name,
        league: req.body.league,
        // clubId: TODO,
        sport: req.body.sport,
        isKidsTeam: (req.body.kidsTeam !== undefined),
        managerIds: [ req.user.id ],
        /*
        players: [
            {
                userId: req.user.id
            }
        ],
        */
        // homeVenueId: TODO,
        teamEmail: req.body.email,
        teamPhone: req.body.phone,
        teamWebsite: req.body.website,
        settings: []
    });
    newTeam.save().then((value) => {
        console.log(value);
        res.redirect(
            '/teams'
        );
    }).catch((value) => {
        console.log(value);
        req.flash('error_msg', value);
        res.redirect(
            '/teams/new'
        );
    });
});

module.exports = router;