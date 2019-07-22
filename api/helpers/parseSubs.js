module.exports.parseSubs = data => {
	const regex = /\\N/g;
	const styleRegex = /({.*?})/g;
	data.text = data.text.replace(regex, '\n');
	data.text = data.text.replace(styleRegex, '');
	return data;
};
