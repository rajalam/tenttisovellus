const bodyparser = require('body-parser')
const fs = require('fs');
//const fs = require('fs').promises;
const https = require('https')
const express = require('express')  //Jos ei toimi, niin "npm install express"

const cors = require('cors')
const { Pool } = require('pg');
const { restart } = require('nodemon');
const app = express()
const port = 8080

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const e = require('cors');
const saltRounds = 10;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

app.use(cors())  //jos ei toimi, niin "npm install cors"
app.use(express.json());  //Ja jos haluaa bodyn suoraan req argumentista
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// Create a NodeJS HTTPS listener on port 4000 that points to the Express app
// Use a callback function to tell when the server is created.
https
  .createServer(
    // Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(4000, ()=>{
    console.log('server is running at port 4000')
  });

//tarvitaanko seuraavaa??
/* app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})
 */


/* 
const read = async () => {

  //lisää try-catch lohkot await haun ympärille
  const data = await fs.readFile('./appdata.json', {encoding: 'utf8', flag: 'r'}); //Voi kestää useita sekunteja
  console.log("Datan sisältö readFile tuloksena", data)
  return data;
}

const write = async (req) => {

  //lisää try-catch lohkot await haun ympärille
  const data = await fs.writeFile('appdata.json', JSON.stringify(req.body)); //Voi kestää useita sekunteja
  return data;
}
 */

 /*

app.get('/', (req, res) => {
  //console.log("Palvelimelta kysellään dataa")
  res.send("Hello from express server.")
  //res.send('Hello!')
  //const data = read()
  //console.log("Datan sisältö read tuloksena", data)
  //res.send(data) // tiedon luku asynkronisesti
})



/*
app.post('/', (req, res) => {
  console.log("Palvelimelle tallennetaan dataa")
  write(req)// tiedon kirjoitus asynkronisesti  req.body antanee tarvittavan datan
  //res.send('Hello World!')
  res.send('Datan tallennus lienee onnistunut, kun tänne asti päästiin!')
})
 */

let salasana = "salasana"
let kayttajanimi = "vilho@gmail.com"

//käyttäjänimen + salasanan lisäys kantaan eli ns. käyttäjätunnuksen rekisteröinti
//syöte: JSON {"kayttajanimi":"KAYTTAJANIMI", "salasana":"SALASANA"}, kayttajanimi, salasana oltava merkkijonoja
//tulos: JSON [success, data]
//HTTP vastauskoodit
//201 data luonti OK
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tietoturvaominaisuudet(esim. salasanan salaus kannassa+liikenteessä)
app.post('/rekisterointi', async (req, res, next) => {  
  
  const kayttajanimi = String(req.body.kayttajanimi)  
  const salasana = String(req.body.salasana)  

  if(!kayttajanimi || !salasana) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return //next()??
  }      
  
  let result;
  console.log ("nyt lisätään kayttajatunnus+salasana")
  
    try {
      let tiiviste = await bcrypt.hash(salasana, saltRounds) //tiivisteen luonti
      result = await pool.query("INSERT INTO kayttaja (kayttajanimi, salasana, on_yllapitaja) VALUES ($1, $2, false) returning id",
      [kayttajanimi, tiiviste])

    }
    catch(e){
      //TODO Pitäiskö seur. if lohko ehto saada paremmin db rakenne riippumattomammaksi?
      if(e.constraint == "kayttaja_kayttajanimi_key") {
        //käyttäjätunnus luotu jo aiemmin, uutta dataa ei luotu
        res.status(204).send(e)
      }
      else { //jokin muu poikkeus tietokantahaussa
        res.status(500).send(e)
      }
      return      
    }

    
    let token;
    try {
      token = jwt.sign(
        { kayttajaId: result.rows[0].id, kayttajanimi: kayttajanimi },
        "secretkeyappearshere",
        { expiresIn: "1h" }
      );
    } catch (err) {
      res.status(500).send(e) //jotain poikkeavaa tapahtui
      return
    }

    res
    .status(201)
    .json({
      success: true,
      data: { kayttajaId: result.rows[0].id,
          kayttajanimi: kayttajanimi, 
          token: token },
    });

  })

  
