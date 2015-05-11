var net = require('net');
var fs = require('fs');
var PORT = 3000;
var server = net.createServer();
var SIZE = 320*240*2;
var buffer = new Buffer(SIZE);
var bufferOut = new Buffer(SIZE);
var index=0;

server.on('connection', function (socket) {
	console.log('connection');
	//console.log(socket);
	//console.log('buffersize:'+socket.bufferSize);
	//socket.setNoDelay(true);
	//socket.setKeepAlive(true,1000);
	
	//console.log('remoteAddress:'+socket.remoteAddress);
	//console.log('remotePort:'+socket.remotePort);
	//console.log('bytesRead:'+socket.bytesRead);
	//console.log('bytesWritten:'+socket.bytesWritten);
	
	socket.on('connect', function(){
		console.log('connect');
	});
	
	socket.on('timeout', function(){
		console.log('timeout');
	});
	
	socket.on('drain', function(){
		console.log('drain');
		socket.resume();
		//socket.end();
	});

	socket.on('close', function(hadError){
		console.log('close:'+hadError);
	});

	socket.on('data', function (data) {
		//console.log('data:'+data.length);
		console.time('all');
		var ds = data.toString('utf8');
		//console.log(ds);
		var res = false;
		if (ds.indexOf('GET / ') == 0) {
			//devuelvo el index
			var fd = fs.openSync('index3.html','r');
			var read = fs.readSync(fd, buffer, 0, SIZE, 0);
			fs.closeSync(fd);
			socket.write('HTTP/1.1 200 OK\n');
			socket.write('Content-Type: text/html; charset=iso-8859-1\n');
			socket.write('Content-Length: '+read+'\n');
			socket.write('Access-Control-Allow-Origin: *\n');
			socket.write('Connection: keep-alive\n');
			socket.write('\n');
			res = socket.write(buffer);
			socket.end();
		} else {
			//devuelvo el fb
			//var fd = fs.openSync('stream.fb','r');
			var fd = fs.openSync('/dev/fb0','r');
			var read = fs.readSync(fd, buffer, 0, SIZE, 0);
			fs.closeSync(fd);
			//index+=2;
			if (index>=SIZE) index = 0;
			buffer.copy(bufferOut,0,index);
			buffer.copy(bufferOut,SIZE-index,0,index);
			socket.write('HTTP/1.1 200 OK\n');
			socket.write('Content-Type: application/octet-stream\n');
			socket.write('Content-Length: '+SIZE+'\n');
			socket.write('Access-Control-Allow-Origin: *\n');
			socket.write('Connection: keep-alive\n');
			socket.write('\n');
			res = socket.write(bufferOut);//,'hex');
			//if (res=true) socket.end();
			if (!res) socket.pause();
		}
		//console.log(data.toString('utf8'));
		console.log(process.memoryUsage());
		console.timeEnd('all');
		
//		console.log('writeRes='+res);
//		console.log('bytesRead:'+socket.bytesRead);
//		console.log('bytesWritten:'+socket.bytesWritten);
//		console.log('buffersize:'+socket.bufferSize);
	});
	
});

server.on('listening', function(){
	console.log('Escuchando...');
	console.log(server.address());
	console.log('maxConnections:'+server.maxConnections);
	console.log('maxConnections:'+server.maxConnections);
});

server.on('close', function(){
	console.log('close server');
});

server.on('request', function (req, res) {
	console.log('request.');
	console.log(req);
	//console.log(res);
});

server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(function () {
      server.close();
      server.listen(PORT);
    }, 1000);
  }
  console.log(e);
});

console.log('Abriendo...');
server.listen(PORT);


