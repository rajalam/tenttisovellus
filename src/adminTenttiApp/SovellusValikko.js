import Kirjautuminen from "./Kirjautuminen";
import Rekisterointi from "./Rekisterointi";

const SovellusValikko = (props) => {

    return (

        <div>
            {!props.kirjautunut &&
                <div>
                    <button data-testid="kirjauduSisaan" onClick={() => {
                        props.dispatch({
                            type: "KIRJAUDU_SISAAN_VALITTU",
                            payload:
                            {
                                kirjauduValittu: true,
                                virhetila: false,
                                virheilmoitus: "",
                                rekisteroidyValittu: false
                            }
                        })
                    }} >Kirjaudu</button>
                    <button onClick={() => {
                        props.dispatch({
                            type: "REKISTEROIDY_VALITTU",
                            payload:
                            {
                                rekisteroidyValittu: true,
                                virhetila: false,
                                virheilmoitus: "",
                                kirjauduValittu: false
                            }
                        })
                    }} >Rekisteröidy</button>
                    <button onClick={() => {
                        window.location.href = "https://www.youtube.com/watch?v=sAqnNWUD79Q"
                    }} >Tietoa sovelluksesta</button>

                </div>
            }
            {props.kirjautunut &&
                <div>
                    <button onClick={() => {
                        props.dispatch({
                            type: "TENTIT_VALITTU",
                            payload:
                            {
                                kirjauduValittu: false,
                                virhetila: false,
                                virheilmoitus: "",
                                rekisteroidyValittu: false,
                                tentitValittu: true
                            }
                        })
                     }} >Tentit</button>
                    <button onClick={() => {
                        window.location.href = "https://www.youtube.com/watch?v=sAqnNWUD79Q"
                    }} >Tietoa sovelluksesta</button>
                    <button onClick={(event) => {
                        //poistetaan token
                        localStorage.removeItem('usertoken')
                        props.dispatch({
                            type: "KIRJAA_ULOS_KAYTTAJA",
                            payload:
                            {
                                virhetila: false,
                                virheilmoitus: ""                                
                            }
                        })
                
                    }} >Poistu</button>

                </div>
            }

            {!props.kirjautunut && props.kirjauduValittu && <Kirjautuminen virhetila={props.virhetila}
                virheilmoitus={props.virheilmoitus} dispatch={props.dispatch} />}

            {!props.kirjautunut && props.rekisteroidyValittu && <Rekisterointi virhetila={props.virhetila}
                virheilmoitus={props.virheilmoitus} dispatch={props.dispatch} />}
        </div>

    )
}

export default SovellusValikko;