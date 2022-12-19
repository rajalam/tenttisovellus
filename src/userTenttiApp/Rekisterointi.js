import './UserTenttiApp.css';
import { getServer } from './Apufunktiot';

import axios from 'axios';


const Rekisterointi = (props) => {

    return (
        <div>

            {/* Jos sama käyttäjätunnus jo aiemmin talletettu kantaan, 
        näytetään käyttäjälle "Virheellinen käyttäjätunnus tjsp." */}
            <b className="virhe">{props.virhetila && props.virheilmoitus}  </b>

            <h4>Syötä uusi käyttäjätunnus ja salasana</h4>

            <form onSubmit={async (event) => {
                event.preventDefault()

                /* trk. pitääkö onSubmit default toiminta estää, 
                vt. keskustelu https://stackoverflow.com/questions/39809943/react-preventing-form-submission */
                try {
                
                    //alert('here') 
                    //console.log("ev.target.value: ", event)
                    //console.log("ev.tunnus.target.value: ", event.target.tunnus.value)
                    props.dispatch({
                        type: "REKISTEROITYMINEN_ALOITETTU",
                        payload:
                        {
                            rekisteroityminenAloitettu: true
                        }
                    })
                    const result = await axios.post(getServer() + '/rekisterointi',
                        {
                            kayttajanimi: event.target.tunnus.value,
                            salasana: event.target.salasana.value,
                            reSalasana: event.target.reSalasana.value
                        }
                    )
                                       
                    if (result.status === 201) { //rekisteröinti ok
                        props.dispatch({
                            type: "REKISTEROI_KAYTTAJA",
                            payload:
                            {
                                virhetila: false,
                                virheilmoitus: "",                                
                                rekisteroityminenAloitettu: false
                            }
                        })


                    }
                    else { //joku muu virhe tapahtui kirjautumisessa
                        throw new Error("Virhetilanne!")
                    }
                    //console.log("post tulos: ", result.data.data)

                } catch (error) {
                    //TODO virhekäsittely, geneerinen virhedispatch, esim. case "VIRHE", vt. heikki mallidemo
                    console.log("error tulos: ", error)
                    props.dispatch({
                        type: "VIRHE_TAPAHTUI",
                        payload:
                        {
                            virhetila: true,
                            virheilmoitus: "Käyttäjätunnuksen luonti epäonnistui, syötä toinen käyttäjätunnus!",
                            rekisteroityminenAloitettu: false
                        }
                    })
                }

            }}>
                <div><label htmlFor="tunnus">Käyttäjätunnus:</label></div>
                <div><input type="text" id="tunnus" name="tunnus" /></div>

                <div><label htmlFor="salasana">Salasana:</label></div>
                <div><input type="password" id="salasana" name="salasana" /></div>

                <div><label htmlFor="reSalasana">Salasana uudelleen:</label></div>
                <div><input type="password" id="reSalasana" name="reSalasana" /></div>

                <div><input type="submit"
                    value="Luo uusi käyttäjätunnus!" /></div>
            </form>
        </div>
    );
}

export default Rekisterointi;