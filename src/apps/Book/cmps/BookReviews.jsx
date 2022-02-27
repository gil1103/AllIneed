import React, {useEffect, useState} from 'react';
import './BookReviews.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


export const BookReviews = ({book, onlyStars, closeReviews}) => {
  const emptyStar = <FontAwesomeIcon icon={['far', 'star']} />;
  const solidStar = <FontAwesomeIcon icon={['fas', 'star']} color='#f18e0c' />;
  const solidStarsArr = Array(5).fill(solidStar);
  const [avgReview, setAvgReview] = useState();

  useEffect(() => {
    if(book.reviews){
      const accRating = book.reviews.reduce((totalReviews, review) => {
        return totalReviews += review.rate;
      }, 0);
      setAvgReview(Math.round(accRating / book.reviews.length));
    }
  }, [book, onlyStars, book.reviews]);


  return (
    <section className="book-reviews">
      {!onlyStars && book.reviews?.length > 0 && <h2 className="reviews-title">REVIEWS</h2>}
      {!onlyStars && book?.reviews && book.reviews.map((review, idx) => {
        return (
          <div key={idx} className="reviews-container">
            <span>
              {solidStarsArr.map((solidStar, i) => {
                return (
                  <span key={i}>
                    {(i < review.rate) ? solidStar : emptyStar}
                  </span>
                );
              })}
            </span>
            <h4>{review.fullName}</h4>
          </div>
        );
      })}

      {onlyStars && book.averageRating && solidStarsArr.map((star, i) => {
        return (
          <span key={i}>
            {(i < book.averageRating) ? star : emptyStar}
          </span>
        );
      })}
      {onlyStars && !book.averageRating && solidStarsArr.map((star, i) => {
        return (
          <span key={i}>
            {(i < avgReview) ? star : emptyStar}
          </span>
        );
      })}

      {onlyStars && book.reviews?.length > 0 && <span className="reviews-count">{book.reviews.length} product ratings</span>}
    </section>
  );
};
