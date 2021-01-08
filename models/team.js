const mongoose = require('mongoose');


const EventSchema = new mongoose.Schema({
    isMatch: {
        type: Boolean,
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    seasonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    createdByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdOnDateTime: {
        type: Date,
        default: Date.now
    },
    isAtHome: {
        type: Boolean,
        required: true
    },
    players: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: Number,
            required: true
        }
    }],
    duties: [{
        name: {
            type: String,
            required: true
        },
        assignedToUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    result: {
        ourScore: {
            type: Number,
            required: false
        },
        theirScore: {
            type: Number,
            required: false
        },
        outcome: {
            type: Number,
            required: false
        }
    }
});

const SeasonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    events: [
        EventSchema
    ]
});


const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    league: {
        type: String
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    sport: {
        type: String,
        required: true
    },
    isKidsTeam: {
        type: Boolean,
        required: true
    },
    coachIds: [mongoose.Schema.Types.ObjectId],
    managerIds: [mongoose.Schema.Types.ObjectId],
    players: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            number: {
                type: String,
                required: false
            },
            position: {
                type: String,
                required: false
            },
            notes: {
                type: String,
                required: false
            }
        }
    ],
    homeVenueId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    teamEmail: {
        type: String,
        required: false
    },
    teamPhone: {
        type: String,
        required: false
    },
    teamWebsite: {
        type: String,
        required: false
    },
    settings: [
        {
            name: String,
            value: String
        }
    ],
    /*
- settings
  - require invitations
  - retain privacy when sending emails
  - who can send messages?
  - let people volunteer for roles
  - randomly assign roles
  - send duty reminder
  */
    matchDuties: [
        {
            name: {
                type: String,
                required: true
            },
            defaultUserId: {
                type: mongoose.Schema.Types.ObjectId,
                required: false
            },
            requiredAccreditationType: {
                type: String,
                required: false
            }
        }
    ],
    trainingDuties: [
        {
            name: {
                type: String,
                required: true
            },
            defaultUserId: {
                type: mongoose.Schema.Types.ObjectId,
                required: false
            },
            requiredAccreditationType: {
                type: String,
                required: false
            }
        }
    ],
    messages: [
        {
            message: String,
            sentByUserId: mongoose.Schema.Types.ObjectId,
            sent: Date
        }
    ],
    seasons: [
        SeasonSchema
    ],
    resources: [
        {
            name: {
                type: String,
                required: true
            },
            type: {
                type: Number,
                required: true
            },
            url: {
                type: String,
                required: false
            },
            fileBlob: {
                type: Buffer,
                required: false
            },
            fileType: {
                type: String,
                required: false
            },
            fileSize: {
                type: Number,
                required: false
            }
        }
    ]
});

const Team = mongoose.model('Team', TeamSchema);

Team.findByMemberUserId = function(userId, callback) {
    console.log('userId is ' + userId);

    { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }


    this.find({ "$or" : [ 
        { 'players.userId' : userId },
        { 'coachIds' : userId },
        { 'managerIds' : userId } ]}, callback);
};

module.exports = Team;