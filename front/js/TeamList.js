

let teamListContainer = document.getElementsByClassName("TeamList")[0];

Team.loadList(function (list){
	for(let team of list) {
		//let teamEntry = document.createElement("div");
		let teamSpoiler = document.createElement("details");
		let teamTitle = document.createElement("summary");
		let grades = document.createElement("button");
		let teamEdit = document.createElement("button");
		let teamDelete = document.createElement("button");

		teamSpoiler.append(teamTitle);
		for(let member of team.members) {
			let teamMember = document.createElement("div");
			teamMember.innerText = member;
			teamSpoiler.append(teamMember);
		}

		//teamEntry.className = "TeamListEntry";
		teamTitle.className = "TeamListTeamTitle";
		grades.className = "TeamGradesButton";
		teamEdit.className = "TeamEditButton";
		teamDelete.className = "TeamDeleteButton";

		teamTitle.innerText = team.title;
		grades.innerText = "Grades";
		teamEdit.innerText = "Edit";
		teamDelete.innerText = "Delete";
		
		grades.onclick = function() {window.location = `grades.html?teamID=${team.id}`};
		teamEdit.onclick = function() {window.location = `/teamedit.html?id=${team.id}`};
		teamDelete.onclick = function(){teamSpoiler.remove(); grades.remove(); teamEdit.remove(); teamDelete.remove(); team.delete();};

		teamListContainer.append(teamSpoiler, grades, teamEdit, teamDelete);
		//teamListContainer.appendChild(teamEntry);
	}
});