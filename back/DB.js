const { Sequelize, DataTypes} = require('sequelize');
const {cryptPassword, comparePassword} = require('./PassHash');
const crypto = require('crypto')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

let Users;
let Tables;
let Teams;
let Grades;

async function init() {
	try {
  		await sequelize.authenticate();
  		console.log('Connection has been established successfully.');
		Users = sequelize.define("users", {
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},

			login: {
				type: DataTypes.STRING,
				unique: true
			},

			passhash: {
				type: DataTypes.STRING
			},

			name: {
				type: DataTypes.STRING
			},

			email: {
				type: DataTypes.STRING
			}
		});

		Tables = sequelize.define("tables", {
			id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
			},

			author: {
				type: DataTypes.INTEGER
			},

			title: {
				type: DataTypes.STRING
			},

			fields: {
				type: DataTypes.JSON
			}
		});

		Teams = sequelize.define("teams", {
			id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
			},

			title: {
				type: DataTypes.STRING
			},

			members: {
				type: DataTypes.JSON
			}
		});

		Grades = sequelize.define("grades", {
			id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
			},

			tableID: {
				type: DataTypes.INTEGER
			},

			teamID: {
				type: DataTypes.INTEGER
			},
			
			grades: {
				type: DataTypes.JSON
			}
		});
		sequelize.sync();
	} catch (error) {
  		console.error('Unable to connect to the database:', error);
	}
}

init();
//TO-DO: use actuall DB

let db = {};

db.tables = {};
db.teams = {};
db.grades = {};
db.users = {};

db.tables.set = function(table) {
	db.tables.get(table.id).then(function(old) {
		if(old) {
			old.fields = table.fields;
			old.save();
		} else {
			let instance = Tables.build({id: table.id, author: table.author, title: table.title, fields: table.fields});
			instance.save();
		}
	});
};

db.tables.get = function (id) {
	return Tables.findOne({where: {id: id}});
};

db.tables.getList = function(user) {
	return Tables.findAll();
}

db.tables.delete = async function(id) {
	let table = await Tables.findOne({where:{id:id}});
	table.destroy();
}

db.teams.set = async function(team) {
	let instance = await Teams.findOne({where: {id:team.id}});
	if(!instance)
		instance = Teams.build({id: team.id, title: team.title, members: team.members ? team.members : []});
	else
		instance.members = team.members;
	instance.save();
}

db.teams.get = function(id) {
	return Teams.findOne({where:{id:id}});
}

db.teams.getList = function(user) {
	return Teams.findAll();
}

db.teams.delete = async function(id) {
	let team = await Teams.findOne({where:{id:id}});
	team.destroy();
}

db.grades.set = async function(grade) {
	let instance = await Grades.findOne({where: {id:grade.id}});
	if(!instance)
		instance = Grades.build({id: grade.id, tableID: grade.tableID, teamID: grade.teamID, grades: grade.grades});
	else
		instance.grades = grade.grades;
	instance.save();
}

db.grades.get = function(id) {
	return Grades.findOne({where:{id:id}});
}

db.grades.getListByTeam = function(id) {
	return Grades.findAll({where:{teamID: id}});
}

db.grades.getByTeamAndTable = function(teamID, tableID) {
	return Grades.findOne({where:{teamID: teamID, tableID: tableID}});
}
	

db.grades.delete = async function(id) {
	let grade = await Grades.findOne({where:{id:id}});
	grade.destroy();
}

db.users.register = function(login, password, name, email) {
	cryptPassword(password, async function(err, passhash) {
		Users.findOne({where: {login: login}}).then(function(user) {
			if(user) {
				console.log(`User with login "${login}" already exists`);
				return;
			}
			user = Users.build({
				login: login,
				passhash: passhash,
				name: name,
				email: email
			});
			user.save().then().catch(err => console.log(err));
		}).catch(function(err) {console.log(err);});
		
	});
}

db.users.login = async function(login, password, callback) {
	let user = await Users.findOne({where:{login:login}});
	comparePassword(password,  user.passhash, async function(err, match) {
		callback(match ? user : undefined);
	});
}

db.users.list = async function() {
	return Users.findAll();
}


db.users.register("admin", "YOUR_BEST_FRIEND", "Chara Dremur", "FirstKid@protonmail.ch");

module.exports = db;