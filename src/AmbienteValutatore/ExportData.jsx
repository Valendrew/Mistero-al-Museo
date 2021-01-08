import React from 'react';

import { Button } from 'react-bootstrap';

import FileSaver from 'file-saver';

export default function ExportData(props) {

	const downloadScores = (props) => {
		let objToDownload={};
		const playerSorted = Object.entries(props.players).sort(([key,val],[key_2,val_2]) => val_2.status.score-val.status.score);
		playerSorted.forEach(([key,val],index)=>{
			objToDownload={...objToDownload,["Posizione " + (index+1)]:{
				name:val.name,
				score:val.status.score
			}
		}
		});
		var blob = new Blob([JSON.stringify(objToDownload)], {type: 'text/json;charset=utf-8'});
		FileSaver.saveAs(blob,"Classifica.json");
	}
	
	return (
        <Button onClick={()=>downloadScores(props)}>Export data</Button>
	);
}
