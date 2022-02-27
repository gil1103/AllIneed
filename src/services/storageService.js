export const storageService = {
	loadFromStorage,
	saveToStorage
};

function loadFromStorage(key) {
	const str = localStorage.getItem(key);
	return JSON.parse(str);
}

function saveToStorage(key, val) {
	const str = JSON.stringify(val);
	localStorage.setItem(key, str);
}