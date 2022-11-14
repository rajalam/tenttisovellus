const bodyparser = require('body-parser')
//const fs = require('fs');
const fs = require('fs').promises;
const express = require('express')  //Jos ei toimi, niin "npm install express"

const cors = require('cors')
const { Pool } = require('pg');
const { restart } = require('nodemon');
const app = express()
const port = 8080

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
  console.log("Palvelimelta kysellään dataa")
  //res.send('Hello!')
  const data = read()
  console.log("Datan sisältö read tuloksena", data)
  res.send(data) // tiedon luku asynkronisesti
})

app.post('/', (req, res) => {
  console.log("Palvelimelle tallennetaan dataa")
  write(req)// tiedon kirjoitus asynkronisesti  req.body antanee tarvittavan datan
  //res.send('Hello World!')
  res.send('Datan tallennus lienee onnistunut, kun tänne asti päästiin!')
})
 */

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

//käyttäjätunnus+salasana parin olemassaolon tarkistushaku tietokannassa
//syöte: URL kayttajanimi, salasana oltava merkkijonoja
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//200 haku OK
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tietoturva(esim. salasanan + tietoliikenteen salaus), mikä paluuarvo tarvitaan?
app.get('/kayttajat/:kayttajanimi/:salasana', async (req, res) => {  
  
  const kayttajanimi = String(req.params.kayttajanimi)
  const salasana = String(req.params.salasana) 
  
  if(!kayttajanimi || !salasana) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }    

  console.log ("nyt vahvistetaan käyttäjätunnus+salasana parin olemassaolo")
  //console.log ("req.body: ", req.body)  
  //console.log ("req.body.kayttajanimi: ", req.body.kayttajanimi)
    try {
      result = await pool.query(
        "select id, on_yllapitaja from kayttaja where kayttajanimi = ($1) and salasana = ($2)", 
        [kayttajanimi, salasana])
      
      //console.log ("result: ", result) 
      res.setHeader("Content-type", "application/json")      
      res.status(200).send(result.rows)
      
      //res.send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})


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

//käyttäjänimen + salasanan lisäys kantaan eli ns. käyttäjätunnuksen rekisteröinti
//syöte: URL kayttajanimi, salasana oltava merkkijonoja
//tulos: JSON [result.rows]
//HTTP vastauskoodit
//201 data luonti OK
//204 käsitelty, ei uutta sisältöä
//422 syötesyntaksivirhe
//500 palvelinvirhe
//TODO tietoturvaominaisuudet(esim. salasanan salaus kannassa+liikenteessä)
app.post('/kayttajat/:kayttajanimi/:salasana', async (req, res) => {  
  
  const kayttajanimi = String(req.params.kayttajanimi)  
  const salasana = String(req.params.salasana)  

  if(!kayttajanimi || !salasana) { //syötesyntaksivirhe
    console.log("syötesyntaksivirhe")
    res.status(422).send()
    return
  }      

  console.log ("nyt lisätään kayttajatunnus+salasana")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("INSERT INTO kayttaja (kayttajanimi, salasana, on_yllapitaja) VALUES ($1, $2, false) returning id",
      [kayttajanimi, salasana])

      if(result.rowCount > 0) { //lisäys ok
        res.status(201).send(result.rows)
      }
      else { //käsitelty, uutta dataa ei luotu
        res.status(204).send(result)
      }
       
    }
    catch(e){
      if(e.constraint == "kayttaja_kayttajanimi_key") {
        //käyttäjätunnus löytyy jo, uutta dataa ei luotu
        res.status(204).send(e)
      }
      else { //jokin muu poikkeus tietokantahaussa
        res.status(500).send(e)
      }      
    }
})


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

JATKA TÄSTÄ!!!

//kysymys poisto
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
//TODO liittyvien tietojen(mm. vastausvaihtoehtojen) poisto samalla toiminnolla?
app.delete('/kysymykset/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt poistetaan kysymys")
  console.log ("kysymysID: ",id)
    try {
      result = await pool.query("delete from kysymys where id = ($1)",[id])
      res.send('Kysymys delete ok')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//vastausvaihtoehto poisto
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
//TODO liittyvien tietojen poisto samalla toiminnolla?, transaktiot avuksi?
app.delete('/vastausvaihtoehdot/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt poistetaan vastausvaihtoehto")
  console.log ("vastausvaihtoehtoID: ",id)
    try {
      result = await pool.query("delete from vastausvaihtoehto where id = ($1)",[id])
      res.send('Vastausvaihtoehto delete ok')    
    }
    catch(e){
      res.status(500).send(e)
    }
})


//tentin nimen muokkaus
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.put('/tentit/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt muokataan tentti nimeä")
  console.log ("tenttiID: ",id)
    try {
      result = await pool.query("update tentti set nimi = ($1) where id = ($2)",[req.body.nimi, id])
      res.send('Tais datan tallennus onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//kysymys nimen muokkaus
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.put('/kysymykset/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt muokataan kysymys nimeä")
  console.log ("kysymysID: ",id)
    try {
      result = await pool.query("update kysymys set nimi = ($1) where id = ($2)",[req.body.nimi, id])
      res.send('Kysymys put ok')    
    }
    catch(e){
      res.status(500).send(e)
    }
})


//vastausvaihtoehdon ominaisuuksien muokkaus
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.put('/vastausvaihtoehdot/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt muokataan vastausvaihtoehdon ominaisuuksia")
  console.log ("vastausvaihtoehtoID: ",id)
    try {
      result = await pool.query("update vastausvaihtoehto set nimi = ($1), on_oikea = ($2) where id = ($3)",
      [req.body.nimi, req.body.on_oikea, id])
      res.send('Vastausvaihtoehto put ok')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//vastauksen muokkaus, vastauksen uusi arvo bodyyn json syntaksilla: {"valittu":false} || {"valittu":true}
//TODO
app.put('/vastausvaihtoehdot/:vastausvaihtoehtoId/kayttajat_vastaukset/:kayttajaId', async (req, res) => {  
  
  const vastausvaihtoehtoId = Number(req.params.vastausvaihtoehtoId)  
  const kayttajaId = Number(req.params.kayttajaId)  
  const valittu = req.body.valittu
  
  console.log ("nyt muokataan vastausta")
  console.log ("vastausvaihtoehtoID: ",vastausvaihtoehtoId)
  console.log ("valittu: ",valittu)
    try {
      result = await pool.query("update kayttaja_vastaus set valittu = ($1) where kayttaja_id = ($2) and vastausvaihtoehto_id = ($3)",
      [valittu, kayttajaId, vastausvaihtoehtoId])
      res.send('Kayttajat_vastaukset put ok')    
    }
    catch(e){
      res.status(500).send(e)
    }
})


app.listen(port, () => {
  console.log(`Tentti app listening on port ${port}`)
})