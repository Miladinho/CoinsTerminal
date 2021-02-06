const HOST = 'ws://35.162.76.65' //change to 'ws://localhost:3331' when testing
const ws = new WebSocket(HOST);

var coinbasePrev = {}
var bittrexPrev = {}
var poloPrev = {}

window.onunload = window.onbeforeunload = function(event) {
    ws.close()
};

ws.onopen = function() {
    
}

ws.onmessage = function(data) {
    var data = JSON.parse(data.data);
    updateBittrexTable(data.Bittrex);
    updateCoinbaseTable(data.Gdax);
    updatePoloniexTable(data.Poloniex);
}
ws.onclose = function() {
    ws.close();
}

function updateCoinbaseTable(data) {
    var currency = data;
    console.log(data);
    const btc = document.getElementById('tr-cb-btc')
    const eth = document.getElementById("tr-cb-eth")
    const ltc = document.getElementById("tr-cb-ltc")

    btc.innerHTML = removeTrailingZerosFromString(data['USDT-BTC']);
    btc.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-BTC')
    
    eth.innerHTML = removeTrailingZerosFromString(data['USDT-ETH']);
    eth.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-ETH')

    ltc.innerHTML = removeTrailingZerosFromString(data['USDT-LTC']);
    ltc.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-LTC')

    coinbasePrev = data
}

function updateBittrexTable(data) {
    var currency = data;
    const btc = document.getElementById('tr-bt-btc')
    const eth = document.getElementById("tr-bt-eth")
    const ltc = document.getElementById("tr-bt-ltc")
    
    btc.innerHTML = removeTrailingZerosFromString(data['USDT-BTC']);
    btc.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-BTC')

    eth.innerHTML = removeTrailingZerosFromString(data['USDT-ETH']);
    eth.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-ETH')

    ltc.innerHTML = removeTrailingZerosFromString(data['USDT-LTC']);
    ltc.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-LTC')

    bittrexPrev = data
}

function updatePoloniexTable(data) {
    var currency = data;
    var btc = document.getElementById('tr-pl-btc')
    var eth = document.getElementById('tr-pl-eth')
    var ltc = document.getElementById('tr-pl-ltc')

    btc.innerHTML = removeTrailingZerosFromString(data['USDT-BTC']);
    btc.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-BTC')

    eth.innerHTML = removeTrailingZerosFromString(data['USDT-ETH']);
    eth.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-ETH')

    ltc.innerHTML = removeTrailingZerosFromString(data['USDT-LTC']);
    ltc.style.color = setTickerChangeColor(coinbasePrev, data, 'USDT-LTC')

    poloPrev = data
}

function removeTrailingZerosFromString(input) {
    return Number(input).toFixed(3).toString();
}

function setTickerChangeColor(prev, next, pairString) {
    const upColor = 'green'
    const downColor = 'red'
    const neutral = 'white'

    const prevVal = parseFloat(prev[pairString])
    const nextVal = parseFloat(next[pairString])
    console.log(prev, next)
    console.log(prevVal, nextVal)
    if (prevVal > nextVal)
        return downColor
    else if (prevVal < nextVal)
        return upColor
    else
        return neutral
}
