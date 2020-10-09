import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import json_missions from "../json/mission.json";

function SelectMission({ missions, handleSubmit }) {
	const [select, setSelect] = useState('empty');

	return (
		<form onSubmit={(e) => handleSubmit(e, select)}>
			<div className="form-group row">
				<div className="col-10">
					<select name="mission" value={select} className="custom-select" onChange={(e) => setSelect(e.target.value)}>
						<option value="empty"></option>
						{missions.map((value, key) => {
							return (
								<option key={key} value={value}>
									Missione {value}
								</option>
							);
						})}
					</select>
				</div>
				<div className="col-2">
					<button className="btn btn-success" type="submit">
						Procedi
					</button>
				</div>
			</div>
		</form>
	);
}

function OrganizeMissions() {
	const [missions, setMissions] = useState(Array.from(json_missions.keys()));
    const [transitions, setTransitions] = useState([]);
    let history = useHistory();

	const handleSubmit = (e, value) => {
		if (value !== "empty") {
			setTransitions(transitions.concat([`Missione ${value}`]));
			setMissions(missions.filter((val) => parseInt(value) !== val));
		}
		e.preventDefault();
    };
    
    const createStory = () => {
        fetch("/add_story", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(transitions),
		}).then(function (response) {
			history.push("/");
		});
    };

	return (
		<div className="container-fluid px-5">
			<div className="row">
				<ul class="list-group list-group-flush">
					{transitions.map((value) => {
						return <li className="list-group-item">{value}</li>;
					})}
					<li class="list-group-item">
						{missions.length ? (
							<SelectMission key={missions.length} missions={missions} handleSubmit={handleSubmit} />
						) : (
							<button className="btn btn-primary" onClick={createStory}>Crea storia</button>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
}

export default OrganizeMissions;
