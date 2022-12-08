import '../App.css';
import Kysymys from './Kysymys';
import { getServer, getTokendata } from './Apufunktiot';
import axios from 'axios';
import { emit } from 'nodemon';
import { editableInputTypes } from '@testing-library/user-event/dist/utils';


const TenttiMuokkaa = (props) => {

    return (
        <div className='tenttiMuokkaa'>

            <div className='kysymysLista'>{props.tenttiData.kysymykset.map((kysymys) =>

                <Kysymys dispatch={props.dispatch} kysymys={kysymys} key={kysymys.kysymys_id}
                />)}

            </div>
            <input className='lisaaKysymys' type="button" value="+" onClick={async (event) => {

                try {
                    props.dispatch({
                        type: "KYSYMYS_LISAYS_ALOITETTU",
                        payload:
                        {
                            palvelinYhteysAloitettu: true
                        }
                    })

                    //console.log(getServer() +
                    //'/tentit/' + props.valittuTenttiId +"/kysymykset")
                    //console.log(getTokendata())

                    //kysymyksen lisäys
                    const result = await axios.post(getServer() +
                        '/tentit/' + props.valittuTenttiId.toString() +"/kysymykset",
                        getTokendata());

                    //TODO ed. axios kutsulla token näyttää undefined vahvistaTokenissa, vaikka muilla axios kutsuilla
                    //toimii ok, miksi?, tosin muita post komentoja en ole voinut testata, enkä postmanillakaan,
                    //ei toiminut postmanillakaan->postmanilla sain toimiin lopulta ok tokenin välityksen,
                    //ja siten myös uuden kysymyksen luonnin,
                    //mutta uutena vikana node_modules herjaa tulee kuten katrilla ke aamuna

                    if (result.status === 201) { //lisäys ok
                        props.dispatch({
                            type: "KYSYMYS_LISAYS_OK",
                            payload: {
                                palvelinYhteysAloitettu: false,
                                valittuTenttiDataPaivitettava: true

                            }
                        })

                    }
                    else { //joku muu virhe
                        throw new Error("Virhetilanne!");
                    }
                } catch (error) {
                    console.log("error tulos: ", error)
                    props.dispatch({
                        type: "VIRHE_TAPAHTUI",
                        payload:
                        {
                            virhetila: true,
                            virheilmoitus: "Uuden kysymyksen lisäys epäonnistui!",
                            palvelinYhteysAloitettu: false
                        }
                    })
                }

            }
            } />
        </div>
    );
}

export default TenttiMuokkaa