import './App.css';

const Kirjautuminen = (props) => {

    return(
      <div>

        {/* Jos käyttäjätunnus/salasana pari syötetty ja tarkkailtu->ei toiminut, 
        näytetään käyttäjälle "Tarkasta käyttäjätunnus/salasana" */}
        <h4>Syötä käyttäjätunnus ja salasana</h4>
        
        <form>
        <div><label for="tunnus">Käyttäjätunnus:</label></div>
        <div><input type="text" id="tunnus" name="tunnus"/></div>

        <div><label for="salasana">Salasana:</label></div>
        <div><input type="password" id="salasana" name="salasana"/></div>

        <div><input type="submit" onsubmit={(event) => {
          props.dispatch({
            type: "SISAANKIRJAA_KAYTTAJA",
            payload:
            {
              tunnus: event.target.tunnus.value,
              salasana: event.target.salasana.value
            }
          })
        }} 
            value="Kirjaudu sisään!"/></div>
        </form>
      </div>  
    );
}

export default Kirjautuminen;