let DB = require('../DB');
const Grade = require('./Grade');

async function GradeUpdate (req, res) {
	let oldgrade = await DB.grades.getByTeamAndTable(req.body.teamID, req.body.tableID);
	let team = await DB.teams.get(req.body.teamID);
	let table = await DB.tables.get(req.body.tableID);
	for(let reqField of req.body.fields) {
		table.fields.find(function(tableField) {return tableField.id == reqField.id;}).grade = parseInt(reqField.grade);
	}
	let grade = new Grade(team, table, oldgrade ? oldgrade.id : undefined);
	DB.grades.set(grade);
	res.send(grade);
}

function GradeList (req, res) {
	DB.grades.getListByTeam(req.body.teamID).then(function(g){res.send(g);});
}

function GradeRead (req, res) {
	DB.grades.get(req.body.id).then(function(g){res.send(g);});
}

function GradeDelete (req, res) {
	DB.grades.delete(req.body.id);
}

module.exports = {GradeUpdate, GradeRead, GradeList, GradeDelete};