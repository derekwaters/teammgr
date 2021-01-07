const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    alternateEmails: [{
        email: String
    }],
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    parent: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        }
    ],
    phoneVerified: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    medicalDetails: {
        doctorName: String,
        doctorPhone: String,
        doctorEmail: String,
        doctorAddress: String,
        allergies: String,
        otherNotes: String
    },
    accreditations: [
        {
            accreditationType: {
                type: String,
                required: true
            },
            expiryDate: {
                type: Date
            }
        }
    ],
    settings: [
        {
            name: String,
            value: String
        }
    ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;