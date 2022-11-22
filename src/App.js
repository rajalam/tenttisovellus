import logo from './logo.svg';
import './App.css';
//import Luokka from './Luokka';
import Tentti from './Tentti';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu
import Kirjautuminen from './Kirjautuminen';
//import Kysymys from './Kysymys';
//import Vastausvaihtoehto from './Vastausvaihtoehto';

function reducer(state, action) {

  //tehdään täysi kopio appDatasta
  let appDataKopio = JSON.parse(JSON.stringify(state))

  switch (action.type) {

    case 'VASTAUS_VE_NIMI_MUUTTUI':
      console.log("Reduceria kutsuttiin", action)

      let nimi = action.payload.nimi
      //appDataKopio = {...state}

      //haetaan appDatakopion ja muiden komponenttien läpi vastausve nimi ja 
      //tallennetaan se appDataKopioon
      //miten valittu tentti ja sen indeksointi?
      appDataKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastausvaihtoehdot[action.payload.vastausvaihtoehtoIndex].nimi = nimi

      //data tallennus tarvitaan
      appDataKopio.tallennetaanko = true

      //data muutettu
      appDataKopio.dataMuutettu = true

      //muistuta käyttäjää nollataan, koska data muuttunut
      appDataKopio.muistutaKayttajaa = false

      return appDataKopio

    case 'VASTAUS_VE_POISTETTIIN':
      console.log("Reduceria kutsuttiin", action)

      //console.log("Reducer, TenttiIndex", action.payload.tenttiIndex)

      //kopioidaan ap tentti, toimiiko muokkaus täs cases 
      //{...state} syntaksilla oikein?, jos ei kopio mene läpi kaikkien tasojen?
      //let tenttiKopio2 = {...state}
      //tenttiKopio = JSON.parse(JSON.stringify(state))

      //haetaan poistettavaksi merkitty vastausvaihtoehto object ja poistetaan se
      //miten valittu tentti ja sen indeksointi?
      appDataKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastausvaihtoehdot.splice(action.payload.vastausvaihtoehtoIndex, 1);

      //data tallennus tarvitaan
      appDataKopio.tallennetaanko = true

      //data muutettu
      appDataKopio.dataMuutettu = true

      //muistuta käyttäjää nollataan, koska data muuttunut
      appDataKopio.muistutaKayttajaa = false


      //näköjään yhtä click kohden reducer funktiota kutsutaan kaksi kertaa, joten
      //välillä yksi poista painallus poistaa kaksi vastausvaihtoehtoa, välillä yhden
      //vielä tarkemmin valittu ja sitä seuraava vastausvaihtoehto poistuu, kiitos sen
      //että 2x tulee tämä reducer funktio kutsutuksi per onClick event,
      //jos valittu listan   viimeinen vastausvaihtoehto, vain se poistuu
      //RATKAISUEHDOTUS: lisää joku tilatieto, esim. boolean jolla if-ehdollal voi tarkistaa
      //että vain ekalla kutsukierroksella suoritetaan tuo poisto action, tokalla enää ei
      //toinen ve: käyttämällä kopioivaa, eikä mutatoivaa funktiota listan säädölle,
      //homman pitäisi myös ratketa eli lisäystä ei voi tehdä pushilla, vaan esim. slicella
      //kopio ensin ja sitten push?
      //3. ve: varmin keino: JSON.parse.(JSON.stringify(state)) täyskopioimalla ensin, vt. github juuso esim.?
      //ja tän jälkeen tehdä muunto-operaatio tälle luodulle kopiolle
      //4. ve: kopioida ensin muutettava lista esim. kysymykset(esim. slicella) ja muokata
      //tätä kopiota sen jälkeen, niin pitäisi ehkä vika poistua?
      //5. ve Anna-sofia idea: Vielä siihen edelliseen ongelmaan liittyen, 
      //tarkemmin tarkasteltuna taitaa riittää, että 
      //rivin "stateCopy.questions = stateCopy.questions.slice();" 
      //muuttaa riviksi "stateCopy.questions = state.questions.slice();" 
      //eli turhaahan siinä on lähteä koodia suuremmin muuttamaan kopioimalla
      // ensin vastaukset jne.
      //console.log("Reduceria kutsuttiin", tenttiKopio2)

      //tenttiKopio2.kysymykset[action.payload.kysymysIndex].vastausvaihtoehdot.splice([action.payload.vastausvaihtoehtoIndex], 1) 

      return appDataKopio

    case 'VASTAUS_VE_LISATTIIN':
      console.log("Reduceria kutsuttiin", action)

      //console.log("Reducer, TenttiIndex", action.payload.tenttiIndex)

      //täysi kopio tentistä
      //tenttiKopio = JSON.parse(JSON.stringify(state))

      //haetaan kysymys, johon liittyvä tyhjä vastausvaihtoehto on tarkoitus lisätä
      //ja lisätään se ko. vastausvaihtoehtolistan loppuun
      //miten valitaan oikea tentti ja sen indeksointi?
      appDataKopio.tentit[action.payload.tenttiIndex].kysymykset[action.payload.kysymysIndex].vastausvaihtoehdot.push(
        {
          nimi: "", onkoOikein: false
        }
      )

      //data tallennus tarvitaan
      appDataKopio.tallennetaanko = true

      //data muutettu
      appDataKopio.dataMuutettu = true

      //muistuta käyttäjää nollataan, koska data muuttunut
      appDataKopio.muistutaKayttajaa = false


      return appDataKopio

    case "MUISTUTA_KAYTTAJAA":
      console.log("Reduceria kutsuttiin", action)
      return { ...state, muistutaKayttajaa: action.payload }

    case "ALUSTA_DATA":
      console.log("Reduceria kutsuttiin", action)
      return { ...action.payload, tietoAlustettu: true }

    case "PAIVITA_TALLENNUSTILA":
      console.log("Reduceria kutsuttiin", action)
      return { ...state, tallennetaanko: action.payload }

    default:
      throw new Error("reduceriin tultiin jännällä actionilla");
  }
}

