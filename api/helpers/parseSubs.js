module.exports.parseSubs = data => {
	const regex = /\\N/g;
	data.text = data.text.replace(regex, '\n');
	return data;
};
