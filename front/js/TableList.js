
let tableListContainer = document.getElementsByClassName("TableList")[0];

Table.loadList(function (list){
	for(let table of list) {
		//let tableEntry = document.createElement("div");
		let tableTitle = document.createElement("span");
		let tableEdit = document.createElement("button");
		let tableDelete = document.createElement("button");

		//tableEntry.className = "TableListEntry";
		tableTitle.className = "TableListTableTitle";
		tableEdit.className = "TableEditButton";
		tableDelete.className = "TableDeleteButton";

		tableTitle.innerText = table.title;
		tableEdit.innerText = "Edit";
		tableDelete.innerText = "Delete";

		tableEdit.onclick = function() {window.location = `/tableedit.html?id=${table.id}`};
		tableDelete.onclick = function(){tableTitle.remove(); tableEdit.remove(); tableDelete.remove(); table.delete();};

		tableListContainer.append(tableTitle, tableEdit, tableDelete);
		//tableListContainer.appendChild(tableEntry);
	}
});