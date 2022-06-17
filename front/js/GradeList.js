let gradeListContainer = document.getElementsByClassName("GradeList")[0];

let tables;

Team.load(getJsonFromUrl().teamID, function(team) {
	let teamTitle = document.getElementsByClassName("TeamDisplayTitle")[0];
	let teamMembers = document.getElementsByClassName("TeamDisplayMembers")[0];
	teamTitle.innerText = team.title;
	for(let member of team.members) {
		let memberEntry = document.createElement("div");
		memberEntry.className = "TeamDisplayMemberEntry";
		memberEntry.innerText = member;
		teamMembers.append(memberEntry);
	}
});

Table.loadList(function(list) {
	let tableSelect = document.getElementsByClassName("NewGradeTableSelect")[0];
	let button = document.getElementsByClassName("NewGradeButton")[0];
	let params = getJsonFromUrl();
	button.onclick = function() {
		window.location=`/gradeedit.html?teamID=${params.teamID}&tableID=${tableSelect.value}`;
	}
	for(let table of list) {
		let option = document.createElement("option");
		option.innerText = table.title;
		option.value = table.id;
		tableSelect.appendChild(option);
	}
	tables = list;
});

post(
	"/gradelist",
	getJsonFromUrl(),
	function (json){
	for(let grade of json) {
		//let gradeEntry = document.createElement("div");
		let tableTitle = document.createElement("span");
		let resultGrade = document.createElement("span");
		let editGrade = document.createElement("button");
		let deleteGrade = document.createElement("button");

		//gradeEntry.className = "GradeListEntry";
		tableTitle.className = "GradeListTableTitle";
		resultGrade.className = "GradeListResultGrade";
		editGrade.className = "GradeEditButton";
		deleteGrade.className = "GradeDeleteButton";

		let table = tables.find(function(t) {return t.id == grade.tableID;});
		if(!table) continue;
		for(let requirement of grade.grades) {
			table.fields.find(function(f){return f.id == requirement.id}).grade = requirement.grade;
		}

		tableTitle.innerText = table.title;
		resultGrade.innerText = ` Result: ${Math.round(table.grade*100) / 100}/${table.weightSum}`;
		editGrade.innerText = "Edit";
		deleteGrade.innerText = "Delete";

		let g = table.grade / table.weightSum;
		resultGrade.style.backgroundColor = `rgb(${parseInt(Math.min(512-g*512, 255))}, ${parseInt(Math.min(g*512, 255))}, 0)`;
		resultGrade.style.textDecoration = table.acceptable ? "" : "line-through";
		
		editGrade.onclick = function() {window.location = `gradeedit.html?teamID=${grade.teamID}&tableID=${grade.tableID}&id=${grade.id}`};
		deleteGrade.onclick = function(){tableTitle.remove(); resultGrade.remove(); editGrade.remove(); deleteGrade.remove(); post("/gradedelete", {id: grade.id});};

		gradeListContainer.append(tableTitle, resultGrade, editGrade, deleteGrade);
		//teamListContainer.appendChild(gradeEntry);
	}
});

