import '../App.css';

import { getServer, getTokendata } from './Apufunktiot';

import axios from 'axios';

const Kysymys = (props) => {

    return (
        <div className='kysymys' key={props.kysymys.kysymys_id}>
            Kysymys: <input className='kysymysNimi' type="text" defaultValue={props.kysymys.kysymys_nimi}
                onBlur="" />
            <input className='poistaKysymys' type="button" value="-" onClick={async (event) => {

                try {
                    props.dispatch({
                        type: "KYSYMYS_POISTO_ALOITETTU",
                        payload:
                        {
                            palvelinYhteysAloitettu: true
                        }
                    })
                    
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
                {/*  {props.kysymys.vastausvaihtoehdot.map((vastausvaihtoehto, index) =>
                    <Vastausvaihtoehto dispatch={props.dispatch}
                        vastausvaihtoehtoIndex={index}
                        kysymysIndex={props.kysymysIndex}
                        vastausvaihtoehto={vastausvaihtoehto}
                        tenttiIndex={props.tenttiIndex} />)} */}
            </div>
            <div>
                {/*  <input type="button" onClick={(event) => {
                    props.dispatch({
                        type: "VASTAUS_VE_LISATTIIN",
                        payload:
                        {
                            nimi: event.target.value,
                            vastausvaihtoehtoIndex: props.vastausvaihtoehtoIndex,
                            kysymysIndex: props.kysymysIndex,
                            tenttiIndex: props.tenttiIndex

                        }
                    })
                }}
                    value="+" /> */}
            </div>

        </div>
    );
}

export default Kysymys