import { utilService } from '../../../services/utilService.js';
import { storageService } from '../../../services/storageService.js';
export const bookService = {
	query,
	getBookById,
	addReview,
	getBookIdToRender,
	filterBooks
};

const axios = require('axios');
const KEY = 'bookDB';
let gBooks = [];
// let gFilterBy = 'all';

const gBooksCategories = [
	{ category: 'Fantasy' },
	{ category: 'Fiction' },
	{ category: 'Photography' },
	{ category: 'History' },
	{ category: 'Education' },
	{ category: 'Art' },
	{ category: 'Adventure' }
];

_createBooks();

async function _createBooks() {
	try {
		gBooks = storageService.loadFromStorage(KEY);
		if (!gBooks || gBooks.length === 0) {
			const allCategoriesBooks = await _getDemoBooks();
			gBooks = allCategoriesBooks.reduce((generalList, bookCat) => {
				return generalList.concat(bookCat.categoryBookList);
			}, []);

			//remove duplications
			gBooks = uniq(gBooks);
			_saveBooksToStorage();
		}
	} catch (err) {
		console.error(err);
	}
}

function uniq(arr) {
	return [...new Map(arr.map((v) => [v.id, v])).values()];
}

function _saveBooksToStorage() {
	storageService.saveToStorage(KEY, gBooks);
}

function query(booksToShow) {
	if (!booksToShow) return gBooks;
	if (booksToShow === 'bestsellers')
		return gBooks.filter((book) => {
			return book.isBestSeller;
		});
	else
		return gBooks.filter((book) => {
			return book.categories.includes(booksToShow);
		});
}

function addReview(bookId, reviewInfo) {
	const book = getBookById(bookId);
	if (book.reviews) {
		book.reviews.push(reviewInfo);
	} else {
		book.reviews = [];
		book.reviews.push(reviewInfo);
	}
	const bookIdx = getIndexById(bookId);
	const books = [...gBooks.slice(0, bookIdx), book, ...gBooks.slice(bookIdx)];
	gBooks = books;
	_saveBooksToStorage();
}

function getBookById(bookId) {
	return gBooks?.find((book) => {
		return book.id === bookId;
	});
}

function getIndexById(bookId) {
	return gBooks.findIndex((book) => book.id === bookId);
}

function getBookIdToRender(bookId, val) {
	const bookIdx = getIndexById(bookId);
	const newIndex = bookIdx + val;
	if (newIndex < 0 || newIndex > gBooks.length - 1) return gBooks[bookIdx].id;
	const bookToRender = gBooks[newIndex];
	return bookToRender.id;
}

function filterBooks(searchTerm) {
	let filteredBooks = [];
	if (searchTerm.identifier === 'filterBy') {
		filteredBooks = gBooks.filter((book) => {
			const filterByOpt = searchTerm.filterBy;
			return book.category
				.toLocaleString().toLowerCase()
				.includes(filterByOpt.toLowerCase());
		});
	} else {
		filteredBooks = gBooks.filter((book) => {
			return Object.values(book)
				.join(' ')
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		});
	}
	return filteredBooks;
}

async function _getDemoBooks() {
	return gBooksCategories.reduce(async (allBookCategories, book) => {
		const category = book.category;
		const categoryBookList = await getCategoryList(category);
		const allCat = await allBookCategories;
		const bookToAdd = {
			categoryBookList,
			category
		};
		await allCat.push(bookToAdd);
		return allCat;
	}, Promise.resolve([]));
}

function getRandomCategory() {
	const pos = utilService.getRandomIntInclusive(0, gBooksCategories.length - 1);
	return gBooksCategories[pos];
}

async function getCategoryList(category) {
	// const res = await fetch(
	// 	'https://www.googleapis.com/books/v1/volumes?q=subject:fantasy'
	// 	// `https://www.googleapis.com/books/v1/volumes?q=subject:${category}`
	// );
	// let result = await res.json();
	const res = await axios.get(
		`https://www.googleapis.com/books/v1/volumes?q=subject:${category}`
	);
	let result = res.data;
	let volumeInfo;
	let books = [];
	for (let i = 0; i < result.items.length; i++) {
		volumeInfo = result.items[i].volumeInfo;
		books[i] = {
			id: result.items[i].id,
			title: volumeInfo.title,
			author: volumeInfo.authors ? volumeInfo.authors : '',
			description: volumeInfo.description,
			category: volumeInfo.categories
				? volumeInfo.categories[0]
				: getRandomCategory(),
			rate: utilService.getRandomIntInclusive(1, 5),
			imgUrl: volumeInfo.imageLinks?.thumbnail,
			created: volumeInfo.publishedDate,
			price: utilService.getRandomIntInclusive(39.99, 99.99),
			averageRating: volumeInfo.averageRating,
			isOnSale: '',
			// get onSale(){
			// 	return this.price > 90?true:false
			// },
			readingLength:
				volumeInfo.pageCount > 500
					? 'Long Reading'
					: volumeInfo.pageCount > 200
					? 'Decent Reading'
					: 'Light Reading',
			isBestSeller: volumeInfo.averageRating * volumeInfo.ratingsCount > 240
		};
		books[i].isOnSale = books[i].price > 90;
	}
	return Promise.resolve(books);
}
















// for (const [i, categoryBooks] of allCategoriesBooks.entries()) {
// 	switch (categoryBooks.category) {
// 		case 'Fantasy':
// 			gFantasyBooks = categoryBooks.categoryBookList;
// 			break;
// 		case 'Fiction':
// 			gFictionBooks = categoryBooks.categoryBookList;
// 			break;
// 		case 'Photography':
// 			gPhotographyBooks = categoryBooks.categoryBookList;
// 			break;
// 		case 'History':
// 			gHistoryBooks = categoryBooks.categoryBookList;
// 			break;
// 		case 'Education':
// 			gEducationBooks = categoryBooks.categoryBookList;
// 			break;
// 		case 'Art':
// 			gArtBooks = categoryBooks.categoryBookList;
// 			break;
// 		case 'Adventure':
// 			gAdventureBooks = categoryBooks.categoryBookList;
// 			break;
// 		default:
// 			return;
// 	}
// 	const key = categoryBooks.category;
// 	const list = categoryBooks.categoryBookList;

// let books = [];
// 	books[i] = { key, list };
// }
// console.log(gBooks);
// gBooks = books.reduce((generalList, bookCat) => {
// 	return generalList.concat(bookCat.list);
// }, []);
