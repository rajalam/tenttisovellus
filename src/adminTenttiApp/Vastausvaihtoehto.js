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
                                    virheilmoitus: "Valitun vastausvaihtoehdon on oikea muokkaus ep??onnistui!",
                                    palvelinYhteysAloitettu: false
                                }
                            })
                        }
                    }} />

                <input className="muokkaaVastausvaihtoehtoNimi" type="text" onBlur={async (event) => {
                    /* t??h??n kohtaan voi tehd?? axios pyynn??t serverille, 
                    tapahtuman k??sittelij???? ei reduceriin eik?? useeffectiin */

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
                                virheilmoitus: "Valitun vastausvaihtoehdon nimen muokkaus ep??onnistui!",
                                palvelinYhteysAloitettu: false
                            }
                        })
                    }

                }}
                    defaultValue={props.vastausvaihtoehto.vastausvaihtoehto_nimi} />

                <input type="button" onClick={async (event) => {
                    /* t??h??n kohtaan voi tehd?? axios pyynn??t serverille, 
                  tapahtuman k??sittelij???? ei reduceriin eik?? useeffectiin,
                  reducer hoitaa reactin p??ivitystilaa, http pyynn??t/axios tietokanta hoitaa,
                  try-catch lohkot axios pyynn??t,
                  jos tulee virhetilanne axios pyynn??ss??, eri reducer case sit?? varten */

                    try {
                        props.dispatch({
                            type: "VASTAUS_VE_POISTO_ALOITETTU",
                            payload:
                            {
                                palvelinYhteysAloitettu: true
                            }
                        })

                        //vastausvaihtoehdon ja k??ytt??j??n vastausten poisto
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
                                virheilmoitus: "Valitun kysymyksen poisto ep??onnistui!",
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
