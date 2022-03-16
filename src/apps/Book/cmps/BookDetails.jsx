import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useParams, useNavigate} from 'react-router-dom';
import {bookService} from '../services/bookService';
import {BookReviews} from './BookReviews';
import './BookDetails.css';
import onSaleImage from '../images/sale.png';
import {AiOutlineCaretRight, AiFillCaretLeft} from "react-icons/ai";

export const BookDetails = () => {
  const [book, setBook] = useState({});
  const [bookDesc, setBookDesc] = useState();
  const [bookId, setBookId] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [onlyStars, setOnlyStars] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const date = new Date(book.created).toLocaleString();
  const dateLength = date.split(',')[0].length;
  const fixedDate = dateLength === 8 ? date.slice(0, 8) : dateLength === 9 ? date.slice(0, 9) : date.slice(0, 10);

  useEffect(() => {
    const loadBook = async () => {
      setBookId(params.bookId);
      const bookData = await bookService.getBookById(bookId);
      bookData ? setBook(bookData) : setBook({});
      bookData ? setBookDesc(bookData.description) : setBook([]);

    };
    loadBook();
  }, [book, params.bookId, bookId, onlyStars, bookDesc]);

  const toggleStars = () => {
    if (book.reviews?.length > 0) setOnlyStars(!onlyStars);
  };

  const onPagination = async (val) => {
    val = +val;
    const newBookId = await bookService.getBookIdToRender(bookId, val);
    navigate(`/book/${ newBookId }`);
  };

  return (
    <section className="book-container">
      {book.length === 0 && <h1>Loading...</h1>}
      <div className="books-pagination">
        <AiFillCaretLeft onClick={() => onPagination('-1')} />
        <AiOutlineCaretRight onClick={() => onPagination('1')} />
      </div>
      <div className="book-details">
        <div className="image-container">
          <img className="book-img" src={book.imgUrl} alt="" />
          {book.isOnSale && <img className="onsale-img" src={onSaleImage} alt="" />}
          {/* <h3 className="reading-mode">{book.readingLength}</h3> */}
        </div>
        <div className="book-info">
          <h1 className="book-details-title">{book.title}</h1>
          <h2 className="book-author">by {book.author}</h2>
          <div className="book-reviews-container" onClick={toggleStars}>
            {onlyStars && <BookReviews onlyStars={onlyStars} book={book} />}
            {!onlyStars && <BookReviews onlyStars={onlyStars} book={book} />}
          </div>
          <h3>Publication date: {fixedDate}</h3>
          <h4>Price: ${book.price}</h4>
          <Link to={`/book/${ book.id }/addreview`}>Write a review</Link>
          <div className="description-container">
            <span className="about-product">About this product</span>
            <span className="product-info">Product Information</span>
            <p>{bookDesc && bookDesc.slice(0, 30)}
              {!showMore && <span className="show-more" onClick={() => setShowMore(true)}> ... Show more</span>}
              {showMore && bookDesc && <span className="more-text">{bookDesc.slice(30)}</span>}
              {showMore && <span className="show-less" onClick={() => setShowMore(false)}> ... Show less</span>}
            </p>
          </div>
        </div>
      </div>
      <a className="Back-to-list" href={'/book'} >Back to list</a>
    </section>
  );
};
