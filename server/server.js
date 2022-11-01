//const fs = require('fs');
const fs = require('fs').promises;
const express = require('express')  //Jos ei toimi, niin "npm install express"

const cors = require('cors')
const app = express()
const port = 8080
app.use(cors())  //jos ei toimi, niin "npm install cors"
app.use(express.json());  //Ja jos haluaa bodyn suoraan req argumentista

//tarvitaanko seuraavaa??
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
})

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})