import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {bookService} from '../services/bookService';
import {eventBusService} from '../../../services/eventBusService';
import './AddReview.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


export const AddReview = () => {
  const [book, setBook] = useState({});
  const [bookId, setBookId] = useState(null);
  const [onOverItem, setOnOverItem] = useState('');
  const [reviewInfo, setReviewInfo] = useState({
    fullName: '', rate: '', body: '', reviewtitle: ''
  });
  const params = useParams();
  let navigate = useNavigate();

  const emptyStar = <FontAwesomeIcon icon={['far', 'star']} size="2x" />;
  const solidStar = <FontAwesomeIcon icon={['fas', 'star']} color='#f18e0c' size="2x" />;
  const emptyStarsArr = Array(5).fill(emptyStar);

  useEffect(() => {
    const loadBook = async () => {
      setBookId(params.bookId);
      const bookData = await bookService.getBookById(bookId);
      bookData ? setBook(bookData) : setBook([]);
    };
    loadBook();
  }, [book, params.bookId, bookId]);

  const onRate = (i) => {
    setReviewInfo(oldValues => ({...oldValues, 'rate': i + 1}));
    setOnOverItem(i);
  };

  const onMouseLeaveHandler = (ev) => {
    ev.preventDefault();
    if (!reviewInfo.rate) setOnOverItem(0);
  };

  const onAddReview = async (ev) => {
    ev.preventDefault();
    await bookService.addReview(bookId, reviewInfo);
    navigate(`/book/${ bookId }`);
    eventBusService.emit('showMsg', 'Review Added');
  };

  const onInputChange = ({target: {value, type, name}}) => {
    value = type === "number" ? +value : value;
    setReviewInfo(oldValues => ({...oldValues, [name]: value}));
  };

  return (
    <form className="review-form" onSubmit={onAddReview}>
      <h2 className="rate-and-review">RATE AND REVIEW</h2>
      <h1 className="addreview-book-title">{book.title}</h1>
      <div className="rate-container">
        <h2 className="rate-product">Rate this product</h2>
        <ul className="stars-container">
          {emptyStarsArr.map((emptyStar, i) => {
            return (
              <li key={i} onMouseOver={() => setOnOverItem(i)}
                onClick={() => onRate(i)}
                onMouseLeave={onMouseLeaveHandler}
              >
                {onOverItem === '0' ? solidStar : (i > onOverItem) ? emptyStar : solidStar}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="fullname-container">
        <label htmlFor="fullName">Your name</label>
        <input type="text" autoFocus
          id="fullName"
          placeholder="Full name"
          name="fullName"
          value={reviewInfo.name}
          onChange={onInputChange}
        />
      </div>
      <div className="product-review-container">
        <label htmlFor="comment">Write your product review</label>
        <textarea id="comment" cols="90" rows="10" name="body" value={reviewInfo.name}
          placeholder="Describe the pros, cons, and other highlights"
          onChange={onInputChange} >
        </textarea>
      </div>
      <div className="product-review-container">
        <label htmlFor="reviewtitle">Review title</label>
        <input type="text"
          id="reviewtitle"
          placeholder="Sum it up in a few words"
          name="reviewtitle"
          value={reviewInfo.reviewtitle}
          onChange={onInputChange}
        />
      </div>
      <div className="addReview-action-btns">
        <a className="cancel-addReview" href={`/book/${ book.id }`} >Cancel</a>
        <button className="add-review-btn" type="submit">Submit</button>
      </div>
    </form>
  );
};