//käyttäjätunnus+salasana parin olemassaolon tarkistushaku tietokannassa->kirjautuminen
//syöte: body {kayttajanimi, salasana} oltava merkkijonoja
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//200 haku OK
//401 autentikointi epäonnistui
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tietoturva(esim. salasanan + tietoliikenteen salaus), mikä paluuarvo tarvitaan?
app.post('/kirjautuminen', async (req, res, next) => {  
  
  const kayttajanimi = String(req.body.kayttajanimi)
  const salasana = String(req.body.salasana) 
  
  if(!kayttajanimi || !salasana) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }    

  console.log ("nyt vahvistetaan käyttäjätunnus+salasana parin olemassaolo")
  //console.log ("req.body: ", req.body)  
  //console.log ("req.body.kayttajanimi: ", req.body.kayttajanimi)

  let olemassaolevaKayttaja
  let salasanaTasmays = false
    try {
      result = await pool.query(
        "select * from kayttaja where kayttajanimi = ($1)", 
        [kayttajanimi])
      
      olemassaolevaKayttaja = {id: result.rows[0].id, 
        kayttajanimi: result.rows[0].kayttajanimi,
        salasana: result.rows[0].salasana}
      
      salasanaTasmays = await bcrypt.compare(salasana, olemassaolevaKayttaja.salasana)  
      //console.log ("result: ", result) 
      //res.setHeader("Content-type", "application/json")      
      //res.status(200).send(result.rows)
      
      //res.send(result.rows)
      
    }
    catch(e){
      res.status(500).send(e)
      return
    }

    if( !olemassaolevaKayttaja || !salasanaTasmays ) {
      res.status(401).send(e) //tarkasta käyttäjätunnus ja salasana asiakkaalle
      return
    }
    let token
    try {
      //luodaan jwt token
      token = jwt.sign(
        { kayttajaId: olemassaolevaKayttaja.id,
        kayttajanimi: olemassaolevaKayttaja.kayttajanimi },
        "secretkeyappearshere",  //dotenv!! tätä hyvä käyttää!!
        { expiresIn: "1h"}
      )      
    }
    catch( e ) {
      res.status(500).send(e)
      return
    }

    res.status(200).json({ success: true,
      data: {
        kayttajaId: olemassaolevaKayttaja.id,
        kayttajanimi: olemassaolevaKayttaja.kayttajanimi,
        token: token
      }
    })

})


const vahvistaToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  //tarvitaan Header  Authorization: 'bearer TOKEN'
  if(!token) {
    res.status(200).json(
      {success: false,
      message: "Error! Tokenia ei ole toimitettu/puuttuu."}
    )
    return //next()
  }

  //dekoodataan TOKEN
  const decodedToken = jwt.verify(token, "secretkeyappearshere")
  req.decoded = decodedToken
  next()
}

//vaaditaan token vahvistus kaikille metodeille tästä rivistä eteenpäin
app.use(vahvistaToken)

//TEST
app.get('/', async (req, res) => {
  console.log(req.decoded)
  res.send("Nyt ollaan kirjautumista vaativassa palvelussa")
})




