const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const User = require('../models/user');
const Venue = require('../models/venue');
const {ensureAuthenticated} = require('../config/auth.js');
const dateAndTime = require('date-and-time');

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
            var playerIds = [];
            team.players.forEach(function(player) {
                playerIds.push(player.userId);
            });
            User.find().where('_id').in(playerIds).exec((err, linkedUsers) => {
                var resultMap = {};
                linkedUsers.forEach((user) => {
                    resultMap[user._id] = user;
                });
                team.players.forEach(function(player) {
                    player.user = resultMap[player.userId];
                });

                var upcoming = [];
                var past = [];

                for (var ev in team.events) {
                    var theEvent = team.events[ev];
                    if (theEvent.startDateTime < now) {
                        past.push(theEvent);
                    } else {
                        upcoming.push(theEvent);
                    }
                }
                past.sort((a, b) => {
                    return a.startDateTime - b.startDateTime;
                });
                upcoming.sort((a, b) => { 
                    return b.startDateTime - a.startDateTime;
                });
                
                res.render('team', {
                    user: req.user,
                    team: team,
                    pastEvents: past,
                    upcomingEvents: upcoming
                });
            });
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



/* Handlers for adding new events fora  team */
router.get('/:teamId/events/new', ensureAuthenticated, (req, res) => {
    Team.findById(req.params.teamId, function(err, team) {
        if (err) {
            res.status(404);
        } else {
            if (team.isManagingUser(req.user.id)) {
                res.render('newEvent', {
                    user: req.user,
                    team: team
                });
            } else {
                res.redirect(team.getUrl());
            }
        }
    });
});

router.post('/:teamId/events/new', ensureAuthenticated, (req, res) => {
    Team.findById(req.params.teamId, function(err, team) {
        if (err) {
            res.status(404);
        } else {
            if (team.isManagingUser(req.user.id)) {
                // console.log(req.body);

                Venue.findByAddress(req.body.venue, function(venue) {
                    var startDateTime = dateAndTime.parse(req.body.startDate, 'YYYY-MM-DD');
                    var tempTime = dateAndTime.parse(req.body.startTime, 'HH:mm');
                    startDateTime.setHours(tempTime.getHours());
                    startDateTime.setMinutes(tempTime.getMinutes());

                    console.log(venue);

                    var newEvent = {
                        isMatch : req.body.isMatch ? true : false,
                        teamId : team.id,
                        startDateTime : startDateTime,
                        duration : req.body.duration,
                        createdByUserId : req.user.id,
                        createdOnDateTime : new Date(),
                        venueId: venue.id,
                        notes: req.body.notes,
                        isAtHome : req.body.isAtHome ? true : false,
                        players: [],
                        duties: []
                    }
                    for (var i in team.players) {
                        newEvent.players.push({
                            userId: team.players[i].id,
                            status: 1
                        });
                    }
                    if (newEvent.isMatch) {
                        for (var j in team.matchDuties) {
                            newEvent.duties.push({
                                name: team.matchDuties[j].name,
                                assignedToUserId: (team.matchDuties[j].defaultUserId)
                            });
                        }
                    }
                    else {
                        for (var j in team.trainingDuties) {
                            newEvent.duties.push({
                                name: team.trainingDuties[j].name,
                                assignedToUserId: (team.trainingDuties[j].defaultUserId)
                            });
                        }
                    }
                    team.events.push(newEvent);

                    console.log('---- About to update the team ----');
                    console.log(team);
                    console.log('----------------------------------');

                    team.save().then((value) => {
                        console.log(value);
                        res.redirect(
                            team.getUrl()
                        );
                    }).catch((value) => {
                        console.log(value);
                        req.flash('error_msg', value);
                        res.redirect(
                            '/teams/new'
                        );
                    });
                });
            } else {
                res.redirect(team.getUrl());
            }
        }
    });
});

module.exports = router;