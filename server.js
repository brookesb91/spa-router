var express = require('express');
var path = require('path');

var port = process.env.PORT || 420;

var app = express();

app.use(express.static(path.resolve(__dirname)));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'demo.html'));
});

app.listen(port, () => console.log(`App Running On Port ${port}`));
