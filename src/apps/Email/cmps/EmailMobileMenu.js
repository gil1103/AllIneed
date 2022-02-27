import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Offcanvas } from 'react-bootstrap';
import './EmailMobileMenu.css';

export const EmailMobileMenu = () => {
	return (
		<div className="email-mobile-menu">
			<Navbar bg="light" expand="sm">
				<Navbar.Toggle aria-controls="offcanvasNavbar" />
				<Navbar.Offcanvas
					id="offcanvasNavbar"
					aria-labelledby="offcanvasNavbarLabel"
					placement="end"
				>
					<Offcanvas.Header closeButton>
						<Offcanvas.Title id="offcanvasNavbarLabel">Appsus Email</Offcanvas.Title>
					</Offcanvas.Header>
					<Navbar.Collapse>
						<Nav className="justify-content-end flex-grow-1 pe-3">
							<Nav.Link href="/email">Inbox</Nav.Link>
							<Nav.Link href="/email/starred">Starred</Nav.Link>
							<Nav.Link href="/email/sent">Sent</Nav.Link>
							<Nav.Link href="/email/drafts">Drafts</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar.Offcanvas>
			</Navbar>
		</div>
	);
};
