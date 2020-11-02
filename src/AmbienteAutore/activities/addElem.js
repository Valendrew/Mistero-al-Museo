import React from "react";
import { Container,Dropdown, DropdownButton} from "react-bootstrap";
export default function addElem(props) {
  
  function addButtons(values){
    let buttonList = [];
    for (let i = 0; i < values.length; i++) {
      let text = "";
      switch(values[i]){
        case "testo": text = "Inserisci un testo o una domanda"; break;
        case "video": text = "Inserisci un video"; break;
        case "immagini": text = "Inserisci delle immagini"; break;
        case "aperta": text = "Risposta Aperta"; break;
        case "multipla_check": text = "Risposta multipla con check box"; break;
        case "multipla_radio": text = "Risposta multipla con radio"; break;
        case "widget": text = "Risposta tramite widget"; break;

        default: text=values[i];
      }
      buttonList.push( <Dropdown.Item eventKey={i} type="button" value={values[i]} 
                          onClick={()=>selectElement(values[i])}>{text}</Dropdown.Item>);
    } 
    return buttonList;
  }

  function selectElement(value){
    props.AddInputs(value);
  }

    return (
        <Container>
          <DropdownButton title="Aggiungi Input" drop="right">
            {addButtons(props.values_)}
          </DropdownButton>
      </Container>
    );
  }
