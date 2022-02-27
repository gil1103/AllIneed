import { utilService } from '../../../services/utilService.js';
import { storageService } from '../../../services/storageService.js';

export const keepService = {
	query,
	toggleCheck,
	uploadImage,
	modifyColor,
	addNewTodo,
	getNoteById,
	deleteItem,
	editItemTxt,
	deleteMedia,
	deleteCanvas,
	editTitle,
	filterNotes,
	addNewNote,
	deleteNote,
	addDimToObj,
	toggleIsPinned
};

const KEY = 'notesDB';
let gNotes;
_createNotes();

function _createNotes() {
	gNotes = storageService.loadFromStorage(KEY);
	if (!gNotes || !gNotes.length) {
		gNotes = _getDemoNotes();
		_saveNotesToStorage();
	}
}

function query() {
	return gNotes;
}

function toggleCheck(noteId, itemId) {
	const noteIdx = findIdxById(noteId);
	const notes = [...gNotes];
	const itemIdx = notes[noteIdx].items.findIndex((item) => item.id === itemId);
	notes[noteIdx].items[itemIdx].isChecked =
		!notes[noteIdx].items[itemIdx].isChecked;
	gNotes = notes;
	_saveNotesToStorage();
}

function findIdxById(noteId) {
	return gNotes.findIndex((note) => note.id === noteId);
}

function getNoteById(noteId) {
	return gNotes.filter((note) => note.id === noteId);
}

function deleteNote(noteId) {
	let notes = [...gNotes];
	notes = notes.filter((note) => note.id !== noteId);
	gNotes = notes;
	_saveNotesToStorage();
	return gNotes;
}

function deleteItem(noteId, itemId) {
	const notes = [...gNotes];
	const noteIdx = findIdxById(noteId);
	let items = notes[noteIdx].items;
	notes[noteIdx].items = items.filter((item) => item.id !== itemId);
	gNotes = notes;
	_saveNotesToStorage();
	return notes[noteIdx].items;
}

function filterNotes(searchTerm) {
	let filteredNotes = [...gNotes];
	filteredNotes = filteredNotes.filter((note) => {
		return deepSearch(note, searchTerm);
	});
	return filteredNotes;
}

function deepSearch(obj, valToSearch) {
	for (let child of Object.values(obj)) {
		if (typeof child === 'object') {
			if (deepSearch(child, valToSearch)) return true;
		} else {
			if (typeof child === 'string') {
				const isValInObj = child
					.toLowerCase()
					.includes(valToSearch.toLowerCase());
				if (isValInObj) {
					return true;
				}
			}
		}
	}
	return false;
}

function deleteMedia(noteId, fileType) {
	const notes = [...gNotes];
	const noteIdx = findIdxById(noteId);
	if (fileType === 'image' || fileType === 'video') {
		notes[noteIdx].uploadedFile = {};
	}
	gNotes = notes;
	_saveNotesToStorage();
}

function deleteCanvas(noteId) {
	const notes = [...gNotes];
	const noteIdx = findIdxById(noteId);
	notes[noteIdx].canvasDrawing = {};
	gNotes = notes;
	_saveNotesToStorage();
}

function editItemTxt(noteId, itemId, updatedTxt) {
	const notes = [...gNotes];
	const noteIdx = findIdxById(noteId);
	let items = notes[noteIdx].items;
	const itemIdx = items.findIndex((item) => item.id === itemId);
	notes[noteIdx].items[itemIdx].txt = updatedTxt;
	gNotes = notes;
	_saveNotesToStorage();
}

function editTitle(noteId, noteTitle) {
	const notes = [...gNotes];
	const noteIdx = findIdxById(noteId);
	notes[noteIdx].info.title = noteTitle;
	gNotes = notes;
	_saveNotesToStorage();
}

function toggleIsPinned(noteId) {
	const notes = [...gNotes];
	const noteIdx = findIdxById(noteId);
	notes[noteIdx].isPinned = !notes[noteIdx].isPinned;
	gNotes = notes;
	_saveNotesToStorage();
}

function uploadImage(file, noteId, imageType) {
	let notes = [...gNotes];
	const noteIdx = notes.findIndex((note) => note.id === noteId);
	if (imageType === 'isBgImage') {
		const fileUrl = file.url;
		const fileType = file.resource_type === 'image' ? 'image' : 'video';
		const publicId = file.public_id;
		const fileId = utilService.makeId();
		const uploadedFile = {
			fileType,
			fileUrl,
			publicId,
			fileId,
			imageType
		};
		notes[noteIdx].uploadedFile = uploadedFile;
	} else if (imageType === 'isCanvasUploaded' || imageType === 'imageUrl') {
		notes[noteIdx].canvasDrawing.uploadedImage = file.url;
	} else if (imageType === 'canvasDrawing') {
		notes[noteIdx].canvasDrawing.drawnImage = file;
	}
	gNotes = notes;
	_saveNotesToStorage();
}

function modifyColor(bgColor, noteId) {
	let notes = [...gNotes];
	const noteIdx = notes.findIndex((note) => note.id === noteId);
	notes[noteIdx].style.backgroundColor = bgColor;
	gNotes = notes;
	_saveNotesToStorage();
}

function addNewTodo(newTodoTxt, noteId) {
	let notes = [...gNotes];
	const noteIdx = notes.findIndex((note) => note.id === noteId);
	const newTodoItem = {
		id: utilService.makeId(),
		txt: newTodoTxt,
		isChecked: false
	};
	notes[noteIdx].items = [...notes[noteIdx].items, newTodoItem];
	gNotes = notes;
	_saveNotesToStorage();
	return newTodoItem;
}

