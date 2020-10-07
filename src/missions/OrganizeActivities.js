import React, { useState, useEffect } from "react";
import json_activities from "../json/example_activities.json";
import ActivityCard from "./ActivityCard";
import MissionCard from "./MissionCard";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

import { useHistory } from "react-router-dom";

function OrganizeActivities() {
	let history = useHistory();
	const [missions, setMissions] = useState([{ start: null }]);
	const [availActivities, setAvailActivities] = useState(json_activities.map((value, key) => key));

	const handleSubmit = (e, values, numberAct, numberMission) => {
		e.preventDefault();
		let new_missions = missions;

		values.forEach((value) => {
			if (numberAct === "start") {
				if (value !== "new_mission") new_missions[numberMission]["start"] = value;
			} else {
				if (!new_missions[numberMission][numberAct].includes(value)) {
					new_missions[numberMission][numberAct].push(value);
				}
			}
			if (value !== "new_mission") {
				new_missions[numberMission][value] = [];
			}
		});
		setMissions(new_missions);
		setAvailActivities(availActivities.filter((act) => !values.includes(act.toString())));
	};

	const submitMissions = (e) => {
		fetch("/add_story", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(missions),
		}).then(function (response) {
			history.push("/");
		});
	};

	return (
		<div className="container-fluid px-5">
			<div className="row row-cols-6 mb-4">
				{json_activities.map((value, i) => {
					return <ActivityCard key={i} id={i} storyline={value["storyline"]} />;
				})}
			</div>
			{missions.map((value, key) => {
				const parentConst = {
					missionNumber: key,
					mission: value,
					activities: json_activities,
					availActivities: availActivities,
					handleSubmit: handleSubmit,
				};
				return <MissionCard key={key} parentConst={parentConst} />;
			})}
			<div className="row justify-content-end">
				<button type="button" className="btn btn-primary" onClick={() => setMissions(missions.concat({ start: null }))}>
					Aggiungi missione
				</button>

				<button type="button" className="btn btn-success" onClick={(e) => submitMissions(e)}>
					Crea storia
				</button>
			</div>
		</div>
	);
}

export default OrganizeActivities;
