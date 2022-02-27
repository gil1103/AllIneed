import React, {useState, useEffect} from 'react';
import {Filter} from '../../cmps/Filter';
import {BookList} from './cmps/BookList';
import {bookService} from './services/bookService';


export const BookApp = () => {
  const [booksData, setBooksData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isFiltered, setIsFilter] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await bookService.query();
      books ? setBooksData(books) : setBooksData([]);
    };
    fetchBooks();
  }, [booksData]);

  const onFilterBy = async (filterBy) => {
    if (filterBy === "all") setIsFilter(false);
    else setIsFilter(true);
    const filterByObj = {identifier: 'filterBy', filterBy};
    const books = await bookService.filterBooks(filterByObj);
    setFilteredBooks(books);
  };

  const searchHandler = async (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const books = await bookService.filterBooks(searchTerm);
      setFilteredBooks(books);
    }
  };

  return (
    <section className="book-app">
      {booksData.length === 0 && <h1>...Loading</h1>}
      <Filter term={searchTerm} searchKeyword={searchHandler} filterBy={onFilterBy} isBook={true} />
      <BookList books={(searchTerm.length > 0 || isFiltered) ? filteredBooks : booksData} />
    </section>
  );
};
