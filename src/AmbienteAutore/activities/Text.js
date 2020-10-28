import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
function Text(props){
    let array=props.inputsVal;


    function saveTip(e, index){
        array["questions"][0]["tips"][index-1]=e.target.value;
    }
    return(
        <Container className="my-4">
        <Row>
            <label>Inserisci l'aiuto numero {props.index}: </label>
            <input type="text" onChange={(e)=>saveTip(e, props.index)}></input>
        </Row>
        </Container>
    );
}
export default Text;