const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Venue = mongoose.model('Venue', VenueSchema);

module.exports = Venue;