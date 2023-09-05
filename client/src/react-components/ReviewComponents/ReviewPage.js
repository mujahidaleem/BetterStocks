import './ReviewPage.css';
import Comments from './Comments/Comment';
import Statistics from './Statistics/Statistics';
import WriteComment from './WriteComment/WriteComment';
import { Navigate, useSearchParams } from 'react-router-dom';
import { uid } from 'react-uid';
import React, {useState, useEffect} from 'react';
import { getCurrentUser, getReviews, makeReview } from '../../actions/Review';

function ReviewPage() {

  const state = {
    profilePicture:
			"https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg"
  };
  const [IsBlackList, setIsBlackList] = useState()
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState()

  const newComment =  <WriteComment parentCallBack={handleInput} />

  const [params, setParams] = useSearchParams();
  const stock_symbol = params.get('symbol');

  useEffect(() => {
    getCurrentUser(setIsBlackList);
  }, []);

  useEffect(() => {
    const write = document.getElementById("writeComment")
    const message = document.getElementById("blockMessage")
    if (IsBlackList == true){
      write.style.opacity = "0.3"
      message.style.display = "block"
    } else {
      write.style.opacity = "1"
      message.style.display = "none"
    }

  }, [IsBlackList])

  useEffect(() => {
    getReviews(stock_symbol, setReviews);
  }, [params]);

  function handleScroll() {
    window.scrollBy(0,1000)
  }

  function handleInput(text, rate) {
    makeReview(stock_symbol, text, rate, setReviews);
  }

  function renderReviews() {
    return reviews.map(review => <Comments key={ uid(review) } userName={ review.author } displayName={ review.displayName } rate={ review.stars } text={ review.review } profilePicture={state.profilePicture}/>);
  }

  function renderStats() {
    const starCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    reviews.map(review => {
      starCounts[review.stars]++;
    });
    let avg = Object.entries(starCounts).reduce((acc, entry) => acc + (entry[0] * entry[1]), 0) * 1.0 / reviews.length;
    if (reviews.length === 0) {
      avg = 0;
    }

    return <Statistics key={ uid(starCounts) } fiveStar={ starCounts[5] } fourStar={ starCounts[4] } threeStar={ starCounts[3] } twoStar={ starCounts[2] } oneStar={ starCounts[1] } avg={ avg } numComment={ reviews.length } />
  }


    return (
      <div className='all'>
        <div className='allReviews'>
          <div className='reviewHeader'>
                Reviews
          </div>
          <button className='writeCommentButton button2' onClick={handleScroll} >Write Comment</button>
          <div id='reviewScroller'>
            { renderReviews() }
          </div>
        </div>
        <div className='allStats'>
          { renderStats() }
        </div>
        <div id='writeComment'>{newComment}</div>
        <div id='blockMessage'>You're not allowed to write comments!</div>
      </div>
    )
}

export default ReviewPage;
