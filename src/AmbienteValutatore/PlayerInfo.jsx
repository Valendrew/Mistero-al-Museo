import React from "react"
function PlayerInfo(props){
    return(
        <>
        <h2>{props.player.value.name}</h2>
        {props.player.id}

        </>
    );
}
export default PlayerInfo