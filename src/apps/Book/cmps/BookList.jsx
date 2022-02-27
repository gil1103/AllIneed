import React from 'react';
import './BookList.css';
import { BookPreview } from "./BookPreview";


export const BookList = ({books}) => {
  return (
    <section className="book-list">
      {books.map(book => {
        return (
          <BookPreview key={book.id} book={book} />
        );
      })}
    </section>
  );
};

