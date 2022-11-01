const { Pool, Client } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
})

/* pool.query('SELECT * FROM koulu ORDER BY id ASC', (err, res) => {
  console.log(err, res.rows)
  pool.end()
}) */

//let laskuri = 0
//for (x = 0; x < 1000; x++) {
    
    //console.log("kierrokset:", x)
    //pool.query("INSERT INTO koulu (nimi) VALUES ('Kangasalan yläaste')", (err, res) => {
    //pool.query("DELETE from koulu", (err, res) => {    
  //      laskuri++
  //      console.log(err, res)
  //      if( laskuri == 1000 ) {
  //          pool.end()
//    }
//    })
//}
//pool.end()

//koulun lisäys
const lisaaKoulu = async() => {
    try {
        let result = await pool.query("INSERT INTO koulu (nimi) VALUES ('Pohjolan yläaste')")
        console.log("näin monta koulua lisättiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
lisaaKoulu()

//uuden tentin lisäys
const lisaaTentti = async(tenttiNimi) => {
    try {
        let query = "INSERT INTO tentti (nimi) VALUES ('"+tenttiNimi+"')"
        let result = await pool.query(query)
        console.log("näin monta tenttiä lisättiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
lisaaTentti("Java perusteet")
lisaaTentti("Haskell perusteet")


//tentin poisto id perusteellaa
const poistaTentti = async(tenttiId) => {
    try {
        let query = "delete from tentti where id = "+tenttiId
        let result = await pool.query(query)
        console.log("näin monta tenttiä poistettiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
poistaTentti(3)

//tentin nimi muutos id perusteella
const muutaTenttiNimi = async(tenttiId, tenttiNimi) => {
    try {
        let query = "update tentti set nimi = '"+tenttiNimi+"' where id = '"+tenttiId+"'"
        let result = await pool.query(query)
        console.log("näin monta tenttiä muutettiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
muutaTenttiNimi(6, "Testitentti 3")

//hakee kaikki tentit
const haeTentit = async() => {
    try {
        let query = "select * from tentti"
        let result = await pool.query(query)
        console.log("näin monta tenttiä haettiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
haeTentit()

//hakee tietty tentti id perusteella
const haeTentti = async(tenttiId) => {
    try {
        let query = "select * from tentti where id = '" + tenttiId + "'"
        let result = await pool.query(query)
        console.log("näin monta tenttiä haettiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
haeTentti(4)

//hakee tentit tentin nimen/kuvauksen perusteella aakkosjärjestyksessä
const haeTentitNimellaAakkosjarjestys = async(tenttiNimiOsa) => {
    try {
        let query = "select * from tentti where nimi like '%" + tenttiNimiOsa + "%' order by nimi"
        let result = await pool.query(query)
        console.log("näin monta tenttiä haettiin:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
haeTentitNimellaAakkosjarjestys("per")


//hakee tentit, joiden id:t ovat 1, 2 tai 3 yhdellä kyselyllä(in syntaksi)
const haeTentitIdPer = async(tenttiId1, tenttiId2, tenttiId3) => {
    try {
        let query = "select * from tentti where id in ('" + tenttiId1 + "', '" + tenttiId2 +
        "', '" + tenttiId3 + "')" 
        //console.log(query)
        let result = await pool.query(query)
        console.log("näin monta tenttiä haettiin tentitIdPer:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
haeTentitIdPer(3, 6, 7)

//hakee tentit, joiden pvm on ennen 12.10.2022(pvm on date tyyppiä)
const haeTentitEnnenPvm = async(pvm) => {
    try {
        let query = "select * from tentti where pvm < '" + pvm + "'" 
        //console.log(query)
        let result = await pool.query(query)
        console.log("näin monta tenttiä haettiin haeTentitEnnenPvm:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
haeTentitEnnenPvm('2022-10-12')

//hakee tentit, jotka on voimassa(onvoimassa kenttä on boolean tyyppiä)
const haeVoimassaOlevatTentit = async(onkoVoimassa) => {
    try {
        let query = "select * from tentti where onvoimassa = '" + onkoVoimassa + "'" 
        //console.log(query)
        let result = await pool.query(query)
        console.log("näin monta tenttiä haettiin haeVoimassaOlevatTentit:", result.rowCount)
    }
    catch (error) {
        console.log("virhetilanne: ", error)
    }

}
haeVoimassaOlevatTentit(true)
