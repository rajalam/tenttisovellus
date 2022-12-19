import './UserTenttiApp.css'
import SovellusValikko from './SovellusValikko';
import { useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu


//appDataTila
const alkuTila = {

    kirjautuminenAloitettu: false,
    rekisteroityminenAloitettu: false,
    kirjautunut: false,
    virhetila: false,
    virheilmoitus: "",
    kirjauduValittu: false,
    rekisteroidyValittu: false,
    tentitValittu: false,
    valittuTenttiIndex: -1,
    valittuTenttiId: -1,
    palvelinYhteysAloitettu: false,
    tenttiListaDataPaivitettava: true
}


const UserTenttiApp = () => {

    //reducer alustus
    const [appDataTila, dispatch] = useReducer(reducer, alkuTila);


    function reducer(state, action) {

        //tehdään täysi kopio appDatasta
        let appDataTilaKopio = JSON.parse(JSON.stringify(state))

        switch (action.type) {

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

            case "TENTIT_VALITTU":
                console.log("TENTIT_VALITTU", action)
                return {
                    ...state, rekisteroidyValittu: action.payload.rekisteroidyValittu,
                    virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    kirjauduValittu: action.payload.kirjauduValittu,
                    tentitValittu: action.payload.tentitValittu,
                    valittuTenttiIndex: -1,
                    valittuTenttiId: -1
                }

            case "KIRJAA_ULOS_KAYTTAJA":
                console.log("KIRJAA_ULOS_KAYTTAJA", action)
                return {
                    ...state, kirjautunut: false,
                    virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    tenttiListaDataPaivitettava: true,
                    valittuTenttiIndex: -1,
                    valittuTenttiId: -1
                }

            case "SISAANKIRJAUTUMINEN_ALOITETTU":
                console.log("SISAANKIRJAUTUMINEN_ALOITETTU", action)
                return {
                    ...state, kirjautuminenAloitettu: action.payload.kirjautuminenAloitettu
                }

            case "SISAANKIRJATTU_KAYTTAJA":
                console.log("SISAANKIRJATTU_KAYTTAJA", action)
                return {
                    ...state, virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    kirjautunut: action.payload.kirjautunut,
                    kirjautuminenAloitettu: action.payload.kirjautuminenAloitettu,
                    tenttiListaDataPaivitettava: true,
                    tentitValittu: false,
                    valittuTenttiIndex: -1,
                    valittuTenttiId: -1
                }

            case "REKISTEROITYMINEN_ALOITETTU":
                console.log("REKISTEROITYMINEN_ALOITETTU", action)
                return {
                    ...state, rekisteroityminenAloitettu: action.payload.rekisteroityminenAloitettu
                }

            case "REKISTEROI_KAYTTAJA":
                console.log("REKISTEROI_KAYTTAJA", action)
                return {
                    ...state, virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    rekisteroityminenAloitettu: action.payload.rekisteroityminenAloitettu,
                    tenttiListaDataPaivitettava: true
                }

            case "VIRHE_TAPAHTUI":
                console.log("VIRHE_TAPAHTUI", action)
                return {
                    ...state,
                    virhetila: action.payload.virhetila,
                    virheilmoitus: action.payload.virheilmoitus,
                    kirjautuminenAloitettu: action.payload.kirjautuminenAloitettu,
                    tenttiListanHakuAloitettu: action.payload.tenttiListanHakuAloitettu,
                    palvelinYhteysAloitettu: action.payload.palvelinYhteysAloitettu
                }
            default:
                throw new Error("Reduceriin tultiin tuntemattomalla actionilla: " + action.type);
        }

    } //end reducer

    return (

        <>
            <div className='sovellusValikko'>
                <SovellusValikko kirjautunut={appDataTila.kirjautunut}
                    virhetila={appDataTila.virhetila}
                    virheilmoitus={appDataTila.virheilmoitus}
                    kirjauduValittu={appDataTila.kirjauduValittu}
                    rekisteroidyValittu={appDataTila.rekisteroidyValittu}
                    dispatch={dispatch} />
            </div>
        </>
    );
}

export default UserTenttiApp;