import logo from './logo.svg';
import './App.css';
import Luokka from './Luokka';
import Tentti from './Tentti';
//import Kysymys from './Kysymys';
//import Vastausvaihtoehto from './Vastausvaihtoehto';

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

  return (

    <div className="flex-container">

      {/* <Header /> */}
      <div><Tentti tentti={tentti1} /></div>

    </div>

  );
}

export default TenttiSovellus;
