import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate
} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { About } from './pages/About';
import { MainNav } from './cmps/MainNav';
import { Footer } from './cmps/Footer';
import { EmailApp } from './apps/Email/EmailApp';
import { EmailDetails } from './apps/Email/cmps/EmailDetails';
import { UserMsg } from './cmps/UserMsg';
import { BookApp } from './apps/Book/BookApp';
import { BookDetails } from './apps/Book/cmps/BookDetails';
import { AddReview } from './apps/Book/cmps/AddReview';
import { BookReviews } from './apps/Book/cmps/BookReviews';
import { KeepApp } from './apps/Keep/pages/KeepApp';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import './index.css';

export default function App() {
	library.add(fab, faStarRegular, faStarSolid);

	return (
		<Router>
			<section className="appsus">
				<MainNav />
				<UserMsg />
				<Routes>
					<Route path="/" element={<HomePage/>} />
					<Route path="/homepage" element={<HomePage />} />
					<Route path="/about" element={<About />} />
					<Route path="/keep" element={<KeepApp />} />
					<Route path="/book" element={<BookApp />} />
					<Route path="/book/:bookId" element={<BookDetails />} />
					<Route path="/book/:bookId/addreview" element={<AddReview />} />
					<Route path="/book/:bookId/reviews" element={<BookReviews />} />
					<Route path="/email" element={<EmailApp />}>
						<Route path="/email/starred" element={<EmailApp />} />
						<Route path="/email/sent" element={<EmailApp />} />
						<Route path="/email/drafts" element={<EmailApp />} />
					</Route>
					<Route path="/email/:emailId" element={<EmailDetails />} />
					<Route path="*" element={<Navigate to="/homepage" />} />
				</Routes>
				<Footer />
			</section>
		</Router>
	);
}

{/* <Route path="/" element={<Navigate to="/homepage" />} /> */}