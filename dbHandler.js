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

const isUserValid = (email, pass) => ALL_USERS.find(a => a.email === email && a.pass === pass);

module.exports = {
    isUserValid
}