import React from 'react';
import {Link} from 'react-router-dom';

import './BookPreview.css';

export const BookPreview = ({book}) => {
  return (
    <Link to={`/book/${ book.id }`}>
      <div className="book-preview">
        <h1 className="book-title">{book.title}</h1>
        <img className="book-image" src={book.imgUrl} alt="" />
        <h3 className="book-price">{book.price}$</h3>
      </div>
    </Link>
  );
};
