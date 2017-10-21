var ws = new WebSocket("wss://ws-feed.gdax.com/trade/");
//var ws = new webSocket('ws://localhost:3000');
ws.onmessage = function(data) {
	console.log(data.data);
}

function stopSocket() {
	ws.close();
}

// function getTradeFeed()
// {
// 	if ("WebSocket" in window) {
// 		ws.onopen = function() {
// 			// Web Socket is connected, send data using send()
// 			ws.send(JSON.stringify({"type": "subscribe","product_ids": ["BTC-USD","ETH-USD","LTC-USD"]}));
// 			alert("Message is sent...");
// 		};

// 		ws.onmessage = function (evt)  { 
// 			var btc_list = document.getElementById("btc-list");
// 			var eth_list = document.getElementById("eth-list");
// 			var ltc_list = document.getElementById("ltc-list");
// 			var received_msg = evt.data;
// 			var data = JSON.parse(received_msg)
// 			var node = document.createElement("DIV")
// 			  var textnode = document.createTextNode(data.price);
// 			  node.appendChild(textnode);
// 			if(data.product_id === "BTC-USD") {
// 			  btc_list.appendChild(node); 
// 			} else if (data.product_id === "ETH-USD") {
// 			  eth_list.appendChild(node);
// 			} else if (data.product_id === "LTC-USD") {
// 			  ltc_list.appendChild(node);
// 			}
// 			//console.log(data);
// 		};

// 		ws.onclose = function()
// 		{ 
// 			alert("Connection is closed..."); 
// 		};

// 		ws.onerror = function(err) {
// 			console.log(err);
// 		}
// 	} else {
// 		alert("WebSocket NOT supported by your Browser!");
// 	}
// }
//WebSocketTest();