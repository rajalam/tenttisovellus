import { getAllByAltText } from '@testing-library/react';
import axios from 'axios';
import '../App.css';
import { getServer, getTokendata } from './Apufunktiot';

const TenttiValikko = (props) => {

    return (
        <div className='tenttiValikko'>
            {props.tenttiListaData.map((tentti) => {
                return (<button key={tentti.id} id={tentti.id}
                    className={props.valittuTenttiId === tentti.id ? 'tenttiValikkoAlkioAktiivinen':'tenttiValikkoAlkio'} 
                    onClick={async (event) => {
                        /* LISÄÄ onclick action tähän */

                        //console.log("event.target.id", event.target.id)

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
                                
                                TODO mitä tehdä kysymysjavastausvaihtoehto-listalla jotta pääsen eteenpäin
                                katso omat kommentit src kansion alta, esim. se että missä kohtaa
                                kysmykset ja vastaukset kannattaa jatkos hakea, useeffectis vai jossain muualla
                                console.log(result.data)
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