//TODO TEE UUDESTAAN seuraava, jos/kun tentti poisto toteutus vaan passivoinnilla
//tenttien haku
//syöte: -
//tulos: JSON [id, nimi]
//HTTP vastauskoodit
//200 haku OK
//500 palvelinvirhe
//TODO mahd. lisäys, jolla haetaan vain tiettyyn käyttäjään liittyvät tentit, koska ei ehkä mielekästä
//hakea kaikkia kannassa olevia tenttejä roolista riippumatta?
app.get('/tentit', async (req, res) => {  
  
  //const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt haetaan tentit")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("select * from tentti", [])
      //res.body = result
      res.setHeader("Content-type", "application/json")
      //res.body = result.body
      res.status(200).send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//kysymysten haku tietyn tentin perusteella
//syöte: URL tenttiId oltava kokonaisluku
//tulos: JSON [id, nimi]
//HTTP vastauskoodit
//200 haku OK
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO 
app.get('/tentit/:tenttiId/kysymykset', async (req, res) => {  
  
  const id = Number(req.params.tenttiId)
  if(!id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }  
    
  console.log ("nyt haetaan kysymykset")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query(
        "select kysymys.id, kysymys.nimi from tentti, kysymys where tentti.id = kysymys.tentti_id and tentti.id = ($1)", [id])
      //res.body = result
      res.setHeader("Content-type", "application/json")      
      res.status(200).send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
    
})

//vastausvaihtoehtojen haku tietyn kysymysid perusteella
//syöte: URL id oltava kokonaisluku
//tulos: JSON [id, nimi, on_oikea]
//HTTP vastauskoodit
//200 haku OK
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO 
app.get('/kysymykset/:id/vastausvaihtoehdot', async (req, res) => {  
  
  const id = Number(req.params.id)  
    
  if(!id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }  
  
  console.log ("nyt haetaan vastausvaihtoehdot")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query(
        "select vastausvaihtoehto.id, vastausvaihtoehto.nimi, vastausvaihtoehto.on_oikea from kysymys, vastausvaihtoehto where kysymys.id = vastausvaihtoehto.kysymys_id and kysymys.id = ($1)", [id])
      
      res.setHeader("Content-type", "application/json")      
      res.status(200).send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})


//tietyn oppilaan vastauksen haku tietyn vastausvaihtoehdon perusteella oppilas näkymässä
//syöte: URL id, kayttajaId oltava kokonaisluku
//tulos: JSON [valittu]
//HTTP vastauskoodit
//200 haku OK
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO 
app.get('/vastausvaihtoehdot/:id/kayttajat_vastaukset/:kayttajaId', async (req, res) => {  
  
  const vastausvaihtoehtoId = Number(req.params.id)  
  const kayttajaId = Number(req.params.kayttajaId) //vaatiiko Number muunnoksen?
  
  if(!vastausvaihtoehtoId || !kayttajaId) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }  
  
  console.log ("nyt haetaan oppilaan vastaus")
  //console.log ("kayttajaId: ", kayttajaId)
  //console.log ("req.body.kayttajaid: ", req.body.kayttajaid)
    try {
      result = await pool.query(
        "select kayttaja_vastaus.valittu from kayttaja_vastaus, kayttaja, vastausvaihtoehto where kayttaja.id = kayttaja_vastaus.kayttaja_id and vastausvaihtoehto.id = kayttaja_vastaus.vastausvaihtoehto_id and vastausvaihtoehto.id = ($1) and kayttaja_id = ($2)", 
        [vastausvaihtoehtoId, kayttajaId])
      
      res.setHeader("Content-type", "application/json")      
      res.status(200).send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//oppilaan vastaus lisäys, joka on post-metodin tuloksena aina true, koska oletuksena oppilaan vastauksen puuttuessa
//kayttaja_vastaus taulusta, on vastauksen arvo false, put-metodilla boolean arvon muutokset
//syöte: URL vastausvaihtoehtoId, kayttajaId oltava kokonaisluku
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//201 data luonti OK
//204 käsitelty, ei sisältöä
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO
app.post('/vastausvaihtoehdot/:vastausvaihtoehtoId/kayttajat_vastaukset/:kayttajaId', async (req, res) => {  
  
  const vastausvaihtoehtoId = Number(req.params.vastausvaihtoehtoId)  
  const kayttajaId = Number(req.params.kayttajaId)  
  
  if(!vastausvaihtoehtoId || !kayttajaId) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }      

  console.log ("nyt lisätään oppilaan vastaus")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("INSERT INTO kayttaja_vastaus (valittu, kayttaja_id, vastausvaihtoehto_id) VALUES (true, $1 , $2) returning id",[kayttajaId, vastausvaihtoehtoId])
      
      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
            
    }
    catch(e){
      res.status(500).send(e)
    }
})

//vastauksen muokkaus, vastauksen uusi arvo bodyyn json syntaksilla: {"valittu":false} || {"valittu":true}
//syöte: URL vastausvaihtoehtoId, kayttajaId oltava kokonaisluku, 
//JSON {"valittu":BOOLEAN} BOOLEAN oltava boolean arvo
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO
app.put('/vastausvaihtoehdot/:vastausvaihtoehtoId/kayttajat_vastaukset/:kayttajaId', async (req, res) => {  
  
  const vastausvaihtoehtoId = Number(req.params.vastausvaihtoehtoId)  
  const kayttajaId = Number(req.params.kayttajaId)  
  const valittu = req.body.valittu
  
  if(!vastausvaihtoehtoId || !kayttajaId || valittu === undefined ) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }

  console.log ("nyt muokataan vastausta")
  console.log ("vastausvaihtoehtoID: ",vastausvaihtoehtoId)
  console.log ("valittu: ",valittu)
    try {
      result = await pool.query("update kayttaja_vastaus set valittu = ($1) where kayttaja_id = ($2) and vastausvaihtoehto_id = ($3) returning *",
      [valittu, kayttajaId, vastausvaihtoehtoId])

      if(result.rowCount > 0) { //muokkaus ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
      
    }
    catch(e){
      res.status(500).send(e)
    }
})

//tarkistetaan, että käyttäjällä ylläpitokäyttäjäoikeudet(admin)
//OAUTH2,  NODE express passport plugin (gmail, facebook...)
const vahvistaYllapitajaOikeudet = async (req, res, next) => {
  
  try {
    result = await pool.query("SELECT * FROM kayttaja WHERE kayttajanimi = $1 ", [req.decoded?.kayttajanimi])
    let yllapitaja = result.rows[0].on_yllapitaja
    if (yllapitaja) { 
      next() 
    } else {
      res.status(403).send("Error! Käyttäjällä ei ylläpitäjän käyttöoikeutta.")
      return
    }    
  }
  catch (e) {
    res.status(500).send(e)
    return
  }

}

//vaaditaan admin käyttäjäoikeudet kaikille metodeille tästä rivistä eteenpäin
app.use(vahvistaYllapitajaOikeudet)

//TODO
//  JATKA TÄSTÄ, ehkä myös lisää on_yllapitaja to token, lisäksi vain admin oikeus suorittaa
//  varten pitäisi luoda oma erillinen middleware tarkastusfunktio ennen varsinaisen funktion suoritusta


//TODO TEE UUDESTAAN seuraava, jos/kun tentti poisto toteutus vaan passivoinnilla
//tentin lisäys
//syöte: JSON {"nimi":"NIMI"}, NIMI oltava merkkijono
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//201 data luonti OK
//204 käsitelty, ei sisältöä
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.post('/tentit', async (req, res) => {  
  
  const nimi = String(req.body.nimi)  

  if(!nimi) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }    
    
  console.log ("nyt lisätään tenttiä")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("INSERT INTO tentti (nimi) VALUES ($1) returning id",[nimi])
      
      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
      
    }
    catch(e){
      res.status(500).send(e)
    }
})

