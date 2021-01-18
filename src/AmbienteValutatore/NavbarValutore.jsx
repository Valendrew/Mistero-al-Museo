import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Breadcrumb } from "react-bootstrap";

export default function NavbarValutatore() {
	return (
		<Breadcrumb>
			<LinkContainer to="/">
				<Breadcrumb.Item>Home</Breadcrumb.Item>
			</LinkContainer>
			<Breadcrumb.Item active="false">Valutatore</Breadcrumb.Item>
		</Breadcrumb>
	);
}