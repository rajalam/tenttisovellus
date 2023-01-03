/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/
var readline = require('readline');

var net = require('net');
var serverinSoketti = null;

var kielletytSanalista = ["perkele", "saatana", "homo"]
var poistettavaSocketIndeksi = -1

var chättääjät = []
var server = net.createServer((socket) => {
	socket.write('Echo server\r\n');
	chättääjät.push(socket)

	socket.on('data', (data) => {
		console.log('Palvelin vastaanotti: ' + data);
		
		kielletytSanalista.map((sana) => {
			//trk. sisältääkö chättääjän syöte kielletyn sanan
			if( data.toString('utf8').toLowerCase().includes(sana) ) {
				//jos kielletty sana löytyi, chättääjä( socket ) poistetaan palvelimelta eli chattääjät listalta
				console.log("kielletty sana löytyi")

				chättääjät.map((alkio) => {
					if( alkio === socket) {
						console.log("socket löyty ok")
						//etsi keino, miten chättääjät-listan nyk. alkiolle löytyy, jotta se voidaan poistaa listalta
						//poistettavaSocketIndeksi = 
					}
				})
				//console.log(chättääjät.find(socket))
				//chättääjät.splice( chättääjät.findIndex(socket) )
			}
		})

        chättääjät.forEach((item)=>{
            console.log("chattääjämäärä: "+ chättääjät.length)
			item.write(data)
		})

	});


    socket.on('error', (data) => {
		console.log('Client putosi pois: ' + data);
        
	});


	socket.on('close', function () {
		console.log('Connection closed');
	});


	//socket.pipe(socket);
});


server.listen(1337, '127.0.0.1');

/*
And connect with a tcp client from the command line using netcat, the *nix
utility for reading and writing across tcp/udp network connections.  I've only
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/

/* Or use this example tcp client written in node.js.  (Originated with
example code from
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */