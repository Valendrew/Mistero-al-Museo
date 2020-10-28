import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container"; 

function NumInput(props) {
    function addTips(e){
        props.setValue(e.target.value);
        props.addTips(e.target.value);
    }
    function prevent(e){
        e.preventDefault();
    }
    return(
        <Container>
    <Row id="div-tips">
        <label for="tips-input"><b>Inserisci dei suggerimenti per il giocatore: </b></label>
        <input id="tips-input" type="number" min="0" max="10" onInput={addTips} onKeyDown={prevent} value={props.value}></input>   
    </Row>
    </Container>
    ); 
}

export default NumInput;