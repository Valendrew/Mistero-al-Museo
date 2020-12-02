import React, { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import MissionModal from "./MissionModal";
import MissionCard from "./MissionCard";

function convertFieldToNumbers(field) {
	/* 
	0 == answer number
	1 == activity number
	n - 1 == mission number
	*/
	const fieldInfo = field.split("_").reverse();
	return fieldInfo.filter((_, key) => [0, 1, fieldInfo.length - 1].includes(key)).map((val) => parseInt(val.replace(/[^0-9]/g, "")));
}

function Missions(props) {
	const [showModal, setShowModal] = useState(false);
	const [inputs, setInputs] = useState({});
	const [missions, setMissions] = useState(props.missions ? props.missions : {}); // missioni
	const [activities, setActivities] = useState(props.missions ? [] : Array.from(Object.keys(props.activities))); // indici attività disponibili

	const handleAddActivity = (field, event) => {
		event.preventDefault();
		if (inputs[field]) {
			let actChild; // valore campo option ("new_mission" oppure indice attività)
			let missionNmb; // numero della missione alla quale stiamo aggiungendo
			let newMission; // oggetto per la nuova (o modificata) missione
			let selectPrefix; // identificativo per le select della nuova attività
			let answersNmb; // risposte possibili per l'attività

			/* Valore della option selezionata e ottenute le risposte 
			possibili nel caso di nuova attività (!= new_mission) */
			if (inputs[field] === "new_mission") actChild = inputs[field];
			else {
				actChild = inputs[field];
				const questions = props.activities[actChild].questions;
				if (questions.length) {
					if (questions[0].answers) answersNmb = questions[0].answers.length;
					// risposte multiple question
					else answersNmb = 1; // risposte open question
				}
				// risposte solo narrazione
				else answersNmb = 1;
			}

			/* Nel caso di missionModal verrà creato un oggetto per la nuova missione, negli
			altri casi verrà cambiato l'array dell'attività padre per impostare il nuovo figlio */
			if (field === "missionModal") {
				missionNmb = Object.keys(missions).length;
				/* newMission è un oggetto e conterrà la nuova missione */
				newMission = {
					start: inputs[field],
				};
				selectPrefix = `m${missionNmb}_a${actChild}_`; // prefisso identificato per le select
				setShowModal(false); // chiusura del modal
			} else {
				/* Valori identificati ottenuti dal campo della select (numero risposta, 
					numero attività padre, numero missione) */
				let ansNmb, actNmb;
				[ansNmb, actNmb, missionNmb] = convertFieldToNumbers(field);
				const mission = { ...missions[missionNmb] }; // l'oggetto della i-esima missione (già esistente)
				/* Modifica all'array dell'attività (padre) al figlio i-esimo con il valore della option*/
				const newActChildren = mission[actNmb].map((value, key) => (key === ansNmb ? actChild : value));
				newMission = { ...mission, [actNmb]: newActChildren }; // impostato nuovo vettore dei figli

				// Nel caso di nuova attività (!= new_mission) viene impostato il prefisso per le select
				if (actChild !== "new_mission") selectPrefix = `${field.replace(`_ans${ansNmb}`, "")}_a${actChild}_`;
			}
			/* Nel caso di nuova attività (!= new_mission) viene creato l'array dei figli
			per essa e vengono aggiunti i nuovi identificativi per le select */
			if (actChild !== "new_mission") {
				//debugger;
				/* Creato array di dimensione pari alle risposte possibili per l'attività creata*/
				newMission = { ...newMission, [actChild]: new Array(answersNmb).fill("") };
				let newInputs = Array.from({ length: answersNmb }, (_, i) => [selectPrefix.concat(`ans${i}`), ""]);
				if (props.activities[actChild].questions.length) {
					const answers = props.activities[actChild].questions[0].answers;
					if (answers) {
						newMission = {
							...newMission,
							[actChild]: newMission[actChild].map((value, key) => (!answers[key].correct && !answers[key].transition ? actChild : value)),
						};
						newInputs = newInputs.filter((value, key) => answers[key].correct || answers[key].transition);
					}
				}
				setInputs({ ...inputs, ...Object.fromEntries(newInputs) });
				setActivities(activities.filter((value) => parseInt(value) !== parseInt(actChild)));
			}
			setMissions({ ...missions, [missionNmb]: newMission });
		}
	};

	const handleRemoveActivity = (field) => {
		const [act, parentAct, mis] = convertFieldToNumbers(field);
		let start = -1;

		/* Se mis è undefined allora è la prima attività della missione, quindi 
		basterà rimuovere l'intero oggetto della missione */
		if (mis === undefined) {
			const { [parentAct]: missionValue, ...otherMission } = { ...missions };
			setMissions(otherMission);
		} else {
			/* Cambiare l'array dell'attività (padre) modificando il figlio i-esimo con il valore vuoto ("")*/
			const newActChildren = missions[mis][parentAct].map((value) => (parseInt(value) === act ? "" : value));
			const { [act]: children, ...otherMission } = { ...missions[mis] };
			const newMission = { ...missions, [mis]: { ...otherMission, [parentAct]: newActChildren } };
			setMissions(newMission);
		}
		/* Cercata la prima attività maggiore rispetto a quella da riaggiungere dalla
		lista delle attività ancora disponibili */
		for (let i = 0; i < activities.length && start === -1; i++) {
			if (parseInt(act) < parseInt(activities[i])) start = i;
		}
		// Nel caso non sia stata trovata nessuna attività maggiore (sarà l'ultima)
		if (start === -1) {
			start = activities.length;
		}
		/* Aggiunta la nuova attività (appena eliminata dalla missione) alla lista delle
		attività disponibili in base all'indice di start (per essere in ordine) */
		let newActs = [...activities];
		newActs.splice(start, 0, act.toString());
		setActivities(newActs);
	};

	const handleShow = () => {
		setInputs({ ...inputs, missionModal: activities[0].toString() });
		setShowModal(true);
	};

	const handleHide = () => {
		setInputs({ ...inputs, missionModal: undefined });
		setShowModal(false);
	};

	const handleSelect = (e) => {
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	};

	const activitiesIncompleted = () => {
		const mission = Object.values(missions);
		let incompleted = false;
		for (let i = 0; i < mission.length && !incompleted; i++) {
			let children = Object.values(mission[i]);
			for (let j = 0; j < children.length && !incompleted; j++) {
				if (Array.isArray(children[j])) incompleted = children[j].includes("");
			}
		}
		return !incompleted && activities.length === 0;
	};

	useEffect(() => {
		setInputs((prevState) => {
			return Object.fromEntries(Object.entries(prevState).map(([key, value]) => [key, activities.length ? activities[0].toString() : "new_mission"]));
		});
	}, [activities]);

	return (
		<Container>
			<MissionModal
				showModal={showModal}
				value={inputs.missionModal}
				activities={activities}
				handleSelect={handleSelect}
				handleHide={handleHide}
				handleAddActivity={handleAddActivity}
			/>
			{Object.entries(missions).map(([key, value]) => {
				return (
					<MissionCard
						key={`m${key}`}
						missionNmb={key}
						missions={value}
						inputs={inputs}
						activities={activities}
						infoActivities={props.activities}
						handleSelect={handleSelect}
						handleAddActivity={handleAddActivity}
						handleRemoveActivity={handleRemoveActivity}
					/>
				);
			})}
			<Row>
				<Col>
					{activities.length ? (
						<Button variant="primary" type="button" onClick={handleShow}>
							Aggiungi missione
						</Button>
					) : null}
				</Col>
				<Col>
					{activitiesIncompleted() ? (
						<Button variant="success" type="button" onClick={() => props.fetchMissions(missions)}>
							Procedi per concludere la storia
						</Button>
					) : null}
				</Col>
			</Row>
		</Container>
	);
}

export default Missions;
