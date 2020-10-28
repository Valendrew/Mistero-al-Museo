import React from "react";
import RemoveElement from "./removeElem";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
let posizione_array=-1;

export default function textArea(props) {


    function getIndex(input_index){
        for (let i = 0; i < props.inputs.length; i++) 
            if(props.inputs[i].id_input === input_index){
                return i;
            }
    }
    

    let style = {
        resize:"none"
    }
    
    let array=props.inputsVal_;
    function setVal(e){
        posizione_array = getIndex(e.target.id);
        array["storyline"][posizione_array] = {"type":"text","val":e.target.value};
        props.setInputsVal_(array);
    }
    return (
        <Row id={props.id_div_}>
            <Col className="col-8 my-2" id="div_main_narrazione">
                <textarea className="form-control" cols="80" rows="4" style={style} id={props.id_input_} onChange={setVal}></textarea>    
            </Col>
            <Col className="col-4 my-2">
                <RemoveElement toRemove={props.id_div_} DeleteInput_={props.DeleteInput_} index={getIndex(props.id_input_)}/>
            </Col>
        </Row>
    );
  }
