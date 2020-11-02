
import React, { useState } from "react";
import RemoveElement from "./removeElem";
import { Form, Row, Col, Image, Container } from "react-bootstrap";
/*fetch(`/story/file/${files[0].name}`, {
                method: 'GET',
                headers:{"Content-Type": "image/*"},
            })
            .then(res=> res.blob())
            .then(data=>{
                setSelMedia([URL.createObjectURL(data)]);
            });*/

let posizione_array=-1;
let media_attributes=[];
export default function Media(props) {

    //dato che potrei avere, per esempio, sia un testo che delle immagini, individeo la posizione dell'array storyline dove
    //salvare i dati relativi a immagini e video
    function getIndex(input_index){
        for (let i = 0; i < props.inputs.length; i++) 
        if(props.inputs[i].id_input === input_index)
            return i;
    }
    
    

    const [selected_media, setSelMedia] = useState([]);

    
    function setVal(e){
        //Se cambio immagini svuoto l'array che contiente i vari attributi
        media_attributes=[];
        let image_to_display=[];
        setSelMedia(image_to_display);
        let array=props.inputsVal_;
        const files = e.target.files;
        
        for(let i = 0; i <files.length; i++){
            image_to_display.push([URL.createObjectURL(files[i]),i]);
            media_attributes.push({"id":files[i].name, "alt":"", "description":""});
            const formData = new FormData();
            formData.append('myFile', files[i]);
            fetch(`/story/file`, {
                method: 'POST',
                body: formData
            });
        }
       
        setSelMedia(image_to_display);
        

        posizione_array = getIndex(e.target.id);

        if(props.type === "video/*"){
            array["storyline"][posizione_array] = {"type":"video","val":media_attributes};
        }
        else{
            array["storyline"][posizione_array] = {"type":"immagini","val":media_attributes};
        }
        props.setInputsVal_(array);
    }

    function setAltVal(e,index){
        let array = props.inputsVal_;
        media_attributes[index]["alt"] = e.target.value;
        array["storyline"][posizione_array]["val"] = media_attributes;
    }
    function setDescription(e,index){
        let array = props.inputsVal_;
        media_attributes[index]["description"] = e.target.value;
        array["storyline"][posizione_array]["val"] = media_attributes;
    }
    let selMedia=[];
    if(props.type === "image/*"){
        selMedia = selected_media.map(data=>
            <Container>
            <Row className="my-4">
                <Col>
                    <Image src={data[0]} thumbnail fluid/>
                </Col>
                <Col>
                    <Form.Control type="text" onChange={(e)=>setAltVal(e,data[1])}></Form.Control>
                </Col>
                <Col>
                    <Form.Control as="textarea" onChange={(e)=>setDescription(e,data[1])}></Form.Control>
                </Col>
            </Row>
            </Container>
        );
    } else{
        selMedia = selected_media.map(data=>
            <Container>
            <Row>
                <Col>
                    <video alt="" width="320" height="240"controls>
                        <source src={data[0]}></source>
                    </video>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Control type="text" onChange={(e)=>setAltVal(e,data[1])}></Form.Control>
                </Col>
                <Col>
                    <Form.Control as="textarea" onChange={(e)=>setDescription(e,data[1])}></Form.Control>
                </Col>
            </Row>
            </Container>
            
        );
    }
    return (
        <Row id={props.id_div_}>
            <Col className="col-8 my-2" id="div_main_narrazione">
            <Form.File accept={props.type} id={props.id_input_} onChange={setVal} multiple={props.type === "image/*"}></Form.File>
                
                    {selMedia}
            </Col>
            <Col className="col-4 my-2">
                <RemoveElement toRemove={props.id_div_} DeleteInput_={props.DeleteInput_} index={getIndex(props.id_input_)} />
            </Col>
        </Row>
    );
  }