//import logo from './logo.svg';
import '../App.css';
import { getServer, getTokendata } from './Apufunktiot';

import axios from 'axios';

const Vastausvaihtoehto = (props) => {
    return (
        <>

            <div key={props.vastausvaihtoehto.vastausvaihtoehto_id} className='vastausvaihtoehto'>
                Vastausvaihtoehto:

                <input className='muokkaaVastausvaihtoehtoOikein' type="checkbox"
                    defaultChecked={props.vastausvaihtoehto.vastausvaihtoehto_oikein}
                    onChange={async (event) => {

                        try {

                            //checkbox arvo muuttunut
                            props.dispatch({
                                type: "VASTAUS_VE_ON_OIKEIN_MUOKKAUS_ALOITETTU",
                                payload:
                                {
                                    palvelinYhteysAloitettu: true
                                }
                            })

                            //console.log("checkbox event value",event.target.value)
                            //console.log("checkbox checked prop",event.target.checked)

                            //vastausvaihtoehdon nimen muokkaus, kun elementti fokus poistuu
                            const result = await axios.put(getServer() +
                                '/vastausvaihtoehdot/' + props.vastausvaihtoehto.vastausvaihtoehto_id,
                                {
                                    nimi: props.vastausvaihtoehto.vastausvaihtoehto_nimi,
                                    on_oikea: event.target.checked
                                },
                                getTokendata());

                            if (result.status === 201) { //muokkaus ok
                                props.dispatch({
                                    type: "VASTAUS_VE_ON_OIKEIN_MUOKKAUS_OK",
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
                                    virheilmoitus: "Valitun vastausvaihtoehdon on oikea muokkaus epäonnistui!",
                                    palvelinYhteysAloitettu: false
                                }
                            })
                        }
                    }} />

                <input className="muokkaaVastausvaihtoehtoNimi" type="text" onBlur={async (event) => {
                    /* tähän kohtaan voi tehdä axios pyynnöt serverille, 
                    tapahtuman käsittelijää ei reduceriin eikä useeffectiin */

                    try {
                        props.dispatch({
                            type: "VASTAUS_VE_NIMI_MUOKKAUS_ALOITETTU",
                            payload:
                            {
                                palvelinYhteysAloitettu: true
                            }
                        })

                        //vastausvaihtoehdon nimen muokkaus, kun elementti fokus poistuu
                        const result = await axios.put(getServer() +
                            '/vastausvaihtoehdot/' + props.vastausvaihtoehto.vastausvaihtoehto_id,
                            {
                                nimi: event.target.value,
                                on_oikea: props.vastausvaihtoehto.on_oikea
                            },
                            getTokendata());

                        if (result.status === 201) { //muokkaus ok
                            props.dispatch({
                                type: "VASTAUS_VE_NIMI_MUOKKAUS_OK",
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
                                virheilmoitus: "Valitun vastausvaihtoehdon nimen muokkaus epäonnistui!",
                                palvelinYhteysAloitettu: false
                            }
                        })
                    }

                }}
                    defaultValue={props.vastausvaihtoehto.vastausvaihtoehto_nimi} />

                <input type="button" onClick={async (event) => {
                    /* tähän kohtaan voi tehdä axios pyynnöt serverille, 
                  tapahtuman käsittelijää ei reduceriin eikä useeffectiin,
                  reducer hoitaa reactin päivitystilaa, http pyynnöt/axios tietokanta hoitaa,
                  try-catch lohkot axios pyynnöt,
                  jos tulee virhetilanne axios pyynnössä, eri reducer case sitä varten */

                    try {
                        props.dispatch({
                            type: "VASTAUS_VE_POISTO_ALOITETTU",
                            payload:
                            {
                                palvelinYhteysAloitettu: true
                            }
                        })

                        //vastausvaihtoehdon ja käyttäjän vastausten poisto
                        const result = await axios.delete(getServer() +
                            '/vastausvaihtoehdot/' + props.vastausvaihtoehto.vastausvaihtoehto_id,
                            getTokendata());

                        if (result.status === 204) { //poisto ok
                            props.dispatch({
                                type: "VASTAUS_VE_POISTO_OK",
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

                }}
                    value='-' />

            </div>
        </>
    );
}

export default Vastausvaihtoehto;
