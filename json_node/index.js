var express = require('express');
var bodyParser = require('body-parser');
var response = require('./response');
var wait = require('wait.for');
var app = express();
Array.prototype.contains = function(str) {
	if(str === undefined) return false;
	for (var i=0;i<this.length;i++) if (str.indexOf(this[i]) > -1) return true;
	return false;
};

app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/',function(req,res){
	wait.launchFiber(handleRequest,req,res);
});

app.post('/',function(req,res){
	wait.launchFiber(handleRequest,req,res);
});

var handleRequest = function(req,res){
	res.header("Access-Control-Allow-Origin","*");
	res.header('Content-Type','application/json');
	referer = req.header('Referer');
	req = req.body;
	res.send(response.getAccounts());
	//res.send(response.getCurrentBlock());
	/*
	if ("balance" in req) res.write(response.getBalance(req["balance"]));
	else if ("rawtx" in req) res.write(response.sendRawTransaction(req["rawtx"]));
	else if ("txdata" in req) res.write(response.getTransactionData(req["txdata"]));
	else if ("estimatedGas" in req) res.write(response.getEstimatedGas(req["estimatedGas"]));
	else if ("ethCall" in req) res.write(response.getEthCall(req["ethCall"]));
	else if ("currentBlock" in req) res.write(response.getCurrentBlock());
	else res.status(400).send();
	res.end()
	*/
}
exports.app = app;
