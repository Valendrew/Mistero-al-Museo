import React, { useState } from 'react';

import { Button, Form, Modal } from 'react-bootstrap';

import { jsPDF } from 'jspdf';
import { nanoid } from 'nanoid';

export default function ExportData(props) {
	const [player, setPlayer] = useState('');
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const exportData = async () => {
		const pdf = new jsPDF();
		let header = [];
		if (player !== 'classifica') {
			header = ['Domanda', 'Risposta', 'Punteggio ottenuto'];

			let headerConfig = header.map(key => ({ name: key, prompt: key, width: 50, align: 'center', padding: 0 }));
			let tableRows = [];
			const result = await fetch(`/games/${player}/${props.storyID}/playerAnswers`);
			if (result.ok) {
				result.json().then(data => {
					tableRows = Object.values(data.answers);
					//Rinomino le chiavi perché devono corrispondere al valore delle colonne
					tableRows.forEach(element => {
						element[header[0]] = element['question'];
						element[header[1]] = element['value'];
						element[header[2]] = element['score'];
					});
					pdf.table(20, 30, tableRows, headerConfig);
					pdf.save(data.name + '.pdf');
				});
			}
		} else {
			header = ['Nome', 'Punteggio'];
			let headerConfig = header.map(key => ({ name: key, prompt: key, width: 50, align: 'center', padding: 0 }));

			//Ordino i giocatori di questa storia in ordine decrescente in base al punteggio
			const playerSorted = Object.entries(props.players).sort(
				([key, val], [key_2, val_2]) => val_2.status.score - val.status.score
			);

			//Dato che ho sia la chiave che i valori tengo solo i valori
			playerSorted.forEach((elem, index) => {
				playerSorted[index] = elem.slice(1, 2);
			});

			//In tableRows metto ciò che mi interessa
			let tableRows = [];
			playerSorted.forEach((elem, index) => {
				tableRows.push({ Nome: elem[0]['name'], Punteggio: elem[0].status['score'].toString() });
			});

			pdf.table(20, 30, tableRows, headerConfig);
			pdf.save('classifica.pdf');
		}
	};

	const setPlayerVal = playerID => {
		setPlayer(playerID);
	};
	return (
		<>
			<Button onClick={() => handleShow()}>Export data</Button>
			<Modal show={show} onHide={handleClose} backdrop='static' keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Di chi vuoi esportare i dati?</Modal.Title>
				</Modal.Header>
				<Form>
					<Modal.Body>
						<Form.Check
							key={nanoid()}
							type='radio'
							label='Scarica classifica'
							value='classifica'
							onChange={e => setPlayerVal(e.target.value)}
							name='selezionePlayer'
						/>
						{Object.entries(props.players).map(([key, val], index) => {
							return (
								<Form.Check
									key={key}
									type='radio'
									label={val.name}
									value={key}
									onChange={e => setPlayerVal(e.target.value)}
									name='selezionePlayer'
								/>
							);
						})}
					</Modal.Body>
					<Modal.Footer>
						<Button variant='primary' onClick={() => exportData()}>
							Scarica
						</Button>

						<Button variant='secondary' onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
