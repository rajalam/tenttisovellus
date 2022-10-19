import logo from './logo.svg';
import './App.css';
import Luokka from './Luokka';
import Tentti from './Tentti';
import { useState,useReducer } from "react"
//import Kysymys from './Kysymys';
//import Vastausvaihtoehto from './Vastausvaihtoehto';

function reducer(state, action) {
  switch (action.type) {
      
    case 'VASTAUS_VE_NIMI_MUUTTUI':
      console.log("Reduceria kutsuttiin", action)
      
      let nimi = action.payload.nimi
      let tenttiKopio = {...state}

      //haetaan tenttikopion ja muiden komponenttien läpi vastausve nimi ja 
      //tallennetaan se tenttikopioon
      tenttiKopio.kysymykset[action.payload.kysymysIndex].vastausvaihtoehdot[action.payload.vastausvaihtoehtoIndex].nimi = nimi      
      
      return tenttiKopio
      
    case 'VASTAUS_VE_POISTETTIIN':
      console.log("Reduceria kutsuttiin", action)

      //kopioidaan ap tentti, toimiiko muokkaus täs cases 
      //{...state} syntaksilla oikein?, jos ei kopio mene läpi kaikkien tasojen?
      //let tenttiKopio2 = {...state}
      let tenttiKopio2 = JSON.parse(JSON.stringify(state))

      //haetaan poistettavaksi merkitty vastausvaihtoehto object ja poistetaan se
      tenttiKopio2.kysymykset[action.payload.kysymysIndex].vastausvaihtoehdot.splice(action.payload.vastausvaihtoehtoIndex, 1);
      
      //näköjään yhtä click kohden reducer funktiota kutsutaan kaksi kertaa, joten
      //välillä yksi poista painallus poistaa kaksi vastausvaihtoehtoa, välillä yhden
      //vielä tarkemmin valittu ja sitä seuraava vastausvaihtoehto poistuu, kiitos sen
      //että 2x tulee tämä reducer funktio kutsutuksi per onClick event,
      //jos valittu listan viimeinen vastausvaihtoehto, vain se poistuu
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

      return tenttiKopio2

      default:
      throw new Error("reduceriin tultiin jännällä actionilla");
  }
}

const TenttiSovellus = () => {

  
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

  //tentit
  let tentit = [tentti1, tentti2]

  //reducer alustus
  const [tentti, dispatch] = useReducer(reducer, tentti1);


  return (

    <div className="flex-container">

      {/* <Header /> */}
      <div><Tentti tentti={tentti} dispatch={dispatch} /></div>

    
    </div>

  );
}

export default TenttiSovellus;
