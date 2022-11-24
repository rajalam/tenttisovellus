import './App.css';

import axios from 'axios'


const Kirjautuminen = (props) => {

  return (
    <div>

      {/* Jos käyttäjätunnus/salasana pari syötetty ja tarkkailtu->ei toiminut, 
        näytetään käyttäjälle "Tarkasta käyttäjätunnus/salasana" */}
      <b color="red">{props.virhetila && props.virheilmoitus}  </b>
      <h4>Kirjaudu</h4>

      <form onSubmit={async (event) => {
          /* tähän väliin axios pyynnöt, try-catch, token tallennus localstorageen */
          /* alert('here') */
          /*  TÄHÄN LISÄÄ HEADER + tarkista miten req . bodyyn saa axios kamaa,
          Content-Type : application/json, vt. https://masteringjs.io/tutorials/axios/json */
          event.preventDefault()
          try {
            //alert('here') 
            //console.log("ev.target.value: ", event)
            //console.log("ev.tunnus.target.value: ", event.target.tunnus.value)
            const result = await axios.post('https://localhost:4000/kirjautuminen',
              {
                kayttajanimi: event.target.tunnus.value,
                salasana: event.target.salasana.value
              }              
            )
            //TODO token tallennus to localstorage tässä kohtaa
            if(result.status === 200) { //token luonti ok
              localStorage.setItem('usertoken', result.data.data.token)
            }
            else { //joku muu virhe tapahtui kirjautumisessa
              throw new Error("Virhetilanne!")
            }
            //console.log("post tulos: ", result.data.data)
            props.dispatch({
              type: "SISAANKIRJATTU_KAYTTAJA",
              payload:
              {
                virhetila: false,
                virheilmoitus: "",
                kirjautunut: true
              }
            })
          } catch (error) {
            //TODO virhekäsittely, geneerinen virhedispatch, esim. case "VIRHE", vt. heikki mallidemo
            console.log("error tulos: ", error)
            props.dispatch({
              type: "VIRHE_TAPAHTUI",
              payload:
              {
                virhetila: true,
                virheilmoitus: "Tarkista käyttäjätunnus ja salasana!"
              }
            })
          }     
                 
      }}>
        <div><label htmlFor="tunnus">Käyttäjätunnus:</label></div>
        <div><input type="text" id="tunnus" name="tunnus" /></div>

        <div><label htmlFor="salasana">Salasana:</label></div>
        <div><input type="password" id="salasana" name="salasana" /></div>

        <div><input type="submit" 
          value="Kirjaudu sisään!" /></div>
      </form>
    </div>
  );
}

export default Kirjautuminen;