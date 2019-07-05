const express = require('express');
const path = require('path');


const app = express();

app.use(express.static(path.join(__dirname, 'src')));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'demo.html')));
app.listen((port = process.env.port || 420), () => console.log(`App Listening on port ${port}`));