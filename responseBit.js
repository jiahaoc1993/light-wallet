var bitcoin = require('bitcoind-rpc')
var BN = require('bignumber.js')
var wait = require('wait.for')
var Sync = require('sync')

var rpc = new bitcoin({
	user: 'user',
	pass: 'pass',
	host: 'localhost',
	port: '18332',
	protocol : 'http'
});
module.exports = rpc
