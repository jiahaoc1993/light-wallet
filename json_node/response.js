'use strict';
var rpc = require('node-json-rpc');
var Sync = require('sync')
var BN = require('bignumber.js');
var wait = require('wait.for')
var Response = function(){}

Response.client = new rpc.Client({
	port: 8545,
	host: '172.22.28.120',
	path: '/',
	strict: true
});

Response.getResponse = function(method,data,callback){
	var resp;
	Response["client"].call({
		"jsonrpc": "2.0",
		"method" : method,
		"params" : data,
		"id" : Math.floor(Math.random() * 100000)
	},function(err,res) {
		if (err) callback(null, {
			error: true,
			data:err	
		})
		else if ("error" in res) callback(null, {
			error: true,
			data : res.error.message
		})
		else callback(null , {
			error: false,
			data: res.result
		})	
	});
}

Response.getResponseSync = function(method,data){
	var resp = wait.for(Response.getResponse,method,data);
	if (resp.error) throw resp.data;
	return resp.data
}

Response.getAccounts = function(){
	return this.runInTryCatch(function(data){
		data.data = Response.getResponseSync("eth_accounts",[]);
	});
}

Response.getBalance = function(addr){
	return this.runInTryCatch(function(data){
		addr = Response.formaAddress(addr);
		data.data = {
		}
	});
}

Response.getCurrentBlock = function(){
	return this.runInTryCatch(function(data){
		data.data = new BN(Response.getResponseSync("eth_blockNumber",[]));
	});
}

Response.getTransactionData = function (addr){
	var parent = this;
	return this.runInTryCatch(function(data){
		addr = parent.formatAddress(addr);
		data.data = {
			address: addr,
			balance: new BN(Response.getResponseSync("eth_getBalance",[addr,"pending"])),
			nonce: Response.getResponseSync("eth_getTransactionCount",[addr,"pending"]),
			gasprice: Resposne.getResponseSync("eth_gasPrice", [] )
		};
	});
}

Response.sendRawTransaction = function (rawTx){
	var parent = this;
	return this.runInTryCatch(function(data){
		data.data = Response.getResponseSync("eth_sendRawTransaction",[rawTx]);	
	});
}

Response.getEthCall = function(txObj){
	var parent = this;
	return this.runInTryCatch(function(data){
		data.data = Response.getResponseSync("eth_call",[txObj,"pending"]);
	});
}

Response.getEstimatedGas = function(txObj){
	var parent = this;
	return this.runInTryCatch(function(data){
		data.data = Response.getResponseSync("eth_estimateGas", [txObj])});
}

Response.getDefaultResponse = function() {
	return {
		"error": false,
		"msg" : "",
		"data": ""
		};
}

Response.getErrorResposne = function(e){
	var data = this.getDefaultResponse();
	data.error = true ; data.msg = e;
	return JSON.stringify(data);
}

Response.runInTryCatch = function(func) {
	var data = this.getDefaultResponse();
	try{
		func(data);
	} catch (e){
		data.error = true;
		data.msg = e.toString();
	}
	return JSON.stringify(data);	
}

Response.formatAddress = function(addr) {
	if (addr.substring(0,2) == "0x") return addr;
	return "0x" + addr;	
}

module.exports = Response;
