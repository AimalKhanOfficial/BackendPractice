const express = require('express');
const { z } = require('zod');
const { isUserValid, getAllFriends, addNewUser } = require('./dbHandler');
const jwt = require('jsonwebtoken');
const JWTPass = 'myCoolJWTPass';

const app = express();
const port = 3000;

app.use(express.json());

//Setting up a schema with zod
const User = z.object({
    email: z.string().email(),
    password: z.string(),
    fullName: z.string().optional()
});

let authenticateRequest = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({
            message: 'Token must be provided'
        });
    }
    else if (token.split(' ').length > 1) {
        token = token.split(' ')[1];
        try {
            const verifiedToken = jwt.verify(token, JWTPass);
            if (!verifiedToken) {
                return res.status(400).json({
                    message: 'invalid token'
                });
            } else {
                res.locals.verifiedToken = verifiedToken;
                next();
            }
        } catch (err) {
            return res.status(404).json({
                message: 'Invalid token'
            })
        }
    } else {
        return res.status(400).json({
            message: 'Please provide a token in the given format "Bearer xxxxxxxxxxxxxxxxx" etc.'
        });
    }
}

//TODO: Need to fix the self reference to get friend IDs
app.get('/allFriends', authenticateRequest, async (req, res) => {
    let verifiedToken = res.locals.verifiedToken;
    let friends = await getAllFriends(verifiedToken.email);
    return res.status(200).json({
        message: 'success',
        data: [friends, 'hey']
    });
});

app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    if (!User.safeParse({ email, password }).success) {
        return res.status(400).json({
            message: 'Email and/or password validation failed'
        });
    }
    console.log('>> isUserValid(email, password)', await isUserValid(email, password))
    if (await isUserValid(email, password)) {
        const token = jwt.sign({ email, password }, JWTPass);
        return res.status(200).json({
            message: 'User Exists, welcome back!',
            token
        });
    } else {
        return res.status(404).json({
            message: 'Invalid Username and password'
        });
    }
});

app.post('/sign-up', (req, res) => {
    const { email, password, fullName } = req.body;
    if (!User.safeParse({ email, password, fullName }).success) {
        return res.status(400).json({
            message: 'Email and/or password validation failed'
        });
    }

    try {
        let newUser = addNewUser(email, password, fullName);
        return res.status(200).json({
            message: 'User created',
            userDetails: newUser
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Something went wrong, please try again'
        });
    }
});

app.listen(port, () => {
    //here my new cool fix
    console.log('>> server started listening on port', port)
});
