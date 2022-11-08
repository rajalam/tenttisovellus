const bodyparser = require('body-parser')
//const fs = require('fs');
const fs = require('fs').promises;
const express = require('express')  //Jos ei toimi, niin "npm install express"

const cors = require('cors')
const { Pool } = require('pg')
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
      res.send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//kysymysten haku tietyn tentin perusteella
//TODO 
app.get('/tentit/:tenttiId/kysymykset', async (req, res) => {  
  
  const id = Number(req.params.tenttiId)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt haetaan kysymykset")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query(
        "select kysymys.id, kysymys.nimi from tentti, kysymys where tentti.id = kysymys.tentti_id and tentti.id = ($1)", [id])
      //res.body = result
      res.setHeader("Content-type", "application/json")      
      res.send(result.rows)
      //res.send('Tais tentti GET onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})


//tentin lisäys
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.post('/tentit', async (req, res) => {  
  
  //const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt lisätään tenttiä")
  //console.log ("tenttiNimi: ",req.body.nimi)
    try {
      result = await pool.query("INSERT INTO tentti (nimi) VALUES ($1) ",[req.body.nimi])
      res.send('Tais tentti tallennus onnistua')    
    }
    catch(e){
      res.status(500).send(e)
    }
})

//tentin poisto
//TODO tarkkailu että vain admin käyttäjä voi suorittaa tämän toiminnon
app.delete('/tentit/:id', async (req, res) => {  
  
  const id = Number(req.params.id)  
  //const luokkaId = Number(req.params.kouluId)  
  
  console.log ("nyt poistetaan tenttiä")
  console.log ("tenttiID: ",id)
    try {
      result = await pool.query("delete from tentti where id = ($1)",[id])
      res.send('Tais datan tallennus onnistua')    
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



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})