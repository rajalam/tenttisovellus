import './App.css';

const Rekisterointi = (props) => {

    return(
      <div>

        {/* Jos sama käyttäjätunnus jo aiemmin talletettu kantaan, näytetään käyttäjälle "Virheellinen käyttäjätunnus tjsp." */}
        <h4>Syötä uusi käyttäjätunnus ja salasana</h4>
        
        <form>
        <div><label for="tunnus">Käyttäjätunnus:</label></div>
        <div><input type="text" id="tunnus" name="tunnus"/></div>

        <div><label for="salasana">Salasana:</label></div>
        <div><input type="password" id="salasana" name="salasana"/></div>

        <div><input type="submit" onsubmit={(event) => {
          props.dispatch({
            type: "REKISTEROI_KAYTTAJA",
            payload:
            {
              tunnus: event.target.tunnus.value,
              salasana: event.target.salasana.value
            }
          })
        }} 
            value="Luo uusi käyttäjätunnus!"/></div>
        </form>
      </div>  
    );
}

export default Rekisterointi;