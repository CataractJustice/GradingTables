const crypto = require('crypto');

class Grade {
	teamID;
	tableID;
	tableTitle;
	grades;
	result;
	max;
	accepted;
	id;
	constructor (team, table, id) {
		this.teamID = team.id;
		this.tableID = table.id;
		this.tableTitle = table.title;
		this.grades = [];
		for(let field of table.fields) {
			this.grades.push({id: field.id, grade: field.grade});
		}
		this.max = table.weightSum;
		this.result = table.grade;
		this.accepted = table.acceptable;
		this.id = id ? id : crypto.randomUUID();
	}
}

module.exports = Grade;