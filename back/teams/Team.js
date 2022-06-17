const crypto = require('crypto');

class Team {
	id;
	title;
	members;
	constructor (title, id, members) {
		this.title = title;
		this.id = id ? id : crypto.randomUUID();
		this.members = members;
	};
}

module.exports = Team;