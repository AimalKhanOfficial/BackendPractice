require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION_STRING);

//Mongo Schema
const UsersSchema = mongoose.Schema({
    email: String,
    password: String,
    fullName: String,
    role: String,
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
});

//model based on the Schema
const User = mongoose.model('Users', UsersSchema);

//sample database before i replace this with MongoDB
let ALL_USERS = [
    {
        email: 'ak@email.com',
        fullName: 'Aimal Khan',
        pass: 'ak123',
        friends: [
            'F1',
            'F2',
            'F3'
        ]
    },
    {
        email: 'asf@email.com',
        fullName: 'Asfandyar Khan',
        pass: 'as123',
        friends: [
            'F1',
            'F2',
            'F3',
            'F4'
        ]
    }
]

const addNewUser = (email, password, fullName, role = 'user', friends) => {
    const newUser = new User({
        email,
        password,
        fullName,
        role,
        friends
    });
    newUser.save();
    return newUser;
}

const isUserValid = async (email, password) => await User.findOne({
    email,
    password
});

const getAllFriends = async (email) => await User.findOne({
    email
}).friends;

module.exports = {
    isUserValid,
    getAllFriends,
    addNewUser
}