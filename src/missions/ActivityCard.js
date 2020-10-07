import React, { useState, useEffect } from "react";

const colStyle = {
	height: "200px",
};

function ListItem(props) {
	return (
		<li className={`list-group-item ${props.item[0] === "text" ? "text-truncate" : ""}`}>
			{props.item[0]}: {props.item[1]}
		</li>
	);
}

function ActivityList(props) {
	return (
		<ul className="list-group list-group-flush">
			{props.storyline.map((value, key) => (
				<ListItem key={key} item={value} />
			))}
		</ul>
	);
}

function ActivityCard(props) {
	return (
		<div className="col">
			<div className="card mb-4" style={colStyle}>
				<div className="card-header">Attività {(props.id + 1).toString()}</div>
				<div className="card-body overflow-auto">
					<h5 className="card-title">Elementi narrazione</h5>
					<ActivityList storyline={props.storyline} />
				</div>
			</div>
		</div>
	);
}

export default ActivityCard;
