import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
export default function Input(props){
    return(
        <Row className="my-4">
            <Col>
                <Form.Label>Inserisci la domanda: </Form.Label>
                <Form.Control type="text"></Form.Control >
            </Col>
        </Row>
    );
}