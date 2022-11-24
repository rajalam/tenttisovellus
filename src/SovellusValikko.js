import Kirjautuminen from "./Kirjautuminen";

const SovellusValikko = (props) => {

    return (
      
      <div>
        {!props.kirjautunut &&
        <div>
            <button onClick={() => {
                props.dispatch({
                    type: "KIRJAUDU_SISAAN_VALITTU",
                    payload:
                    {
                        kirjauduValittu: true,
                        virhetila: false,
                        virheilmoitus: ""
                    }
                })
            }} >Kirjaudu</button>
            <button onClick={() => {}} >Rekisteröidy</button>
            <button onClick={() => {
                window.location.href= "https://www.youtube.com/watch?v=sAqnNWUD79Q"}} >Tietoa sovelluksesta</button>

        </div>        
        }
        {props.kirjautunut &&
        <div>
            <button onClick={() => {}} >Tentit</button>
            <button onClick={() => {
                window.location.href= "https://www.youtube.com/watch?v=sAqnNWUD79Q"}} >Tietoa sovelluksesta</button>
            <button onClick={() => {}} >Poistu</button>

        </div>        
        }

        {!props.kirjautunut && props.kirjauduValittu && <Kirjautuminen virhetila={props.virhetila} 
        virheilmoitus={props.virheilmoitus} dispatch={props.dispatch} />}

      </div>

    )
}

export default SovellusValikko;