import React from "react";
import RemoveElement from "./removeElem";
import {Form, Table, Col, Row} from "react-bootstrap";
import Domanda from "./domanda";

function RispostaAperta(props) {
    let array=props.inputsVal_;
    
    
    function setVal(e){
        if(array["questions"].length === 0){
            array["questions"].push({"type": "open", "value":"", "answers":[], "tips":[]});
            array["questions"][0]["answers"].push({score:[-1,-1]});
        }
        else if((array["questions"][0]["tips"].length > 0 &&  array["questions"][0]["answers"].length === 0) || (array["questions"][0]["value"]!=="" && array["questions"][0]["answers"].length === 0)){
            array["questions"][0]["answers"].push({score:[-1,-1]});
        }
        
            
        if(e.target.name === "primo_input")
                array["questions"][0]["answers"][0]["score"] = [e.target.value, array["questions"][0]["answers"][0]["score"][1]];
        else
            array["questions"][0]["answers"][0]["score"] = [array["questions"][0]["answers"][0]["score"][0],e.target.value];
    }


    return (
       <div id={props.id_div_}>
           <Domanda inputsVal={props.inputsVal_}/>
            <Row>
                <Col className="col-6 my-2">
                    <Table >
                        <tr>
                            <td><Form.Label>Inserisci punteggio minimo: </Form.Label></td> 
                            <td><Form.Control type="number" name="primo_input" className="mb-2" onChange={setVal}></Form.Control></td>
                        </tr>
                    </Table>
                </Col>
                <Col className="col-6 my-2">
                    <RemoveElement toRemove={props.id_div_} DeleteInput_={props.DeleteInput_}/>
                </Col>
            </Row>
            <Row>
                <Col className="col-6 my-2">
                    <Table >
                        <tr>
                            <td><Form.Label>Inserisci punteggio massimo: </Form.Label></td>
                            <td><Form.Control type="number" name="secondo_input" onChange={setVal}></Form.Control></td>    
                        </tr>
                    </Table>
                </Col>
           </Row>
       </div>
    );
  }

  export default RispostaAperta;