//kysymys lisäys
//syöte: URL tenttiId oltava kokonaisluku, JSON {"nimi":"NIMI"}, NIMI oltava merkkijono
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//201 data luonti OK
//204 käsitelty, ei sisältöä
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.post('/tentit/:tenttiId/kysymykset', async (req, res) => {  
  
  const id = Number(req.params.tenttiId)  
  const nimi = String(req.body.nimi)
  
  if(!nimi || !id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }      

  console.log ("nyt lisätään kysymys")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("INSERT INTO kysymys (nimi, tentti_id) VALUES ($1, $2) returning id",[nimi, id])
      
      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
            
    }
    catch(e){
      res.status(500).send(e)
    }
})

//vastausvaihtoehto lisäys
//syöte: URL id oltava kokonaisluku, JSON {"nimi":"NIMI"}, NIMI oltava merkkijono
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//201 data luonti OK
//204 käsitelty, ei sisältöä
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.post('/kysymykset/:id/vastausvaihtoehdot', async (req, res) => {  
  
  const id = Number(req.params.id)  
  const nimi = String(req.body.nimi)

  if(!nimi || !id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }      

  console.log ("nyt lisätään vastausvaihtoehto")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("INSERT INTO vastausvaihtoehto (nimi, on_oikea, kysymys_id) VALUES ($1, false, $2) returning id",[nimi, id])
      
      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
            
    }
    catch(e){
      res.status(500).send(e)
    }
})


