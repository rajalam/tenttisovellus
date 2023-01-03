var net = require('net');
var readline = require('readline');

var nimimerkkiAsetettu = false
var nimimerkki = ""

var client = new net.Socket();
var rl = null

client.connect(1337, '127.0.0.1', () => {
    console.log('Connected');

    //lue komentoriviltä tekstiä ja lähetä se sockettiin. 
    //    client.write (komentoriviltäluettudata)

    //console.log("Nimimerkkiasetettu: ", nimimerkkiAsetettu)
    if (!nimimerkkiAsetettu) {

        nimimerkki = annaJaLahetaSyote("Syötä nimimerkki: ")

        //console.log("Nimimerkki: ", nimimerkki)
        //nimimerkkiAsetettu = true
    } else { //nimimerkki asetettu
        annaJaLahetaSyote(nimimerkki + ' >')
    }

});

client.on('error', (data) => {
    console.log('Nyt tuli muuten tupen rapinat ' + data)
});

client.on('data', async (data) => {
    console.log('Received: ' + data);

    if( nimimerkkiAsetettu ) {
        rl.setPrompt(nimimerkki + ' >');    
    }
    rl.prompt()



});

client.on('close', function () {
    console.log('Connection closed');
});

const annaJaLahetaSyote = (promptString) => {
    //alku oma funktio
    rl = readline.createInterface(
        process.stdin, process.stdout);

    rl.setPrompt(promptString);
    //rl.prompt()

    rl.on('line', (teksti) => {
        //console.log(`teksti: ${teksti}`);
        if (nimimerkkiAsetettu) {
            client.write(nimimerkki + ': ' + teksti)
        } else { //nimimerkkiä ei asetettu
            client.write(teksti)
        }


        if (!nimimerkkiAsetettu) {
            nimimerkki = teksti
            nimimerkkiAsetettu = true
        }
        //rl.close();

        //return teksti

    });


    //    client.write("Viesti asiakkaalta")
    //	client.destroy(); // kill client after server's response
    //loppu oma funktio
}