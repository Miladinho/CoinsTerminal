const PORT = process.env.PORT || 3331
const DATA_FETCH_DELAY = process.env.DATA_FETCH_DELAY || 2000

const WebSocket = require('ws').Server
const express = require('express')
const app = express()

const util = require('util')
const request = util.promisify(require('request'))

const {transports, createLogger, format} = require('winston')
const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({format:'MMM-DD-YYYY HH:mm:ss'}),
		format.json()
	),
	defaultMeta: { service: 'user-service'},
	transports: [
		new transports.File({ filename: 'combined.log' }),
		new transports.Console({'timestamp':true})
	]
})

app.use(express.static(getRootDirectory()+ "/web"))

const server = app.listen(PORT, () => {
	logger.log('info',`Server listening on port ${PORT}`)
})
const wss = new WebSocket({server})

wss.on('connection', function(ws, req) {
	const tickerUpdate = setInterval(async function() {
		ws.send(JSON.stringify(await getExchangeData()))
	}, DATA_FETCH_DELAY)

	ws.on('close', function() {
		logger.log('info', `Lost connection from client ${req.socket.remoteAddress}`)
		clearInterval(tickerUpdate)
	})

	logger.log('info',`New connection to client: ${req.socket.remoteAddress}`)
})

function getRootDirectory() {
	let dir = __dirname.split('/')
	dir.pop()
	return dir.join('/') 
}

async function getExchangeData() {
	let bittrexTickerURL = 'https://bittrex.com/api/v1.1/public/getticker/'
	let poloTickerURL = 'https://poloniex.com/public?command=returnTicker'
	let gdaxURL = 'https://api.gdax.com/products/'
	
	let data = {
		Bittrex: new Object(),
		Poloniex: new Object(),
		Gdax: new Object()
	}

	try {
		data.Bittrex['USDT-BTC'] = String(JSON.parse((await request(bittrexTickerURL+'?market=usdt-btc')).body).result.Last)
		data.Bittrex['USDT-ETH'] = String(JSON.parse((await request(bittrexTickerURL+'?market=usdt-eth')).body).result.Last)
		data.Bittrex['USDT-LTC'] = String(JSON.parse((await request(bittrexTickerURL+'?market=usdt-ltc')).body).result.Last)

		const poloData = JSON.parse((await request(poloTickerURL)).body)
		data.Poloniex['USDT-BTC'] = poloData.USDT_BTC.last
		data.Poloniex['USDT-ETH'] = poloData.USDT_ETH.last
		data.Poloniex['USDT-LTC'] = poloData.USDT_LTC.last

		data.Gdax['USDT-BTC'] = JSON.parse((await request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'BTC-USD/ticker'})).body).price
		data.Gdax['USDT-ETH'] = JSON.parse((await request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'ETH-USD/ticker'})).body).price
		data.Gdax['USDT-LTC'] = JSON.parse((await request({headers: {'User-Agent': 'Mozilla 5.0'}, uri: gdaxURL+'LTC-USD/ticker'})).body).price
	} catch (e) {
		console.error(e)
	} finally {
		console.log(data)
		return data
	}
}
