var fs = require('fs');
var vhost = require('vhost');
var express = require('express');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/ssl/private/ssl-cert-snakeoil.key', 'utf8');
var certificate = fs.readFileSync('/etc/ssl/certs/ssl-cert-snakeoil.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var app = express();
app.use(vhost('172.22.28.143', require('./index.js').app));
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var httpsServer2 = https.createServer(credentials, app);
httpServer.listen(80);
httpsServer.listen(8443);
httpsServer2.listen(443);
console.log("server is running in 172.22.28.143");

