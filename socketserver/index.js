const PORT = process.env.PORT || 3331
const DATA_FETCH_DELAY = process.env.DATA_FETCH_DELAY || 2000

const WebSocket = require('ws').Server
const request = require('request')
const express = require("express")
const app = express()

let bittrexTickerURL = 'https://bittrex.com/api/v1.1/public/getticker/'
let poloTickerURL = 'https://poloniex.com/public?command=returnTicker'
let gdaxURL = 'https://api.gdax.com/products/'

app.use(express.static(getRootDirectory()+ "/public"))
console.log(getRootDirectory()+ "/public")
server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
const wss = new WebSocket({server})

wss.on('connection', function(ws, req) {
	var bitt = {}
	var polo = {}
	var gdax = {}
	const tickerUpdate = setInterval(function() {
		request(bittrexTickerURL+'?market=usdt-btc', function (error, response, body) {
			if (error)
				console.log(`Bittrex BTC-USD error: ${error}`)
			else
				bitt['USDT-BTC'] = JSON.parse(body).result.Last
		})
		request(bittrexTickerURL+'?market=usdt-eth', function (error, response, body) {
			if (error)
				console.log(`Bittrex ETH-USD error: ${error}`)
			else
				bitt['USDT-ETH'] = JSON.parse(body).result.Last
		})
		request(bittrexTickerURL+'?market=usdt-ltc', function (error, response, body) {
			if (error)
				console.log(`Bittrex LTC-USD error: ${error}`)
			else
				bitt['USDT-LTC'] = JSON.parse(body).result.Last
		})
		request(poloTickerURL, function (error, response, body) {
			if (error) {
				console.log(`Poloniex error: ${error}`)
				return
			}
			var data = JSON.parse(body)
			polo['USDT-BTC'] = data.USDT_BTC.last
			polo['USDT-ETH'] = data.USDT_ETH.last
			polo['USDT-LTC'] = data.USDT_LTC.last
		})
		request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'BTC-USD/ticker'}, function (error, response, body) {
			if (error)
				console.log(`Gdax BTC-USD error: ${error}`)
			else
				gdax['USDT-BTC'] = JSON.parse(body).price
		})
		request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'ETH-USD/ticker'}, function (error, response, body) {
			if (error)
				console.log(`Gdax ETH-USD error: ${error}`)
			else
				gdax['USDT-ETH'] = JSON.parse(body).price
		})
		request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'LTC-USD/ticker'}, function (error, response, body) {
			if (error)
				console.log(`Gdax LTC-USD error: ${error}`)
			else
				gdax['USDT-LTC'] = JSON.parse(body).price
		})
		var data ={}
		data.Poloniex = polo
		data.Bittrex = bitt
		data.Gdax = gdax

		ws.send(JSON.stringify(data))
	}, DATA_FETCH_DELAY)

	ws.on('close', function() {
		console.log(`Lost conneection from client ${req.socket.remoteAddress}`)
		clearInterval(tickerUpdate)
	})

	console.log(`New coonnection to client: ${req.socket.remoteAddress}`)
})

function getRootDirectory() {
	let dir = __dirname.split('/')
	dir.pop()
	return dir.join('/') 
}

function updateCurrentBittrexValues(data) {
    if (data.MarketName === '') {
    	lastUSDT_ETH = data.Fills[0].Rate
  	} else if (data.MarketName === '') {
  		lastUSDT_LTC = data.Fills[0].Rate
  	} else {
  		lastUSDT_BTC = data.Fills[0].Rate
  	}
}
