class Team {
	id;
	title;
	members;
	constructor(title, id, members) {
		this.id = id;
		this.title = title;
		this.members = members;
	}

	delete(callback) {
		post("/teamdelete", {"id": this.id}, callback);
	}
}

Team.create = function(title) {
	post("/teamcreate", {"title": title});
}

Team.load = function(id, callback) {
	post("/teamread", {id: id}, function(data) {
		callback(new Team(data.title, data.id, data.members));
	})
}

Team.loadList = function(callback) {
	post("/teamlist", {}, function(data) {
		let list = [];
		for(let t of data) {
			list.push(new Team(t.title, t.id, t.members));
		}
		callback(list);
	})
}