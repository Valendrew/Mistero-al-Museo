import React from "react";
import RemoveElement from "./removeElem";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

function RispostaAperta(props) {
    let array=props.inputsVal_;
    
    
    function setVal(e){
        if(array["questions"].length === 0){
            array["questions"].push({"type": "open", "answers":[], "tips":[]});
            array["questions"][0]["answers"].push({score:[-1,-1]});
        }
        else if( array["questions"][0]["tips"].length > 0 &&  array["questions"][0]["answers"].length === 0){
            array["questions"][0]["answers"].push({score:[-1,-1]});
        }
        
            
        if(e.target.name === "primo_input")
                array["questions"][0]["answers"][0]["score"] = [e.target.value, array["questions"][0]["answers"][0]["score"][1]];
        else
            array["questions"][0]["answers"][0]["score"] = [array["questions"][0]["answers"][0]["score"][0],e.target.value];
    }


    return (
       <Row id={props.id_div_}>
           <Col className="col-8 my-2">
           <Table >
               <tr>
                    <td><label>Inserisci punteggio minimo: </label></td> 
                    <td><input type="number" name="primo_input" onChange={setVal}></input></td>
                    
                </tr>
            </Table>
                </Col>
            <Col className="col-4 my-2">
                <RemoveElement toRemove={props.id_div_} DeleteInput_={props.DeleteInput_}/>
            </Col>
            <Col className="col-8 my-2">
            <Table >
                <tr>
                   
                    <td><label>Inserisci punteggio massimo: </label></td>
                    <td><input type="number" name="secondo_input" onChange={setVal}></input></td>
                    
                </tr>
           </Table>
           </Col>
       </Row>
    );
  }

  export default RispostaAperta;