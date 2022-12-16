//import { getAllByAltText } from '@testing-library/react';
import '../App.css';
import axios from 'axios';
import { getServer, getTokendata } from './Apufunktiot';

const TenttiValikko = (props) => {

    return (
        <div className='tenttiValikko'>
            {props.tenttiListaData.map((tentti) => {
                return (<button key={tentti.id} id={tentti.id}
                    className={props.valittuTenttiId === tentti.id ? 'tenttiValikkoAlkioAktiivinen' : 'tenttiValikkoAlkio'}
                    onClick={(event) => {
                        /* LISÄÄ onclick action tähän */
                        //console.log("event.target.id", event.target.id)

                        /* TODO mitä tehdä kysymysjavastausvaihtoehto - listalla jotta pääsen eteenpäin
                        katso omat kommentit src kansion alta, esim.se että missä kohtaa
                        kysmykset ja vastaukset kannattaa jatkos hakea, useeffectis vai jossain muualla */
                        //console.log(result.data)
                        props.dispatch({
                            type: "AKTIIVINEN_TENTTI_VALITTU",
                            payload:
                            {
                                aktiivinenTenttiId: event.target.id,
                                valittuTenttiDataPaivitettava: true
                            }
                        })
                    }

                    }>
                    {tentti.nimi}
                </button>

                )

            })}

            <button className="lisaaTentti" onClick={async (event) => {

                let result = undefined;

                try {
                    props.dispatch({
                        type: "LISAA_TENTTI_ALOITETTU",
                        payload:
                        {
                            palvelinYhteysAloitettu: true
                        }
                    })

                    //uusi tentti lisäys
                    result = await axios.post(getServer() +
                        '/tentit/',
                        {},
                        getTokendata());

                    if (result.status === 201) { //lisäys ok

                        props.dispatch({
                            type: "LISAA_TENTTI_OK",
                            payload: {
                                palvelinYhteysAloitettu: false,
                                tenttiListaDataPaivitettava: true                                
                            }
                        })

                        //console.log("result:", result.data[0].id)

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
                            virheilmoitus: "Tentin lisäys epäonnistui!",
                            palvelinYhteysAloitettu: false
                        }
                    })
                }

            }}>
                +
            </button>
        </div>
    );
}

export default TenttiValikko