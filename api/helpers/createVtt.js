const fs = require('fs');
const path = require('path');

/** @description Receive a JSON object, creates vtt format */
module.exports.parseVtt = data => {
	fs.appendFileSync(path.join(__dirname, 'subOut.vtt'), buildOutput(data));
};

/** @description Receives time in ms, converts to 00:00:000 */
const convertTime = time => {
	let seconds = Math.trunc(time / 1000);
	let minutes = Math.trunc(seconds / 60);
	let milliSeconds = ((time / 1000) % 1).toFixed(3);
	seconds = seconds % 60;
	seconds < 10 && (seconds = '0' + seconds);
	minutes < 10 && (minutes = '0' + minutes);

	let str = `${minutes}:${seconds}.${milliSeconds.slice(2)}`;
	return str;
};

/** @description Builds VTT type string */
const buildOutput = data => {
	let startTime = convertTime(data.time);
	let endTime = convertTime(data.time + data.duration);
	let text = data.text;
	let output = `${startTime} --> ${endTime}\n- ${text}\n\n`;
	return output;
};
