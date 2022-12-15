import '../App.css';
import Vastausvaihtoehto from './Vastausvaihtoehto';
import { getServer, getTokendata } from './Apufunktiot';

import axios from 'axios';

const Kysymys = (props) => {

    return (
        <div className='kysymys' key={props.kysymys.kysymys_id}>
            Kysymys: <input className='muokkaaKysymys' type="text" defaultValue={props.kysymys.kysymys_nimi}
                onBlur={async (event) => {

                    try {
                        props.dispatch({
                            type: "KYSYMYS_MUOKKAUS_ALOITETTU",
                            payload:
                            {
                                palvelinYhteysAloitettu: true
                            }
                        })

                        //kysymyksen ominaisuuksien muokkaus, kun elementti fokus poistuu
                        const result = await axios.put(getServer() +
                            '/kysymykset/' + props.kysymys.kysymys_id,
                            {
                                nimi: event.target.value,
                            },
                            getTokendata());

                        if (result.status === 201) { //muokkaus ok
                            props.dispatch({
                                type: "KYSYMYS_MUOKKAUS_OK",
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
                                virheilmoitus: "Valitun kysymyksen muokkaus epäonnistui!",
                                palvelinYhteysAloitettu: false
                            }
                        })
                    }
                }} />
            <input className='poistaKysymys' type="button" value="-" onClick={async (event) => {

                try {
                    props.dispatch({
                        type: "KYSYMYS_POISTO_ALOITETTU",
                        payload:
                        {
                            palvelinYhteysAloitettu: true
                        }
                    })

                    //kysymyksen, siihen liittyvien vastausvaihtoehtojen ja käyttäjän vastausten poisto
                    const result = await axios.delete(getServer() +
                        '/kysymykset/' + props.kysymys.kysymys_id,
                        getTokendata());

                    if (result.status === 204) { //poisto ok
                        props.dispatch({
                            type: "KYSYMYS_POISTO_OK",
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
                            virheilmoitus: "Valitun kysymyksen poisto epäonnistui!",
                            palvelinYhteysAloitettu: false
                        }
                    })
                }

            }
            } />

            <div className='vastausvaihtoehtoLista'>
                {props.kysymys.vastausvaihtoehdot.map((vastausvaihtoehto) =>
                    <Vastausvaihtoehto dispatch={props.dispatch}
                        vastausvaihtoehto={vastausvaihtoehto} />)}
            </div>
            <div>
                <input type="button" onClick={async (event) => {

                    try {
                        props.dispatch({
                            type: "VASTAUS_VE_LISAYS_ALOITETTU",
                            payload:
                            {
                                palvelinYhteysAloitettu: true
                            }
                        })

                        //vastausvaihtoehdon lisäys
                        const result = await axios.post(getServer() +
                            '/kysymykset/' + props.kysymys.kysymys_id + "/vastausvaihtoehdot",
                            {},
                            getTokendata());

                        if (result.status === 201) { //lisäys ok
                            props.dispatch({
                                type: "VASTAUS_VE_LISAYS_OK",
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
                                virheilmoitus: "Uuden vastausvaihtoehdon lisäys epäonnistui!",
                                palvelinYhteysAloitettu: false
                            }
                        })
                    }

                }}
                    value="+" />
            </div>

        </div>
    );
}

export default Kysymys