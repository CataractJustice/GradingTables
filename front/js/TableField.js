
class TableField {
	title;
	grade;
	maxGrade;
	weight;
	minAcceptable;
	table;

	constructor(title, weight, maxGrade = 1, minAcceptable = 0) {
		this.title = title;
		this.maxGrade = maxGrade;
		this.weight = weight;
		this.grade = 0;
		this.minAcceptable = minAcceptable;
	}

	//returns grade divided by maxGrade and multiplied by weight
	get weightedGrade() {
		return this.grade / this.maxGrade * this.weight;
	}

	get acceptable() {
		return this.grade >= this.minAcceptable;
	} 

	createDOM() {
		let tr = document.createElement("tr");
		
		let title = document.createElement("th");
		title.innerText = this.title;
		title.className = "FieldTitle";
		tr.appendChild(title);

		let weight = document.createElement("th");
		weight.innerText = this.weight;
		weight.className = "FieldWeight";
		tr.appendChild(weight);

		let minAcceptable = document.createElement("th");
		minAcceptable.innerText = this.minAcceptable ? "it is not allowed to defend" : "0";
		minAcceptable.className = "FieldMinAcceptable";
		tr.appendChild(minAcceptable);

		let grade = document.createElement("th");
		grade.className = "FieldGrade";
		
		let gradeSelect = document.createElement("select");
		gradeSelect.className = "FieldGradeSelect";
		for(let i = 0; i <= this.maxGrade; i++) {
			let gradeOption = document.createElement("option");
			gradeOption.value = i;
			gradeOption.innerText = i;
			gradeSelect.appendChild(gradeOption);
		}

		let field = this;

		gradeSelect.onchange = function(e) {
			field.grade = this.value;
			field.table.updateGrade();
		}
		grade.appendChild(gradeSelect);

		tr.appendChild(grade);

		return tr;
	}
}
