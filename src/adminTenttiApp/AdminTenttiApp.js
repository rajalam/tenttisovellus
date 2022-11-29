import '../App.css';
import SovellusValikko from './SovellusValikko';
import { getServer, getTokendata } from './Apufunktiot';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu

//const SERVER = 'https://localhost:8080';


//appDataTila
const alkuTila = {

    kirjautuminenAloitettu: false,
    rekisteroityminenAloitettu: false,
    kirjautunut: false,
    virhetila: false,
    virheilmoitus: "",
    kirjauduValittu: false,
    rekisteroidyValittu: false,
    tenttiListaDataPaivitettava: true,
    tenttiListanHakuAloitettu: false,
    tenttiListaData: []
}

const AdminTenttiApp = () => {

    //reducer alustus
    const [appDataTila, dispatch] = useReducer(reducer, alkuTila);


    function reducer(state, action) {

        //tehdään täysi kopio appDatasta
        let appDataTilaKopio = JSON.parse(JSON.stringify(state))

        switch (action.type) {

            case "SISAANKIRJAUTUMINEN_ALOITETTU":
                console.log("SISAANKIRJAUTUMINEN_ALOITETTU", action)
                return {
                    ...state, kirjautuminenAloitettu: action.payload.kirjautuminenAloitettu
                }
            case "REKISTEROITYMINEN_ALOITETTU":
                console.log("REKISTEROITYMINEN_ALOITETTU", action)
                return {
                    ...state, rekisteroityminenAloitettu: action.payload.rekisteroityminenAloitettu
                }
            case "SISAANKIRJATTU_KAYTTAJA":
                console.log("SISAANKIRJATTU_KAYTTAJA", action)
                return {
                    ...state, virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus, kirjautunut: action.payload.kirjautunut,
                    kirjautuminenAloitettu: action.payload.kirjautuminenAloitettu
                }
            case "REKISTEROI_KAYTTAJA":
                console.log("REKISTEROI_KAYTTAJA", action)
                return {
                    ...state, virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    rekisteroityminenAloitettu: action.payload.rekisteroityminenAloitettu
                }
            case "KIRJAUDU_SISAAN_VALITTU":
                console.log("KIRJAUDU_SISAAN_VALITTU", action)
                return {
                    ...state, kirjauduValittu: action.payload.kirjauduValittu,
                    virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    rekisteroidyValittu: action.payload.rekisteroidyValittu
                }

            case "REKISTEROIDY_VALITTU":
                console.log("REKISTEROIDY_VALITTU", action)
                return {
                    ...state, rekisteroidyValittu: action.payload.rekisteroidyValittu,
                    virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    kirjauduValittu: action.payload.kirjauduValittu
                }

            case "TENTTI_LISTA_HAKU_ALOITETTU":
                console.log("TENTTI_LISTA_HAKU_ALOITETTU", action)
                return {
                    ...state, tenttiListanHakuAloitettu: action.payload
                }

            case "TENTTI_LISTA_HAKU_OK":
                console.log("TENTTI_LISTA_HAKU_OK", action)
                appDataTilaKopio.tenttiListanHakuAloitettu = action.payload.tenttiListanHakuAloitettu
                appDataTilaKopio.tenttiListaData = action.payload.tenttiListaData
                appDataTilaKopio.tenttiListaDataPaivitettava = false
                return appDataTilaKopio
                
            case "VIRHE_TAPAHTUI":
                console.log("VIRHE_TAPAHTUI", action)
                return {
                    ...state, virhetila: action.payload.virhetila, virheilmoitus: action.payload.virheilmoitus,
                    kirjautuminenAloitettu: action.payload.kirjautuminenAloitettu,
                    tenttiListanHakuAloitettu: action.payload.tenttiListanHakuAloitettu
                }
            default:
                throw new Error("Reduceriin tultiin tuntemattomalla actionilla: " + action.type);
        }

    }

    useEffect(() => {
        const haeTenttiLista = async () => {

            try {
                dispatch({
                    type: "TENTTI_LISTA_HAKU_ALOITETTU",
                    payload: {
                        tenttiListanHakuAloitettu: true
                    }
                })

                const result = await axios.get(getServer() + '/tentit',
                    getTokendata());
                if (result.status === 200) { //haku ok
                    dispatch({
                        type: "TENTTI_LISTA_HAKU_OK",
                        payload: {
                            tenttiListanHakuAloitettu: false,
                            tenttiListaData: result.data
                        }
                    })
                }
                else { //joku muu virhe
                    throw new Error("Virhetilanne!");
                }
            }
            catch (error) {
                console.log("error tulos: ", error)
                dispatch({
                    type: "VIRHE_TAPAHTUI",
                    payload:
                    {
                        virhetila: true,
                        virheilmoitus: "Tenttidatan haku epäonnistui!",
                        tenttiListanHakuAloitettu: false
                    }
                })
            }
        }
        if (appDataTila.tenttiListaDataPaivitettava && appDataTila.kirjautunut) {
            haeTenttiLista()
        }
    }, [appDataTila.tenttiListaDataPaivitettava, appDataTila.kirjautunut])

    return (
        <div className='flex-container'>

            <div>
                <SovellusValikko kirjautunut={appDataTila.kirjautunut}
                    virhetila={appDataTila.virhetila}
                    virheilmoitus={appDataTila.virheilmoitus}
                    kirjauduValittu={appDataTila.kirjauduValittu}
                    rekisteroidyValittu={appDataTila.rekisteroidyValittu}
                    dispatch={dispatch} />
            </div>
        </div>
    );
}

export default AdminTenttiApp;