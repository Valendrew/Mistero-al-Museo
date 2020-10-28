
import React, { useState } from "react";
import AddElem from "./addElem";
import Input from "./Input";
import { nanoid } from "nanoid";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import NumInput from "./numInput";
import Text from "./Text";
const values = [
    ["testo", "video", "immagini"],
    ["aperta","multipla_check","multipla_radio","widget"]
  ];


function CreaStoria(props) {
    
        //Callback props
        function AddInputs(value){
            const newInput = {typology:value, id_div:"div-" +nanoid(), id_input:"input-" + nanoid()};
            setInput([...inputs, newInput]);
        }

        function addTips(value){
            let array = inputsVal;
            if(value > tips.length){
                const newTip = value;
                setTips([...tips,newTip]);
                if(array["questions"].length === 0){
                    array["questions"].push({"type": "", "answers":[], "tips":[]});
                }
                array["questions"][0]["tips"].push("");
            }
            else{
                let old_tips = tips.slice(0,tips.length-1);
                setTips(old_tips);
                array["questions"][0]["tips"].pop();
                if(array["questions"][0]["tips"].length===0 && array["questions"][0]["type"] === "" && array["questions"][0]["answers"].length === 0){
                    array["questions"].splice(0,1);
                }
            }
            setInputsVal(array);
        }

        //Callback props
        function AddRisposta(value){
            const newInput = {typology:value, id_div:"div-" + nanoid(), id_input:"input-" + nanoid()};
            setRisposta([...risposta, newInput]);
        }

        //Callback props
        function deleteInput(input_id, index){
            const remainingInputs = inputs.filter((input) => input_id !== input.id_div);
            setInput(remainingInputs);
            let remainingStoryVal = inputsVal["storyline"];
            for(let i=0; i<remainingStoryVal.length;i++){
                // eslint-disable-next-line
                if(i==index){
                    remainingStoryVal.splice(i,1);
                }
            }
            let remainingVal={
                "storyline":remainingStoryVal,
                "questions":inputsVal["questions"]
            };
            setInputsVal(remainingVal);
        }

        //Callback props
        function deleteRisposta(risposta_id){
            const remainingRisposta = risposta.filter(risp => risposta_id !== risp.id_div);
            setRisposta(remainingRisposta);
            let remainingStoryVal = inputsVal["questions"];
            if(remainingStoryVal[0]["tips"].length === 0){
                remainingStoryVal.splice(0,1);
            }
            else{
                remainingStoryVal[0]["type"] = "";
                remainingStoryVal[0]["answers"] = [];
            }
            let remainingVal={
                "storyline":inputsVal["storyline"],
                "questions":remainingStoryVal
            };
            setInputsVal(remainingVal);
        }

        //risposte è un array di oggetti per prevedere la possibilità di avere più input di risposta
        const [inputsVal, setInputsVal] = useState({"storyline":[],"questions":[]});
        
        const [inputs, setInput] = useState([]);
        
        const inputList = inputs.map(input => 
                <Input 
                    inputs={inputs} 
                    inputsVal_={inputsVal} 
                    setInputsVal_={setInputsVal} 
                    posizione={inputs.length - 1} 
                    tipo = {input.typology} 
                    id_input={input.id_input} 
                    id_div={input.id_div} 
                    key={input.id_div} 
                    DeleteInput={deleteInput}
                />
            );
            
        const [risposta, setRisposta] = useState([]);
            
        
        const tipoRisposta = risposta.map(risp => 
            <Input 
                tipo = {risp.typology} 
                inputs={inputs} 
                inputsVal_={inputsVal} 
                setInputsVal_={setInputsVal} 
                posizione={inputs.length - 1} 
                id_input={risp.id_input} 
                id_div={risp.id_div} 
                key={risp.id_div} 
                DeleteInput={deleteRisposta}
            />
        );
    
        const[numero_pagina, setNumeroPagina] = useState(0);
        
        const gestisciDati = (e)=>{
            e.preventDefault();
            fetch(`/story/activity/${title}/${numero_pagina}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputsVal),
            }).then(function (response) {
                setNumeroPagina(numero_pagina+1);
                //Per andare a creare una nuova attività resetto tutti i campi di input
                setInputsVal({"storyline":[],"questions":[]});
                setInput([]);
                setRisposta([]);
                setTips([]);
                setNumVal(0);
            });
        };

        const [title, setTitle]=useState("");
        function setTitleVal(e){
            setTitle(e.target.value);
        };
        function TextName(){
            if (numero_pagina === 0) {
              return(
                    <div>
                        <h1>Inserisci il titolo della storia</h1>
                        <input type="text" size={40} onChange={setTitleVal} value={title} autoFocus></input>
                    </div>
                );
            }
            else{
                return null;
            }
        }
        const [tips, setTips] = useState([]);
        const tipList = tips.map(index=>
            <Text index={index} inputsVal={inputsVal} />
        );
        const [num_val, setNumVal] = useState(0);
        return ( 
            <form onSubmit={gestisciDati}>
                <Container id="main_container" key ="main_container" className="container my-4 border rounded shadow-sm p-4 mb-4">
                    <TextName />
                    <h3>Narrazione</h3>
                    <Row id="narrazione">
                        <AddElem drop_id="primo_drop" values_={values[0]} AddInputs={AddInputs} />        
                    </Row>

                    {inputList}
            
                        <h3>Risposte</h3>
                        <Row id="rispsote">
                            <AddElem drop_id="primo_drop" values_={values[1]} AddInputs={AddRisposta} /> 
                        </Row>

                    {tipoRisposta}
                    <NumInput addTips={addTips} value={num_val} setValue={setNumVal}/>
                    {tipList}
                    <Row className="my-4">
                        <Col>
                            <ButtonGroup >
                                <Button type="submit" variant="success">Prossima attività</Button>
                                <Button type="button" variant="success">Concludi Storia</Button>
                            </ButtonGroup>
                        </Col>

                    </Row>
            

                </Container>
            </form>
        );
    }

    export default CreaStoria;