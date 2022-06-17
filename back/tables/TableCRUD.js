let DB = require('../DB');
const User = require('../users/User');
const Table = require('../tables/Table');

function TableCreate(req, res) {
	let table = new Table(req.body.title, req.user.id);
	DB.tables.set(table);

	res.redirect(`tableedit.html?id=${table.id}`);
}

function TableList(req, res) {
	DB.tables.getList(req.user).then(function(list){res.send(list)});
}

function TableRead(req, res) {
	DB.tables.get(req.body.id).then(function(t){res.send(t);});
}

function TableUpdate(req, res) {
	//TO-DO: check if user can edit table\
	let tablejson;
	try {
		tablejson = JSON.parse(req.body.table);
		DB.tables.get(tablejson.id).then(function(table) {
			if(table)
				DB.tables.set(new Table(table.title, table.author, table.id, tablejson.fields));
		});
	} catch (err) {
		console.log(err);
	}

	res.redirect(`/tableedit.html?id=${tablejson.id}`);
}

function TableDelete(req, res) {
	DB.tables.delete(req.body.id);
}

module.exports = {TableCreate, TableList, TableRead, TableUpdate, TableDelete};