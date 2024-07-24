const express = require('express');
const { z } = require('zod');
const { isUserValid, getAllFriends } = require('./dbHandler');
const jwt = require('jsonwebtoken');
const JWTPass = 'myCoolJWTPass';

const app = express();
const port = 3000;

app.use(express.json());

//Setting up a schema with zod
const User = z.object({
    email: z.string().email(),
    password: z.string()
});

app.get('/allFriends', (req, res) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({
            message: 'Token must be provided'
        });
    }
    if (token.split(' ').length > 1) {
        token = token.split(' ')[1];
    }
    try {

        const verifiedToken = jwt.verify(token, JWTPass);
        if (!verifiedToken) {
            return res.status(400).json({
                message: 'invalid token'
            });
        } else {
            return res.status(200).json({
                message: 'success',
                data: getAllFriends(verifiedToken.email)
            });
        }
    } catch (err) {
        return res.status(404).json({
            message: 'Invalid token'
        })
    }
});

app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    if (!User.safeParse({ email, password }).success) {
        return res.status(400).json({
            message: 'Email and/or password validation failed'
        });
    }

    if (isUserValid(email, password)) {
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

app.listen(port, () => {
    console.log('>> server started listening on port', port)
});