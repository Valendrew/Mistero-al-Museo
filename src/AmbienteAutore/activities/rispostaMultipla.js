import React, { useState } from "react";
import RemoveElement from "./removeElem";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

function RispostaMultipla(props) {
    
    let array=props.inputsVal_;
    
    function addOpzioni(event){
        
        if(array["questions"].length === 0){
            array["questions"].push({"type": props.type, "answers":[], "tips":[]});
        }
        let inputCount=0;
        setButtons([]);
        let newBtn = [];
        for (let i = 0; i < event.target.value; i++) {
            newBtn[i]= {radio_check:props.type, id:inputCount};   
            inputCount++;
        }
        setButtons(newBtn);

        if(event.target.value > array["questions"][0]["answers"].length){
            for (let k = 0; k <= event.target.value - array["questions"][0]["answers"].length; k++)
                array["questions"][0]["answers"].push({"text":"","score":[-1],"correct":false, "transition":false});
        }
        else{
            for (let j = 0; j < array["questions"][0]["answers"].length - event.target.value; j++)
                array["questions"][0]["answers"].pop();
        }
    }
    
    function setValue(e){
        
        let input_index = e.target.parentNode.parentNode.id;
        if(e.target.name === "text")
            array["questions"][0]["answers"][input_index]= {text:e.target.value,score:[array["questions"][0]["answers"][input_index]["score"][0]], 
                correct:array["questions"][0]["answers"][input_index]["correct"], transition:array["questions"][0]["answers"][input_index]["transition"]};
        else if(e.target.name === "checbok_percorso")
            array["questions"][0]["answers"][input_index]= {text:array["questions"][0]["answers"][input_index]["text"],score:[array["questions"][0]["answers"][input_index]["score"][0]], 
                correct:array["questions"][0]["answers"][input_index]["correct"], transition: !(array["questions"][0]["answers"][input_index]["transition"])};
        else if(e.target.name === "score")
            array["questions"][0]["answers"][input_index]= {text:array["questions"][0]["answers"][input_index]["text"],score: [e.target.value], 
                correct:array["questions"][0]["answers"][input_index]["correct"], transition:array["questions"][0]["answers"][input_index]["transition"]};
        else{
            array["questions"][0]["answers"][input_index]= {text:array["questions"][0]["answers"][input_index]["text"],score: [array["questions"][0]["answers"][input_index]["score"][0]], 
                    correct:!(array["questions"][0]["answers"][input_index]["correct"]), transition:array["questions"][0]["answers"][input_index]["transition"]};
            if(props.type === "radio"){
                for (let i = 0; i < array["questions"][0]["answers"].length; i++){
                     // eslint-disable-next-line
                    if(i != input_index && array["questions"][0]["answers"][i]["correct"] === true){
                        array["questions"][0]["answers"][i]["correct"] = false;
                    }
                }
            }
        }
    }

    props.tipologia.pop();
    const [buttons, setButtons] = useState(props.tipologia);
    const buttonList = buttons.map(btn =>
            <tr onChange={setValue} id={btn.id}>
                <td><input type={btn.radio_check} disabled/></td>
                <td><input name="text" type="text"/></td>
                <td><input name={btn.radio_check} type={btn.radio_check}/></td>
                <td><input name="checbok_percorso" type="checkbox" /></td>
                <td><input name="score" type="number"/></td>
            </tr>
        );
    return (
        <Row id={props.id_div_}>
            <Col className="col-8 my-2" id="div_main_narrazione">
                <input type="number" min="2" max="5" onInput={addOpzioni}></input>   
            </Col>
            <Col className="col-4 my-2">
                <RemoveElement toRemove={props.id_div_} DeleteInput_={props.DeleteInput_}/>
            </Col>
            <Col className="col-8 my-2" id="div_main_narrazione">
                <Table>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Inserisci risposta</th>
                        <th scope="col">Selezione le questions corrette</th>
                        <th scope="col">Genera percorso alternativo</th>
                        <th scope="col">Inserisci punteggio</th>
                    </tr>
                 {buttonList}
                </Table>
            </Col>
        </Row>
    );
  }

  export default RispostaMultipla;