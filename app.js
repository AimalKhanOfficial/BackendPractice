const express = require('express');
const { z } = require('zod');
const { isUserValid } = require('./dbHandler');
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
    const token = req.headers.authorization;
    if (!jwt.verify(token, JWTPass)) {
        return res.json(400, {
            message: 'invalid token'
        });
    } else {
        
    }
});

app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    if (!User.safeParse({ email, password }).success) {
        return res.json(400, 'Email and/or password validation failed');
    }

    if (isUserValid(email, password)) {
        const token = jwt.sign({email, password}, JWTPass);
        return res.json(200, {
            message: 'User Exists, welcome back!',
            token
        });
    } else {
        return res.json(404, 'Invalid Username and password');
    }
});

app.listen(port, () => {
    console.log('>> server started listening on port', port)
});