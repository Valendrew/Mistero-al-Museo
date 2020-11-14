import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default function NavbarAutore() {
	return (
		<Navbar>
			<Nav>
				<Nav.Link as={Link} to="/">
					Home
				</Nav.Link>
				<Nav.Link as={Link} to={`/autore`}>
					Home Autore
				</Nav.Link>
			</Nav>
		</Navbar>
	);
}
