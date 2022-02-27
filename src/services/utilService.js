export const utilService = {
	makeId,
	shortenText,
	changeStempToDate,
	getRandomIntInclusive
};

function makeId(length = 6) {
	var txt = '';
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return txt;
}

function shortenText(text, requireLength) {
	if (text.length < 20) return text;
	// const shortened = text.slice(0, requireLength);
	return text.substring(0, requireLength) + '...';
}

function changeStempToDate(timeStamp) {
	const newDate = Date.now();
	const diff = newDate - timeStamp;
	let days = Math.floor(diff / (1000 * 60 * 60 * 24));
	let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	// let seconds = Math.floor((diff % (1000 * 60)) / 1000);
	const notMilliSecTime = new Date(timeStamp * 1000);
	if (days > 0) {
		let date = notMilliSecTime.toLocaleString('en-US', { day: '2-digit' });
		date += ' ' + notMilliSecTime.toLocaleString('en-US', { month: 'short' });
		return date;
	}
	if (hours > 0) {
		let date = hours < 10 ? '0' + hours : hours;
		date += minutes < 10 ? ':0' + minutes : ':' + minutes;
		date += hours < 10 ? ' AM' : ' PM';
		return date;
	} else {
		return 'Now';
	}
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// function getDefaultDate() {
// 	return new Intl.DateTimeFormat('en', {
// 		dateStyle: 'short',
// 		timeZone: 'Asia/Jerusalem'
// 	}).format(Date.now());
// }

// function defaultTime() {
// 	new Intl.DateTimeFormat('en', {
// 		timeStyle: 'short',
// 		timeZone: 'Asia/Jerusalem'
// 	}).format(Date.now());
// }
