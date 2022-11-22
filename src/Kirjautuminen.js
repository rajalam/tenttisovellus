import './App.css';

import axios from 'axios'
import { keyboardImplementationWrapper } from '@testing-library/user-event/dist/keyboard';

const Kirjautuminen = (props) => {

  return (
    <div>

      {/* Jos käyttäjätunnus/salasana pari syötetty ja tarkkailtu->ei toiminut, 
        näytetään käyttäjälle "Tarkasta käyttäjätunnus/salasana" */}
      <h4>Syötä käyttäjätunnus ja salasana</h4>

      <form onSubmit={async (event) => {
          /* tähän väliin axios pyynnöt, try-catch, token tallennus localstorageen */
          /* alert('here') */
          try {
            alert('here') 
            const result = await axios.post('https://localhost:4000/kirjautuminen',
              {
                kayttajanimi: event.target.tunnus.value,
                salasana: event.target.salasana.value
              }
               TÄHÄN LISÄÄ HEADER + tarkista miten req . bodyyn saa axios kamaa,
                  Content-Type : application/json, vt. https://masteringjs.io/tutorials/axios/json
            )
            console.log("post tulos: ", result.data.data)
          } catch (error) {
            //TODO virhekäsittely
            console.log("error tulos: ", error)
          }
          props.dispatch({
            type: "SISAANKIRJAA_KAYTTAJA",
            payload:
            {
              tunnus: event.target.tunnus.value,
              salasana: event.target.salasana.value
            }
          })
        
        /* event.preventDefault()   */
      }}>
        <div><label for="tunnus">Käyttäjätunnus:</label></div>
        <div><input type="text" id="tunnus" name="tunnus" /></div>

        <div><label for="salasana">Salasana:</label></div>
        <div><input type="password" id="salasana" name="salasana" /></div>

        <div><input type="submit" 
          value="Kirjaudu sisään!" /></div>
      </form>
    </div>
  );
}

export default Kirjautuminen;