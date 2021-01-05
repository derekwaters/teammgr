const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: false
    },
    photoBlob: {
        type: Buffer,
        required: true
    },
    photoSize: {
        type: Number,
        reuired: true
    },
    photoType: {
        type: String,
        required: true
    },
    dateTimeTaken: {
        type: Date,
        required: false
    },
    uploadedByUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tags: [ String ]
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;