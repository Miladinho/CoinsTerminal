var PORT = process.env.port || 3331;
var ws = require('ws').Server;
var server = new ws({port: PORT});
var request = require('request');

console.log('started app');

var bittrexTickerURL = 'https://bittrex.com/api/v1.1/public/getticker/';
var poloTickerURL = 'https://poloniex.com/public?command=returnTicker';
var gdaxURL = 'https://api.gdax.com/products/';

server.on('connection', function(ws) {
	var bitt = {};
	var polo = {};
	var gdax = {};
	setInterval(function() {
		request(bittrexTickerURL+'?market=usdt-btc', function (error, response, body) {
			bitt['USDT-BTC'] = JSON.parse(body).result.Last;
		
		});
		request(bittrexTickerURL+'?market=usdt-eth', function (error, response, body) {
			bitt['USDT-ETH'] = JSON.parse(body).result.Last;
		});
		request(bittrexTickerURL+'?market=usdt-ltc', function (error, response, body) {
			bitt['USDT-LTC'] = JSON.parse(body).result.Last;
		});
		request(poloTickerURL, function (error, response, body) {
			var data = JSON.parse(body);
			polo['USDT-BTC'] = data.USDT_BTC.last;
			polo['USDT-ETH'] = data.USDT_ETH.last;
			polo['USDT-LTC'] = data.USDT_LTC.last;
		});
		request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'BTC-USD/ticker'}, function (error, response, body) {
			gdax['USDT-BTC'] = JSON.parse(body).price;
		});
		request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'ETH-USD/ticker'}, function (error, response, body) {
			gdax['USDT-ETH'] = JSON.parse(body).price;
		});
		request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'LTC-USD/ticker'}, function (error, response, body) {
			gdax['USDT-LTC'] = JSON.parse(body).price;
		});
		var data ={};
		data.Poloniex = polo;
		data.Bittrex = bitt;
		data.Gdax = gdax;
		console.log(data);

		ws.send(JSON.stringify(data));
	},3000);

});

server.on('close', function(ws) {
	ws.close();
})


function updateCurrentBittrexValues(data) {
    if (data.MarketName === '') {
    	lastUSDT_ETH = data.Fills[0].Rate;
  	} else if (data.MarketName === '') {
  		lastUSDT_LTC = data.Fills[0].Rate;
  	} else {
  		lastUSDT_BTC = data.Fills[0].Rate;
  	}
}
