import React from "react";
import {Form, Container, Row} from "react-bootstrap";
function Text(props){
    let array=props.inputsVal;


    function saveTip(e, index){
        array["questions"][0]["tips"][index-1]=e.target.value;
    }
    return(
        <Container className="my-4">
        <Row>
            <Form.Label>Inserisci l'aiuto numero {props.index}: </Form.Label>
            <Form.Control type="text" onChange={(e)=>saveTip(e, props.index)}></Form.Control>
        </Row>
        </Container>
    );
}
export default Text;