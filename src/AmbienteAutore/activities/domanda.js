import React from 'react';
import {Form, Col, Row} from "react-bootstrap";
export default function Input(props){
    let array = props.inputsVal;
    function setDomandaVal(e){
        if(array["questions"].length === 0){
            array["questions"].push({"type": "open", "value":"", "answers":[], "tips":[]});
        }
        array["questions"][0]["value"] = e.target.value;
    }
    return(
        <Row className="my-4">
            <Col>
                <Form.Label>Inserisci la domanda: </Form.Label>
                <Form.Control type="text" onChange={setDomandaVal}></Form.Control >
            </Col>
        </Row>
    );
}