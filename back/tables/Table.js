/*
	Table name
*/


class Table {
	//public
	title;
	fields;
	#author;

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

	//private
	#id;
}