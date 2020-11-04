import React from "react";
import { Form, Row, Container} from "react-bootstrap";

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
        <Form.Label for="tips-input"><b>Inserisci dei suggerimenti per il giocatore: </b></Form.Label>
        <Form.Control id="tips-input" type="number" min="0" max="10" onInput={addTips} onKeyDown={prevent} value={props.value}></Form.Control>   
    </Row>
    </Container>
    ); 
}

export default NumInput;