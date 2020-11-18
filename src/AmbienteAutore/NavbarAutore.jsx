import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

export default function NavbarAutore(props) {
	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to="/">Home</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Link to="/">Autore</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item active>{props.name}</Breadcrumb.Item>
		</Breadcrumb>
	);
}
