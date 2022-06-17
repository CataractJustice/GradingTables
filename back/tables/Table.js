const crypto = require('crypto');
const TableField = require('./TableField');

class Table {
	title;
	fields;
	id;
	author;

	constructor(title, author, id, fields) {
		this.title = title;
		this.author = author;
		this.fields = fields ? fields : [];
		for(let field of this.fields) {
			field.id = field.id ? field.id : crypto.randomUUID();
		}
		this.id = id ? id : crypto.randomUUID();
	}

	//TO-DO:
	userHasEditAccess(user) {
		return true;
	} 

	get weightSum () {
		let sum = 0;
		for(let field of this.fields) {
			sum += field.weight;
		}
		return sum;
	}

	get grade () {
		let gradesum = 0;
		for(let field of this.fields) {
			gradesum += field.grade / field.maxGrade * field.weight;;
		}
		return gradesum;
	}

	get acceptable () {
		for(let field of this.fields) {
			if(field.grade < field.minAcceptable) return false;
		}
		return true;
	}
}

Table.fromJSON = function(json) {
	return new Table(json.title, json.author, json.id, json.fields)
}

module.exports = Table;