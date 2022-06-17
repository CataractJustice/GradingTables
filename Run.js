require('./Config');
const TableCRUD = require('./back/tables/TableCRUD');
const TeamCRUD = require('./back/teams/TeamCRUD');
const GradeCRUD = require('./back/grades/GradeCRUD');
var cookieParser = require('cookie-parser')
const User = require('./back/users/User')
const express = require('express');


let app = express();


app.use(express.json())
app.use(express.urlencoded());
app.use(express.static("front"));
app.use(cookieParser())
app.listen(config.host.port);

function UserAccessWrap(reqHandler) {
	return function (req, res) {
		let user = User.getUser(req.cookies.session);
		if(user) {
			req.user = user;
			reqHandler(req, res);
		} else {
			res.redirect("/login.html");
			console.log(req.cookies, User)
		}
	}
}

for(let handler in TableCRUD) {
	app.post("/"+handler.toLowerCase(), UserAccessWrap(TableCRUD[handler]));
}

for(let handler in TeamCRUD) {
	app.post("/"+handler.toLowerCase(), UserAccessWrap(TeamCRUD[handler]));
}

for(let handler in GradeCRUD) {
	app.post("/"+handler.toLowerCase(), UserAccessWrap(GradeCRUD[handler]));
}

app.post("/login", User.login);

console.log(`Server is runing at localhost:${config.host.port}`);