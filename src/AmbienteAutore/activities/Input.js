import React from 'react';
import TextArea from "./textArea";
import Media from "./media";
import RispostaMultipla from "./rispostaMultipla";
import RispostaAperta from "./rispostaAperta";

const type_risposta_multipla = [{
    radio_check:"",
    id:""
}];

function aggiungiInput(input,id_input, id_div, DeleteInput, setInputsVal, posizione, inputsVal,inputs){
    switch (input) {
        case "testo":
            return(
                <TextArea id_div_={id_div} DeleteInput_={DeleteInput} id_input_={id_input} setInputsVal_={setInputsVal} posizione={posizione} inputsVal_={inputsVal} inputs={inputs}/>
            );

        case "video":  
            return(
                <Media id_div_={id_div} DeleteInput_={DeleteInput} id_input_={id_input} type="video/*" setInputsVal_={setInputsVal} posizione={posizione} inputsVal_={inputsVal} inputs={inputs}/>
            ); 
            
        case "immagini":  
            return(
                <Media id_div_={id_div} DeleteInput_={DeleteInput} id_input_={id_input} type="image/*" setInputsVal_={setInputsVal} posizione={posizione} inputsVal_={inputsVal} inputs={inputs}/>
            ); 
        case "aperta":return(
            <RispostaAperta id_div_={id_div} DeleteInput_={DeleteInput} setInputsVal_={setInputsVal} posizione={posizione} inputsVal_={inputsVal} inputs={inputs}/>
        );
        case "multipla_check":return(
            <RispostaMultipla id_div_={id_div} type="checkbox" DeleteInput_={DeleteInput} tipologia={type_risposta_multipla} setInputsVal_={setInputsVal} posizione={posizione} inputsVal_={inputsVal} inputs={inputs}/>
        );
        case "multipla_radio":return(
            <RispostaMultipla id_div_={id_div} type="radio" DeleteInput_={DeleteInput} tipologia={type_risposta_multipla} setInputsVal_={setInputsVal} posizione={posizione} inputsVal_={inputsVal} inputs={inputs}/>
        );
        case "widget":return(null);
        default:
            break;
    }
}
export default function Input(props) {
    return ( 
            aggiungiInput(props.tipo, props.id_input, props.id_div, props.DeleteInput, props.setInputsVal_, props.posizione, props.inputsVal_, props.inputs)
        );
    }
