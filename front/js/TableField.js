class TableField {
	title;
	grade;
	maxGrade;
	weight;
	minAcceptable;
	id;
	#table;
	#index;

	get table (){
		return this.#table;
	}

	set table (table){
		this.#table = table; 
	}
	
	set index (i) {
		this.#index = i;
	}

	get index() {
		return this.#index;
	}

	constructor(title, weight, maxGrade = 1, minAcceptable = 0, id) {
		this.title = title;
		this.maxGrade = maxGrade;
		this.weight = weight;
		this.grade = 0;
		this.minAcceptable = minAcceptable;
		this.id = id;
	}

	//returns grade divided by maxGrade and multiplied by weight
	get weightedGrade() {
		return this.grade / this.maxGrade * this.weight;
	}

	get acceptable() {
		return this.grade >= this.minAcceptable;
	} 

	createDOM(gradeEdit) {
		let tableEdit = !gradeEdit;
		
		//create requirement row
		let tr = document.createElement("tr");
		//requirement description cell
		let title = document.createElement("th");
		let weight = document.createElement("th");
		let minAcceptable = document.createElement("th");

		title.className = "FieldTitle";
		weight.className = "FieldWeight";
		minAcceptable.className = "FieldMinAcceptable";

		if(tableEdit) {
			let controllsContainer = document.createElement("div");
			let moveControlls = document.createElement("div");
			let deleteButton = document.createElement("button");
			deleteButton.innerText = "🗑️";
			let field = this;
			deleteButton.onclick = function() {
				if(confirm("Are you sure you want to delete this requirement?")) {
				field.table.removeField(field.index);
				field.table.updateDOM();
				}
			};

			let moveupButton = document.createElement("button");
			moveupButton.innerText = "▲";
			moveupButton.onclick = function() {
				field.table.removeField(field.index);
				field.table.insertField(field, field.index-1)
				field.table.updateDOM();
			};

			let movedownButton = document.createElement("button");
			movedownButton.innerText = "▼";
			movedownButton.onclick = function() {
				field.table.removeField(field.index);
				field.table.insertField(field, field.index+1)
				field.table.updateDOM();
			};
			moveControlls.append(moveupButton, movedownButton);
			controllsContainer.append(moveControlls, deleteButton);
			title.append(controllsContainer);
			controllsContainer.className = "FieldControlls";
			moveControlls.className = "FieldMoveControlls";
			movedownButton.className = "FieldMoveControlls";
			moveupButton.className = "FieldMoveControlls";

			let requirementInput = document.createElement("textarea");
			let weightInput = document.createElement("input");
			let acceptanceInput = document.createElement("select");
			
			requirementInput.className = "RequirementInput";
			weightInput.className = "WeightInput";
			acceptanceInput.className = "AcceptanceInput";

			requirementInput.value = this.title;
			weightInput.value = this.weight;
			weightInput.type = "number";

			let optionAcceptable = document.createElement("option");
			let optionUnacceptable = document.createElement("option");
			optionAcceptable.value = 0;
			optionUnacceptable.value = 1;
			optionAcceptable.innerText = "0";
			optionUnacceptable.innerText = "It is not allowed to defend";

			if(!this.minAcceptable) optionAcceptable.selected = "selected";
			if(this.minAcceptable) optionUnacceptable.selected = "selected";

			acceptanceInput.appendChild(optionAcceptable);
			acceptanceInput.appendChild(optionUnacceptable);

			title.appendChild(requirementInput);
			weight.appendChild(weightInput);
			minAcceptable.appendChild(acceptanceInput);

			//update resulting grade of a table
			requirementInput.onchange = function(e) {
				field.title = this.value;
			}
			weightInput.onchange = function(e) {
				field.weight = parseFloat(this.value);
				field.table.updateGrade();
			}
			acceptanceInput.onchange = function(e) {
				field.minAcceptable = parseFloat(this.value);
				field.table.updateGrade();
			}

		} else {
			title.innerText = this.title;
			weight.innerText = this.weight;
			minAcceptable.innerText = this.minAcceptable ? "it is not allowed to defend" : "0";
		}



		
		tr.appendChild(title);
		tr.appendChild(weight);
		tr.appendChild(minAcceptable);
		
		let grade = document.createElement("th");
		grade.className = "FieldGrade";
		
		if(gradeEdit) {
			if(this.maxGrade == 1) {
				let gradeCheckbox = document.createElement("input");
				gradeCheckbox.className = "FieldGradeCheckbox";
				gradeCheckbox.type = "checkbox";
				gradeCheckbox.checked = this.grade;

				let field = this;
				gradeCheckbox.oninput = function() {
					field.grade = this.checked ? 1 : 0;
					field.table.updateGrade();
				}
				grade.append(gradeCheckbox);
			} else {
				let gradeSelect = document.createElement("select");
				gradeSelect.className = "FieldGradeSelect";

				//append options to a grade select
				for(let i = 0; i <= this.maxGrade; i++) {
					let gradeOption = document.createElement("option");
					gradeOption.value = i;
					gradeOption.innerText = i;
					gradeOption.selected = i == this.grade;
					gradeSelect.appendChild(gradeOption);
				}
				grade.appendChild(gradeSelect);

				//update resulting grade of a table when the grade is selected
				let field = this;
				gradeSelect.onchange = function(e) {
					field.grade = this.value;
					field.table.updateGrade();
				}
			}
		} 
		if(tableEdit) {
			let gradeInput = document.createElement("input");
			gradeInput.type = "number";
			gradeInput.min = 1;
			gradeInput.value = this.maxGrade;
			gradeInput.className = "MaxGradeInput";
			grade.appendChild(gradeInput);
			let field = this;
			gradeInput.onchange = function() {
				field.maxGrade = Math.max(1, this.value);
				field.grade = Math.min(field.maxGrade, field.grade);
				field.table.updateDOM();
				field.table.updateGrade();
			}
		}
		
		tr.appendChild(grade);

		return tr;
	}
}