//tietyn käyttäjätunnuksen olemassaolon tarkistushaku tietokannassa, pal. boolean
//tarkistettava käyttäjätunnus bodyssa muodossa {"kayttajanimi":"TARKISTETTAVA"}
//tämä piti muuttaa .get->.post malliksi, jotta bodyssa json data tuli mukana
//tämä jää tarpeettomaksi, kun kayttajanimi kenttä merkitty UNIQUE constraintilla tietokannassa
//TODO 
/* app.post('/kayttajat/', async (req, res) => {  
  
  //const vastausvaihtoehtoId = Number(req.params.id)  
  //const kayttajaId = Number(req.params.kayttajaId) //vaatiiko Number muunnoksen?
  
  console.log ("nyt haetaan käyttäjätunnuksen olemassaolo")
  console.log ("req.body: ", req.body)  
  console.log ("req.body.kayttajanimi: ", req.body.kayttajanimi)
    try {
      result = await pool.query(
        "select * from kayttaja where kayttajanimi = ($1)", 
        [req.body.kayttajanimi])
      
      //console.log ("result: ", result) 
      //res.setHeader("Content-type", "application/json")      
      if(result.rowCount == 0) { //käyttäjänimeä ei löytynyt tietokannasta
        res.send(false)
      }
      else { //käyttäjänimi löytyi tietokannasta jo
        res.send(true)
      }
      //res.send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})
*/



//TODO TEE UUDESTAAN seuraava, jos/kun tentti poisto toteutus vaan passivoinnilla
//tentin poisto
//syöte: URL id oltava kokonaisluku
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
//TODO pitäisikö poistaa samalla tenttiin liittyvä data myös? ja vaatiiko ne transaktion käyttöä?
app.delete('/tentit/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  
  if(!id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }     
  
  console.log ("nyt poistetaan tenttiä")
  console.log ("tenttiID: ",id)
    try {
      result = await pool.query("delete from tentti where id = ($1)",[id])
      
      if(result.rowCount > 0) { //poisto ok
        res.status(204).send(result.rows)
      }
      else { //käsitelty, dataa ei ollut
        res.status(404).send(result)
      }
            
    }
    catch(e){
      res.status(500).send(e)
    }
})


//kysymys poisto
//syöte: URL id oltava kokonaisluku
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
//TODO liittyvien tietojen(mm. vastausvaihtoehtojen) poisto samalla toiminnolla?->ok
app.delete('/kysymykset/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  
  if(!id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }     
    
  console.log ("nyt poistetaan kysymys")
  console.log ("kysymysID: ",id)

  const client = pool.connect()
  if( !client ) { //db yhteys epäonnistui
    res.status(500).send()
    return
  }
    try {
      await client.query('BEGIN')

      //käyttäjän vastausten poisto
      result = await client.query("delete from kayttaja_vastaus where kayttaja_vastaus.vastausvaihtoehto_id in (select id from vastausvaihtoehto where kysymys_id = ($1) )",[id])
      result = await client.query("delete from vastausvaihtoehdot where kysymys_id = ($1) ", [id])
      result = await client.query("delete from kysymys where id = ($1)",[id])
      await client.query('COMMIT')

      if(result.rowCount > 0) { //poisto ok
        res.status(204).send(result.rows)
      }
      else { //käsitelty, dataa ei ollut
        res.status(404).send(result)
      }      
    }
    catch(e) {
      await client.query('ROLLBACK')
      res.status(500).send(e)
    }
    finally {
      await client.release()
    }
})

