/*
*/

class Table {
	//public
	title;
	fields;

	#author;
	#id;
	#DOM;

	get weightSum() {
		let w = 0;
		for(let field of this.fields)
			w += field.weight;

		return w;
	}

	get grade() {
		let g = 0; 
		for(let field of this.fields)
			g += field.weightedGrade;
		return g;
	}

	get acceptable() {
		for(let field of this.fields)
			if(!field.acceptable) return false;

		return true;
	}

	insertField(field, index) {
		field.table = this;
		if(!index)
			index = this.fields.length;
		index = Math.min(this.fields.length, index);
		
		if(index == this.fields.length) {
			this.fields.push(field);
			return;
		}

		let buffer = this.fields[index];
		this.fields[index] = field;
		this.insertField(field, index + 1);
	}

	get id() {
		return this.#id;
	};

	get author() {
		return this.#author;
	}
	
	constructor(title, author) {
		this.title = title;
		this.#author = author;
		this.fields = [];
	}

	updateGrade() {
		let sumCell = this.DOM.getElementsByClassName("WeightSumCell")[0];
		let gradeCell = this.DOM.getElementsByClassName("GradeCell")[0];

		sumCell.innerText = this.weightSum;
		
		gradeCell.innerText = this.grade;
		gradeCell.classList.add(this.acceptable ? "GradeCellEvaluated" : "GradeCellNotEvaluated");
		gradeCell.classList.remove(this.acceptable ? "GradeCellNotEvaluated" : "GradeCellEvaluated");
	}

	#updateDOM () {
		//create table
		let table = this.#DOM;
		if(!table)
			table = document.createElement("table");
		else
			table.innerHTML = "";

		//create header row
		let header = document.createElement("tr");

		//column titles

		let titleheader = document.createElement("th");
		titleheader.innerText = "Requirement";
		header.appendChild(titleheader);

		let weightheader = document.createElement("th");
		weightheader.innerText = "If it meets";
		header.appendChild(weightheader);

		let acceptanceheader = document.createElement("th");
		acceptanceheader.innerText = "If not";
		header.appendChild(acceptanceheader);

		let gradeheader = document.createElement("th");
		gradeheader.innerText = "Result";
		header.appendChild(gradeheader);
		
		//
		table.appendChild(header);

		//append requirements rows to a table
		for(let field of this.fields) {
			table.appendChild(field.createDOM());
		}
		
		//create grading result
		let gradingrow = document.createElement("tr");
		
		let sumTitle = document.createElement("th");
		sumTitle.className = "SumTitle";
		sumTitle.innerText = "Suma:";
		gradingrow.appendChild(sumTitle);

		let sumCell = document.createElement("th");
		sumCell.className = "WeightSumCell";
		sumCell.innerText = " ";
		gradingrow.appendChild(sumCell);

		let emptyCell = document.createElement("th");
		gradingrow.appendChild(emptyCell);

		let gradeCell = document.createElement("th");
		gradeCell.className = "GradeCell";
		gradeCell.innerText = " ";
		gradingrow.appendChild(gradeCell);

		table.appendChild(gradingrow);

		this.#DOM = table;
	}

	get DOM () {
		if(!this.#DOM) this.#updateDOM();
		return this.#DOM;
	}

	copyTemplate() {
		let table = new Table(this.title, this.author);
		for(let field of this.fields) {
			table.insertField(new TableField(field.title, field.weight, field.maxGrade, field.minAcceptable));
		}
		return table;
	}
}