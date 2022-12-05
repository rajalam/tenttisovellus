//import { getAllByAltText } from '@testing-library/react';
//import axios from 'axios';
import '../App.css';
//import { getServer, getTokendata } from './Apufunktiot';

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
        </div>
    );
}

export default TenttiValikko