//vastausvaihtoehto poisto
//syöte: URL id oltava kokonaisluku
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
//TODO liittyvien tietojen poisto samalla toiminnolla?, transaktiot avuksi?->ok
app.delete('/vastausvaihtoehdot/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  

  if(!id) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }     
  
  console.log ("nyt poistetaan vastausvaihtoehto")
  console.log ("vastausvaihtoehtoID: ",id)

  const client = pool.connect()
  if( !client ) { //db yhteys epäonnistui
    res.status(500).send()
    return
  }

    try {
      result = await client.query("delete from kayttaja_vastaus where vastausvaihtoehto_id = ($1)",[id])
      result = await client.query("delete from vastausvaihtoehto where id = ($1)",[id])
      await client.query('COMMIT')

      if(result.rowCount > 0) { //poisto ok
        res.status(204).send(result.rows)
      }
      else { //käsitelty, dataa ei ollut
        res.status(404).send(result)
      }      
      
    }
    catch(e){
      await client.query('ROLLBACK')
      res.status(500).send(e)
    }
    finally {
      await client.release()
    }
         
})

//TODO TEE UUDESTAAN seuraava, jos/kun tentti poisto toteutus vaan passivoinnilla
//tentin ominaisuuksien muokkaus
//syöte: URL id oltava kokonaisluku, JSON {"nimi":"NIMI"} NIMI oltava merkkijono
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.put('/tentit/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  const nimi = String(req.body.nimi)
  
  if(!id || !nimi) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }     
    
  console.log ("nyt muokataan tentti ominaisuuksia")
  console.log ("tenttiID: ",id)
    try {
      result = await pool.query("update tentti set nimi = ($1) where id = ($2) returning *",[nimi, id])

      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
     
    }
    catch(e){
      res.status(500).send(e)
    }
})

//kysymys nimen muokkaus
//syöte: URL id oltava kokonaisluku, JSON {"nimi":"NIMI"} NIMI oltava merkkijono
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.put('/kysymykset/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  const nimi = String(req.body.nimi)
  
  if(!id || !nimi) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }     
   
  console.log ("nyt muokataan kysymys nimeä")
  console.log ("kysymysID: ",id)
    try {
      result = await pool.query("update kysymys set nimi = ($1) where id = ($2) returning *",[nimi, id])

      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      } 
    }
    catch(e){
      res.status(500).send(e)
    }
})


//vastausvaihtoehdon ominaisuuksien muokkaus
//syöte: URL id oltava kokonaisluku, JSON {"nimi":"NIMI","on_oikea":BOOLEAN} NIMI oltava merkkijono, BOOLEAN oltava boolean arvo
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//204 käsitelty, ei uutta sisältöä
//404 resurssia ei löydy
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.put('/vastausvaihtoehdot/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  const nimi = String(req.body.nimi)
  const on_oikea = Boolean(req.body.on_oikea)
  
  if(!id || !nimi || on_oikea === undefined ) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }     
    
  console.log ("nyt muokataan vastausvaihtoehdon ominaisuuksia")
  console.log ("vastausvaihtoehtoID: ",id)
    try {
      result = await pool.query("update vastausvaihtoehto set nimi = ($1), on_oikea = ($2) where id = ($3) returning *",
      [nimi, on_oikea, id])

      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }  
      
    }
    catch(e){
      res.status(500).send(e)
    }
})



/*
 app.listen(port, () => {
  console.log(`Tentti app listening on port ${port}`)
}) 
*/