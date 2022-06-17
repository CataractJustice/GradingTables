const crypto = require('crypto');

class TableField {
	title;
	grade;
	maxGrade;
	weight;
	minAcceptable;
	id;

	constructor(title, weight, maxGrade = 1, minAcceptable = 0, id) {
		this.title = title;
		this.maxGrade = maxGrade;
		this.weight = weight;
		this.grade = 0;
		this.minAcceptable = minAcceptable;
		this.id = id ? id : crypto.randomUUID();
	}
}

TableField.fromJSON = function(json) {
	new TableField(json.title, json.weight, json.maxGrade, json.minAcceptable, json.id)
}