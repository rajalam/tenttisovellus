import axios from 'axios';
import '../App.css';
import { getServer, getTokendata } from './Apufunktiot';

const TenttiValikko = (props) => {

    return (
        <div className='tenttiValikko'>
            {props.tenttiListaData.map((tentti) => {
                return (<button key={tentti.id} id={tentti.id}
                    className='tenttiValikkoAlkio' onClick={async (event) => {
                        /* LISÄÄ onclick action tähän */

                        console.log("event.target.id", event.target.id)

                        try {

                            props.dispatch({
                                type: "TENTTIDATA_HAKU_ALOITETTU",
                                payload:
                                {
                                    palvelinYhteysAloitettu: true
                                }
                            })

                            //TODO tenttiin liittyvien kysymysten, vastausvaihtoehtojen haku axios
                            const result = 
                                await axios.get(getServer() + 
                                '/tentit/' + event.target.id + '/kysymyksetjavastausvaihtoehdot', 
                                    getTokendata())

                            if (result.status === 200) { //haku ok
                                props.dispatch({
                                    type: "AKTIIVINEN_TENTTI_VALITTU",
                                    payload:
                                    {
                                        aktiivinenTenttiId: event.target.id                                        
                                    }
                                })
                            }
                            else { //jokin virhe tapahtui
                                throw new Error("Virhetilanne!")
                            }

                        } catch (error) {
                            console.log("error tulos: ", error)
                            props.dispatch({
                                type: "VIRHE_TAPAHTUI",
                                payload:
                                {
                                    virhetila: true,
                                    virheilmoitus: "Tenttidatan nouto epäonnistui!",
                                    palvelinYhteysAloitettu: false
                                }
                            })
                        }

                    }

                    }>
                    {tentti.nimi}
                </button>
                )
            })}
        </div>
    );
}

export default TenttiValikko