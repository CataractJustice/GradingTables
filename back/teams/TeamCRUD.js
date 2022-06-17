const Team = require('./Team');
const User = require('../users/User');
let DB = require('../DB');

function TeamCreate(req, res) {
	let team = new Team(req.body.title);
	DB.teams.set(team);
	res.redirect("/teams.html");
}

function TeamList(req, res) {
	DB.teams.getList(req.user).then(function(list){res.send(list);});
}

function TeamRead(req, res) {
	DB.teams.get(req.body.id).then(function(team){res.send(team);});
}

function TeamUpdate(req, res) {
	DB.teams.get(req.body.id).then(function(team) {
		if(team)
			DB.teams.set(new Team(team.title, team.id, req.body.members));
	});

	res.send("");
}

function TeamDelete(req, res) {
	DB.teams.delete(req.body.id);
}

module.exports = {TeamCreate, TeamList, TeamRead, TeamUpdate, TeamDelete};