function addDimToObj(noteId, noteDimensions) {
	const { noteWidth, noteHeight } = noteDimensions;
	let notes = [...gNotes];
	const noteIdx = notes.findIndex((note) => note.id === noteId);
	notes[noteIdx].noteDimensions = { noteWidth, noteHeight };
	gNotes = notes;
	_saveNotesToStorage();
}

function addNewNote(type) {
	const newNote = {
		id: utilService.makeId(),
		isPinned: false,
		type: type,
		uploadedFile: {},
		canvasDrawing: {
			drawnImage: '',
			uploadedImage: ''
		},
		info: {
			title: ''
		},
		style: {
			backgroundColor: '#9ff59f'
		},
		items: []
	};
	let notes = [...gNotes, newNote];
	gNotes = notes;
	_saveNotesToStorage();
	return newNote;
}

function _saveNotesToStorage() {
	storageService.saveToStorage(KEY, gNotes);
}

function _getDemoNotes() {
	const demoNotes = [
		{
			id: utilService.makeId(),
			isPinned: false,
			type: 'NoteTodo',
			uploadedFile: {},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: 'Current mission'
			},
			style: {
				backgroundColor: '#9ff59f'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: 'Being a fullstack master!',
					isChecked: true
				},
				{
					id: utilService.makeId(),
					txt: 'Backend proficiency',
					isChecked: false
				}
			]
		},
		{
			id: utilService.makeId(),
			isPinned: true,
			type: 'NoteTodo',
			uploadedFile: {
				fileId: 'GrXenY',
				fileType: 'video',
				fileUrl:
					'http://res.cloudinary.com/dqehfu3kx/video/upload/v1645955754/keepapp/doscmlldkoqhdkctrjq6.mp4',
				imageType: 'isBgImage',
				publicId: 'keepapp/doscmlldkoqhdkctrjq6'
			},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: "Mom's birthday tommorow"
			},
			style: {
				backgroundColor: '#fefdca'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: 'play her favorite video',
					isChecked: false
				},
				{
					id: utilService.makeId(),
					txt: 'remind everyone to call her',
					isChecked: false
				}
			]
		},
		{
			id: utilService.makeId(),
			isPinned: false,
			type: 'NoteTodo',
			uploadedFile: {},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: 'Scrum master:'
			},
			style: {
				backgroundColor: 'lightsteelblue'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: 'Complete PMP course on the Technion',
					isChecked: true
				},
				{
					id: utilService.makeId(),
					txt: 'Being a certified scrum master',
					isChecked: true
				},
				{
					id: utilService.makeId(),
					txt: 'Complete PMP exam',
					isChecked: false
				}
			]
		},
		{
			id: utilService.makeId(),
			isPinned: true,
			type: 'NoteTodo',
			uploadedFile: {
				fileType: 'image',
				fileUrl:
					'http://res.cloudinary.com/dqehfu3kx/image/upload/v1645954377/keepapp/dwgrwflvqwfi9ta6skht.jpg',
				publicId: 'keepapp/dwgrwflvqwfi9ta6skht',
				fileId: 'ujnTB2',
				imageType: 'isBgImage'
			},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: "Don't forget:"
			},
			style: {
				backgroundColor: 'lightsteelblue'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: 'Enjoy The Journey',
					isChecked: false
				},
				{
					id: utilService.makeId(),
					txt: 'Eat good',
					isChecked: true
				},
				{
					id: utilService.makeId(),
					txt: 'Take a nap',
					isChecked: false
				}
			]
		},
		{
			id: utilService.makeId(),
			isPinned: false,
			type: 'NoteTodo',
			uploadedFile: {},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: "Riding eating and drinking"
			},
			style: {
				backgroundColor: 'lightsteelblue'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: 'keep on doing sport twice a week',
					isChecked: false
				},
				{
					id: utilService.makeId(),
					txt: 'Eat healthy food',
					isChecked: true
				},
				{
					id: utilService.makeId(),
					txt: 'Drink red wine every night',
					isChecked: false
				}
			]
		},
		{
			id: utilService.makeId(),
			isPinned: true,
			type: 'NoteTodo',
			uploadedFile: {},
			canvasDrawing: {
				drawnImage:
					'data:image/png;base64,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',
				uploadedImage:
					'http://res.cloudinary.com/dqehfu3kx/image/upload/v1645956933/keepapp/zsnb55pxrl4nbhdo1rfq.jpg'
			},
			info: {
				title: 'My next bikes'
			},
			style: {
				backgroundColor: 'lightsteelblue'
			},
			items: [
			]
		},
		{
			id: utilService.makeId(),
			isPinned: false,
			type: 'NoteTodo',
			uploadedFile: {},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: "Being a pro"
			},
			style: {
				backgroundColor: 'lightsteelblue'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: 'Read whenever you can',
					isChecked: false
				},
				{
					id: utilService.makeId(),
					txt: 'Watch relevant playlist',
					isChecked: true
				},
				{
					id: utilService.makeId(),
					txt: 'Work hard to achieve your goals',
					isChecked: false
				}
			]
		},
		{
			id: utilService.makeId(),
			isPinned: false,
			type: 'NoteTodo',
			uploadedFile: {},
			canvasDrawing: {
				drawnImage: '',
				uploadedImage: ''
			},
			info: {
				title: `Manager: welcome all. 
					tell us about what you do in one line`
			},
			style: {
				backgroundColor: 'lightgreen'
			},
			items: [
				{
					id: utilService.makeId(),
					txt: "Dev1: I wear glasses because I can't c#. hello everyone, I am a java developer",
					isChecked: false
				},
				{
					id: utilService.makeId(),
					txt: 'Dev2:I wont let anyone see the skies. hello everyone, i am a cloud developer ',
					isChecked: true
				}
			]
		}
	];
	return demoNotes;
}
