import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Breadcrumb } from "react-bootstrap";

export default function NavbarAutore(props) {
	return (
		<Breadcrumb>
			<LinkContainer to="/">
				<Breadcrumb.Item>Home</Breadcrumb.Item>
			</LinkContainer>
			<LinkContainer to="/autore">
				<Breadcrumb.Item>Autore</Breadcrumb.Item>
			</LinkContainer>
			<Breadcrumb.Item active>{props.name}</Breadcrumb.Item>
		</Breadcrumb>
	);
}