const TenttiSovellus = () => {


  /*
  let oppilas1 = { nimi: "Olli Oppilas" }

  let oppilas2 = { nimi: "Mikko Mallikas" }
  let oppilas3 = { nimi: "Kalle Kolmonen" }


  let luokka1 = {
    nimi: "3A",
    opplaidenMäärä: 27,
    oppilaat: [oppilas1, oppilas3]
  }

  let luokka2 = {
    nimi: "2B",
    opplaidenMäärä: 24,
    oppilaat: [oppilas2]
  }

  let koulu = {
    oppilaidenMäärä: 100,
    nimi: "Kangasalan ala-aste",
    luokat: [luokka1, luokka2]
  }
 */

  /* vastausvaihtoehtojen määrittely */
  let vastausvaihtoehto1 = {
    nimi: "gggggggggggggggg", onkoOikein: true
  }
  let vastausvaihtoehto2 = {
    nimi: "kkkkkkkkkkkkkkkkkkkkkkkkkk", onkoOikein: false
  }
  let vastausvaihtoehto3 = {
    nimi: "lllllllllll", onkoOikein: true
  }
  let vastausvaihtoehto4 = {
    nimi: "ooooooooooooooooooooooooo", onkoOikein: false
  }
  let vastausvaihtoehto5 = {
    nimi: "pppppppppppppp", onkoOikein: false
  }
  let vastausvaihtoehto6 = {
    nimi: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", onkoOikein: true
  }

  /* tenttikysymysten määrittely */
  let kysymys1 = {
    nimi: "Onko tässä järkee?",
    vastausvaihtoehdot: [vastausvaihtoehto1, vastausvaihtoehto2, vastausvaihtoehto3]
  }
  let kysymys2 = {
    nimi: "Entäs tässä?",
    vastausvaihtoehdot: [vastausvaihtoehto5, vastausvaihtoehto4, vastausvaihtoehto6]
  }
  let kysymys3 = {
    nimi: "Onko maailma valmis?",
    vastausvaihtoehdot: [vastausvaihtoehto3, vastausvaihtoehto4, vastausvaihtoehto5]
  }
  let kysymys4 = {
    nimi: "Mitä kuuluu?",
    vastausvaihtoehdot: [vastausvaihtoehto4, vastausvaihtoehto5, vastausvaihtoehto6]
  }
  let kysymys5 = {
    nimi: "Onko valmista jo?",
    vastausvaihtoehdot: [vastausvaihtoehto3, vastausvaihtoehto5, vastausvaihtoehto6]
  }
  let kysymys6 = {
    nimi: "Mitäs teet seuraavaksi?",
    vastausvaihtoehdot: [vastausvaihtoehto2, vastausvaihtoehto3, vastausvaihtoehto4]
  }
  let kysymys7 = {
    nimi: "Eikö ole vielä riittävän haastavaa?",
    vastausvaihtoehdot: [vastausvaihtoehto3, vastausvaihtoehto4, vastausvaihtoehto6]
  }

  //tenttien määrittely
  let tentti1 = {
    nimi: "Javascript perusteet",
    kysymykset: [kysymys1, kysymys2, kysymys3, kysymys4]
  }

  let tentti2 = {
    nimi: "Haskell perusteet",
    kysymykset: [kysymys4, kysymys5, kysymys6]
  }

  //appData
  let appisData = {
    tentit: [tentti1, tentti2],
    tallennetaanko: false,
    tietoAlustettu: false,
    dataMuutettu: false,
    muistutaKayttajaa: false
  }

  //reducer alustus
  const [appData, dispatch] = useReducer(reducer, appisData);

  //muistutusTimer alustus
  const [muistutusTimer, setMuistutusTimer] = useState(-1)

  //effectien alustus, suoritetaan renderöinnin eli return{...} sisällön rungon 
  //suoritus jälkeen
  useEffect(() => {

    const haeData = async () => {

      try {
        //tässä kohtaa voi hakea kaikki tenttitiedot(kaikki tentit) db:sta, 
        //toinen useEffect voi hoitaa tietyn tentin tiedot, kun tietty tentti valittu
        //reducerissa hoidetaan reactin tilaa
        //esim. toast kirjasto eri virheiden näyttöön käyttäjälle
        //JSON objekti pitää rakentaa ja pyörittää jossain, joko palvelimella tai reactin puolella

        const result = await axios('http://localhost:8080');
        console.log("get result:", result)
        //dispatch({ type: "ALUSTA_DATA", payload: result.data })
        dispatch({ type: "ALUSTA_DATA", payload: result.data.data })
      } catch (error) {
        console.log("virhetilanne", error)
      }
    }
    haeData()
  }, []);

  /* //haetaan appdata
  let appdata = localStorage.getItem("appdata");

  if( appdata != null ) { //local storage dataa löytyi
    
    console.log("Data luettu local storagesta")

    dispatch({ type: "ALUSTA_DATA", payload: (JSON.parse(appdata) )})
  } else { //local storage dataa ei löytynyt, tiedot haetaan vakiosta
    
    console.log("Tiedot haettu vakiosta")
    localStorage.setItem("appdata", JSON.stringify( appisData ) )
    dispatch({ type: "ALUSTA_DATA", payload: appisData } )
  }
*/
  //}, []);

  useEffect(() => {

    const tallennaData = async () => {

      try {

        const result = await axios.post('http://localhost:8080', {
          data: appData
        })
        dispatch({ type: "PAIVITA_TALLENNUSTILA", payload: false })
      } catch (error) {
        console.log("virhetilanne", error)
      }
    }

    if (appData.tallennetaanko) { //tallennus tila menossa, päivitetään appdata

      tallennaData() //tallennetaan

      /* console.log("Appdata pitää tallentaa")
      console.log("Appdata: ", appData)

      if (muistutusTimer > -1) { //jos timer käynnissä
        clearTimeout(muistutusTimer)
      }

      setMuistutusTimer(setTimeout(() => {

        //timer pitäisi myös nollata jossain kohtaa, että jokainen käyttäjän muutos
        //tuottama timer nollataan ettei ne jää taustalle pyörimään
        //aina uutta timeria ja MUISTUTA_KAYTTAJAA tulee kutsutuksi per jokainen muutos
        //clearTimerilla, tällä toteutuksella timeout-funktio laukeaa vaikka käyttäjä
        //muokkaisi jotain esim. 10 sekunnin välein niin silti jokaista syötettä/muutosta kohti
        //timeout laukee eli pitäisi miettiä tarkemmin, missä timeout funktio käynnistetään ja
        //missä myös jo käynnistetty timer kannattaa nollata

        console.log("setTimeout laukee")
        dispatch({ type: "MUISTUTA_KAYTTAJAA", payload: true })
      }, 5000
      ))

      appData.dataMuutettu = false

      localStorage.setItem("appdata", JSON.stringify(appData))
      dispatch({ type: "PAIVITA_TALLENNUSTILA", payload: false }) */

    }

  }, [appData.tallennetaanko]);

  return (

    <div className="flex-container">

      {/* <Header /> */}
      <div>
        {/* 
        {appData.tietoAlustettu && appData.tentit.map((tentti, index) =>
          <Tentti tentti={tentti} tenttiIndex={index} dispatch={dispatch} />)}
        */}
        <Kirjautuminen/>
      </div>

      {/* <div>
        {tentti.muistutaKayttajaa && <h1>HERÄÄ PAHVI</h1>}
      </div> */}

    </div>

  );
}

export default TenttiSovellus;
