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

Venue.findByAddress = function (venueAddress, callback) {
    console.log('Looking for ' + venueAddress);

    this.find({ 'address' : venueAddress }, function (err, venue) {
        if (err) throw err;

        console.log(venue);
        console.log('----------------');
        if (!venue || venue.length === 0) {
            venue = new Venue({
                name: venueAddress,
                address: venueAddress
            });
            venue.save().then((value) => {
                console.log(value);
                callback(venue);
            }).catch((value) => {
                throw value;
            });
        } else {
            callback(venue[0]);
        }
    });
};

module.exports = Venue;