
class TableField {
	title;
	grade;
	maxGrade;
	weight;
	minAcceptable;

	constructor(title, weight, maxGrade = 1, minAcceptable = 0) {
		this.maxGrade = maxGrade;
		this.weight = weight;
		this.grade = 0;
		this.minAcceptable = minAcceptable;
	}
}