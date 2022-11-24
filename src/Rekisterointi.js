import './App.css';

const Rekisterointi = (props) => {

    return(
      <div>

        {/* Jos sama käyttäjätunnus jo aiemmin talletettu kantaan, näytetään käyttäjälle "Virheellinen käyttäjätunnus tjsp." */}
        <h4>Syötä uusi käyttäjätunnus ja salasana</h4>
        
        <form onSubmit={ async (event) => {
          event.preventDefault() 
          
            /* trk. pitääkö onSubmit default toiminta estää, 
            vt. keskustelu https://stackoverflow.com/questions/39809943/react-preventing-form-submission */
            try {
              //alert('here') 
              //console.log("ev.target.value: ", event)
              //console.log("ev.tunnus.target.value: ", event.target.tunnus.value)
              const result = await axios.post('https://localhost:4000/rekisterointi',
                {
                  kayttajanimi: event.target.tunnus.value,
                  salasana: event.target.salasana.value
                }              
              )
              //TODO token tallennus to localstorage tässä kohtaa
              if(result.status === 201) { //rekisteröinti ok
                props.dispatch({
                  type: "REKISTEROI_KAYTTAJA",
                  payload:
                  {
                    tunnus: event.target.tunnus.value,
                    salasana: event.target.salasana.value
                  }
                })
              }
              else { //joku muu virhe tapahtui kirjautumisessa
                throw new Error("Virhetilanne!")
              }
              //console.log("post tulos: ", result.data.data)
              
            } catch (error) {
              //TODO virhekäsittely, geneerinen virhedispatch, esim. case "VIRHE", vt. heikki mallidemo
              console.log("error tulos: ", error)
              props.dispatch({
                type: "VIRHE",
                payload:
                {
                  virheilmoitus: "Käyttäjätunnuksen luonti epäonnistui!"
                }
              })
            }
                        
          }}>
        <div><label for="tunnus">Käyttäjätunnus:</label></div>
        <div><input type="text" id="tunnus" name="tunnus"/></div>

        <div><label for="salasana">Salasana:</label></div>
        <div><input type="password" id="salasana" name="salasana"/></div>

        <div><input type="submit"  
            value="Luo uusi käyttäjätunnus!"/></div>
        </form>
      </div>  
    );
}

export default Rekisterointi;