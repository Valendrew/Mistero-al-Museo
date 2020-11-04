import React from 'react';
import Button from "react-bootstrap/Button";
function removeElem(props) {
    return ( 
            <Button type="button" variant="warning" onClick={()=>props.DeleteInput_(props.toRemove, props.index)}>Rimuovi Elemento</Button>
        );
    }

    export default removeElem;