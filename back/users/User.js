let DB = require('../DB');
const crypto = require('crypto');

class User {
}

User.sessions = [];

User.getSession = function(user) {
	let session = User.sessions.find(function(s) {
		return s.user.id == user.id;
	});
	if(session) return session.id;
	
	let sessionID = crypto.randomUUID();
	User.sessions.push({id: sessionID, user: user});
	return sessionID;
};

User.getUser = function(sessionID) {
	return this.sessions.find(function(session) {
		return session.id == sessionID;
	});
}

User.login = async function (req, res) {
	DB.users.login(req.body.login, req.body.password, function(user) {
		if(user) {
			res.send(`
			<script>document.cookie="session=${User.getSession(user)}"; window.location="/";</script>
			`);
		} else {
			res.status(401).send("Bad login");
		}
	});
};

module.exports = User;