const express = require('express');

let app = express();

app.get('/', function(req, res) {
	res.send("a");
});

app.listen(4488)