
async function post(url, data, callback) {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data),
	});
	
	if(callback) {
		response.json().then(data => {
			callback(data);
		});
	}
}