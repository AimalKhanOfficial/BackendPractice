const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.json('Hello world');
});

app.listen(port, () => {
    console.log('>> server started listening on port', port)
})