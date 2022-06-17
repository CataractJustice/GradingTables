/*
*/

class Table {
	//public
	title;
	fields;
	saved;

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

	setFieldGradeById(id, grade) {
		this.fields.find(function(field) {return field.id == id}).grade = grade;
	}

	insertField(field, index) {
		field.table = this;
		if(index < 0) index = 0; 
		if(index === undefined)
			index = this.fields.length;
		index = Math.min(this.fields.length, index);
		
		if(index == this.fields.length) {
			this.fields.push(field);
			field.index = index;
			return;
		}

		let buffer = this.fields[index];
		this.fields[index] = field;
		this.insertField(buffer, index + 1);

		for(let i = 0; i < this.fields.length; i++) {
			this.fields[i].index = i;
		}
	}

	removeField(index) {
		while(this.fields[index] = this.fields[++index]);
		this.fields.pop();
		for(let i = 0; i < this.fields.length; i++) {
			this.fields[i].index = i;
		}
	}

	get id() {
		return this.#id;
	};

	get author() {
		return this.#author;
	}
	
	constructor(title, author, id, fields) {
		this.title = title;
		this.#author = author;
		this.#id = id;
		this.fields = [];
		if(fields) {
			for(let field of fields)
				this.insertField(new TableField(field.title, field.weight, field.maxGrade, field.minAcceptable, field.id));
		}
		this.saved = true;
	}

	updateGrade() {
		let sumCell = this.DOM.getElementsByClassName("WeightSumCell")[0];
		let gradeCell = this.DOM.getElementsByClassName("GradeCell")[0];

		sumCell.innerText = this.weightSum;
		
		gradeCell.innerText = Math.round(this.grade * 100) / 100;
		let g = this.grade / this.weightSum;
		gradeCell.style.backgroundColor = `rgb(${parseInt(Math.min(512-g*512, 255))}, ${parseInt(Math.min(g*512, 255))}, 0)`;
		gradeCell.classList.add(this.acceptable ? "GradeCellEvaluated" : "GradeCellNotEvaluated");
		gradeCell.classList.remove(this.acceptable ? "GradeCellNotEvaluated" : "GradeCellEvaluated");
		this.saved = false;
	}

	updateDOM (gradeEdit) {
		let tableEdit = !gradeEdit;

		//create table
		let table = this.#DOM;
		if(!table)
			table = document.createElement("table");
		else
			table.innerHTML = "";

		//create header row
		let header = document.createElement("tr");
		let titleheader = document.createElement("th");
		let weightheader = document.createElement("th");
		let acceptanceheader = document.createElement("th");
		let gradeheader = document.createElement("th");

		titleheader.innerText = "Requirement";
		weightheader.innerText = "If it meets";
		acceptanceheader.innerText = "If not";
		if(tableEdit) gradeheader.innerText = "Grade range";
		if(gradeEdit) gradeheader.innerText = "Result";

		//create grading result
		let gradingrow = document.createElement("tr");
		let sumTitle = document.createElement("th");
		let sumCell = document.createElement("th");
		let emptyCell = document.createElement("th");
		let gradeCell = document.createElement("th");
		
		sumTitle.className = "SumTitle";
		sumTitle.innerText = "Sum:";
		sumCell.className = "WeightSumCell";
		sumCell.innerText = " ";
		gradeCell.className = "GradeCell";
		gradeCell.innerText = " ";
		
		//append columns to a table header
		header.appendChild(titleheader);
		header.appendChild(weightheader);
		header.appendChild(acceptanceheader);
		header.appendChild(gradeheader);
		//append a table header
		table.appendChild(header);
		
		//append requirement rows to a table

		for(let field of this.fields) {
			table.appendChild(field.createDOM(gradeEdit));
		}

		if(tableEdit) {
			let editRow = document.createElement("tr");
			let editCell = document.createElement("th");

			let newFieldButton = document.createElement("button");
			let tableobj = this;
			newFieldButton.innerText = "New requirement";
			newFieldButton.onclick =  function() {
				tableobj.insertField(new TableField("", 1, 1, 0));
				tableobj.updateDOM();
				tableobj.updateGrade();
			}
			editCell.appendChild(newFieldButton);
			editRow.appendChild(editCell);

			table.appendChild(editRow);
		}

		//append grading row
		gradingrow.appendChild(sumTitle);
		gradingrow.appendChild(sumCell);
		gradingrow.appendChild(emptyCell);
		gradingrow.appendChild(gradeCell);
		table.appendChild(gradingrow);

		this.#DOM = table;
		this.saved = false;
	}

	get DOM () {
		if(!this.#DOM) this.updateDOM();
		return this.#DOM;
	}

	copyTemplate() {
		let table = new Table(this.title, this.author);
		for(let field of this.fields) {
			table.insertField(new TableField(field.title, field.weight, field.maxGrade, field.minAcceptable));
		}
		return table;
	}

	async delete() {
		const response = await fetch(window.location.origin + "/tabledelete", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: `{
			"id": "${this.id}"
 			}`,
		});
	}
}

Table.load = async function(id, callback) {
	const response = await fetch(window.location.origin + "/tableread", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: `{
			"id": "${id}"
 			}`,
	});
	
	response.json().then(data => {
		callback(
			new Table(data.title, data.author, data.id, data.fields)
		);
	});
}

Table.loadList = async function(callback) {
	const response = await fetch(window.location.origin + "/tablelist", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});
	
	response.json().then(data => {
		let tables = [];
		for(let json of data) {
			tables.push(new Table(json.title, json.author, json.id, json.fields));
		}
		callback(tables);
	});
}